if !exists('g:colors_name') || g:colors_name !=# 'everforest'
    finish
endif
if index(g:everforest_loaded_file_types, 'swift') ==# -1
    call add(g:everforest_loaded_file_types, 'swift')
else
    finish
endif
" ft_begin: swift {{{
" swift.vim: https://github.com/keith/swift.vim {{{
highlight! link swiftInterpolatedWrapper Yellow
highlight! link swiftInterpolatedString Blue
highlight! link swiftProperty Aqua
highlight! link swiftTypeDeclaration Orange
highlight! link swiftClosureArgument Purple
" }}}
" ft_end
