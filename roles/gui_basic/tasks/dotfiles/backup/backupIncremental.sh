#!/bin/bash

# User config
SOURCES=(~/./Documents/ ~/./Music/ ~/./Pictures/ ~/./Videos/ ~/./bin/ ~/./Games ~/./configAndDotfiles ~/./.password-store ~/./.config ~/./i3bin/ ~/./.thunderbird/)
BACKUPS_TO_KEEP=60 # Two months of daily backups

# Config for script
TARGET="incremental"
TODAY=$(date --iso-8601)
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
HOME_DIR="/var/services/homes/emily"

set -e

# First check if the last backup failed. If so, we propage the error.
if [ "$1" != "" ]; then
    echo "Force flag detected. Doing the update now!"
elif [ "$(sed -n '1p' bi.out)" != 'true' ]; then
    echo "[ERROR] the backup logs indicate that there is an error. Doing it anyway :o"

elif [ "$(date -d "6 hours ago" --iso-8601)" != "$TODAY" ]; then
    echo "[ERROR] it is too early in the morning to do a backup. (0:00 - 6:00)"
    exit 1
else
    echo $'[Info]  Everything is clear: starting backup normally. \n'
fi

exit_and_write_to_file() {
    rm -f "$SCRIPT_DIR/bi.out"
    echo "[ERROR] This operation failed. I am exiting!"
    echo "false" > "$SCRIPT_DIR/bi.out"
    echo "$TODAY" >> "$SCRIPT_DIR/bi.out"

    # Maybe notify i3blocks
    if [[ $XDG_CURRENT_DESKTOP == "i3" ]]; then
        pkill -SIGRTMIN+12 i3blocks
    fi

    exit 1
}

exit_normal() {
    rm -f "$SCRIPT_DIR/bi.out"

    echo "true" > "$SCRIPT_DIR"/bi.out
    echo "$TODAY" >> "$SCRIPT_DIR"/bi.out

    # Maybe notify i3blocks
    if [[ $XDG_CURRENT_DESKTOP == "i3" ]]; then
        pkill -SIGRTMIN+12 i3blocks
    fi

    exit 0
}


echo "[Info] Starting the Backup ..."
echo "doing" > "$SCRIPT_DIR/bi.out"
echo "$TODAY" >> "$SCRIPT_DIR/bi.out"

# Maybe notify i3blocks
if [[ $XDG_CURRENT_DESKTOP == "i3" ]]; then
    pkill -SIGRTMIN+12 i3blocks
fi

echo "[Debug] Checking for general connectivity"
ping -q -w 1 -c 1 `ip r | grep default | cut -d ' ' -f 3` > /dev/null || (echo '[Debug] Failed to detect a internet connection. Sleeping for 10s and retrying'  && sleep 10 )

ping -q -w 1 -c 1 `ip r | grep default | cut -d ' ' -f 3` > /dev/null  && echo $'[Debug] Iternet connectivity checked, everything works fine!'  || (echo "[ERROR] You are not connected to your main gateway impliying you can\'t reach your NAS. Bailing out!" && exit_and_write_to_file )


echo "[Debug] starting to check for NAS connectivity"

if [ "$(ssh -o BatchMode=yes -o ConnectTimeout=45 nas echo uwu 2>&1)" != "uwu" ]; then
    echo "[ERROR] Could not reach the NAS after 45s of waiting. Bailing out!"
    exit_and_write_to_file
fi

echo $'[Debug] The Nas is up, starting to calculate the total file size to be synced ...\n'
echo "[Info]  The total file size is $(du -abx "${SOURCES[@]}" -d 0 | cut -f1 | paste -sd+ - | bc | numfmt --to=si)"

echo $'\n[Debug] Starting to create the directory structure ...'

ssh nas "mkdir -p ~/backup/$TARGET"

echo "[Debug] Deleting extra directories ..."

# TODO: Make this better
# x=$(ssh nas "find ~/backup/$TARGET -maxdepth 1 -mindepth 1 -type d " | sort --reverse | tail -n +$BACKUPS_TO_KEEP)
#x=$(ssh nas "find ~/backup/$TARGET -maxdepth 1 -mindepth 1 -type d " | sort | head -n 60)
#echo $BACKUPS_TO_KEEP
#echo $x
#echo hello
# | xargs -d '\n' -r rm -rf --"
# echo "sort --reverse | tail -n +$BACKUPS_TO_KEEP | xargs -d '\n' -r rm -rf --" || exit_and_write_to_file

ssh nas "mkdir -p ~/backup/$TARGET; find ~/backup/$TARGET -maxdepth 1 -mindepth 1 -type d | sort --reverse | tail -n +$BACKUPS_TO_KEEP | xargs -d '\n' -r rm -rf --" || exit_and_write_to_file

echo $'\n[Info]  All of the setup is done. Handing it over to rsync now!\n'

rsync -e ssh --info=progress2 --copy-links                     \
    --one-file-system --exclude-from "$SCRIPT_DIR/exclude.txt" \
        --link-dest "$HOME_DIR/backup/incremental/last" \
    -ahR "${SOURCES[@]}" "nas:backup/$TARGET/$TODAY"     ||
        exit_and_write_to_file

echo $'\n[Debug] linking `last` to the current backup ...'
ssh nas "ln -nsf ~/backup/$TARGET/$TODAY ~/backup/$TARGET/last" || exit_and_write_to_file

echo $'\n[Info] Succeeded in doing the backup. Have a nice day ^^'

exit_normal
