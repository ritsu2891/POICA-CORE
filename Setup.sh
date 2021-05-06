eval "$(cat config/.env.development <(echo) <(declare -x))"
mkdir -p $UPLOAD_PATH
mkdir -p $UPLOAD_PATH/master
mkdir -p $UPLOAD_PATH/master/cardimage
mkdir -p $UPLOAD_PATH/master/logo