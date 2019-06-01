#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

docker \
    run \
    --volume $(pwd):/config \
    --publish 8083:8083 \
    --network 'ink' \
    --network-alias 'hn' \
    jordimartin/mmock
