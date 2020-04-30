const { Sequelize } = require('sequelize');
var express = require("express");
var app = express();

if (app.get('env') != 'test') {
  module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PSWD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  });
} else {
  module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PSWD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  });
}