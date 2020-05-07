const { Op } = require("sequelize");

const { filterObject } = require('../util.js');
const { currentUser } = require('../auth.js');

const models = require('../models');
const Card = models.Card;
const CardMaster = models.CardMaster;
const validators = require('./validators.js');

// ログイン中のユーザが管理しているカードマスタの一覧
module.exports.list = async function() {
  const masters = await currentUser().getOwnedMasters();
  const resmasters = masters.map((master) => {
    return master.toJSON();
  });
  return resmasters;
}

// ログイン中のユーザ管理のカードマスタを追加
module.exports.add = async function(rOpts) {
  let opts = filterObject(rOpts, 
    ['style', 'showInList', 'regByURL', 'userToUserPointOpt',
    'displayName', 'primaryColor', 'backgroundColor', 'textColor', 'logo']
  );
  opts = Object.assign(opts, {
    ownerUserId: currentUser().id,
  });

  await CardMaster.create(opts);
}

// 登録用UUIDからのマスタ検索
module.exports.findByRegToken = async function(regToken) {
  const master = await CardMaster.findOne({
    where: {
      regToken: regToken
    }
  });
  console.log(master.logoUrl);
  validators.denyEmptyResult(master);
  return master.toJSON();
}

// 管理者として操作可能なカードを特定のユーザについて取得
module.exports.underControllCardOfUser = async function(userId) {
  const masters = await currentUser().getOwnedMasters();
  const cards = await Card.findAll({
    where: {
      [Op.and]: [
        { ownerUserId: userId },
        { masterId: {
          [Op.or]: masters.map(m => m.id),
        }}
      ]
    }
  });
  return cards;
}