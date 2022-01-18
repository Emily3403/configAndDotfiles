# The first part of this config file is mostly inspired by Garuda linux.
#
#
# TODO:
#   git aliases


# Hide welcome message
set fish_greeting
set VIRTUAL_ENV_DISABLE_PROMPT "1"


# Starship prompt
if status --is-interactive
    source (starship init fish --print-full-init | psub)
end


# Add stuff to PATH
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

remove_from_path ~/bin
add_to_path ~/.local/bin ~/arm/bin ~/bin/i3programs ~/bin ~/bin/bash_functions_for_fish ~/.local/share/gem/ruby/3.0.0/bin


# Backup
function bu --argument filename
    cp $filename $filename.bak
end


# List a random subset of files
function lsr
	if count $argv > /dev/null
		set cnt $argv
	else
		set cnt 10
	end

	ls | sort -R | tail -"$cnt"
end

# Profile a python script
function profile
    echo "Running Program…"
    time python -m cProfile -o profiled.dat $argv
    echo "Done!"
    snakeviz profiled.dat
end

# General configuration manager
function conf
	switch $argv
		case fish
			vim "$HOME/.config/fish/config.fish"
		case i3
			vim "$HOME/.config/i3/config"
		case vim 
	        vim "$HOME/.vimrc"
        case ssh 
            vim "$HOME/.ssh/config"
        case starship 
            vim "$HOME/.config/starship.toml"
    end
end

# Function to get to by common places
function u
	switch (string lower $argv)
		case bs 
			cd "$HOME/Documents/Uni/5/BSPrak/Exercises"
        case bs!
            cd "$HOME/Documents/Uni/5/BSPrak/Material"
            
		case dip
			cd "$HOME/Documents/Uni/5/DIP/Exercises"
        case dip!
            cd "$HOME/Documents/Uni/5/DIP/Material"

		case grs
			cd "$HOME/Documents/Uni/5/GRS/Exercises"
        case grs!
            cd "$HOME/Documents/Uni/5/GRS/Material"

		case ig
            cd "$HOME/Documents/Uni/5/IG/Exercises"
        case ig!
            cd "$HOME/Documents/Uni/5/IG/Material"

		case latex
			cd "$HOME/Documents/Uni/LaTeX/"

        case backup
            cd "$HOME/Documents/Programs/Bash/BackupScript"

        case isisdl is
            cd "$HOME/Documents/Programs/Python/isisdl" && ac

	end
end


function cd
    builtin cd $argv
    ls
end




# Activate a python virtual environment
function ac
    if count $argv > /dev/null
        set vers $argv
    else
        # find highest python version
        for i in (seq 10 -1 7)
            if type -q python3.$i
                set vers $i
                break
            end
        end
    end 

    if not test -e ./venv
        eval "python3.$vers -m venv venv/"
    end
    source venv/bin/activate.fish
end

# Fast remove
function rmf
	mkdir -p .empty/
	rsync -r --delete .empty/ $argv
	rmdir .empty/
	rmdir $argv
end

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




## Useful aliases
# Replace ls with exa
if type -q exa
	alias ls='exa -lb --color=always --group-directories-first --icons --time-style=long-iso'   # preferred listing
	alias lt='exa -aT --color=always --group-directories-first --icons --sort=size --level=3'  # tree listing
end


# Replace some more things with better alternatives
alias cat='bat --style header --style rules --style snip --style changes --style header'
alias yay='paru'
alias sudo='doas'

# Common use
alias tar!='tar -acf'
alias untar='tar -zxvf'
alias wget='wget -c '
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias .....='cd ../../../..'
alias ......='cd ../../../../..'
alias dir='dir --color=auto'
alias vdir='vdir --color=auto'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'
alias hw='hwinfo --short'                                   # Hardware Info
alias big="expac -H M '%m\t%n' | sort -h | nl"              # Sort installed packages according to size in MB
alias gitpkg='pacman -Q | grep -i "\-git" | wc -l'			# List amount of -git packages

