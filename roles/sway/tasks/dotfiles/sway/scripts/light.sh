#!/bin/sh
CONTENT=$(curl -s https://freegeoip.app/json/)
longitude=$(echo "$CONTENT" | jq .longitude)
latitude=$(echo "$CONTENT" | jq .latitude)
# wlsunset -l $latitude -L $longitude
wlsunset -s "21:00" -S "7:00"
