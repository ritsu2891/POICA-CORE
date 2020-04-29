var express = require("express");
const User = require("../models/User.model.js");
const Card = require("../models/Card.model.js");
const CardMaster = require("../models/CardMaster.model.js");
const PointOpReq = require("../models/PointOpReq.model.js");
const router = express.Router();
const { isEmpty } = require('../util.js');

// カードマスタ管理者による操作 (宛先明確)
/*
{
  TargetCardID: _,
  OpType: 'point-free',
  Value: _,
}
*/
router.post('/op-admin2user', (req, res) => {
  (async function () {
    // DUMMY!
    const currentUserId = 1;

    const targetCard = await Card.findOne({
      where: {
        ID: req.body.targetcardid
      }
    });
    if (isEmpty(targetCard)) {
      res.status(400).json(errRes('CARD_NOT_FOUND', 'Card was not found'));
      return;
    }
    const targetCardMaster = await CardMaster.findOne({
      where: {
        ID: targetCard.Master
      }
    });
    if (isEmpty(targetCardMaster)) {
      res.status(400).json(errRes('MASTER_NOT_FOUND', 'Card Master was not found'));
      return;
    }
    if (currentUserId != targetCardMaster.OwnerUser) {
      res.status(400).json(errRes('NO_PERMISSION', 'You can not operate requested action'));
      return;
    }
    if (!Number.isInteger(Number(req.body.value))) {
      res.status(400).json(errRes('INVALID_VALUE', 'Value must be integer'));
      return;
    }
    targetCard.Point += Number(req.body.value) | 0;
    targetCard.save();

    res.json({result: 'ok'});
  })();
});

// カード所有者間の操作 (宛先明確)
/*
  TargetCardID: _,
  OpType: 'point-free',
  Value: _,
*/
router.post('/op-user2user', (req, res) => {
  (async function () {
    // DUMMY!
    const currentUserId = 1;

    const targetCard = await Card.finedOne({
      where: {
        ID: req.body.targetcardid
      }
    });
    if (isEmpty(targetCard)) {
      res.status(400).json(errRes('CARD_NOT_FOUND', 'Card was not found'));
      return;
    }
    const targetCardMaster = await CardMaster.findOne({
      where: {
        ID: targetCard.Master
      }
    });
    if (isEmpty(targetCardMaster)) {
      res.status(400).json(errRes('MASTER_NOT_FOUND', 'Card Master was not found'));
      return;
    }

    // ========= ここまでおんなじ =================

    if (!targetCardMaster.UserToUserPointOp) {
      res.status(400).json(errRes('NO_PERMISSION', 'You can not operate requested action'));
      return;
    }
    const operatorCard = await Card.findOne({
      where: {
        Master: targetCard.Master
      }
    });
    if (isEmpty(operatorCard)) {
      res.status(400).json(errRes('NO_PERMISSION', 'You can not operate requested action'));
      return;
    }

    // ========= ここからおんなじ =================    

    if (!Number.isInteger(Number(req.body.value))) {
      res.status(400).json(errRes('INVALID_VALUE', 'Value must be integer'));
      return;
    }
    targetCard.Point += Number(req.body.value) | 0;
    targetCard.save();

    res.json({result: 'ok'});
  })();
});

// カードマスタ管理者による操作 (宛先不明)
/*
{
  Master: _,
  OpType: 'point-free',
  Value: _,
}
*/
router.post('/op-admin2user-nd', (req, res) => {
  (async function () {
    const currentUserId = 1;

    const targetCardMaster = await CardMaster.findOne({
      where: {
        ID: req.body.Master
      }
    });
    if (isEmpty(targetCardMaster)) {
      res.status(400).json(errRes('MASTER_NOT_FOUND', 'Card Master was not found'));
      return;
    }
    if (currentUserId != targetCardMaster.OwnerUser) {
      res.status(400).json(errRes('NO_PERMISSION', 'You can not operate requested action'));
      return;
    }
    if (!Number.isInteger(Number(req.body.value))) {
      res.status(400).json(errRes('INVALID_VALUE', 'Value must be integer'));
      return;
    }

    PointOpReq.create({
      OperatorUserID: currentUserId,
      OpType: req.body.OpType,
      Value: req.body.Value,
    });

    res.json({result: 'ok'});
  })();
});

// カード所有者間の操作 (宛先不明)
/*
{
  TargetMasterID: _,
  OpType: 'point-free',
  Value: _,
}
*/
router.post('/op-user2user-nd', (req, res) => {
  (async function () {
    // DUMMY!
    const currentUserId = 1;

    const targetCardMaster = await CardMaster.findOne({
      where: {
        ID: req.body.Master
      }
    });
    if (isEmpty(targetCardMaster)) {
      res.status(400).json(errRes('MASTER_NOT_FOUND', 'Card Master was not found'));
      return;
    }

    // ========= ここまでおんなじ =================

    if (!targetCardMaster.UserToUserPointOp) {
      res.status(400).json(errRes('NO_PERMISSION', 'You can not operate requested action'));
      return;
    }
    const operatorCard = await Card.findOne({
      where: {
        Master: targetCard.Master
      }
    });
    if (isEmpty(operatorCard)) {
      res.status(400).json(errRes('NO_PERMISSION', 'You can not operate requested action'));
      return;
    }

    // ========= ここからおんなじ =================    

    if (!Number.isInteger(Number(req.body.value))) {
      res.status(400).json(errRes('INVALID_VALUE', 'Value must be integer'));
      return;
    }

    PointOpReq.create({
      OperatorUserID: currentUserId,
      OpType: req.body.OpType,
      Value: req.body.Value,
    });

    res.json({result: 'ok'});
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
    const currentUserId = 1;

    const opreq = await PointOpReq.findOne({
      where: {
        Token: req.body.Token,
      }
    });
    if (isEmpty(opreq)) {
      res.status(400).json(errRes('INVALID_TOKEN', 'Token is invalid'));
      return;
    }
    const targetCard = await Card.findOne({
      where: {
        ID: req.body.ID,
        OwnerUser: currentUserId,
      }
    });
    if (isEmpty(targetCard)) {
      res.status(400).json(errRes('INVALID_CARD', 'This operation is not acceptable for the card'));
      return;
    }

    targetCard.Point += Number(req.body.value) | 0;
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