#!/usr/bin/env bash

set -euo pipefail

cd $(dirname $0)

docker \
    run \
    --interactive \
    --tty \
    --volume $(pwd)/hackersearch.sh:/hackersearch.sh \
    --network 'ink' \
    mamachanko/react-and-ink \
    bash hackersearch.sh
