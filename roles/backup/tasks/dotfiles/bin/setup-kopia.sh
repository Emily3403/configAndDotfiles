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
source $SCRIPT_DIR/setup-config.sh $1
source $SCRIPT_DIR/generate-cert.sh $1

read  -n 1 -p "Please edit the /etc/kopia/$1.env file to contain passwords. Afterwards, please press enter!"

source "/etc/kopia/$1.env"
if [ -z "$KOPIA_PASSWORD" ];
then
    echo "No password given. Aborting!"
    exit 1
else
    echo "Working..."
fi

if [ "$1" == "Nixie" ];
then
    KOPIA_PATH="kopia"
    HOST="130.149.220.19"
    KNOWN_HOSTS_DATA="130.149.220.19 ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDxDMymGlUOH3ImqcZERYbAQQ5QSqA93bL9HyM8IW2MzPRCQDhTkG+vFPmRqCi1/TL8/ebdsUG4uPlcppwTPRe6YrlK62JaaJlv3sZeutd1Pz3ky1Pql2YDvVbLnFh1Be/tKYGjaOv9shxs150J2L45EHPzfHBa76pbZJl36XniEfUyARckJ515JyrUZnxxiSdIHCnefsHK81h8UhaVsw02Z2KP2+KhxST2tBO4rNWpfIjHhzGFWp3pdQASIB9hBBuMWVLUmNNQ9wrv64AsHi93cf868baA8jiqc2j1I+vMs4CAi16t6a3kABGxllFXv7IpWDp1T0qVXZGucrDYestSBTzj4amIcmH0fB+Le6hjueRpzqU/Vwfhkua3/bvyKsSLyHn9JBC2W2JTnOJDH7HHBvjNCP/V+hlzUjufPjmur7xgP5Gy7oG0703Ibxlux7tg+adLieBGNigRJyTccCAPBwGeH+ypApczhNI3GcBsdlw+Y3JipLr1wH3Rjxs6cHmPoY9mLh/Em9cNTMbGXd9zR9PadJ0ZAKONhz/xRUnjWxM50MildFRzknYnhdF0tck7uRjCcuFlg43TaO48mqwo1T8kKM//GnH9VKm/0ENRCJ2EZ9hhrHYYmBNBeq9ztGLShBDWIChcmvbQWoq28XL9x4puGTuFqAYjenaGd3tdhQ=="
elif [ "$1" == "UwU-Grave" ];
then
    KOPIA_PATH="home/kopia"
    HOST="192.168.1.69"
    KNOWN_HOSTS_DATA="192.168.1.69 ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBOyBPABe4Kn5JXOXS//w03OJnQsmD9ME4tUzkqXFf1OxyTMm6hZ6ddznDtaXbc+QO4YpsLLfhJha4QW6mtQjFos="
fi

# Common config
USERNAME="emily-backup"
KEYFILE="$HOME/.ssh/id_user"

mkdir -p /home/emily/.config/kopia/$1/log

kopia repository connect sftp --description=$1 --config-file=/home/emily/.config/kopia/$1/config.json --no-persist-credentials --no-check-for-updates \
    --log-file=/home/emily/.config/kopia/$1/kopia.log --file-log-level=warning --log-level=warning --cache-directory=/root/.cache/kopia \
    --path="$KOPIA_PATH" --host="$HOST" --known-hosts-data="$KNOWN_HOSTS_DATA" \
    --username="$USERNAME" --keyfile="$KEYFILE" --password="$KOPIA_PASSWORD" --override-username=emily

chown -R emily:emily "/home/emily/.config/kopia/"
chown -R emily:emily "/home/emily/.cache/kopia"
