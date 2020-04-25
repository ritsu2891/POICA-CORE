var express = require("express");
var app = express();

require('dotenv').config({
  path: 'config/environment/.env.' + app.get('env')
});

var dbconn = require("../config/db.js");
dbconn.connect();