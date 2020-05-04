var express = require("express");
const router = express.Router();

const { restApiRes } = require('../util.js');
const validators = require('../controllers/validators.js');

const userController = require('../controllers/user.controler.js');

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