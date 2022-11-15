#!/bin/bash

# User config
SOURCES=(~/./Documents/ ~/./Music/ ~/./Pictures/ ~/./Videos/ ~/./bin/ ~/./Games ~/./configAndDotfiles ~/./.password-store)
BACKUPS_TO_KEEP=60000  # Keep all backups

# Config for script
TARGET="complete"
TODAY=$(date -d "last sunday" --iso-8601)
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"

if [ $(date -d "6 hours ago" --iso-8601) != $(date --iso-8601) ]
then
    echo "Refusing to do backups between 0:00 and 6:00!"
    exit 0
fi

if [ "$(ssh -o BatchMode=yes -o ConnectTimeout=5 nas echo ok 2>&1)" != "ok" ];
then
    echo "Could not reach the NAS."
    exit 1
fi

if ssh nas "[ -d ~/backup/$TARGET/$TODAY ]";
then
    echo "Already done this weeks backup!"
    exit 0
fi

echo "Total size: $(du -abx ${SOURCES[@]} -d 0 | cut -f1 | paste -sd+ - | bc | numfmt --to=si)"
echo

# Setup paths + delete extra copies
ssh nas "mkdir -p ~/backup/$TARGET; find ~/backup/$TARGET -maxdepth 1 -mindepth 1 -type d | sort --reverse | tail -n +$BACKUPS_TO_KEEP | xargs -d '\n' -r rm -rf --"

# Execute the rsync
rsync -e ssh --one-file-system --info=progress2 --copy-links --delete  --exclude-from "$SCRIPT_DIR/exclude.txt"     \
    -ahR "${SOURCES[@]}" "nas:backup/$TARGET/$TODAY" || exit

# Link `last` to the current backup
ssh nas "ln -nsf ~/backup/$TARGET/$TODAY ~/backup/$TARGET/last" 
