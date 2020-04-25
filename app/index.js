var express = require("express");
var app = express();

require('dotenv').config({
  path: 'config/environment/.env.' + app.get('env')
});

require("./models/User.model.js");