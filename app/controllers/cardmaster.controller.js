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
    return filterMaster(master);
  });
  return resmasters;
}

// ログイン中のユーザ管理のカードマスタを追加
module.exports.add = async function(rOpts) {
  const opts = filterObject(rOpts, ['style', 'showInList', 'regByURL']);

  await CardMaster.create({
    ownerUserId: currentUser().id,
    style: opts.style,
    showInList: opts.showInList,
    regByURL: opts.regByURL,
  });
}

// 登録用UUIDからのマスタ検索
module.exports.findByRegToken = async function(regToken) {
  const master = await CardMaster.findOne({
    where: {
      regToken: regToken
    }
  });
  validators.denyEmptyResult(master);
  return filterMaster(master);
}

function filterMaster(master) {
  return filterObject(master.toJSON(), ['id', 'style', 'showInList', 'regByURL', 'regToken']);
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