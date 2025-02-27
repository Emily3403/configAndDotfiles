# Hide welcome message
set fish_greeting
set VIRTUAL_ENV_DISABLE_PROMPT 1

if ! status --is-interactive
    return
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


function add_to_path
    for arg in $argv
        if test -d $arg; and not contains -- $arg $PATH
            set -p PATH $arg
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
add_to_path ~/bin/bash_functions_for_fish ~/.local/bin ~/arm/bin ~/.cargo/bin ~/go/bin /opt/KopiaUI/

# Re-add ~/bin at the end so it is considered first
remove_from_path ~/bin
add_to_path ~/bin


# Automatically get the newest update of the config
function upfish
    set id (tr -dc A-Za-z0-9 </dev/urandom | head -c 8 ; echo '')
    wget -4 https://raw.githubusercontent.com/Emily3403/configAndDotfiles/main/roles/shell/tasks/dotfiles/fish/config.fish --directory-prefix /tmp/$id
    mv /tmp/$id/config.fish "$HOME/.config/fish/config.fish"
    chmod +x "$HOME/.config/fish/config.fish"
end

# Replace the `cd` implementation of fish. Also save it in `standard_cd` so it can be reused.
functions -c cd standard_cd

function cd
    standard_cd $argv

    # If `onefetch` is install show a 
    #    git rev-parse &>/dev/null
    #if test $status -eq 0
    #    if test "$_LAST_REPO" != (basename (git rev-parse --show-toplevel))
    #        onefetch
    #        set -g _LAST_REPO (basename (git rev-parse --show-toplevel))
    #    end
    #end
    ls
end


# Faster remove with big files
function rmf.
    if not test -e $argv
        return 1
    end
    mkdir -p .empty/
    rsync -r --delete .empty/ $argv
    rmdir .empty/
    rmdir $argv
end

# Backup a directory
function bu
    if test -d "$argv.bak"
        perror "Error: Refusing to overwrite existing path"
        return
    end
    cp -a "$argv" "$argv.bak"
end

# TODO: Make this into a stack-concept, with .bak.1, .2, etc. 
function rebu
    rm -rf "$argv.bak"
    cp -a "$argv" "$argv.bak"
end

function unbu
    rmf "$argv"
    mv "$argv.bak" "$argv"
end


# Aliases for config files
alias fishe="vim $HOME/.config/fish/config.fish"
alias fished="cd $HOME/.config/fish"

alias alacrittye="vim $HOME/.config/alacritty/alacritty.toml"
alias alacrittyed="cd $HOME/.config/alacritty"

alias sshe="vim $HOME/.ssh/config"
alias sshed="cd $HOME/.ssh/config.d"
alias sshke="vim $HOME/.ssh/known_hosts"
alias sshwe="vim $HOME/.ssh/config.d/work"
alias sshwpe="vim $HOME/.ssh/config.d/work-projects"
alias sshwae="vim $HOME/.ssh/config.d/work-admin"
alias sshse="vim $HOME/.ssh/config.d/servers"
alias sshhe="vim $HOME/.ssh/config.d/home"

alias i3e="vim $HOME/.config/i3/config"
alias i3ed="cd $HOME/.config/i3/config.d"
alias i3ec="vim $HOME/.config/i3/custom_conf"

alias pbare="vim $HOME/.config/polybar/config.ini"
alias pbared="cd $HOME/.config/polybar"

alias swaye="vim $HOME/.config/sway/config"
alias swayed="cd $HOME/.config/sway/config.d"

alias hypre="vim $HOME/.config/hypr/hyprland.conf"
alias hypred="cd $HOME/.config/hypr/"

alias vime="vim $HOME/.vimrc"
alias nvime="vim $HOME/.config/nvim/init.vim"
alias nvimed="cd $HOME/.config/nvim"

alias svime="vim $HOME/.SpaceVim.d/init.toml"
alias svimae="vim $HOME/.SpaceVim.d/autoload/myspacevim.vim"
alias svimed="cd $HOME/.SpaceVim.d"

alias waybare="vim $HOME/.config/waybar/config"
alias waybared="cd $HOME/.config/waybar"

