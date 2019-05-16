#!/usr/bin/env bash

set -euo pipefail

cd $(dirname $0)

docker \
    run \
    --interactive \
    --tty \
    --volume $(pwd)/hackersearch.sh:/hackersearch.sh \
    mamachanko/react-and-ink \
    bash hackersearch.sh
