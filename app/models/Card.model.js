const { Sequelize, DataTypes, Model } = require('sequelize');
var sequelize = require("../../config/db.js");

class Card extends Model {
  static associate = {
    belongsTo: {
      model: 'User',
      options: {
        as: 'OwnerUser',
        foreignKey: 'OwnerUserID'
      }
    }
  }
}

Card.init({
  ID: {
    type: DataTypes.INET,
    primaryKey: true
  },
  MasterID: {
    type: DataTypes.BIGINT
  },
  OwnerUserID: {
    type: DataTypes.BIGINT
  },
  Point: {
    type: DataTypes.INET
  },
}, {sequelize});

module.exports = Card;