"-------------  General Settings  --------------

if &shell =~# 'fish$'
    set shell=sh
endif

filetype plugin indent on
set backspace=indent,eol,start
set complete+=kspell
set nohlsearch
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
set hidden
set nostartofline
set timeout ttimeoutlen=25
let mapleader = " "
syntax on

" Performance
set lazyredraw

" Source plugins
source $HOME/.config/nvim/vim-plug/plugins.vim

" Use Python3
if has('python3')
endif

"--------------  Auxiliary Files  ----------------

set backupdir=~/.vim/backup//
set directory=~/.vim/swap//
set undodir=~/.vim/undo//

"--------------  Key Tweaks  ---------------------

nnoremap <Tab> >>2l
nnoremap <S-Tab> <<2h

" gm -> add mark
nnoremap gm m

"--------------  Moving Lines  -------------------

nnoremap <C-K> :m .+1<CR>==
nnoremap <C-L> :m .-2<CR>==
inoremap <C-K> <Esc>:m .+1<CR>==gi
inoremap <C-L> <Esc>:m .-2<CR>==gi
vnoremap <C-K> :m '>+1<CR>gv=gv
vnoremap <C-L> :m '<-2<CR>gv=gv

"--------------  Vimrc Editing  ------------------

nnoremap <F1> :e ~/.config/nvim/init.vim<CR>
nnoremap <F2> <C-o>:source ~/.config/nvim/init.vim<CR>

"--------------  Clipboard  ----------------------

autocmd VimLeave * call system("xsel -ib", getreg('+'))

set clipboard+=unnamedplus
let g:clipboard = {
            \   'name': 'xsel_override',
            \   'copy': {
                \      '+': 'xsel --input --clipboard',
                \      '*': 'xsel --input --primary',
                \    },
                \   'paste': {
                    \      '+': 'xsel --output --clipboard',
                    \      '*': 'xsel --output --primary',
                    \   },
                    \   'cache_enabled': 1,
                    \ }

"--------------  Vim-Localrc  --------------------

silent! so .vimlocal
au BufReadPost *.vimlocal set filetype=vim

"--------------  Line Numbers  -------------------

augroup numbertoggle
    autocmd!
    autocmd BufEnter,FocusGained,InsertLeave * set relativenumber
    autocmd BufLeave,FocusLost,InsertEnter   * set norelativenumber
augroup END

"--------------  Spelling and Grammar  -----------

" switch spellcheck languages
let g:myLang = 0
let g:myLangList = [ "nospell", "de_de", "en_us" ]
function! MySpellLang()
    " loop through languages
    let g:myLang = g:myLang + 1
    if g:myLang >= len(g:myLangList) | let g:myLang = 0 | endif
    if g:myLang == 0 | set nospell | endif
    if g:myLang == 1 | setlocal spell spelllang=de_de | endif
    if g:myLang == 2 | setlocal spell spelllang=en_us | endif
    echo "language:" g:myLangList[g:myLang]
endfunction

map <F12> :call MySpellLang()<CR>
imap <F12> :call MySpellLang()<CR>

"--------------  Windows  ------------------------

" Make windows always equal size after resize
autocmd VimResized * if &equalalways | wincmd = | endif

"--------------  Themes  -------------------------

if has('termguicolors')
    set termguicolors
endif

" For dark version.
set background=dark

" Other options
let g:everforest_enable_italic = 1
let g:everforest_transparent_background = 1
let g:everforest_cursor = 'auto'
let g:everforest_ui_contrast = 'high'
let g:everforest_show_eob = 1
let g:everforest_diagnostic_text_highlight = 1
let g:everforest_diagnostic_line_highlight = 0
let g:everforest_better_performance = 1

" Use this color scheme
colorscheme everforest

"--------------  Lualine  ------------------------

lua << END
require('lualine').setup {
    options = {
        icons_enabled = true,
        theme = 'auto',
        component_separators = { left = '', right = ''},
        section_separators = { left = '', right = ''},
        disabled_filetypes = {},
        always_divide_middle = true,
        },
    sections = {
        lualine_a = {'mode'},
        lualine_b = {'branch', 'diff', 'diagnostics'},
        lualine_c = {'filename'},
        lualine_x = {'encoding', 'fileformat', 'filetype'},
        lualine_y = {'progress'},
        lualine_z = {'location'}
        },
    inactive_sections = {
        lualine_a = {},
        lualine_b = {},
        lualine_c = {'filename'},
        lualine_x = {'location'},
        lualine_y = {},
        lualine_z = {}
        },
    tabline = {},
    extensions = {}
    }
