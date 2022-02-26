#!/bin/bash

find ~/.vim/pack/vendor/start/* -maxdepth 0 -type d -exec rm -rf {} \;
