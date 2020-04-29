var express = require("express");
const User = require("../models/User.model.js");
const Card = require("../models/Card.model.js");
const CardMaster = require("../models/CardMaster.model.js");
const router = express.Router();
const { isEmpty } = require('../util.js');

const currentUser = 1;

router.get('/registered', (req, res) => {
  (async function () {
    const cards = await Card.findAll({
      where: {
        OwnerUser: currentUser.ID
      }
    })
    const rescards = cards.map(c => ({
        id: c.ID,
        master: c.Master,
        point: c.Point
      }));
    res.json(rescards);
  })();
});

// ポイントカードを登録
/* 
  {
    masterid: '',
    regtoken: '',
  }
*/
router.post('/register', (req, res) => {
  (async function () {
    const master = await CardMaster.findOne({
      where: {
        ID: req.body.masterid
      }
    });
    if (isEmpty(master)) {
      res.status(400).json(errRes('MASTER_NOT_FOUND', 'Point Card Master you posted was not found'));
      return;
    }
    if (!master.canRegisterByUser()) {
      res.status(400).json(errRes('CANNOT_REGISTER_BY_USER', 'This point card can not be registered by user'));
      return;
    }
    if (!master.ShowInList) {
      if (isEmpty(req.body.regtoken) | req.body.regtoken != master.RegToken) {
        res.status(400).json(errRes('CANNOT_REGISTER_BY_USER', 'This point card can not be registered by user'));
        return;
      }
    }
    const newCard = Card.create({
      'Master': master.ID,
      'OwnerUser': 1, // DUMMY!
    });
    res.json({result: 'ok'});
    return;
  })();
});

/*
 * ポイントカードマスタ 
 */

// 自分が管理しているポイントカードマスタ一覧取得
router.get('/master', (req, res) => {
  (async function () {
    const masters = await CardMaster.findAll({
      where: {
        OwnerUser: currentUser.id
      }
    });
    const resmasters = masters.map(m => ({
      id: m.ID,
      style: m.Style
    }));
    res.json(resmasters);
  })();
});

// ポイントカードマスタの新規作成
router.post('/add-master', (req, res) => {
  console.log(req.body);
  const newMaster = CardMaster.create({
    'Style': req.body.style,
    'OwnerUser': 1, // DUMMY!
    'ShowInList': req.body.showinlist,
    'RegByURL': req.body.regbyurl,
  });
  res.json({result: 'ok'});
})

function errRes(errtype, message) {
  return {
    'result': 'error',
    'type': errtype,
    'message': message
  };
}


module.exports = router;