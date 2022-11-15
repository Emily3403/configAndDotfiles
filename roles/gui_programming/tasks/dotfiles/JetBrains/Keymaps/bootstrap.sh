#!/bin/bash

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"

for dir in ~/.config/JetBrains/*
do
    for keymap in Dvorak Qwertz
    do
        if [ ! -f "$dir/jba_config/linux.keymaps/$keymap.xml" ];
        then
            ln -s "$SCRIPT_DIR/$keymap.xml" "$dir/jba_config/linux.keymaps/$keymap.xml"
        fi
    done
done
