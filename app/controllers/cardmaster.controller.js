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
    return filterObject(master.toJSON(), ['id', 'style', 'showInList', 'regByURL', 'regToken']);
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