alias btope="vim $HOME/.config/btop/btop.conf"
alias btoped="cd $HOME/.config/btop"

alias fane="vim $HOME/.config/fw-fanctrl/config.json && sudo systemctl restart fw-fanctrl"

# ===== Python Stuff =====


# Activate a python virtual environment
# Usage:
#   `ac`    → activate a python3   environment
#   `ac 8`  → activate a python3.8 environment
#   `ac 10` → activate a python3.8 environment

function ac
    if not test -e venv
        if count $argv &>/dev/null
            set python_ver "python3.$argv"
        else
            set python_ver python3
        end

        eval $python_ver -m venv venv
    end

    source venv/bin/activate.fish
    pip install pynvim ipython --break-system-packages
end


# Profile a python script
function profile
    echo "Running Program…"
    time python -m cProfile -o profiled.dat $argv
    echo "Done!"
    snakeviz profiled.dat
end


# Anaconda packages
alias py="python"
alias i="ipython --no-confirm-exit"
alias jn="jupyter notebook"
alias jn.="jupyter notebook stop"


# Pip aliases
alias pi="pip install --break-system-packages"
alias pu="pip uninstall --break-system-packages"
alias pir="pip install -r requirements.txt --break-system-packages"
alias pie="pip install -e .\[testing\] --break-system-packages"
alias pird="pip install -r requirements_dev.txt"
alias piu="pip list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1  | xargs -n1 pip install"
alias pipup="pip install --upgrade pip"
alias piuf="pip list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1  | xargs -n1 -P(nproc) pip install"
alias pin="pip install neovim pynvim"


# ====/ Python Stuff =====


# ===== Rust Stuff =====

alias rustdbg="export RUST_LOG=trace; export RUST_BACKTRACE=short"

# ====/ Rust Stuff =====


# ===== Useful aliases =====


# Aliases for posix-commands

alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias .....='cd ../../../..'
alias ......='cd ../../../../..'

# Mount stuff
alias mntu="sudo umount /mnt"
alias mnta1='sudo mount /dev/sda1 /mnt'
alias mnta2='sudo mount /dev/sda2 /mnt'
alias mnta3='sudo mount /dev/sda3 /mnt'
alias mntb1='sudo mount /dev/sdb1 /mnt'
alias mntb2='sudo mount /dev/sdb2 /mnt'
alias mntb3='sudo mount /dev/sdb3 /mnt'
alias mntc1='sudo mount /dev/sdc1 /mnt'
alias mntc2='sudo mount /dev/sdc2 /mnt'
alias mntc3='sudo mount /dev/sdc3 /mnt'
alias mntd1='sudo mount /dev/sdd1 /mnt'
alias mntd2='sudo mount /dev/sdd2 /mnt'
alias mntd3='sudo mount /dev/sdd3 /mnt'
alias mnte1='sudo mount /dev/sde1 /mnt'
alias mnte2='sudo mount /dev/sde2 /mnt'
alias mnte3='sudo mount /dev/sde3 /mnt'
alias mntf1='sudo mount /dev/sdf1 /mnt'
alias mntf2='sudo mount /dev/sdf2 /mnt'
alias mntf3='sudo mount /dev/sdf3 /mnt'
alias mntn11='sudo mount /dev/nvme0n1p1 /mnt'
alias mntn12='sudo mount /dev/nvme0n1p2 /mnt'
alias mntn13='sudo mount /dev/nvme0n1p3 /mnt'
alias mntn21='sudo mount /dev/nvme0n2p1 /mnt'
alias mntn22='sudo mount /dev/nvme0n2p2 /mnt'
alias mntn23='sudo mount /dev/nvme0n2p3 /mnt'
alias mntn31='sudo mount /dev/nvme0n3p1 /mnt'
alias mntn32='sudo mount /dev/nvme0n3p2 /mnt'
alias mntn33='sudo mount /dev/nvme0n3p3 /mnt'

alias mkfs.fat32="sudo mkfs.fat -F 32"
alias ip="ip -c"

# SSH Aliases
alias ssh!="ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"
alias ssh!!="ssh -oHostKeyAlgorithms=+ssh-rsa"
alias sse="vim $HOME/.config/starship.toml"

