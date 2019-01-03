#!/bin/bash
dir=$(pwd)
for service in $(ls */docker-compose.yml); do
    arrIN=(${service//\// })
    cd $(echo "$dir/$arrIN")
    docker stack rm $arrIN
done
cd $dir

