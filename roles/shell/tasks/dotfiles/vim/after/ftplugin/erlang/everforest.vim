if !exists('g:colors_name') || g:colors_name !=# 'everforest'
    finish
endif
if index(g:everforest_loaded_file_types, 'erlang') ==# -1
    call add(g:everforest_loaded_file_types, 'erlang')
else
    finish
endif
" ft_begin: erlang {{{
" builtin: https://github.com/vim-erlang/vim-erlang-runtime {{{
highlight! link erlangAtom Aqua
highlight! link erlangLocalFuncRef Green
highlight! link erlangLocalFuncCall Green
highlight! link erlangGlobalFuncRef Green
highlight! link erlangGlobalFuncCall Green
highlight! link erlangAttribute PurpleItalic
highlight! link erlangPipe Orange
" }}}
" ft_end
