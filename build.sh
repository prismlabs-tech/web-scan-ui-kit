#!/usr/bin/env bash
set -e # exit on error

echo "-------------------------------------------------------------------"
echo "Run npm install ..."
echo "-------------------------------------------------------------------"
npm ci

# check whether the commit is tagged so we can decide which environment to build
STAGE_REGEXP="^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)-rc(\.(0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*?(\+([0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*))?$"
PROD_REGEXP="^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$"

if [[ "$CIRCLE_TAG" =~ $PROD_REGEXP ]]; then
    echo "-------------------------------------------------------------------"
    echo "Production release detected: $CIRCLE_TAG"
    echo "-------------------------------------------------------------------"
    npm run build:cdn:prod
    npm publish --access public

elif [[ "$CIRCLE_TAG" =~ $STAGE_REGEXP ]]; then
    echo "-------------------------------------------------------------------"
    echo "Stage release detected: $CIRCLE_TAG"
    echo "-------------------------------------------------------------------"
    npm run build:cdn:stage

else
    echo "-------------------------------------------------------------------"
    echo "Dev build for: $CIRCLE_TAG"
    echo "-------------------------------------------------------------------"
    npm run build:cdn:dev
fi