alias lsfs="lsblk -o NAME,STATE,SIZE,FSAVAIL,FSUSED,FSUSE%,FSTYPE,MOUNTPOINTS"
alias cdmk="mkdir -p $argv; cd"
alias mkcd="mkdir -p $argv; cd"
alias lsr="ls | sort -R | tail -10"
alias dir="exa -lb --color=always --group-directories-first --icons --time-style=long-iso" # But why would anyone use this? :D
alias findstr="find ~ -mount -type f -print0 | xargs -0 -P 32 grep -s $argv"
alias takeover="sudo chown -R $USER ."
alias compress="lrzip -z -p $(nproc)"
alias uncompress="lrunzip -p $(nproc)"
alias tar.='tar caf'
alias untar="tar xvf"
alias grep='grep --color=auto'

alias visudo="sudo EDITOR=vim visudo"
alias sudo="sudo -E"
alias sudo.="/usr/bin/sudo"

alias dc="cd"
alias ds="du -shx * | sort -h"
alias ds.="du -shx * .* | sort -h"
alias sl.="pkill -9 sl"
alias nt="clear && neofetch && builtin cd"
alias mhz="cat /proc/cpuinfo | grep MHz | sort" # TODO: Sort numerically
alias MHz=mhz
alias quote="fortune | cowsay | lolcat"
alias b="bluetoothctl"
alias please="sudo"
alias fuck.="fuck --hard"
alias findbu="find ~ -mount -name '*.bak*' -exec du -sh {} \; | sort"
alias nmap-home="nmap -sn \"192.168.1.*\""
alias convert-image-pdf='find . -type f -exec file --mime-type {} \+ | awk -F: \'{if ($2 ~/image\//) print $1}\' | xargs -P "$(nproc)" -I it sh -c \'img2pdf $1 -o ${1%.*}.pdf\' -- it'
alias convert-image-pdf.='find . -type f -exec file --mime-type {} \+ | awk -F: \'{if ($2 ~/image\//) print $1}\' | xargs -P "$(nproc)" -I it sh -c \'img2pdf $1 -o ${1%.*}.pdf; rm "$1"\' -- it'

# Systemd
alias sysr="sudo systemctl restart"
alias sysdr="sudo systemctl daemon-reload"
alias syse="sudo systemctl enable --now"
alias syss="systemctl status"
alias syssus="sudo systemctl suspend"
alias syst="sudo systemctl start"
alias sysp="sudo systemctl stop"
alias sysd="sudo systemctl disable"
alias sysed="sudo systemctl edit"

alias sysur="systemctl --user restart"
alias sysudr="systemctl --user daemon-reload"
alias sysue="systemctl --user enable --now"
alias sysus="systemctl --user status"
alias sysusus="systemctl --user suspend"
alias sysut="systemctl --user start"
alias sysup="systemctl --user stop"
alias sysud="systemctl --user disable"

alias mst="sudo systemctl start mariadb.service"
alias bst="sudo systemctl start bluetooth.service"
alias bsp="sudo systemctl stop bluetooth.service"
alias sshst="sudo systemctl start sshd"

alias log="journalctl -xeu"
alias loga="journalctl -xe"

# Shortcut for too long names
alias rmf="rm -rf"
alias rmd="rmdir"
alias rmo="rm -rf out"
alias rmv="rm -rf venv"
alias rmg="rm -rf .git"
alias rmi="rm -rf .idea"
alias rmz="rm -rf zig-out zig-cache"
alias rmb="rm -rf build"
alias rmt="rm -rf target"

alias da="direnv allow"
alias mi="mediainfo"
alias mypy="dmypy run"
alias mypy.="/usr/bin/mypy"
alias ss="source sauce"
alias htop.="htop --delay 3"

# Git aliases
alias git.="/usr/bin/git"
alias gs="git status"
alias grm="git stash; git stash drop" # Danger!
alias grmf="git stash --all; git stash drop" # Danger!
alias grmrf=grmf
alias grh="git reset --hard origin/main"
alias gfo="git fetch origin"
alias gd="git diff"
alias gdh="git diff HEAD"
alias gdh1="git diff HEAD~1"
alias gdh2="git diff HEAD~2"
alias gdh3="git diff HEAD~3"
alias gdh4="git diff HEAD~4"
alias gdh5="git diff HEAD~5"

