var express = require("express");
var app = express();

require('dotenv').config({
  path: 'config/environment/.env.' + app.get('env')
});

var cors = require("../config/middlewares/cors.js");
app.use(cors);

const router = require('./router.js');
app.use('/cards', router);

var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});