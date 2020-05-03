var express = require("express");
var session = require("express-session");
var cookieParser = require('cookie-parser');
var app = express();
require('dotenv').config({
  path: 'config/environment/.env.' + app.get('env')
});
const passport = require('./auth.js').passport;

process.env.TZ = 'Asia/Japan';

if (app.get('env') != 'test') {
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

  app.use('/cards', require('./api/card.js'));
  app.use('/cardmasters', require('./api/cardmaster.js'));
  app.use('/points', require('./api/point.js'));

  // http://localhost:4000/auth/google
  app.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile'], session: false }),
  );
  app.get('/auth/google/done',
    passport.authenticate('google', { session: false }),
    function(req, res) {
      res.cookie('accessToken', req.user.accessToken, {
        httpOnly: false
      });
      res.cookie('authResult', 'ok', {
        httpOnly: false
      });
      res.json({});
    }
  );

  var server = app.listen(4000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
  });
}