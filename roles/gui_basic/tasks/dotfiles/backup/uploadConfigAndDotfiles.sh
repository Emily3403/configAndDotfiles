#!/bin/bash

cd ~/configAndDotfiles/ || exit 1

git add -A
git commit -m "Automatic upload at $(date +"%Y-%m-%d T %H:%M:%S%z")"
git push

cd - || exit 1
