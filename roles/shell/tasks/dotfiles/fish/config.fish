# Hide welcome message
set fish_greeting
set VIRTUAL_ENV_DISABLE_PROMPT "1"


# Logging
function pnotify 
    set_color blue
    printf "[ NOTE    ]: "
    set_color normal
    printf "$argv\n"
end

function pwarn 
    set_color yellow
    printf "[ WARNING ]: "
    set_color normal
    printf "$argv\n"
end

function perror 
    set_color red
    printf "[ ERROR   ]: "
    set_color normal
    printf "$argv\n"
end

function psuccess 
    set_color green
    printf "[ SUCCESS ]: "
    set_color normal
    printf "$argv\n"
end


function add_to_path
    for arg in $argv
        if test -d $arg; and not contains -- $arg $PATH
            set -p PATH  $arg
        end
    end
end

function remove_from_path
    for arg in $argv
        if set -l index (contains -i $arg $PATH)
            set --erase PATH[$index]
        end
    end
end


# Add the "usual" stuff to the path. This may vary for you!
add_to_path ~~/bin/bash_functions_for_fish /.local/bin ~/arm/bin 

# Re-add ~/bin at the end so it is considered first
remove_from_path ~/bin
add_to_path ~/bin


# Automatically get the newest update of the config
function upfish
    set id (tr -dc A-Za-z0-9 </dev/urandom | head -c 8 ; echo '')
    wget https://raw.githubusercontent.com/Emily3403/configAndDotfiles/main/roles/shell/tasks/dotfiles/fish/config.fish --directory-prefix /tmp/$id
    mv /tmp/$id/config.fish "$HOME/.config/fish/config.fish"
end


# Have cd show usefull stuff about repos
function cd
    builtin cd $argv

    # If `onefetch` is install show a 
    git rev-parse &>/dev/null
    if test $status -eq 0
        if test "$_LAST_REPO" != (basename (git rev-parse --show-toplevel))
            onefetch
			set -g _LAST_REPO (basename (git rev-parse --show-toplevel))
        end
    end
    ls
end


# Fast / better remove
function rmf
	mkdir -p .empty/
	rsync -r --delete .empty/ $argv
	rmdir .empty/
	rmdir $argv
end



# Aliases for config files
alias fishe="vim $HOME/.config/fish/config.fish"
alias i3e="vim $HOME/.config/i3/config"
alias vime="vim $HOME/.config/i3/config"
alias vime="vim $HOME/.ssh/config"
alias sse="vim $HOME/.config/starship.toml"



# ===== Python Stuff =====


# Activate a python virtual environment
# Usage:
#   `ac`    → activate a python3   environment
#   `ac 8`  → activate a python3.8 environment
#   `ac 10` → activate a python3.8 environment
 
function ac
    if not test -e venv
        if count $argv &> /dev/null
            set python_ver "python3.$argv"
        else
            set python_ver "python3"
        end 

        eval $python_ver -m venv venv
    end

    source venv/bin/activate.fish
end


# Profile a python script
function profile
    echo "Running Program…"
    time python -m cProfile -o profiled.dat $argv
    echo "Done!"
    snakeviz profiled.dat
end


# Anaconda packages
alias i="ipython --no-confirm-exit"
alias jn="jupyter notebook"
alias jn.="jupyter notebook stop"


# Pip aliases
alias pi="pip install"
alias pir="pip install -r requirements.txt"
alias pie="pip install -e ."
alias pird="pip install -r requirements_dev.txt"
alias piu="pip list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1  | xargs -n1 pip install -U --user"
alias piuf="pip list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1  | xargs -n1 -P(nproc) pip install"


# ====/ Python Stuff =====


# ===== Useful aliases =====


# Aliases for posix-commands

alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias .....='cd ../../../..'
alias ......='cd ../../../../..'

alias lsfs="lsblk -o NAME,STATE,SIZE,FSAVAIL,FSUSED,FSUSE%,FSTYPE,MOUNTPOINTS"
alias dir='dir --color=auto'  # But why would anyone use this? :D

alias tar.='tar caf'
alias untar="tar xvf"
alias grep='grep --color=auto'

