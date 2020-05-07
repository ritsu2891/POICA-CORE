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
    type: DataTypes.TEXT,
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
  },
  // 5/6追加：リッチな表現第一弾
  displayName: {
    type: DataTypes.TEXT
  },
  logo: {
    type: DataTypes.TEXT
  },
  logoUrl: {
    type: DataTypes.VIRTUAL(DataTypes.TEXT, ['logo']),
    get() {
      return `${process.env.SELF_URL}/uploads/master/logo/${this.get('logo')}`
    }
  },
  primaryColor: {
    type: DataTypes.STRING
  },
  backgroundColor: {
    type: DataTypes.STRING
  },
  textColor: {
    type: DataTypes.STRING
  },
}, {sequelize});

module.exports = CardMaster;