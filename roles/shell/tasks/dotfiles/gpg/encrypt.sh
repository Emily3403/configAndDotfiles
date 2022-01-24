#/bin/bash

# If you are using this script you should change "Emily Seebeck" to your name!
USER=Emily\ Seebeck

gpg --export $USER > pubkey.asc
gpg --export-secret-keys $USER | paperkey --output-type raw | openssl enc -aes-256-cbc -md sha512 -pbkdf2 -iter 100000 | qrencode --8bit --output secret.png
