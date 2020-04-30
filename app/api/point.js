var express = require("express");
const router = express.Router();
const { restApiRes } = require('../util.js');
const pointController = require('../controllers/point.controller.js');

// ポイント付与
router.post('/give', (req, res) => {
  restApiRes(req, res, () => {return pointController.give(req.body)}, (r) => {return r;});
});

// UUIDによるポイントの受け取り
router.post('/receive', (req, res) => {
  restApiRes(req, res, () => {return pointController.receive(req.body)}, (r) => {return r;});
});

module.exports = router;