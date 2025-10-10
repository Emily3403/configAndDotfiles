#!/usr/bin/env bash

DISABLED_COLOR="%{F#696969}"
DISABLED_MESSAGE="${DISABLED_COLOR}󰓨 Sync"

FAILED_COLOR="%{F#ED8796}"
FAILED_MESSAGE="${FAILED_COLOR}󰓧 Sync"
SETUP_ERROR_MESSAGE="${FAILED_COLOR}Setup Error"

WAITING_COLOR="%{F#EED49F}"
WAITING_MESSAGE="${WAITING_COLOR}… Sync"

SUCESSFUL_COLOR="%{F#A6DA95}"
SUCESSFUL_MESSAGE="${SUCESSFUL_COLOR}󰓦 Sync"

if ! systemctl is-active syncthing@emily.service &> /dev/null; then
    echo "$DISABLED_MESSAGE"
    exit 1
fi

if ! ping -c 1 130.149.220.19 &> /dev/null; then
    echo "$FAILED_MESSAGE Server is offline"
    exit 1
fi

if ! dig sync.ruwusch.de &> /dev/null; then
    echo "$FAILED_MESSAGE Server is offline"
    exit 1
fi

if ! curl -I https://sync.ruwusch.de --max-time 10 &> /dev/null; then
    echo "$FAILED_MESSAGE No HTTP"
    exit 1
fi

if ! source /home/emily/.config/polybar/auth/syncthing-api-key &> /dev/null; then
    echo "$SETUP_ERROR_MESSAGE No API Key File!"
    exit 1
fi

if [ -z "$SYNCTHING_API_KEY" ]; then
    echo "$SETUP_ERROR_MESSAGE No API Key!"
    exit 1
fi

connected=$(curl -s -H "X-API-Key: $SYNCTHING_API_KEY" http://127.0.0.1:8384/rest/system/connections | jq '.connections["JLUSVL4-N43D5LL-NTSMWHC-IXPJFRT-VK6J33M-3XV3HED-LVSZDW7-SHHC5A7"].connected')
if [ "$connected" = "false" ]; then
    echo "$WAITING_MESSAGE"
    exit 0
fi

echo "$SUCESSFUL_MESSAGE"

