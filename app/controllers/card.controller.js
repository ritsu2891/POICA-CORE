const { currentUser } = require('../auth.js');

const models = require('../models');
const Card = models.Card;
const CardMaster = models.CardMaster;
const validators = require('./validators.js');

// ログイン中のユーザが持っているカードの一覧
module.exports.list = async function() {
  const cards = await currentUser().getRegisteredCards();
  const rescards = cards.map((card) => {
    return card.toJSON();
  });
  return rescards;
}

// ログイン中のユーザ名義のカードを追加
module.exports.add = async function(id, token) {
  const master = await CardMaster.findOne({
    where: {
      id: id
    }
  });

  validators.denyEmptyResult(master, 'MASTER');
  validators.cardCanRegisterByUser(master);
  validators.denyInvalidRegToken(master, token);

  const newCard = await Card.create({
    'masterId': master.id,
  });

  newCard.setOwnerUser(currentUser());
}