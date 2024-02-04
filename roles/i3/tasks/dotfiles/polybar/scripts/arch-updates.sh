#!/usr/bin/env bash

lockfile="/tmp/.arch-update.lock"

updates=$(flock "$lockfile" -c checkupdates) || exit 1
echo "$updates" | wc -l
