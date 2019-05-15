#!/usr/bin/env bash

set -euo pipefail

trap ctrl_c INT

function ctrl_c() {
    echo
    echo ok. bye.
    exit
}

echo "Search for the 5 latest Hackernews stories."
echo "Type your query and press <enter>."
echo

while [ true ] ; do
    read -p ">_ " query
    echo -ne " loading ...\r"
    curl -sL "https://hn.algolia.com/api/v1/search_by_date?tags=story&query=${query}" | jq --raw-output '.hits[0:5] | map(.title) | .[]' ;
    echo
done