#!/usr/bin/env bash

if [ "$EUID" -ne 0 ]
  then echo "This script needs root permissions!"
  exit
fi

IP="138.201.195.105"
GATEWAY=$(ip route get "$IP" | awk '{for (i=1; i<=NF; i++) if ($i == "via") print $(i+1)}')

ip route add "$IP"/32 via "$GATEWAY"
