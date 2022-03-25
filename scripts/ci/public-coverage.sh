#!/usr/bin/env bash

set -euo pipefail

if [[ -d "coverage/lcov-report" ]]; then
  # Publish web-app code coverage
  mkdir -p public/coverage-web-app
  cp -r "coverage/lcov-report" "public/"
  echo "Published CMS web app report"
fi
