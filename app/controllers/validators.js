const { isEmpty } = require('../util.js');

module.exports.denyEmptyResult = function(target, name) {
  if (isEmpty(target)) {
    throw new Error(name + '_NOT_FOUND');
  }
  return;
}

module.exports.cardCanRegisterByUser = function(master) {
  if (!master.canRegisterByUser()) {
    throw new Error('CANNOT_REGISTER_BY_USER');
  }
  return;
}

module.exports.denyInvalidRegToken = function(master, token) {
  if (!master.showInList) {
    if (isEmpty(token) | token != master.regToken) {
      throw new Error('INVALID_CARD_REGISTER_TOKEN');
    }
  }
  return;
}