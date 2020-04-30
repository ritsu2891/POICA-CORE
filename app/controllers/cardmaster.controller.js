const { filterObject, currentUser } = require('../util.js');

const models = require('../models');
const Card = models.Card;
const CardMaster = models.CardMaster;
const validators = require('./validators.js');

// ログイン中のユーザが管理しているカードマスタの一覧
module.exports.list = async function() {
  const masters = await (await currentUser()).getOwnedMasters();
  const resmasters = masters.map((master) => {
    return filterObject(master.toJSON(), ['id', 'style', 'showInList', 'regByURL', 'regToken']);
  });
  return resmasters;
}

// ログイン中のユーザ管理のカードマスタを追加
module.exports.add = async function(rOpts) {
  const opts = filterObject(rOpts, ['style', 'showInList', 'regByURL']);
  const cu = await currentUser();

  console.log(opts);

  await CardMaster.create({
    ownerUserId: cu.id,
    style: opts.style,
    showInList: opts.showInList,
    regByURL: opts.regByURL,
  });
}