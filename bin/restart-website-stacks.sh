#!/bin/bash
for service in $(docker service ls -f mode=replicated -q); do
    docker service update $service --force
done
