const models = require('./models');
const User = models.User;

module.exports.isEmpty = function(val) {
  if (!val) { // null|undefined|''|0|false
    if ( val !== 0 && val !== false ) {
      return true;
    }
  }　else if　(typeof val == "object"){ //array|object
    return Object.keys(val).length === 0;
  }
  return false; // 値は空ではない
}

module.exports.currentUser = async function() {
  return await User.findOne({
    where: {
      ID: 1
    }
  });
}