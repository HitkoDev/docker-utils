#!/bin/bash
for service in $(docker service ls -q); do
    docker service update $service --force
done
