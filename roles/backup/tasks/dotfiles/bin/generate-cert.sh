#!/usr/bin/env bash

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

if [ "$1" == "Nixie" ];
then
    HOSTNAME="nixie"
elif [ "$1" == "UwU-Grave" ];
then
    HOSTNAME="uwu-grave"
fi

mkdir -p /home/emily/.config/kopia/$1/
openssl req -new -x509 -sha256 -newkey rsa:4096 -nodes -keyout "/home/emily/.config/kopia/$1/key.pem" -days 36500 -out "/home/emily/.config/kopia/$1/cert.pem" \
  -subj "/C=DE/ST=Berlin/L=Berlin/O=Emily/OU=Company/CN=$HOSTNAME.kopia.ruwusch.de"
