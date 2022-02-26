if !exists('g:colors_name') || g:colors_name !=# 'everforest'
    finish
endif
if index(g:everforest_loaded_file_types, 'ps1') ==# -1
    call add(g:everforest_loaded_file_types, 'ps1')
else
    finish
endif
" ft_begin: ps1 {{{
" vim-ps1: https://github.com/PProvost/vim-ps1 {{{
highlight! link ps1FunctionInvocation Aqua
highlight! link ps1FunctionDeclaration Aqua
highlight! link ps1InterpolationDelimiter Yellow
highlight! link ps1BuiltIn Yellow
" }}}
" ft_end
