#!/bin/bash

files=$(grep RedisDatabaseIndex /srv/websites/*/*.conf)
dirs=$(ls /srv/websites/)
oIFS="$IFS"; IFS=$'\n'
regex="/srv/websites/([^/]+)/.*? RedisDatabaseIndex ([0-9]+);"
matches=()
for f in $files
do
    if [[ $f =~ $regex ]]
    then
        matches+="${BASH_REMATCH[2]}\t${BASH_REMATCH[1]}\n"
    else
        echo "$f doesn't match" >&2 # this could get noisy if there are a lot of non-matching files
    fi
done
IFS="$oIFS"

echo -e $matches | sort -nr

echo "No pagespeed for:"
for dir in $dirs
do
    if ! grep RedisDatabaseIndex /srv/websites/$dir/*.conf &>/dev/null
    then
        echo "$dir"
    fi
done

