var express = require("express");
const router = express.Router();
const { restApiRes } = require('../util.js');
const authorize = require('../../config/middlewares/auth.js');
const cardController = require('../controllers/card.controller.js');

router.get('/list', authorize, (req, res) => {
  restApiRes(req, res, cardController.list, (r) => {return {cards: r};});
});

router.post('/add', authorize, (req, res) => {
  restApiRes(req, res, cardController.add(req.body.masterid), (r) => {return {};});
});

module.exports = router;