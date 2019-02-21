#!/bin/bash
function abs_path {
    cd "$(dirname $2)" &>/dev/null
    cd "$(dirname $1)" &>/dev/null
    pwd
}

me="$(test -L "$0" && readlink "$0" || echo "$0")"
dir=$(abs_path $me $0)
input=$(realpath "$dir/../docker-utils/bin/disable-cron.txt")

for f in $1; do
    sed -i -e "
        /define(\s*\'ABSPATH\'/r $input
        /require_once(ABSPATH . 'wp-settings.php')/q
    " $f
done
