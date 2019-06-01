#!/usr/bin/env bash

set -euxo pipefail

docker network create ink

docker \
    build \
    . \
    --tag mamachanko/react-and-ink:latest