END

"--------------  Text Objects  -------------------

for s:char in [ '_', '.', ':', ',', ';', '<bar>', '<bslash>', '*', '+', '%', '$' ]
    execute 'xnoremap i' . s:char . ' :<C-u>normal! T' . s:char . 'vt' . s:char . '<CR>'
    execute 'onoremap i' . s:char . ' :normal vi' . s:char . '<CR>'
    execute 'xnoremap a' . s:char . ' :<C-u>normal! F' . s:char . 'vf' . s:char . '<CR>'
    execute 'onoremap a' . s:char . ' :normal va' . s:char . '<CR>'
endfor

"--------------  Nerdtree  -----------------------

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

"--------------  Coc  ----------------------------

" Set internal encoding of vim, not needed on neovim, since coc.nvim using some
" unicode characters in the file autoload/float.vim
set encoding=utf-8

"Some servers have issues with backup files, see #649.
set nobackup
set nowritebackup

"Give more space for displaying messages.
set cmdheight=2

"Having longer updatetime (default is 4000 ms = 4 s) leads to noticeable
"delays and poor user experience.
set updatetime=300

"Don't pass messages to |ins-completion-menu|.
set shortmess+=c

"Always show the signcolumn, otherwise it would shift the text each time
"diagnostics appear/become resolved.
if has("nvim-0.5.0") || has("patch-8.1.1564")
    "  Recently vim can merge signcolumn and number column into one
    set signcolumn=number
else
    set signcolumn=yes
endif

"Use <c-space> to trigger completion.
if has('nvim')
    inoremap <silent><expr> <c-space> coc#refresh()
else
    inoremap <silent><expr> <c-@> coc#refresh()
endif

" Make <CR> auto-select the first completion item and notify coc.nvim to
" format on enter, <cr> could be remapped by other vim plugin
inoremap <silent><expr> <cr> pumvisible() ? coc#_select_confirm()
            \: "\<C-g>u\<CR>\<c-r>=coc#on_enter()\<CR>"

"Use `[g` and `]g` to navigate diagnostics
"Use `:CocDiagnostics` to get all diagnostics of current buffer in location list.
nmap <silent> [g <Plug>(coc-diagnostic-prev)
nmap <silent> ]g <Plug>(coc-diagnostic-next)

"GoTo code navigation.
nmap <silent> gd <Plug>(coc-definition)
nmap <silent> gy <Plug>(coc-type-definition)
nmap <silent> gi <Plug>(coc-implementation)
nmap <silent> gr <Plug>(coc-references)

"Use K to show documentation in preview window.
nnoremap <silent> K :call <SID>show_documentation()<CR>

