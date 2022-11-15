#!/bin/bash

if [ ! -f ~/.password-store/ssh.gpg ] || [ ! -f ~/.password-store/ssh_pub.gpg ]
then
    echo "The ssh / ssh_pub files are missing."
    exit 1
fi

read -p "Password please: " -s password

export GPG_TTY=$(tty)

gpg --batch --passphrase-file <(echo -n $password) --decrypt ~/.password-store/ssh.gpg > ~/.ssh/id_rsa || exit 1
gpg --batch --passphrase-file <(echo -n $password) --decrypt ~/.password-store/ssh_pub.gpg  > ~/.ssh/id_rsa.pub || exit 1

chmod 0600 ~/.ssh/id_rsa