alias gb="git branch"
alias gbd="git branch -D"
alias gco="git checkout"
alias gcom="git checkout main"
alias gcoh="git checkout HEAD"
alias gcob="git switch -c"
alias gsw="git switch"
alias gswm="git switch main"
alias gswh="git switch HEAD"
alias gswb="git switch -c"

alias ga="git add"
alias gaa="git add --all"
alias gau="git add -u"

alias gu="git add -u; git commit; git push"
alias gul="git add -u; git commit-status; git push "
alias gun="git add -u; git commit -m 'no message.'; git push"
alias guw="git add -u; git commit -m 'WIP Sync'; git push"
alias gua="git add -u; git commit --amend --no-edit; git push --force-with-lease"
alias gufun="git add -u; git commit -m (curl -s https://whatthecommit.com/index.txt) && git push"
alias guam="git add -u; git commit --amend; git push --force-with-lease"

alias gc="git commit -m"
alias gca="git commit --amend"

alias gm="git merge"
alias gma="git merge --abort"
alias gmc="git merge --contiue"

alias gp="git push"
alias gpf="git push --force-with-lease"
alias gpf!="git push --force"
alias gl="git pull"
alias glr="git pull --rebase"
alias gls="git stash; git pull; git stash pop"
alias glrs="git stash; git pull --rebase; git stash pop"
alias glg="git log"

if type -q tig
    alias glg="tig log"
end

alias grc="git rebase --continue"
alias gra="git rebase --abort"

alias gcl="git clone"
alias gcl.="git clone --depth 1"

alias gst="git stash"
alias gsa="git stash apply"
alias gsd="git stash drop"
alias gsp="git stash pop"

# Change the remote from HTTPS to ssh
alias grs="python3 -c \"import os; from subprocess import check_output; from urllib.parse import urlparse; it=urlparse(check_output(['git', 'config', '--get', 'remote.origin.url'])); (print('Remote is already ssh'), exit(0)) if it.path.decode().startswith('git@') else None; ssh_url=f'git@{it.hostname.decode()}:{it.path.decode()}'; os.system(f'git remote set-url origin {ssh_url}'); print('Succeeded in changing the remote url to ssh') if all(ssh_url in out for out in check_output(['git', 'remote', '-v']).decode().split('\n')[:-1]) else print('Could not set the remote url ... Why?')\""


# Aliases specific to devices
alias powerbtn='sudo bash -c \'echo 0 > /sys/class/leds/tpacpi::power/brightness; echo 0 >  /sys/class/leds/platform::micmute/brightness\'' # Disable power LED
alias liftoff='sudo bash -c \'echo level 7 > /proc/acpi/ibm/fan\''
alias takedown='sudo bash -c \'echo level 1 > /proc/acpi/ibm/fan\''

if [ "$XDG_SESSION_TYPE" = x11 ]
    alias c="sed -z '\$ s/\n\$//' | xclip -sel clip" # strip newline
    alias C="xclip -sel clip" # don't strip newline
else if [ "$XDG_SESSION_TYPE" = wayland ]
    alias c="sed -z '\$ s/\n\$//' | wl-copy"
    alias C="wl-copy"
end

alias C="xclip -sel clip" # don't strip newline
alias cpd="pwd | c" # Current directory to clipboard

# Application stuff
alias ytdl="yt-dlp"


# Browser Stuff
alias cr="firefox"
alias fi="firefox"
set -g browser firefox
export BROWSER=firefox
alias pdf="$BROWSER ./target/main.pdf"