function! s:show_documentation()
    if (index(['vim','help'], &filetype) >= 0)
        execute 'h '.expand('<cword>')
    elseif (coc#rpc#ready())
        call CocActionAsync('doHover')
    else
        execute '!' . &keywordprg .  " . expand('<cword>')
    endif
endfunction

"Highlight the symbol and its references when holding the cursor.
autocmd CursorHold * silent call CocActionAsync('highlight')

"Symbol renaming.
nmap <leader>rn <Plug>(coc-rename)

"Formatting selected code.
xmap <leader>f  <Plug>(coc-format-selected)
nmap <leader>f  <Plug>(coc-format-selected)

augroup cocgroup0
    autocmd!
    "  Setup formatexpr specified filetype(s).
    autocmd FileType typescript,json setl formatexpr=CocAction('formatSelected')
    "  Update signature help on jump placeholder.
    autocmd User CocJumpPlaceholder call CocActionAsync('showSignatureHelp')
augroup end

"Applying codeAction to the selected region.
"Example: `<leader>aap` for current paragraph
xmap <leader>a  <Plug>(coc-codeaction-selected)
nmap <leader>a  <Plug>(coc-codeaction-selected)

"Remap keys for applying codeAction to the current buffer.
nmap <leader>ac  <Plug>(coc-codeaction)
"Apply AutoFix to problem on the current line.
nmap <leader>qf  <Plug>(coc-fix-current)

"Run the Code Lens action on the current line.
nmap <leader>cl  <Plug>(coc-codelens-action)

"Map function and class text objects
"NOTE: Requires 'textDocument.documentSymbol' support from the language server.
xmap af <Plug>(coc-funcobj-a)
xmap if <Plug>(coc-funcobj-i)
omap if <Plug>(coc-funcobj-i)
omap af <Plug>(coc-funcobj-a)
xmap ic <Plug>(coc-classobj-i)
omap ic <Plug>(coc-classobj-i)
xmap ac <Plug>(coc-classobj-a)
omap ac <Plug>(coc-classobj-a)

"Remap <C-f> and <C-b> for scroll float windows/popups.
" if has('nvim-0.4.0') || has('patch-8.2.0750')
"   nnoremap <silent><nowait><expr> <Down> coc#float#has_scroll() ? coc#float#scroll(1) : \<Down>"
"   nnoremap <silent><nowait><expr> <Up> coc#float#has_scroll() ? coc#float#scroll(0) : \<Up>"
"   inoremap <silent><nowait><expr> <Down> coc#float#has_scroll() ? \<c-r>=coc#float#scroll(1)\<cr>" : "\<Right>"
"   inoremap <silent><nowait><expr> <Up> coc#float#has_scroll() ? \<c-r>=coc#float#scroll(0)\<cr>" : "\<Left>"
"   vnoremap <silent><nowait><expr> <Down> coc#float#has_scroll() ? coc#float#scroll(1) : \<Down>"
"   vnoremap <silent><nowait><expr> <Up> coc#float#has_scroll() ? coc#float#scroll(0) : \<Up>"
" endif

"Use CTRL-S for selections ranges.
"Requires 'textDocument/selectionRange' support of language server.
nmap <silent> <C-s> <Plug>(coc-range-select)
xmap <silent> <C-s> <Plug>(coc-range-select)

"Add `:Format` command to format current buffer.
command! -nargs=0 Format :call CocAction('format')

"Add `:Fold` command to fold current buffer.
command! -nargs=? Fold :call     CocAction('fold', <f-args>)

"Add `:OR` command for organize imports of the current buffer.
command! -nargs=0 OR   :call     CocActionAsync('runCommand', 'editor.action.organizeImport')

"Add (Neo)Vim's native statusline support.
"NOTE: Please see `:h coc-status` for integrations with external plugins that
"provide custom statusline: lightline.vim, vim-airline.
set statusline^=%{coc#status()}%{get(b:,'coc_current_function','')}

"Mappings for CoCList
"Show all diagnostics.
nnoremap <silent><nowait> <space>a  :<C-u>CocList diagnostics<cr>
"Manage extensions.
nnoremap <silent><nowait> <space>e  :<C-u>CocList extensions<cr>
"Show commands.
nnoremap <silent><nowait> <space>c  :<C-u>CocList commands<cr>
"Find symbol of current document.
nnoremap <silent><nowait> <space>o  :<C-u>CocList outline<cr>
"Search workspace symbols.
nnoremap <silent><nowait> <space>s  :<C-u>CocList -I symbols<cr>
"Do default action for next item.
nnoremap <silent><nowait> <space>j  :<C-u>CocNext<CR>
"Do default action for previous item.
nnoremap <silent><nowait> <space>k  :<C-u>CocPrev<CR>
"Resume latest coc list.
nnoremap <silent><nowait> <space>p  :<C-u>CocListResume<CR>

"--------------  Coc-Snippets  -------------------

inoremap <silent><expr> <TAB>
            \ pumvisible() ? coc#_select_confirm() :
            \ coc#expandableOrJumpable() ? "\<C-r>=coc#rpc#request('doKeymap', ['snippets-expand-jump',''])\<CR>" :
            \ <SID>check_back_space() ? "\<TAB>" :
            \ coc#refresh()

function! s:check_back_space() abort
    let col = col('.') - 1
    return !col || getline('.')[col - 1]  =~# '\s'
endfunction

" let g:coc_snippet_next = '<tab>'

"--------------  UltiSnips  ----------------------

let g:UltiSnipsSnippetDirectories=[$HOME.'/.config/nvim/UltiSnips']
au BufRead,BufNewFile *.snippets setfiletype snippets
let g:UltiSnipsEditSplit="vertical"
let g:UltiSnipsExpandTrigger = "<s-tab>"
let g:ulti_expand_or_jump_res = 0
let g:UltiSnipsJumpForwardTrigger="<nop>"
let g:UltiSnipsJumpBackwardTrigger="<nop>"


"--------------  Formating  ----------------------

" Selects correct formating app the given file
fun! Format()
    if exists('b:useClangFormat')
        let l:lines="all"
        if has('python3')
            py3f ~/.config/llvm/clang-format.py
        elseif has('python')
            pyf ~/.config/llvm/clang-format.py
        endif
    endif
    if exists('b:usePrettier')
        Prettier
        return
    endif
    if exists('b:dontFormat')
        return
    endif
    Autoformat
endfun

" File formatting settings
autocmd FileType h,c,cpp let b:useClangFormat=1
autocmd FileType html,javascript,vue,css let b:usePrettier=1
autocmd FileType "",yaml,vifm,conf,markdown let b:dontFormat=1
autocmd BufWritePre *.rasi let b:dontFormat=1
autocmd BufWritePre *.snippets let b:dontFormat=1
autocmd BufWritePre * call Format()

"--------------  Latex  --------------------------

syntax enable

let g:tex_flavor = "latex"

" Or with a generic interface:
let g:vimtex_view_general_viewer = 'okular'
let g:vimtex_view_general_options = '--unique file:@pdf\#src:@line@tex'

let g:vimtex_compiler_method = 'latexmk'

" vim-latex-live-preview
set updatetime=500
let g:livepreview_previewer = 'okular'
let g:livepreview_texinputs = './out/'
let g:livepreview_use_biber = 1

" Quick compilation
autocmd FileType tex nnoremap <CR> :AsyncRun rm out/*; latexmk -pdf -output-directory=out %<CR>


"--------------  C++  ----------------------------

" Quick compile && run
autocmd FileType cpp nnoremap <C-c> :!g++ -std=c++11 % -Wall -g -o %.out && ./%.out<CR>
autocmd FileType cpp nnoremap <C-s> :!make && gdb -tui ./bin/main.out<CR>
autocmd FileType cpp nnoremap <C-m> :!make && ./bin/main.out<CR>
autocmd FileType cpp nnoremap <CR> :!cmake -S src -B release ; make --directory=release ; ./release/main images/lena.jpg $@

"--------------  Bash  ---------------------------

autocmd FileType sh nnoremap <C-c> :!bash %<CR>

"--------------  Python  -------------------------

autocmd FileType python nnoremap <CR> :AsyncRun make run ARGS="%"<CR>
autocmd FileType python nnoremap <F4> :AsyncRun make test <CR>

augroup numbertoggle
    autocmd!
    autocmd BufEnter,FocusGained,InsertLeave * set relativenumber
    autocmd BufLeave,FocusLost,InsertEnter   * set norelativenumber
augroup END

let g:asyncrun_open = 10

"--------------  Markdown  -----------------------

autocmd BufWritePre *.md call CocActionAsync('runCommand', 'markdownlint.fixAll')
" autocmd FileType markdown normal zR
" let g:vim_markdown_math = 1
" let g:mkdp_refresh_slow=1
" let g:mkdp_markdown_css='~/.vim/ressources/github-markdown.css'
let g:mkdp_browser = 'chromium'
let $NVIM_MKDP_LOG_FILE = expand('~/mkdp-log.log')
let $NVIM_MKDP_LOG_LEVEL = 'debug'

"--------------  Betriebssystem Praktikum  -------

autocmd FileType c set shiftwidth=4
autocmd FileType c set tabstop=4
autocmd FileType c nnoremap <F3> :Neomake qemu <CR>
autocmd FileType c nnoremap <F4> :Neomake debug <CR>



"--------------  Custom Emily --------------------

noremap ö l
noremap l k
noremap k j
noremap j h

let g:gutentags_cache_dir = '~/.cache/gutentags/'
lua require'nvim-tree'.setup()


nmap <C-f> :NvimTreeToggle<CR>
