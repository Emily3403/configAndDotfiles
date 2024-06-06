#!/usr/bin/env bash

# When starting up, internet is not available just yet. This should be fixed some other way but this is a workaround for now
sleep 5

lockfile="/tmp/.arch-update.lock"

updates=$(flock "$lockfile" -c checkupdates)
status="$?"
if [ "$status" == 1 ]; then
  exit 1
elif [ "$status" == 2 ]; then
  echo 0
  exit 0
fi

echo "$updates" | wc -l
