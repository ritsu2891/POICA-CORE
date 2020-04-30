const { filterObject, currentUser } = require('../util.js');

const models = require('../models');
const Card = models.Card;
const CardMaster = models.CardMaster;
const validators = require('./validators.js');

// ログイン中のユーザが持っているカードの一覧
module.exports.list = async function() {
  const cards = await (await currentUser()).getRegisteredCards();
  const rescards = cards.map((card) => {
    return filterObject(card.toJSON(), ['id', 'masterId', 'point']);
  });
  return rescards;
}

// ログイン中のユーザ名義のカードを追加
module.exports.add = async function(masterId) {
  const master = await CardMaster.findOne({
    where: {
      ID: masterId
    }
  });

  validators.denyEmptyResult(master, 'MASTER');
  validators.cardCanRegisterByUser(master);
  validators.denyInvalidRegToken(master, token);

  const newCard = await Card.create({
    'masterId': master.ID,
  });

  newCard.setOwnerUser(await currentUser());
}