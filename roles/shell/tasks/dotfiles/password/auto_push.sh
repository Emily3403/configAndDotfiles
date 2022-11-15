#/bin/bash

password_dir="$HOME/.password-store/"
echo "#!/bin/sh
set -x
git pull --rebase # get edits by other devices
git push          # send the latest commit" > "$password_dir/.git/hooks/post-commit"

chmod +x "$password_dir/.git/hooks/post-commit"