# Written by ChatGPT
function tex2u -d "Translate LaTeX escape sequences to unicode equivalents"
    switch $argv[1]
        case alpha
            echo α | c
        case beta
            echo β | c
        case gamma
            echo γ | c
        case delta
            echo δ | c
        case epsilon
            echo ε | c
        case zeta
            echo ζ | c
        case eta
            echo η | c
        case theta
            echo θ | c
        case iota
            echo ι | c
        case kappa
            echo κ | c
        case lambda
            echo λ | c
        case mu
            echo μ | c
        case nu
            echo ν | c
        case xi
            echo ξ | c
        case omicron
            echo ο | c
        case pi
            echo π | c
        case rho
            echo ρ | c
        case sigma
            echo σ | c
        case tau
            echo τ | c
        case upsilon
            echo υ | c
        case phi
            echo φ | c
        case chi
            echo χ | c
        case psi
            echo ψ | c
        case omega
            echo ω | c
        case leq
            echo "≤" | c
        case geq
            echo "≥" | c
        case neq
            echo "≠" | c
        case times
            echo "×" | c
        case cross
            echo "✗" | c
        case check
            echo "✓" | c
        case div
            echo "÷" | c
        case pm
            echo "±" | c
        case infty
            echo "∞" | c
        case deg
            echo "°" | c
        case cdot
            echo "·" | c
        case ldots
            echo "…" | c
        case prime
            echo "′" | c
        case ldotp
            echo "⋅" | c
        case propto
            echo "∝" | c
        case rightarrow
            echo "→" | c
        case leftarrow
            echo "←" | c
        case uparrow up
            echo "↑" | c
        case downarrow down
            echo "↓" | c
        case angle
            echo "∠" | c
        case nabla
            echo "∇" | c
        case in
            echo "∈" | c
        case ni
            echo "∋" | c
        case subset
            echo "⊂" | c
        case supset
            echo "⊃" | c
        case subseteq
            echo "⊆" | c
        case supseteq
            echo "⊇" | c
        case cap
            echo "∩" | c
        case cup
            echo "∪" | c
        case int
            echo "∫" | c
        case sum
            echo Σ | c
        case prod
            echo "∏" | c
        case wedge
            echo "∧" | c
        case vee
            echo "∨" | c
        case oplus
            echo "⊕" | c
        case otimes
            echo "⊗" | c
        case bigcirc
            echo "◯" | c
        case dagger
            echo "†" | c
        case ddagger
            echo "‡" | c
        case amalg
            echo "⨿" | c
        case forall
            echo "∀" | c
        case exists
            echo "∃" | c
        case neg
            echo "¬" | c
        case in
            echo "∈" | c
        case ni
            echo "∋" | c
        case subset
            echo "⊂" | c
        case supset
            echo "⊃" | c
        case subseteq
            echo "⊆" | c
        case supseteq
            echo "⊇" | c
        case equiv
            echo "≡" | c
        case cong
            echo "≅" | c
        case approx
            echo "≈" | c
        case sim
            echo "~" | c
        case avg
            echo "⌀" | c
        case tm
            echo "™" | c
        case lra
            echo "⇔" | c
        case --
            echo "–" | c
        case ---
            echo "—" | c
        case perp
            echo "⊥" | c
        case parallel
            echo "∥" | c
        case baht
            echo "฿" | c
            default echo "Invalid input"
    end
end

# Replace commands with better commands (if they exist)

if type -q neofetch
    alias neofetch="neofetch --ascii $HOME/.config/neofetch/current_image.txt --ascii_colors 9 10 22 12 13 14"
end

if type -q hyfetch
    alias hyfetch="hyfetch --ascii $HOME/.config/neofetch/current_image.txt"
end

if type -q nvim
    alias vi="nvim"
    alias vim="nvim"
end

if type -q exa
    alias ls='exa -lb --color=always --group-directories-first --icons --time-style=long-iso'
    alias la='exa -lba --color=always --group-directories-first --icons --time-style=long-iso'
    alias lt='exa -T --color=always --group-directories-first --icons --sort=size --level=3'
    alias l=ls
    alias ls.="/usr/bin/ls"
end


if type -q bat
    alias cat='bat --style header --style snip --style changes --style header'
    alias cat.="/usr/bin/cat"
end

if type -q btop
    alias htop="btop"
    alias htop.="/usr/bin/htop --delay 3"
end

if type -q gix
    alias gcl!="gix -v clone"
end

if type -q unzrip
    alias unzip="unzrip"
    alias unzip.="/usr/bin/unzip"
end

if type -q cyme
    alias lsusb="cyme"
    alias lsusb.="/usr/bin/lsusb"
end

