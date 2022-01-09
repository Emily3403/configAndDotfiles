if !exists('g:colors_name') || g:colors_name !=# 'everforest'
    finish
endif
if index(g:everforest_loaded_file_types, 'dosini') ==# -1
    call add(g:everforest_loaded_file_types, 'dosini')
else
    finish
endif
let s:configuration = everforest#get_configuration()
let s:palette = everforest#get_palette(s:configuration.background)
" ft_begin: dosini {{{
call everforest#highlight('dosiniHeader', s:palette.red, s:palette.none, 'bold')
highlight! link dosiniLabel Yellow
highlight! link dosiniValue Green
highlight! link dosiniNumber Green
" ft_end
