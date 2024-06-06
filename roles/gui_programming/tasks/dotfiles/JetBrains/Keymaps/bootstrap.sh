#!/bin/bash

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"

for dir in ~/.config/JetBrains/*
do
    for keymap in Dvorak Qwertz
    do
        ln -fs "$SCRIPT_DIR/$keymap.xml" "$dir/keymaps/$keymap.xml"
    done
done
