const { isEmpty } = require('../util.js');

const models = require('../models');
const Card = models.Card;

function denyEmptyResult(target, name) {
  if (isEmpty(target)) {
    throw new Error(name + '_NOT_FOUND');
  }
  return;
}
module.exports.denyEmptyResult = denyEmptyResult;

module.exports.cardCanRegisterByUser = function(master) {
  if (!master.canRegisterByUser()) {
    throw new Error('CANNOT_REGISTER_BY_USER');
  }
  return;
}

module.exports.checkPointGiveAuthority = async function(master, userid, as) {
  if (as == 'admin') {
    if (userid != master.ownerUserId) {
      throw new Error('NO_PERMISSION');
    }
  } else if (as == 'user') {
    if (!master.userToUserPointOpt) {
      throw new Error('NO_PERMISSION');
    }
    const operatorCard = await Card.findOne({
      where: {
        masterId: master.id,
        ownerUserId: userid,
      }
    });
    try {
      denyEmptyResult(operatorCard, '');
    } catch (e) {
      throw new Error('NO_PERMISSION');
    }
  }
}

module.exports.denyInvalidRegToken = function(master, token) {
  if (!master.showInList) {
    if (isEmpty(token) | token != master.regToken) {
      throw new Error('INVALID_CARD_REGISTER_TOKEN');
    }
  }
  return;
}

module.exports.denyNonNumerical = function(value) {
  const numValue = Number(value);
  if (!Number.isInteger(numValue)) {
    throw new Error('INVALID_VALUE');
    return;
  }
}