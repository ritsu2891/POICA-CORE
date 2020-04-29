var express = require("express");
const router = express.Router();
const { isEmpty, filterObject, currentUser } = require('../util.js');

const models = require('../models');
const User = models.User;
const Card = models.Card;
const CardMaster = models.CardMaster;

// 自分が管理しているポイントカードマスタ一覧取得
router.get('/list', (req, res) => {
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
router.post('/add', (req, res) => {
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