#!/usr/bin/env bash

set -euo pipefail

cd $(dirname $0)

./run.sh "http://hn:8083"
