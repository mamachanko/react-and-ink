#!/usr/bin/env bash

cd $(dirname $0)

pushd bash
    ./build.sh
popd

pushd ink
    yarn
popd
