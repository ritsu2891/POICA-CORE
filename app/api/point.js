var express = require("express");
const router = express.Router();
const { isEmpty, currentUser } = require('../util.js');

const models = require('../models');
const Card = models.Card;
const CardMaster = models.CardMaster;
const PointOpReq = models.PointOpReq;

// カードマスタ管理者による操作 (宛先明確)
/*
{
  as: 'admin' | 'user',
  media: 'direct' | 'uuid',
  masterid: _,
  cardid: _,
  optype: 'point-free',
  value: _,
}
*/
router.post('/give', (req, res) => {
  (async function () {
    const cu = currentUser();

    const as = req.body.as;
    const media = req.body.media;
    const cardid = req.body.cardid;
    const masterid = req.body.masterid;

    const opType = req.body.optype;
    const value = req.body.value;

    const targetCard = undefined;
    const targetCardMaster = undefined;

    // パラメータチェック
    if (media == 'direct' && isEmpty(cardid)) {
      res.status(400).json(errRes('PARAM_LACK', 'Please specify target card'));
      return;
    }
    if (media == 'uuid' && isEmpty(cardid) && isEmpty(masterid)) {
      res.status(400).json(errRes('PARAM_LACK', 'Please specify target master or target card'));
      return;
    }

    // 対象ポイントカードマスタの特定
    if (isEmpty(masterid)) {
      targetCard = await Card.findOne({
        where: {
          id: req.body.targetcardid
        }
      });
      if (isEmpty(targetCard)) {
        res.status(400).json(errRes('CARD_NOT_FOUND', 'Card was not found'));
        return;
      }
      targetCardMaster = await targetCard.getCardMaster();
    } else {
      targetCardMaster = await CardMaster.findOne({
        where: {
          id: masterid
        }
      });
    }
    if (isEmpty(targetCardMaster)) {
      res.status(400).json(errRes('MASTER_NOT_FOUND', 'Card Master was not found'));
      return;
    }

    // ポイント付与権限を確認
    if (as == 'admin') {
      if (cu.id != targetCardMaster.OwnerUser) {
        res.status(400).json(errRes('NO_PERMISSION', 'You can not operate requested action'));
        return;
      }
    } else if (as == 'user') {
      if (!targetCardMaster.UserToUserPointOp) {
        res.status(400).json(errRes('NO_PERMISSION', 'You can not operate requested action'));
        return;
      }
      const operatorCard = await Card.findOne({
        where: {
          masterId: targetCardMaster.id,
          ownerUserId: cu.id,
        }
      });
      if (isEmpty(operatorCard)) {
        res.status(400).json(errRes('NO_PERMISSION', 'You can not operate requested action'));
        return;
      }
    }

    // ポイント付与・発行
    numValue = Number(value);
    if (!Number.isInteger(numValue)) {
      res.status(400).json(errRes('INVALID_VALUE', 'Value must be integer'));
      return;
    }

    if (media == 'direct') {
      targetCard.Point += numValue | 0;
      targetCard.save();

      res.json({result: 'ok'});
    } else if (media == 'uuid') {
      const opReq = await PointOpReq.create({
        operatorUserID: cu.id,
        opType: opType,
        value: value,
      });

      res.json({
        result: 'ok',
        token: opReq.token
      });
    }

    return;
  })();
});

// UUIDによるポイントの受け取り
/*
{
  Token: _,
  CardID: _,
}
*/
router.post('/receive', (req, res) => {
  (async function () {
    const cu = currentUser();

    const token = req.body.token;
    const cardid = req.body.cardid;

    const opreq = await PointOpReq.findOne({
      where: {
        token: token,
      }
    });
    if (isEmpty(opreq)) {
      res.status(400).json(errRes('INVALID_TOKEN', 'Token is invalid'));
      return;
    }
    // TODO: 有効期限確認
    const targetCard = await Card.findOne({
      where: {
        id: cardid,
        ownerUserId: cu.id,
      }
    });
    if (isEmpty(targetCard)) {
      res.status(400).json(errRes('INVALID_CARD', 'This operation is not acceptable for the card'));
      return;
    }

    // TODO: valueが数値かどうかの検証

    targetCard.Point += Number(opreq.value) | 0;
    targetCard.save();

    res.json({result: 'ok'});
  })();
});

function errRes(errtype, message) {
  return {
    'result': 'error',
    'type': errtype,
    'message': message
  };
}

module.exports = router;