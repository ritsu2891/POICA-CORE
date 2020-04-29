const { Sequelize, DataTypes, Model } = require('sequelize');
var sequelize = require("../../config/db.js");

class Card extends Model {
  // ...
}

Card.init({
  ID: {
    type: DataTypes.INET,
    primaryKey: true
  },
  Master: {
    type: DataTypes.BIGINT
  },
  Point: {
    type: DataTypes.INET
  },
  OwnerUser: {
    type: DataTypes.BIGINT
  }
}, {sequelize});

module.exports = Card;