const { Sequelize, DataTypes, Model } = require('sequelize');
var sequelize = require("../../config/db.js");

class Card extends Model {
  static associate = {
    belongsTo: [
      {
        model: 'User',
        options: {
          as: 'OwnerUser',
          foreignKey: 'ownerUserID'
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
}, {sequelize});

module.exports = Card;