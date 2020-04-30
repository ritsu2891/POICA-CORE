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
    const cu = currentUser();

    const masters = await CardMaster.findAll({
      where: {
        ownerUser: cu.id
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
  const cu = currentUser();

  await CardMaster.create({
    style: req.body.style,
    ownerUser: cu.id,
    showInList: req.body.showinlist,
    regByURL: req.body.regbyurl,
  });
  res.json({result: 'ok'});
})

module.exports = router;