var express = require("express");
const router = express.Router();
const { isEmpty, filterObject, currentUser, restApiRes } = require('../util.js');
const authorize = require('../../config/middlewares/auth.js');
const masterController = require('../controllers/cardmaster.controller.js');
const validators = require('../controllers/validators.js');

// 自分が管理しているポイントカードマスタ一覧取得
router.get('/list', authorize, (req, res) => {
  restApiRes(req, res, masterController.list, (r) => {return {masters: r}});
});

// ポイントカードマスタの新規作成
router.post('/add', authorize, (req, res) => {
  restApiRes(req, res, () => {return masterController.add(req.body)}, (r) => {return {}});
})

// 登録用UUIDからのマスタ検索
router.get('/byRegToken', (req, res) => {
  restApiRes(req, res, () => {
    return masterController.findByRegToken(req.query.regToken)
  }, (r) => {return {master: r};});
});

// 管理者として操作可能なカードを特定のユーザについて取得
router.get('/underControllCardOfUser', authorize, (req, res) => {
  restApiRes(req, res, () => {
    const userId = req.query.userId;
    validators.denyEmptyResult(userId, 'TARGET_USER_ID');
    return masterController.underControllCardOfUser(userId);
  }, r => ({cards: r}));
});
module.exports = router;