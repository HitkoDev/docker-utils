#!/bin/bash
dir=$(pwd)
for service in $(ls */docker-compose.yml); do
    arrIN=(${service//\// })
    if case $arrIN in __*) false;; esac; then
        cd $(echo "$dir/$arrIN")
        docker stack deploy -c docker-compose.yml --with-registry-auth --prune $arrIN
    fi
done
cd $dir