# Get fastest mirrors 
alias mirror="sudo reflector -f 30 -l 30 --number 10 --verbose --save /etc/pacman.d/mirrorlist" 
alias mirrord="sudo reflector --latest 50 --number 20 --sort delay --save /etc/pacman.d/mirrorlist" 
alias mirrors="sudo reflector --latest 50 --number 20 --sort score --save /etc/pacman.d/mirrorlist" 
alias mirrora="sudo reflector --latest 50 --number 20 --sort age --save /etc/pacman.d/mirrorlist" 


alias lsfs="lsblk -o NAME,STATE,SIZE,FSAVAIL,FSUSED,FSUSE%,FSTYPE,MOUNTPOINTS"

# Copy to clipboard
alias c="sed -z '\$ s/\n\$//' | xclip -sel clip"  # stripping newline
alias C="xclip -sel clip"                         # don't strip newline
alias cpd="pwd | c"                               # Current directory to clipboard

# Python shortcuts
alias i="ipython --no-confirm-exit"
alias jn="jupyter notebook"
alias jn!="jupyter notebook stop"

# Browser Stuff
alias cr="chromium"
alias fi="firefox"
set -g browser firefox
alias pdf="$BROWSER ./out/main.pdf"

# General stuff
alias dc="cd"
alias ds="du -shx * | sort -h"
alias ds!="du -shx * .* | sort -h"
alias sl!="pkill -9 sl"
alias rm!="rm -rf"
alias nt="clear && neofetch"
alias neofetch="neofetch --ascii $HOME/.config/neofetch/current_image.txt --ascii_colors 9 10 11 12 13 14"
alias thunar="/usr/bin/thunar & disown"
alias quote="fortune | cowsay | lolcat"
alias b="bluetoothctl"
alias please="sudo"
alias fuck!="fuck --hard"

# Shortcut for too long names
alias blue=bluetoothctl
alias mi=mediainfo
alias rmv="rm venv -rf"
alias rmg="rm .git -rf"
alias pipi="pip install -e ."
alias pipr="pip install -r requirements.txt"
alias piprd="pip install -r requirements_dev.txt"
alias pipu="pip list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1  | xargs -n1 pip install -U --user"
alias mypy="dmypy run"
# _alias (for vim jump)


########### Matteo's stuff ############

# Open files easily
alias open="nohup xdg-open $argv 1>/dev/null 2>/dev/null"

# find things
alias findbn="sudo find / -not -path '/run/*' -name '$1' "


###############  VPN  ############################

# Connect to the VPN of Technische Universität Berlin
# alias vpnt='openconnect https://vpn.tu-berlin.de/ -b'
function vpnt 
  pnotify "Connecting to the VPN of Technische Universität Berlin ..."
  vpnnd >/dev/null
  sudo openconnect https://vpn.tu-berlin.de/ -q -b --no-dtls -u mattis3403
  psuccess "Connection established."
end

# Disconnect from the VPN of Technische Universität Berlin
function vpntd 
  sudo pkill openconnect
  psuccess "Disconnected from the VPN of Technische Universität Berlin."
end

# Connect to the VPN of NordVPN
function vpnn 
  pnotify "Connecting to NordVPN ..."
  if pidof openconnect >/dev/null
    vpntd >/dev/null
  end

  if not string match -q -- "*active (running)*" (systemctl status nordvpnd)
    sudo systemctl enable nordvpnd
  end 

  if not string match -q -- "*not logged in*" (nordvpn connect)
    nordvpn login
  end
  nordvpn connect $argv
end 

# Disconnect from NordVPN
function vpnnd 
  nordvpn disconnect
  psuccess "Disconnected from NordVPN."
end


### Random stuff ###

## Export variable need for qt-theme
if type "qtile" >> /dev/null 2>&1
   set -x QT_QPA_PLATFORMTHEME "qt5ct"
end

## Run paleofetch if session is interactive
if status --is-interactive
   neofetch
end

# Colorful man pages
set -x MANPAGER "sh -c 'col -bx | bat -l man -p'"


# Hooks for various packages
direnv hook fish | source
thefuck --alias | source

### Exports
# To enable importing gpg keys via qr codes
# See: https://wiki.archlinux.org/title/Paperkey
export EDITOR=vim

# Make gpg work, check `man gpg-agent`

