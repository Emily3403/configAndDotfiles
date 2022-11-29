#!/bin/bash

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
find $SCRIPT_DIR -maxdepth 2 -name ".git"  | sed -r 's|/[^/]+$||' | xargs -P10 -I{} /usr/bin/git -C {} pull --rebase
