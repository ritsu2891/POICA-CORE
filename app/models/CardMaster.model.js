const { Sequelize, DataTypes, Model } = require('sequelize');
var sequelize = require("../../config/db.js");

class CardMaster extends Model {
  canRegisterByUser() {
    return this.showInList | this.regByURL;
  }

  static associate = {
    hasMany: [{
      model: 'Card',
      options: {
        as: 'SlaveCards',
        foreignKey: 'masterID',
      }
    }],
    belongsTo: [
      {
        model: 'User',
        options: {
          as: 'OwnerUser',
          foreignKey: 'ownerUserId'
        }
      },
    ]
  }
}

CardMaster.init({
  style: {
    type: DataTypes.INET,
  },
  ownerUserId: {
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