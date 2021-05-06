eval "$(cat config/.env.development <(echo) <(declare -x))"
mysql -h$DB_HOST -u $DB_USER -p$DB_PSWD $DB_NAME < setup.sql