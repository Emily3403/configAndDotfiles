#!/usr/bin/env bash

ROOT_PASSWORD="grootyroot"

mkdir -p /mnt/etc/nixos/
curl -o /mnt/etc/nixos/configuration.nix -L \
https://github.com/openzfs/openzfs-docs/raw/master/docs/Getting%20Started/NixOS/Root%20on%20ZFS/configuration.nix

for i in $DISK; do
  sed -i \
  "s|PLACEHOLDER_FOR_DEV_NODE_PATH|\"${i%/*}/\"|" \
  /mnt/etc/nixos/configuration.nix
  break
done

# Customize configuration to your hardware
diskNames=""
for i in $DISK; do
  diskNames="$diskNames \"${i##*/}\""
done
tee -a /mnt/etc/nixos/machine.nix <<EOF
{
  bootDevices = [ $diskNames ];
}
EOF

# Change password
sed -i \
"s|PLACEHOLDER_FOR_ROOT_PWD_HASH|\""${rootPwd}"\"|" \
/mnt/etc/nixos/configuration.nix
