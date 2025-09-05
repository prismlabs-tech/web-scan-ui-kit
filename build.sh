#!/usr/bin/env bash
set -e # exit on error

# install dependencies
npm ci

# check whether the commit is tagged so we can decide which environment to build
STAGE_REGEXP="^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)-[rc](?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$"
PROD_REGEXP="^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$"

if [[ "$CIRCLE_TAG" =~ $PROD_REGEXP ]]; then
    echo "Production release detected: $CIRCLE_TAG"
    npm run build:cdn:prod

elif [[ "$CIRCLE_TAG" =~ $STAGE_REGEXP ]]; then
    echo "Stage release detected: $CIRCLE_TAG"
    npm run build:cdn:stage

else
    echo "Dev build for: $CIRCLE_TAG"
    npm run build:cdn:dev
fi
