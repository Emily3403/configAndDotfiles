if !exists('g:colors_name') || g:colors_name !=# 'everforest'
    finish
endif
if index(g:everforest_loaded_file_types, 'help') ==# -1
    call add(g:everforest_loaded_file_types, 'help')
else
    finish
endif
let s:configuration = everforest#get_configuration()
let s:palette = everforest#get_palette(s:configuration.background)
" ft_begin: help {{{
call everforest#highlight('helpNote', s:palette.purple, s:palette.none, 'bold')
call everforest#highlight('helpHeadline', s:palette.red, s:palette.none, 'bold')
call everforest#highlight('helpHeader', s:palette.orange, s:palette.none, 'bold')
call everforest#highlight('helpURL', s:palette.green, s:palette.none, 'underline')
call everforest#highlight('helpHyperTextEntry', s:palette.yellow, s:palette.none, 'bold')
highlight! link helpHyperTextJump Yellow
highlight! link helpCommand Aqua
highlight! link helpExample Green
highlight! link helpSpecial Blue
highlight! link helpSectionDelim Grey
" ft_end
