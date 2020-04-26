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
  },
  ShowInList: {
    type: DataTypes.BOOLEAN,
  },
  RegByURL: {
    type: DataTypes.BOOLEAN
  },
  RegToken: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4
  }
});

module.exports = CardMaster;