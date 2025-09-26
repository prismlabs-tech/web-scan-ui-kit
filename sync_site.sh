#!/usr/bin/env sh

# check whether the commit is tagged and decide which s3 bucket to push to
STAGE_REGEXP="^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)-rc(\.(0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*?(\+([0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*))?$"
PROD_REGEXP="^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$"

S3_SUFFIX=dev
(echo $CIRCLE_TAG | grep -P $STAGE_REGEXP) && S3_SUFFIX=stage
(echo $CIRCLE_TAG | grep -P $PROD_REGEXP) && S3_SUFFIX=prod

aws s3 sync --delete ./build s3://$S3_PREFIX-$S3_SUFFIX/

if [ "${S3_SUFFIX}" = "dev" ]; then
  echo "-------------------------------------------------------------------"
  echo "Push dev release to cloudfrount ..."
  echo "-------------------------------------------------------------------"
  aws cloudfront create-invalidation --distribution-id $CF_DISTRIBUTION_ID_DEV --paths "/*"

elif [ "${S3_SUFFIX}" = "stage" ]; then
  echo "-------------------------------------------------------------------"
  echo "Push stage release to cloudfrount ..."
  echo "-------------------------------------------------------------------"
  aws cloudfront create-invalidation --distribution-id $CF_DISTRIBUTION_ID_STAGE --paths "/*"

elif [ "${S3_SUFFIX}" = "prod" ]; then
  echo "-------------------------------------------------------------------"
  echo "Push production release to cloudfrount ..."
  echo "-------------------------------------------------------------------"
  aws cloudfront create-invalidation --distribution-id $CF_DISTRIBUTION_ID_PROD --paths "/*"
fi
