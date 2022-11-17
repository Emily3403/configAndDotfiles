#/bin/bash

minWidth=3840
minHeight=2160
parallel=16

# $1 = filename
remove_bad_file() {
    width=$(identify -format "%w" $1)
    height=$(identify -format "%h" $1)
    if [ $width -lt $minWidth ]; then
        rm $1
        continue
    fi 
    if [ $height -lt $minHeight ]; then
        rm $1
        continue
    fi
}

for file in ./Images/*
do
    ((i=i%parallel)); ((i++==0)) && wait
    remove_bad_file $file &

done
