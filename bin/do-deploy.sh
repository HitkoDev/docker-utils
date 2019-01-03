#!/bin/bash
result=${PWD##*/}
docker stack deploy -c docker-compose.yml --with-registry-auth --prune $result
