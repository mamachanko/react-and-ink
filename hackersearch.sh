#!/usr/bin/env bash

set -euo pipefail

echo "Press <space> to search Hackernews, <q> to quit."
while [ true ] ; do
    read -s -n 1 key
    if [[ $key = '' ]] ; then
        curl -sL "https://hn.algolia.com/api/v1/search_by_date?tags=story&query=Bangalore" | jq --raw-output '.hits[0:5] | map(.title)' ;
    elif [[ $key = q ]] ; then
        echo ok. bye.
        exit ;
    fi
done