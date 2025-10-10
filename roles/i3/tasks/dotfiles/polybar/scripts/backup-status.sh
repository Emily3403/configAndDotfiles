#!/usr/bin/env bash

DISABLED_COLOR="%{F#696969}"
FAILED_COLOR="%{F#ED8796}"

DISABLED_MESSAGE="${DISABLED_COLOR}Backup"
FAILED_MESSAGE="${FAILED_COLOR} Backup"
SETUP_ERROR_MESSAGE="${FAILED_COLOR} Backup Setup Error"


WAITING_COLOR="%{F#EED49F}"
WAITING_MESSAGE="${WAITING_COLOR}Backup …"

SUCESSFUL_COLOR="%{F#A6DA95}"
SUCESSFUL_MESSAGE="${SUCESSFUL_COLOR}  Backup"

if ! source /home/emily/.config/polybar/auth/kopia-nixie-password &> /dev/null; then
    echo "$SETUP_ERROR_MESSAGE: Kopia Password File"
    exit 1
fi

if [ -z "$KOPIA_PASSWORD" ]; then
    echo "$SETUP_ERROR_MESSAGE: Kopia Password"
    exit 1
fi


if ! systemctl is-active kopia-nixie &> /dev/null; then
    echo "$DISABLED_MESSAGE"
    exit 1
fi

if ! curl -k https://127.0.0.1:8385 &> /dev/null; then
    echo "$FAILED_MESSAGE: Server is offline"
    exit 1
fi

# ===
# All of the below written by Claude

CONFIG_FILE="/home/emily/.config/kopia/Nixie/config.json"
CURRENT_HOST=$(jq -r '.hostname // empty' "$CONFIG_FILE" 2>/dev/null)
TIME_THRESHOLD=$((2 * 3600))  # 2 hours in seconds

# Get list of all snapshots with their sources
snapshots=$(kopia snapshot list --timezone=cest --all --config-file="$CONFIG_FILE" --json 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "$FAILED_MESSAGE: CLI error%{F-}"
    exit 1
fi

# Get unique sources (targets) from snapshots
sources=$(echo "$snapshots" | jq -r --arg host "$CURRENT_HOST" \
    '[.[] | select(.source.host == $host)] | map(.source | "\(.userName)@\(.host):\(.path)") | unique | .[]' 2>/dev/null)

if [ -z "$sources" ]; then
    echo "$FAILED_MESSAGE: No snapshots%{F-}"
    exit 0
fi

# Count total sources
total_sources=$(echo "$sources" | wc -l)

# Check each source's latest snapshot
stale_count=0
recent_count=0

current_time=$(date +%s)

while IFS= read -r source; do
    if [ -z "$source" ]; then
        continue
    fi

    # Get latest snapshot time for this source
    latest_snapshot=$(echo "$snapshots" | \
        jq -r --arg src "$source" \
        '[.[] | select((.source.userName + "@" + .source.host + ":" + .source.path) == $src)] |
         sort_by(.startTime) | reverse | .[0].startTime' 2>/dev/null)

    if [ -z "$latest_snapshot" ] || [ "$latest_snapshot" = "null" ]; then
        ((stale_count++))
        continue
    fi

    # Convert snapshot time to epoch (convert from UTC to local time)
    snapshot_time=$(date -d "$latest_snapshot" +%s 2>/dev/null)

    if [ $? -ne 0 ]; then
        # Try alternative date parsing for ISO 8601 UTC format
        snapshot_time=$(date --date="$latest_snapshot" +%s 2>/dev/null)
    fi

    if [ $? -ne 0 ]; then
        ((stale_count++))
        continue
    fi

    # Check if snapshot is within threshold
    time_diff=$((current_time - snapshot_time))

    if [ $time_diff -gt $TIME_THRESHOLD ]; then
        ((stale_count++))
    else
        ((recent_count++))
    fi
done <<< "$sources"

# Output status for polybar
if [ $stale_count -eq 0 ]; then
    echo "$SUCESSFUL_MESSAGE"
else
    echo "$FAILED_MESSAGE"
fi

exit 0