#!/usr/bin/env bash

set -euxo pipefail

docker \
    build \
    . \
    --tag mamachanko/react-and-ink:latest
