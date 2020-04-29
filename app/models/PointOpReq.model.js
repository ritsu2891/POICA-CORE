const { Sequelize, DataTypes, Model } = require('sequelize');
var sequelize = require("../../config/db.js");

class PointOpReq extends Model {
  // ...
}

PointOpReq.init({
  ID: {
    type: DataTypes.INET,
    primaryKey: true
  },
  Token: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  OperatorUserID: {
    type: DataTypes.INET,
  },
  OpType: {
    type: DataTypes.INET,
  },
  Value: {
    type: DataTypes.INET,
  }
}, {sequelize});

module.exports = PointOpReq;