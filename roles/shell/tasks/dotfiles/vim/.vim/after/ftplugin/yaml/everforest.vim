if !exists('g:colors_name') || g:colors_name !=# 'everforest'
    finish
endif
if index(g:everforest_loaded_file_types, 'yaml') ==# -1
    call add(g:everforest_loaded_file_types, 'yaml')
else
    finish
endif
" ft_begin: yaml {{{
highlight! link yamlKey Orange
highlight! link yamlConstant Purple
" ft_end