if type -q pass
    alias pc="pass -c"

    function passwork
        set -gx PASSWORD_STORE_DIR "$HOME/Pictures/.git/work-passwords"
        pass $argv
        set -e PASSWORD_STORE_DIR
    end

    alias pw="passwork"
    alias pwc="passwork -c"

end

if type -q vim
    alias v="vim"
end

if type -q nvim
    alias v="nvim"
end

if type -q ripdrag
    alias rd="ripdrag"
end

if type -q libreoffice
    alias lo="libreoffice"
    alias li="libreoffice"
end



if type -q cargo-mommy
    alias cargo="cargo mommy"
    alias cargo.="$HOME/.cargo/bin/cargo"
end

# ====/ Useful aliases =====


# ===== VPN Stuff =====

function vpn-connect
    sudo wg-quick up $argv && psuccess "Successfully connected to $argv VPN" || perror "Error in connecting to $argv VPN!"
end

function vpn-disconnect
    sudo wg-quick down $argv && psuccess "Successfully disconnected from $argv VPN" || perror "Error in disconnecting from $argv VPN!"
end

alias wvpnc="vpn-connect work"
alias wvpnd="vpn-disconnect work"

alias rvpnc="vpn-connect ruwusch"
alias rvpnd="vpn-disconnect ruwusch"

alias rtvpnc="vpn-connect ruwusch-tunnel"
alias rtvpnd="vpn-disconnect ruwusch-tunnel"

alias hvpnc="vpn-connect home"
alias hvpnd="vpn-disconnect home"

# ====/ VPN Stuff =====


# ===== Personal config =====

# Function to get to my common places
function u
    switch (string lower $argv)
        case bach ba b
            cd "$HOME/Documents/Uni/Study/Bachelor-Thesis"
        case bs
            cd "$HOME/Documents/Uni/Study/5/BSPrak/Exercises/Exercise02/code/"

            # Projects: Programming 
        case proj
            cd "$HOME/Documents/Projects/"
        case prog
            cd "$HOME/Documents/Projects/Programming"
        case py
            cd "$HOME/Documents/Projects/Programming/Python"
        case hss hscout hs
            cd "$HOME/Documents/Projects/Programming/Python/hetzner-server-scouter"
        case is isisdl
            cd "$HOME/Documents/Projects/Programming/Python/isisdl" && ac
        case sha
            cd "$HOME/Documents/Projects/Programming/Python/shabot" && ac
        case uwu
            cd "$HOME/Documents/Projects/Programming/Python/Suwudo" && ac
        case latex
            cd "$HOME/Documents/Projects/Programming/LaTeX/emily_template"
        case img
            cd "$HOME/Documents/Projects/Programming/Rust/YetAnotherImageViewer"
        case l lager
            cd "$HOME/Documents/Projects/Programming/Python/Shila-Lager" && ac
        case cc ccc
            cd "$HOME/Documents/Projects/Programming/LaTeX/CocktailCards"

            # Projects: Servers
        case snix
            cd "$HOME/Documents/Projects/Servers/NixOServer"
        case smar
            cd "$HOME/Documents/Projects/Servers/MartinAnsible"

            # Projects: Talks
        case talks
            cd "$HOME/Documents/Projects/Talks"
        case tlatex
            cd "$HOME/Documents/Projects/Talks/Advanced-LaTeX-Talk"
        case unix
            cd "$HOME/Documents/Projects/Talks/Unix-Sysadmin"

            # Private
        case priv
            cd "$HOME/Documents/Private"
        case tb
            set it "$HOME/Documents/Private/Tagebuch/$(date +%Y)/$(date +%m)/"
            mkdir -p "$it"
            cd "$it"
            init-tagebuch
            vim "$(date +%d).md"

            # configAndDotfiles
        case cbu
            cd "$HOME/configAndDotfiles/roles/backup/tasks/dotfiles"
        case cgb
            cd "$HOME/configAndDotfiles/roles/gui_basic/tasks/dotfiles"
        case cgp
            cd "$HOME/configAndDotfiles/roles/gui_programming/tasks/dotfiles"
        case ci3
            cd "$HOME/configAndDotfiles/roles/i3/tasks/dotfiles"
        case cpw
            cd "$HOME/configAndDotfiles/roles/password/tasks/dotfiles"
        case csh
            cd "$HOME/configAndDotfiles/roles/shell/tasks/dotfiles"
        case csw
            cd "$HOME/configAndDotfiles/roles/sway/tasks/dotfiles"

            # Work
        case work
            cd "$HOME/Documents/Work/2023_INET/Sysadmin"
        case wans
            cd "$HOME/Documents/Work/2023_INET/Sysadmin/Ansible"
        case wcert
            cd "$HOME/Documents/Work/2023_INET/Sysadmin/Certs/$(date +%Y)"
        case wser
            cd "$HOME/Documents/Work/2023_INET/Sysadmin/Servers"
        case wnix
            cd "$HOME/Documents/Work/2023_INET/Sysadmin/Servers/NixOS"
        case dns bind
            cd "$HOME/Documents/Work/2023_INET/Sysadmin/Servers/NixOS/bind" && vim inet.tu-berlin.de
        case wsbin
            cd "$HOME/Documents/Work/2023_INET/Sysadmin/Servers/StaticBinaries"
        case wscr
            cd "$HOME/Documents/Work/2023_INET/Sysadmin/Scripts"

            # Uni
        case shila
            cd "$HOME/Documents/Uni/Shila"
        case sla
            cd "$HOME/Documents/Uni/Shila/Lager" && libreoffice "Getränke.ods"

        case ct cw
            cd "$HOME/Documents/Uni/Study/10/CT/coursework-3" && ac
    end
