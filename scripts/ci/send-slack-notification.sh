#!/usr/bin/env bash

set -euo pipefail

slack_notification_message=$1
slack_notification_user="@${GITLAB_USER_LOGIN}"

echo "Sending Slack Notification to ${GITLAB_USER_LOGIN}"

curl -X POST \
  https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer ${SLACK_TOKEN}" \
  -H 'Content-Type: application/json; charset=utf-8' \
  -d "{
  'channel': '${slack_notification_user}',
  'text': '${slack_notification_message}',
  'charset': 'utf-8'
}"
