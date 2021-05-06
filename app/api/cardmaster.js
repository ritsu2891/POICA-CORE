const path = require('path');
var express = require("express");
const router = express.Router();
const multer  = require('multer');
const randtoken = require('rand-token');
const { isEmpty, currentUser, restApiRes } = require('../util.js');
const authorize = require('../../config/middlewares/auth.js');
const masterController = require('../controllers/cardmaster.controller.js');
const validators = require('../controllers/validators.js');

// 自分が管理しているポイントカードマスタ一覧取得
router.get('/list', authorize, (req, res) => {
  restApiRes(req, res, masterController.list, (r) => {return {masters: r}});
});

// ポイントカードマスタの新規作成
const iconUpload = multer({
  limits: {
    fieldNameSize: 20,
    fileSize: 2e9, //2G Byte
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    console.log('fileFilter()');
    const acceptFileExt = ['jpg', 'jpeg', 'png', 'svg'];
    const acceptMimetype = ['image/jpg', 'image/jpeg', 'image/png', 'image/svg+xml'];
    const fileExtRegRes = (new RegExp("\\.(.*)$")).exec(file.originalname);
    const fileExt = fileExtRegRes ? fileExtRegRes[1] : null;
    if (fileExt === null || !acceptFileExt.includes(fileExt)) {
      // 拡張子がファイル名に入っていないか、サポート対象外のもの
      cb(new Error('UNSUPPORTED_EXTENSION'));
      return;
    }
    if (!acceptMimetype.includes(file.mimetype)) {
      // MimeTypeがサポート対象外のもの
      cb(new Error('UNSUPPORTED_MIME_TYPE'));
      return;
    }
    console.log('fileFilter() Accept');
    cb(null, true);
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(process.env.UPLOAD_PATH, 'master/logo'))
    },
    filename: function (req, file, cb) {
      const fileExtRegRes = (new RegExp("\\.(.*)$")).exec(file.originalname);
      const fileExt = fileExtRegRes ? '.'+fileExtRegRes[1] : '';
      cb(null, `${randtoken.generate(50)}${fileExt}`);
    }
  }),
}).single('logo');

router.post(
  '/add',
  authorize,
  (req, res) => {
    restApiRes(
      req, res,
      async function() {
        const pIconUpload = () => new Promise((resoleve, reject) => {
          iconUpload(req, res, function (err) {
            console.log(err);
            resoleve(err);
          });
        });
        const upErr = await pIconUpload();
        if (upErr) {
          throw new Error(upErr.message);
        }

        const opts = req.body;
        if (req.file) {
          Object.assign(opts, {
            logo: req.file.filename,
          });
        }
        return masterController.add(opts);
      },
      (r) => {return {}}
    );
  }
);

// 削除
router.post('/remove', authorize, (req, res) => {
  restApiRes(req, res, () => masterController.remove(req.body.masterId), () => ({}));
})

// IDからのマスタ検索
router.get('/byId', (req, res) => {
  restApiRes(req, res, () => {
    return masterController.findById(req.query.id);
  }, (r) => {return {master: r};});
});

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