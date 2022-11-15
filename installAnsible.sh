#!/bin/bash
sudo pacman -S ansible
pip install aiohttp

ansible-galaxy collection install community.general