end

function unfuck
    switch $argv
        case bt
            sudo systemctl restart bluetooth
        case fp fprint frpintd fingerprint
            sudo systemctl restart fprintd
        case v vim nvim
            pip install pynvim
    end
end

# Server service aliases
alias podtrans="podman exec -ti transmission"
alias podyou="podman exec -ti youtrack"

# For Work
alias podmail="podman exec -ti mail"
alias podmm="podman exec -ti mailman-core"
alias podbak="podman exec -ti backuppc"
alias podpassb="podman exec -ti passbolt"

# Get secrets
alias getsn="rsync -a nixie:NixOServer/NixDotfiles/secrets/ $HOME/Documents/Projects/Servers/NixOServer/NixDotfiles/secrets/"
alias getsr="rsync -a ruwusch:NixOServer/NixDotfiles/secrets/ $HOME/Documents/Projects/Servers/NixOServer/NixDotfiles/secrets/"
alias getsor="rsync -a old-ruwusch:NixOServer/NixDotfiles/secrets/ $HOME/Documents/Projects/Servers/NixOServer/NixDotfiles/secrets/"

# ====/ Personal Config =====



# Finally, export and set variables accordingly.

## Enable qt-theme 
if type qtile >>/dev/null 2>&1
    export QT_QPA_PLATFORMTHEME="qt5ct"
end



# Colorful man pages
if type -q bat
    export MANPAGER="sh -c 'col -bx | bat -l man -p'"
    export MANROFFOPT='-c'
end

if type -q vim
    export EDITOR=vim
end

if type -q nvim
    export EDITOR=nvim
end

if test -e /run/user/1000/ssh-agent.socket
    export SSH_AUTH_SOCK=/run/user/1000/ssh-agent.socket
end

# Hooks for packages
if type -q starship
    source (starship init fish --print-full-init | psub)
end


if type -q direnv
    direnv hook fish | source
end

if type -q mtr
    alias traceroute.="sudo /usr/bin/traceroute"
    alias traceroute="sudo mtr"
end
if type -q trip
    alias traceroute.="sudo /usr/bin/traceroute"
    alias traceroute="sudo trip"
end

if type -q curl
    alias weather="curl wttr.in/berlin"
    alias weather.="curl v2.wttr.in"
    alias weather!="curl wttr.in"
end
if test -e /usr/share/doc/find-the-command/ftc.fish
    source /usr/share/doc/find-the-command/ftc.fish noupdate
end

# Enable zoxide
if type -q zoxide
    zoxide init fish | source
end

# Display neofetch only in iteractive mode so connections are not affected
if type -q neofetch && status --is-interactive && ! set -q SSH_CONNECTION
    neofetch
end
