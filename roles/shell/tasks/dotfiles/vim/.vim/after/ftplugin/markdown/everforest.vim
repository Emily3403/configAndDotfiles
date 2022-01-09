if !exists('g:colors_name') || g:colors_name !=# 'everforest'
    finish
endif
if index(g:everforest_loaded_file_types, 'markdown') ==# -1
    call add(g:everforest_loaded_file_types, 'markdown')
else
    finish
endif
let s:configuration = everforest#get_configuration()
let s:palette = everforest#get_palette(s:configuration.background)
" ft_begin: markdown {{{
" builtin: {{{
call everforest#highlight('markdownH1', s:palette.red, s:palette.none, 'bold')
call everforest#highlight('markdownH2', s:palette.orange, s:palette.none, 'bold')
call everforest#highlight('markdownH3', s:palette.yellow, s:palette.none, 'bold')
call everforest#highlight('markdownH4', s:palette.green, s:palette.none, 'bold')
call everforest#highlight('markdownH5', s:palette.blue, s:palette.none, 'bold')
call everforest#highlight('markdownH6', s:palette.purple, s:palette.none, 'bold')
call everforest#highlight('markdownUrl', s:palette.blue, s:palette.none, 'underline')
call everforest#highlight('markdownItalic', s:palette.none, s:palette.none, 'italic')
call everforest#highlight('markdownBold', s:palette.none, s:palette.none, 'bold')
call everforest#highlight('markdownItalicDelimiter', s:palette.grey1, s:palette.none, 'italic')
highlight! link markdownCode Green
highlight! link markdownCodeBlock Aqua
highlight! link markdownCodeDelimiter Aqua
highlight! link markdownBlockquote Grey
highlight! link markdownListMarker Red
highlight! link markdownOrderedListMarker Red
highlight! link markdownRule Purple
highlight! link markdownHeadingRule Grey
highlight! link markdownUrlDelimiter Grey
highlight! link markdownLinkDelimiter Grey
highlight! link markdownLinkTextDelimiter Grey
highlight! link markdownHeadingDelimiter Grey
highlight! link markdownLinkText Purple
highlight! link markdownUrlTitleDelimiter Green
highlight! link markdownIdDeclaration markdownLinkText
highlight! link markdownBoldDelimiter Grey
highlight! link markdownId Yellow
" }}}
" vim-markdown: https://github.com/gabrielelana/vim-markdown {{{
call everforest#highlight('mkdURL', s:palette.blue, s:palette.none, 'underline')
call everforest#highlight('mkdInlineURL', s:palette.purple, s:palette.none, 'underline')
call everforest#highlight('mkdItalic', s:palette.grey1, s:palette.none, 'italic')
highlight! link mkdCodeDelimiter Aqua
highlight! link mkdBold Grey
highlight! link mkdLink Purple
highlight! link mkdHeading Grey
highlight! link mkdListItem Red
highlight! link mkdRule Purple
highlight! link mkdDelimiter Grey
highlight! link mkdId Yellow
" }}}
" ft_end
let s:configuration = everforest#get_configuration()
let s:palette = everforest#get_palette(s:configuration.background)
" ft_begin: html/markdown/javascriptreact/typescriptreact {{{
" builtin: https://notabug.org/jorgesumle/vim-html-syntax {{{
call everforest#highlight('htmlH1', s:palette.red, s:palette.none, 'bold')
call everforest#highlight('htmlH2', s:palette.orange, s:palette.none, 'bold')
call everforest#highlight('htmlH3', s:palette.yellow, s:palette.none, 'bold')
call everforest#highlight('htmlH4', s:palette.green, s:palette.none, 'bold')
call everforest#highlight('htmlH5', s:palette.blue, s:palette.none, 'bold')
call everforest#highlight('htmlH6', s:palette.purple, s:palette.none, 'bold')
call everforest#highlight('htmlLink', s:palette.none, s:palette.none, 'underline')
call everforest#highlight('htmlBold', s:palette.none, s:palette.none, 'bold')
call everforest#highlight('htmlBoldUnderline', s:palette.none, s:palette.none, 'bold,underline')
call everforest#highlight('htmlBoldItalic', s:palette.none, s:palette.none, 'bold,italic')
call everforest#highlight('htmlBoldUnderlineItalic', s:palette.none, s:palette.none, 'bold,underline,italic')
call everforest#highlight('htmlUnderline', s:palette.none, s:palette.none, 'underline')
call everforest#highlight('htmlUnderlineItalic', s:palette.none, s:palette.none, 'underline,italic')
call everforest#highlight('htmlItalic', s:palette.none, s:palette.none, 'italic')
highlight! link htmlTag Green
highlight! link htmlEndTag Blue
highlight! link htmlTagN OrangeItalic
highlight! link htmlTagName OrangeItalic
highlight! link htmlArg Aqua
highlight! link htmlScriptTag Purple
highlight! link htmlSpecialTagName RedItalic
" }}}
" ft_end
