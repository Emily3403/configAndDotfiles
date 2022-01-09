if !exists('g:colors_name') || g:colors_name !=# 'everforest'
    finish
endif
if index(g:everforest_loaded_file_types, 'ruby') ==# -1
    call add(g:everforest_loaded_file_types, 'ruby')
else
    finish
endif
" ft_begin: ruby {{{
" builtin: https://github.com/vim-ruby/vim-ruby {{{
highlight! link rubyKeywordAsMethod Green
highlight! link rubyInterpolation Yellow
highlight! link rubyInterpolationDelimiter Yellow
highlight! link rubyStringDelimiter Green
highlight! link rubyBlockParameterList Blue
highlight! link rubyDefine RedItalic
highlight! link rubyModuleName Purple
highlight! link rubyAccess Orange
highlight! link rubyAttribute Yellow
highlight! link rubyMacro RedItalic
" }}}
" ft_end
