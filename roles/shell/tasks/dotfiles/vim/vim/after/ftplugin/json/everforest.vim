if !exists('g:colors_name') || g:colors_name !=# 'everforest'
    finish
endif
if index(g:everforest_loaded_file_types, 'json') ==# -1
    call add(g:everforest_loaded_file_types, 'json')
else
    finish
endif
" ft_begin: json {{{
highlight! link jsonKeyword Orange
highlight! link jsonQuote Grey
highlight! link jsonBraces Fg
" ft_end
