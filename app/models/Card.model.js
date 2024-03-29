const { Sequelize, DataTypes, Model } = require('sequelize');
var sequelize = require("../../config/db.js");

class Card extends Model {
  static associate = {
    belongsTo: [
      {
        model: 'User',
        options: {
          as: 'OwnerUser',
          foreignKey: 'ownerUserId'
        }
      },
      {
        model: 'CardMaster',
        options: {
          as: 'CardMaster',
          foreignKey: 'masterId'
        }
      }
    ]
  }
}

Card.init({
  masterId: {
    type: DataTypes.BIGINT
  },
  ownerUserId: {
    type: DataTypes.BIGINT
  },
  point: {
    type: DataTypes.INET
  },
  description: {
    type: DataTypes.TEXT
  },
}, {sequelize});

module.exports = Card;