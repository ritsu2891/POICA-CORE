var express = require("express");
const router = express.Router();
const { restApiRes } = require('../util.js');
const authorize = require('../../config/middlewares/auth.js');
const cardController = require('../controllers/card.controller.js');

router.get('/list', authorize, (req, res) => {
  restApiRes(req, res, cardController.list, (r) => {return {cards: r};});
});

router.post('/add', authorize, (req, res) => {
  restApiRes(req, res, () => cardController.add(req.body.id, req.body.token), (r) => {return {};});
});

router.post('/remove', authorize, (req, res) => {
  restApiRes(req, res, () => cardController.remove(req.body.cardId), () => ({}));
})

module.exports = router;