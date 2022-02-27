#!/bin/bash

git clone https://github.com/sainnhe/everforest &
git clone https://github.com/iamcco/markdown-preview.nvim &
git clone https://github.com/preservim/nerdtree &
git clone https://github.com/Xuyuanp/nerdtree-git-plugin &
git clone https://github.com/SirVer/ultisnips &
git clone https://github.com/tpope/vim-commentary &
git clone https://github.com/dag/vim-fish &
git clone https://github.com/honza/vim-snippets &
git clone https://github.com/lervag/vimtex &
git clone https://github.com/ycm-core/YouCompleteMe &

wait

cd YouCompleteMe
git submodule update --jobs=8 --init --recursive
./install.py
cd ..


