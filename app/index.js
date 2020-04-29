var express = require("express");
var app = express();

require('dotenv').config({
  path: 'config/environment/.env.' + app.get('env')
});

if (app.get('env') !== 'test') {
  var cors = require("../config/middlewares/cors.js");
  app.use(cors);

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }));

  app.use('/cards', require('./api/card.js'));
  app.use('/points', require('./api/point.js'));

  var server = app.listen(4000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
  });
}