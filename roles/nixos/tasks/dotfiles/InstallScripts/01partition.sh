#!/usr/bin/env bash

for i in ${DISK}; do

# wipe flash-based storage device to improve
# performance.
# ALL DATA WILL BE LOST
# blkdiscard -f $i

sgdisk --zap-all $i

sgdisk -n1:1M:+1G -t1:EF00 $i

sgdisk -n2:0:+4G -t2:BE00 $i

sgdisk -n4:0:+${INST_PARTSIZE_SWAP}G -t4:8200 $i

if test -z $INST_PARTSIZE_RPOOL; then
    sgdisk -n3:0:0   -t3:BF00 $i
else
    sgdisk -n3:0:+${INST_PARTSIZE_RPOOL}G -t3:BF00 $i
fi

sgdisk -a1 -n5:24K:+1000K -t5:EF02 $i

sync && udevadm settle && sleep 3

cryptsetup open --type plain --key-file /dev/random $i-part4 ${i##*/}-part4
mkswap /dev/mapper/${i##*/}-part4
swapon /dev/mapper/${i##*/}-part4
done
