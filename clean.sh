#!/usr/bin/env bash

cd $(dirname $0)

docker system prune --force --all --volumes

rm -rf ink/node_modules
