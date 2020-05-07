var express = require("express");
const router = express.Router();

const authorize = require('../../config/middlewares/auth.js');

const { restApiRes } = require('../util.js');
const validators = require('../controllers/validators.js');

const userController = require('../controllers/user.controler.js');

// 自分のプロフィール情報を取得
router.get('/myProfile', authorize, (req, res) => {
  restApiRes(req, res, userController.myProfile, r => ({user: r}));
});

// 表示名から検索
router.get('/byDisplayName', (req, res) => {
  restApiRes(req, res, () => {
    const displayName = req.query.displayName;
    validators.denyEmptyResult(displayName, 'DISPLAY_NAME');
    return userController.searchByDisplayName(displayName);
  },
  (r) => {
    return {users: r};
  })
});

module.exports = router;