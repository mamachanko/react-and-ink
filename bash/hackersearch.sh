#!/usr/bin/env bash

set -euo pipefail

trap ctrl_c INT

function ctrl_c() {
    echo
    echo ok. bye.
    exit
}

echo "Search for Hackernews stories by date."
echo "Type your query and press <enter>."
echo

while [ true ] ; do
    read -p ">_ " query
    echo -ne " loading ...\r"
    curl \
        --get \
        --url "https://hn.algolia.com/api/v1/search_by_date" \
        --data-urlencode "tags=story" \
        --data-urlencode "query=${query}" \
        --silent \
        --location \
    | jq --raw-output '.hits[0:5] | map(.title) | .[]'
    echo
done