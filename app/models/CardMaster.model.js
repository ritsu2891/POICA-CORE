const { Sequelize, DataTypes, Model } = require('sequelize');
var sequelize = require("../../config/db.js");

class CardMaster extends Model {
  canRegisterByUser() {
    return this.showInList | this.regByURL;
  }
}

CardMaster.init({
  style: {
    type: DataTypes.INET,
  },
  ownerUser: {
    type: DataTypes.BIGINT
  },
  showInList: {
    type: DataTypes.BOOLEAN,
  },
  regByURL: {
    type: DataTypes.BOOLEAN
  },
  regToken: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  userToUserPointOpt: {
    type: DataTypes.BOOLEAN,
  }
}, {sequelize});

module.exports = CardMaster;