#!/bin/zsh

eval "$(cat config/environment/.env.test <(echo) <(declare -x))"
mysql -u$DB_USER -p$DB_PSWD -e "DROP DATABASE $DB_NAME;";