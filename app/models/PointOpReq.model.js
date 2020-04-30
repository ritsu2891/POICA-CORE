const { Sequelize, DataTypes, Model } = require('sequelize');
var sequelize = require("../../config/db.js");

class PointOpReq extends Model {
  // ...
}

PointOpReq.init({
  token: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  operatorUserId: {
    type: DataTypes.INET,
  },
  opType: {
    type: DataTypes.CHAR,
  },
  value: {
    type: DataTypes.INET,
  }
}, {sequelize});

module.exports = PointOpReq;