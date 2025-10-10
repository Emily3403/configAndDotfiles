#!/usr/bin/env bash

if [[ $EUID -eq 0 ]]; then
   echo "This script should not be run as root."
   exit 1
fi

if [ $# -eq 0 ] || [ $# -gt 1 ];
then
    echo "I need a single name to connect to. Currently supported: Nixie / UwU-Grave."
    exit 1
fi

if [ "$1" != "Nixie" ] && [ "$1" != "UwU-Grave" ];
then
    echo "Argument not in the expected: Nixie / UwU-Grave. Aborting!"
    exit 1
fi

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"

sudo mkdir -p /etc/kopia/
sudo chown root:root /etc/kopia/
sudo chmod 0700 /etc/kopia
sudo cp "$SCRIPT_DIR/../systemd/kopia-${1,,}.env" "/etc/kopia/$1.env"
