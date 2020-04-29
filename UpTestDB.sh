#!/bin/zsh

eval "$(cat config/environment/.env.test <(echo) <(declare -x))"
TEST_DB_NAME=$DB_NAME
eval "$(cat config/environment/.env.development <(echo) <(declare -x))"
mysql -u$DB_USER -p$DB_PSWD -e "CREATE DATABASE $TEST_DB_NAME;";
mysqldump -u$DB_USER -p$DB_PSWD $DB_NAME --no-data | mysql -u$DB_USER -p$DB_PSWD $TEST_DB_NAME;