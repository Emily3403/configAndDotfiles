# My Config and Dotfile Repo

This repository contains my personal configuration files for my linux systems as well as a way to install them on a new system using [Ansible](https://www.ansible.com/).

# Installation
To install the configuration files on a new system, first configure the `main.yaml` file. Change the `roles` to the ones your want to install. Depending on your needs, you might also have to change the `hosts`.

Also, make sure you have Ansible installed and ssh access to `localhost` without password using a public key. It can be installed using the following command: `ssh-copy-id localhost`.

Then, simply execute the `./run.sh` script. You will be prompted for your sudo (become) password and the installation will start. It will clone this repository to `~/.config/dotfiles` and symlink all configuration to there.

# Scope
This repository is meant for **installing** a new system, not for maintaining a system. For example, the `.SpaceVim` directory in the `shell` role is a git repository that is only created, and not updated. This has to be done manually.

Further, this repository is meant for my personal use. If you find something useful, feel free to use it, however this is not tested on any other system than my own (Arch btw). It might work on other systems, but it might also break them. Use at your own risk.

# License
Unless otherwise specified, all files in this repository are licensed under the GPL v3 license. See the LICENSE file for more information. 

The `dotfiles` of each `role` are subject to the licensing terms of their respective original projects.
