if !exists('g:colors_name') || g:colors_name !=# 'everforest'
    finish
endif
if index(g:everforest_loaded_file_types, 'haskell') ==# -1
    call add(g:everforest_loaded_file_types, 'haskell')
else
    finish
endif
" ft_begin: haskell {{{
" haskell-vim: https://github.com/neovimhaskell/haskell-vim {{{
highlight! link haskellBrackets Blue
highlight! link haskellIdentifier Yellow
highlight! link haskellAssocType Aqua
highlight! link haskellQuotedType Aqua
highlight! link haskellType Aqua
highlight! link haskellDeclKeyword RedItalic
highlight! link haskellWhere RedItalic
highlight! link haskellDeriving PurpleItalic
highlight! link haskellForeignKeywords PurpleItalic
" }}}
" ft_end
