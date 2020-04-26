const { Sequelize, DataTypes, Model } = require('sequelize');
var sequelize = require("../../config/db.js");

class CardMaster extends Model {
  canRegisterByUser() {
    return this.ShowInList | this.RegByURL;
  }
}

CardMaster.init({
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
}, {sequelize});

module.exports = CardMaster;