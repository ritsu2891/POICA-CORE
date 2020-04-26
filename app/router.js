var express = require("express");
const User = require("./models/User.model.js");
const Card = require("./models/Card.model.js");
const CardMaster = require("./models/CardMaster.model.js");
const router = express.Router();

router.get('/registered', (req, res) => {
  (async function () {
    const currentUser = await User.findOne({
      where: {
        AccessToken: 'TESTACTKN1'
      }
    });
    const cards = await Card.findAll({
      where: {
        OwnerUser: currentUser.id
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

/*
 * ポイントカードマスタ 
 */

// 自分が管理しているポイントカードマスタ一覧取得
router.get('/master', (req, res) => {
  (async function () {
    const currentUser = await User.findOne({
      where: {
        AccessToken: 'TESTACTKN1'
      }
    });
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