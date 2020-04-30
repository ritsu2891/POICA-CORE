var express = require("express");
const router = express.Router();
const { isEmpty, filterObject, currentUser, restApiRes } = require('../util.js');

const masterController = require('../controllers/cardmaster.controller.js');

// 自分が管理しているポイントカードマスタ一覧取得
router.get('/list', (req, res) => {
  restApiRes(req, res, masterController.list, (r) => {return {masters: r}});
});

// ポイントカードマスタの新規作成
router.post('/add', (req, res) => {
  restApiRes(req, res, () => {return masterController.add(req.body)}, (r) => {return {}});
})

module.exports = router;