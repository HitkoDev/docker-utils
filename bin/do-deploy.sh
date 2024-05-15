#!/bin/bash
result=${PWD##*/}
docker stack deploy -c docker-compose.yml --detach=true --with-registry-auth --prune $result
