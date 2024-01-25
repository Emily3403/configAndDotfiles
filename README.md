# My Config and Dotfile Repo

This repository contains my personal configuration files for my linux systems as well as a way to install them on a new system using [Ansible](https://www.ansible.com/).

# Installation
To install the configuration files on a new system, simply run the following command:
```bash
./run.sh
```

You need to have Ansible installed and ssh access to `localhost` without password using a public key. It can be installed using the following command: `ssh-copy-id localhost`.

You will then be prompted for your sudo (become) password.

# License
Unless otherwise specified, all files in this repository are licensed under the GPL v3 license. See the LICENSE file for more information. The `dotfiles` of each `role` are subject to the licensing terms of their respective original projects.
