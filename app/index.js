const path = require('path');
var express = require("express");
var session = require("express-session");
var cookieParser = require('cookie-parser');
var app = express();
console.log(`Run with ${app.get('env')} environment.`);
require('dotenv').config({
  path: path.resolve(__dirname, '../config/.env.' + app.get('env'))
});
const passport = require('./auth.js').passport;
var mustacheExpress = require('mustache-express');
const util = require('./util.js');

process.env.TZ = 'Asia/Japan';

if (app.get('env') != 'test') {
  app.engine('mustache', mustacheExpress());
  app.set('view engine', 'mustache');
  app.set('views', __dirname + '/views');

  var cors = require("../config/middlewares/cors.js");
  app.use(cors);

  app.use(express.json())
  app.use(session({
    secret: "cats",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));
  app.use(cookieParser())
  app.use(express.urlencoded({ extended: true }));

  app.use(passport.initialize());
  app.use(passport.session());

  console.log(path.resolve(__dirname + "/../uploads"));
  app.use('/uploads', express.static(process.env.UPLOAD_PATH));

  app.use('/cards', require('./api/card.js'));
  app.use('/cardmasters', require('./api/cardmaster.js'));
  app.use('/points', require('./api/point.js'));
  app.use('/users', require('./api/user.js'));

  // http://rpakambp.local:4000/auth/google
  app.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile'], session: false }),
  );
  app.get('/auth/google/done',
    passport.authenticate('google', { session: false }),
    function(req, res) {
      // res.cookie('accessToken', req.user.accessToken, {
      //   httpOnly: false
      // });
      // res.cookie('authResult', 'ok', {
      //   httpOnly: false
      // });
      // res.json({});
      res.render('sendToken', {accessToken: req.user.accessToken});
    }
  );

  //テスト用
  app.get('/test', async (req, res) => {
    res.json({});
  });

  var server = app.listen(process.env.PORT || 4000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
  });
}
