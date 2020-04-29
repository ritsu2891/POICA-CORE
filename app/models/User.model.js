const { Sequelize, DataTypes } = require('sequelize');
var sequelize = require("../../config/db.js");

class User extends Model {
  // ...
}

User.init({
  ID: {
    type: DataTypes.INET,
    primaryKey: true
  },
  DisplayName: {
    type: DataTypes.STRING,
  },
  AccessToken: {
    type: DataTypes.STRING
  }
}, {sequelize});

module.exports = User;