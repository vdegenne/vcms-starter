#!/usr/bin/env bash

export DOCKER_HOST=$(/sbin/ip route | awk '/default/ { print $3 }')

bash "$@"
