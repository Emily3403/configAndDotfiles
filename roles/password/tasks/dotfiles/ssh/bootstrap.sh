#!/bin/bash


if [ ! -f ~/.password-store/ssh.gpg ] || [ ! -f ~/.password-store/ssh_pub.gpg ]
then
    echo "The ssh / ssh_pub files are missing."
    exit 1
fi

read -p "Password please: " -s password

gpg --batch --passphrase-file <(echo -n $password) --decrypt ~/.password-store/ssh.gpg > ~/.ssh/id_rsa
gpg --batch --passphrase-file <(echo -n $password) --decrypt ~/.password-store/ssh_pub.gpg  > ~/.ssh/id_rsa.pub

chmod 0600 ~/.ssh/id_rsa
