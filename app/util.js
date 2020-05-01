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

module.exports.filterObject = function(obj, allowKey) {
  resObj = {};
  Object.values(allowKey).forEach((key) => {
    resObj[key] = obj[key];
  });
  return resObj;
}

module.exports.restApiRes = async function(req, res, processFn, formatFn) {
  try {
    const processRes = await processFn();
    const resJson = {
      'result': 'ok'
    };
    Object.assign(resJson, formatFn(processRes));
    res.json(resJson);
  } catch (e) {
    const resJson = {
      'result': 'error',
      'type': e.message,
    };
    res.status(400).json(resJson);
  }
}