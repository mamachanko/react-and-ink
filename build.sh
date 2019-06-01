#!/usr/bin/env bash

cd $(dirname $0)

pushd hn-mock
    ./build.sh
popd

pushd bash
    ./build.sh
popd

pushd ink
    yarn
popd
