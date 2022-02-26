if !exists('g:colors_name') || g:colors_name !=# 'everforest'
    finish
endif
if index(g:everforest_loaded_file_types, 'dirvish') ==# -1
    call add(g:everforest_loaded_file_types, 'dirvish')
else
    finish
endif
" ft_begin: dirvish {{{
" https://github.com/justinmk/vim-dirvish
highlight! link DirvishPathTail Aqua
highlight! link DirvishArg Yellow
" ft_end
