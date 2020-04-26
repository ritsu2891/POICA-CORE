const { Sequelize, DataTypes } = require('sequelize');
var sequelize = require("../../config/db.js");

const CardMaster = sequelize.define('CardMaster', {
  ID: {
    type: DataTypes.INET,
    primaryKey: true
  },
  Style: {
    type: DataTypes.INET,
  },
  OwnerUser: {
    type: DataTypes.BIGINT
  }
});

module.exports = CardMaster;