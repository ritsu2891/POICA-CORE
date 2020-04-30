const { isEmpty, currentUser } = require('../util.js');

const models = require('../models');
const Card = models.Card;
const CardMaster = models.CardMaster;
const PointOpReq = models.PointOpReq;
const validators = require('./validators.js');

// ポイント付与
/*
{
  as: 'admin' | 'user',
  media: 'direct' | 'uuid',
  masterId: _,
  cardId: _,
  optype: 'point-free',
  value: _,
}
*/
module.exports.give = async function(opt) {
  const cu = await currentUser();

  let targetCard = undefined;
  let targetCardMaster = undefined;

  // パラメータチェック
  if (opt.media == 'direct' && isEmpty(opt.cardId)) {
    throw new Error('DEST_UNSPECIFIED');
  }
  if (opt.media == 'uuid' && isEmpty(opt.cardId) && isEmpty(opt.masterId)) {
    throw new Error('DEST_UNSPECIFIED');
  }

  // 対象ポイントカードマスタの特定
  if (isEmpty(opt.masterId)) {
    targetCard = await Card.findOne({
      where: {
        id: opt.cardId
      }
    });
    validators.denyEmptyResult(targetCard, 'CARD');
    targetCardMaster = await targetCard.getCardMaster();
  } else {
    targetCardMaster = await CardMaster.findOne({
      where: {
        id: opt.masterId
      }
    });
  }
  validators.denyEmptyResult(targetCardMaster, 'MASTER');

  // ポイント付与権限を確認
  await validators.checkPointGiveAuthority(targetCardMaster, cu.id, opt.as);

  // ポイント付与・発行
  validators.denyNonNumerical(opt.value);
  const numValue = Number(opt.value);

  if (opt.media == 'direct') {
    targetCard.point += numValue | 0;
    await targetCard.save();
    return {};
  } else if (opt.media == 'uuid') {
  
    const opReq = await PointOpReq.create({
      masterId: targetCardMaster.id,
      operatorUserId: cu.id,
      opType: opt.opType,
      value: opt.value,
    });
    return {
      token: opReq.token
    };
  }
}

// UUIDによるポイントの受け取り
/*
{
  token: _,
  cardId: _,
}
*/
module.exports.receive = async function(opt) {
  const cu = await currentUser();

  const opReq = await PointOpReq.findOne({
    where: {
      token: opt.token,
    }
  });
  validators.denyEmptyResult(opReq);
  // TODO: 有効期限確認
  const targetCard = await Card.findOne({
    where: {
      id: opt.cardId,
      ownerUserId: cu.id,
    }
  });
  validators.denyEmptyResult(targetCard);
  
  // TODO: valueが数値かどうかの検証
  targetCard.point += Number(opReq.value) | 0;
  await targetCard.save();
  return;
}