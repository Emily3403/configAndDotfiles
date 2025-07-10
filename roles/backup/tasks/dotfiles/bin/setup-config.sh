#!/usr/bin/env bash

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root." 
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

mkdir -p /etc/kopia/
chown root:root /etc/kopia/
chmod 0700 /etc/kopia

cp "$SCRIPT_DIR/../systemd/kopia-${$1,,}.env" "/etc/kopia/$1.env"
