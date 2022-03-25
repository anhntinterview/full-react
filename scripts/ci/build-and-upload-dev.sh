#!/usr/bin/env bash

# aws configuration and synch data from build directory to S3 storage
output_dir="build"
s3_app_dir="$(echo ooolab-demo-workable-shiner)"

AWS_ACCESS_KEY_ID="$OOO_AWS_ACCESS_KEY_ID" AWS_SECRET_ACCESS_KEY="$OOO_AWS_SECRET_ACCESS_KEY" \
    aws s3 sync \
    "$output_dir" \
    "s3://${s3_app_dir}" \
    --quiet \
    --delete \
    --acl private \
    --cache-control "no-cache,no-store,must-revalidate"

testing_url="https://demo.ooolab.edu.vn/"
if [[ $CI_ENVIRONMENT_NAME == 'staging' ]]; then
    testing_url="https://demo.ooolab.edu.vn/"
fi
echo "Build complete. You can access your testing URL on ${testing_url}"