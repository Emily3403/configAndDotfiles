" use <tab> for trigger completion and navigate to the next complete item


function! myspacevim#before() abort
  set clipboard=unnamedplus
  set wrap

  noremap ö l
  noremap l k
  noremap k j
  noremap j h

  noremap <C-w>ö <C-w>l
  noremap <C-w>l <C-w>l
  noremap <C-w>k <C-w>j
  noremap <C-w>j <C-w>h

  set timeoutlen=0
  
  " Coc Support
  let g:coc_config_home = '~/.SpaceVim.d/'
  let g:coc_global_extensions = [
        \ 'coc-texlab',
        \ 'coc-vimtex',
        \ 'coc-rust-analyzer',
        \ 'coc-clangd',
        \ 'coc-snippets',
        \ 'coc-marketplace',
        \ 'coc-sh', 
        \ 'coc-fish',
        \ 'coc-vimlsp',
        \ 'coc-jedi',
        \ 'coc-zig',
        \ ]

endfunction

" use <tab> for trigger completion and navigate to the next complete item
" (https://github.com/neoclide/coc.nvim/wiki/Completion-with-sources#use-tab-or-custom-key-for-trigger-completion)
function! CheckBackspace() abort
  let col = col('.') - 1
  return !col || getline('.')[col - 1]  =~# '\s'
endfunction

function! myspacevim#after() abort

  inoremap <silent><expr> <Tab>
      \ coc#pum#visible() ? coc#pum#next(1) :
      \ coc#expandableOrJumpable() ? "\<C-r>=coc#snippet#next()\<CR>" :
      \ CheckBackspace() ? "\<Tab>" :
      \ coc#refresh() 

  inoremap <silent><expr> <S-Tab>
      \ coc#pum#visible() ? coc#pum#prev(1) :
      \ coc#expandableOrJumpable() ? "\<C-r>=coc#snippet#prev()\<CR>" :
      \ CheckBackspace() ? "\<S-Tab>" :
      \ coc#refresh()
  
endfunction