alias dc="cd"
alias ds="du -shx * | sort -h"
alias ds.="du -shx * .* | sort -h"
alias sl.="pkill -9 sl"
alias neofetch="neofetch --ascii $HOME/.config/neofetch/current_image.txt --ascii_colors 9 10 11 12 13 14"
alias nt="clear && neofetch"
alias quote="fortune | cowsay | lolcat"
alias b="bluetoothctl"
alias please="sudo"
alias fuck.="fuck --hard"
alias bu="cp -r $1 $1.bak"


# Shortcut for too long names
alias rmv="rm venv -rf"
alias mi="mediainfo"
alias rmg="rm .git -rf"
alias mypy="dmypy run"
alias ss="source sauce"
alias htop.="htop -d 0.1"

# Git aliases
alias git.="/usr/bin/git"
alias ga="git add"
alias gaa="git add --all"
alias gau="git add -u"
alias gu="git add -u; git commit-status; git push "
alias gs="git status"
alias gb="git branch"
alias gc="git commit -m"
alias gco="git checkout"
alias gp="git push"
alias gl="git pull"
alias grm="git stash; git stash drop"  # Danger!
alias gcl="git clone --depth 1"



# Copy to clipboard
alias c="sed -z '\$ s/\n\$//' | xclip -sel clip"  # stripping newline
alias C="xclip -sel clip"                         # don't strip newline
alias cpd="pwd | c"                               # Current directory to clipboard

# Browser Stuff
alias cr="chromium"
alias fi="firefox"
set -g browser chromium
export BROWSER=chromium
alias pdf="$BROWSER ./out/main.pdf"

# Replace commands with better commands (if they exist)

if type -q exa
	alias ls='exa -lb --color=always --group-directories-first --icons --time-style=long-iso'
	alias lt='exa -aT --color=always --group-directories-first --icons --sort=size --level=3'
end


if type -q bat
    alias cat='bat --style header --style rules --style snip --style changes --style header'
end

if type -q pass
    alias pc="pass -c"
end

# ====/ Useful aliases =====


# ===== VPN Stuff =====

# Connect to the VPN of Technische Universität Berlin
function tuvpn-connect 
    pnotify "Connecting to the VPN of Technische Universität Berlin ..."
    vtuvpn-disconnect &> /dev/null
    sudo openconnect https://vpn.tu-berlin.de/ -q -b --no-dtls -u mattis3403
    psuccess "Connection established."
end


# Disconnect from the VPN of Technische Universität Berlin
function tuvpn-disconnect 
    sudo pkill openconnect
    psuccess "Disconnected from the VPN of Technische Universität Berlin."
end


# ====/ VPN Stuff =====


# ===== Personal config =====

add_to_path ~/arm/bin ~/bin/i3programs ~/.local/share/gem/ruby/3.0.0/bin


# Function to get to by common places
# _ue
function u
	switch (string lower $argv)
		case bs 
			cd "$HOME/Documents/Uni/5/BSPrak/Exercises/Aufgabe_6"
        case bs!
            cd "$HOME/isisdl/[WS 2122] Betriebssystempraktikum"

		case grs
			cd "$HOME/Documents/Uni/5/GRS/Exercises"
        case grs!
            cd "$HOME/isisdl/[WS2122] Grundlagen der Rechnersicherheit"

		case ig
            cd "$HOME/Documents/Uni/5/IG/Exercises"
        case ig!
            cd "$HOME/isisdl/[WS21] Information Governance"

		case latex
			cd "$HOME/Documents/Programs/LaTeX"

        case bu
            cd "$HOME/Documents/Programs/Bash/BackupScript"

        case isisdl is
            cd "$HOME/Documents/Programs/Python/isisdl" && ac
	end
end


# ====/ Personal Config =====



# Finally, export and set variables accordingly.

## Enable qt-theme 
if type "qtile" >> /dev/null 2>&1
    export QT_QPA_PLATFORMTHEME="qt5ct"
end

# Colorful man pages
if type -q bat 
    export MANPAGER="sh -c 'col -bx | bat -l man -p'"
end

if type -q vim
    export EDITOR=vim
end


# Hooks for packages
if type -q direnv
    direnv hook fish | source
end

if type -q thefuck 
    thefuck --alias | source
end


# Display the final prompt
if status --is-interactive
    source (starship init fish --print-full-init | psub)
    neofetch
end

