var express = require("express");
const router = express.Router();
const { isEmpty, filterObject, currentUser } = require('../util.js');

const models = require('../models');
const User = models.User;
const Card = models.Card;
const CardMaster = models.CardMaster;

router.get('/list', (req, res) => {
  (async function () {
    const cards = await (await currentUser()).getRegisteredCards();
    const rescards = cards.map((card) => {
      return filterObject(card.toJSON(), ['id', 'masterId', 'point']);
    });
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
router.post('/add', (req, res) => {
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
    const newCard = await Card.create({
      'MasterID': master.ID,
    });

    newCard.setOwnerUser(await currentUser());

    res.json({result: 'ok'});
    return;
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