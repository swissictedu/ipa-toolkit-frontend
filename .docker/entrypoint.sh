#!/bin/sh
set -xe

: "${API?Define the api endpoint}"

sed -i "s/\/\/REPLACE_WITH_API/$API/g" /usr/share/nginx/html/index.html

exec "$@"
