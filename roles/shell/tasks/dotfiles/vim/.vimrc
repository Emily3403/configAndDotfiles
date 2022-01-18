" These settings are copied from https://github.com/MatteoGaetzner/arch-box-system-files - Thanks alot ^^

" TODO: 
"   Latex
"   Scrolling less intensive
"
"   Ask:
"       How to best jump between windows?
"       What does more textobjects do?
"       Why packadd! everforest not in your .vimrc file?
"       How to clipboard
"       How to sniplet
"       How to indent whole line
"
" Maybe todo:
"   Auto clang
"   Markdown preview
"   Spelling and grammer
"

"--  Temp custom  --
packadd! everforest


"---------------  General Settings  ---------------
if &shell =~# 'fish$'
    set shell=sh
endif


filetype plugin indent on
set backspace=indent,eol,start
set complete+=kspell
set completeopt=menuone,longest
set conceallevel=2
set expandtab
set ic is
set ignorecase
set linebreak
set shiftwidth=4
set shortmess+=c
set smartcase
set smartindent
set tabstop=4
set number relativenumber
set nu rnu
let mapleader = " "
syntax on

" Use Python3
if has('python3')
endif


"------------------  Key Tweaks  ------------------

nnoremap <BS> hx

"----------------  Vimrc Editing  -----------------

nnoremap <F1> :e ~/.vimrc<CR>
nnoremap <F2> <C-o>:source ~/.vimrc<CR>
nnoremap <F3> :e ~/.config/fish/config.fish<CR>


"-----------------  Moving Lines  -----------------

set timeout ttimeoutlen=25
nnoremap <C-k> :m .+1<CR>==
nnoremap <C-l> :m .-2<CR>==
inoremap <C-k> <Esc>:m .+1<CR>==gi
inoremap <C-l> <Esc>:m .-2<CR>==gi
vnoremap <C-k> :m '>+1<CR>gv=gv
vnoremap <C-l> :m '<-2<CR>gv=gv

"-----------------  Line Numbers  -----------------





" For dark version.
set background=dark
" This configuration option should be placed before `colorscheme everforest`.
" Available values: 'hard', 'medium'(default), 'soft'
let g:everforest_background = 'medium'

" Other options
let g:everforest_enable_italic = 1
let g:everforest_cursor = 'auto'
let g:everforest_ui_contrast = 'high'
let g:everforest_show_eob = 1
let g:everforest_diagnostic_text_highlight = 1
let g:everforest_diagnostic_line_highlight = 0
let g:everforest_better_performance = 1

" Custom stuff
let g:everforest_disable_italic_comment = 1
let g:everforest_transparent_background = 1


" Use this color scheme
colorscheme everforest

" More textobjects
for s:char in [ '_', '.', ':', ',', ';', '<bar>', '/', '<bslash>', '*', '+', '%', '$' ]
  execute 'xnoremap i' . s:char . ' :<C-u>normal! T' . s:char . 'vt' . s:char . '<CR>'
  execute 'onoremap i' . s:char . ' :normal vi' . s:char . '<CR>'
  execute 'xnoremap a' . s:char . ' :<C-u>normal! F' . s:char . 'vf' . s:char . '<CR>'
  execute 'onoremap a' . s:char . ' :normal va' . s:char . '<CR>'
endfor

"-------------------  Nerdtree  -------------------

" Open Nerdtree shortcuts
nmap <C-f> :NERDTreeToggle<CR>
nnoremap <silent> <Leader>v :NERDTreeFind<CR>
set modifiable

" Beauty
let NERDTreeMinimalUI = 1
let NERDTreeDirArrows = 1

" Convenience
let NERDTreeQuitOnOpen = 1
let NERDTreeAutoDeleteBuffer = 1

" Exit Vim if NERDTree is the only window left.
autocmd BufEnter * if tabpagenr('$') == 1 && winnr('$') == 1 && exists('b:NERDTree') && b:NERDTree.isTabTree() |
      \ quit | endif



"--------------  YouCompleteMe  ------------------

let g:ycm_min_num_of_chars_for_completion = 1
let g:ycm_global_ycm_extra_conf = '/home/matteo/.vim/settings/ycm/ycm_extra_conf.py'

"--------------  UltiSnips  ----------------------

let g:UltiSnipsEditSplit="vertical"
let g:UltiSnipsExpandTrigger = "<nop>"
let g:UltiSnipsListSnippets="<C-l>"
let g:ulti_expand_or_jump_res = 0
function ExpandSnippetOrCarriageReturn()
  let snippet = UltiSnips#ExpandSnippetOrJump()
  if g:ulti_expand_or_jump_res > 0
    return snippet
  else
    return "\<CR>"
  endif
endfunction
inoremap <expr> <CR> pumvisible() ? "<C-R>=ExpandSnippetOrCarriageReturn()<CR>" : "\<CR>"


"----------------  Custom (Emily)  ----------------
noremap ö l
noremap l k
noremap k j
noremap j h

"----------------  Fish ---------------


