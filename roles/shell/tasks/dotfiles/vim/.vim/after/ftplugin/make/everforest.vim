if !exists('g:colors_name') || g:colors_name !=# 'everforest'
    finish
endif
if index(g:everforest_loaded_file_types, 'make') ==# -1
    call add(g:everforest_loaded_file_types, 'make')
else
    finish
endif
" ft_begin: make {{{
highlight! link makeIdent Aqua
highlight! link makeSpecTarget Yellow
highlight! link makeTarget Blue
highlight! link makeCommands Orange
" ft_end
