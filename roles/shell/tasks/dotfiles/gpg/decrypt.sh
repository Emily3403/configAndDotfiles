#/bin/bash

if [ ! -f "secret.asc" ]; then
    echo "The file \"secret.asc\" was not found."
    exit 1
fi

if [ ! -f "pubkey.asc" ];  then
    echo "The file \"pubkey.asc\" was not found."
    exit 1
fi


cat secret.asc  | openssl enc -d -aes-256-cbc -md sha512 -pbkdf2 -iter 100000 | paperkey --pubring pubkey.asc | gpg --import
