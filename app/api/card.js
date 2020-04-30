var express = require("express");
const router = express.Router();
const { restApiRes } = require('../util.js');
const cardController = require('../controllers/card.controller.js');

router.get('/list', (req, res) => {
  restApiRes(req, res, cardController.list, (r) => {return {cards: r};});
});

router.post('/add', (req, res) => {
  restApiRes(req, res, cardController.add(req.body.masterid), (r) => {return {};});
});

module.exports = router;