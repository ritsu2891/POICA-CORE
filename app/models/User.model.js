const { Sequelize, DataTypes, Model } = require('sequelize');
var sequelize = require("../../config/db.js");
const randtoken = require('rand-token');

class User extends Model {
  static associate = {
    hasMany: [
      {
        model: 'Card',
        options: {
          as: 'RegisteredCards', // 複数形限定! https://sequelize.org/master/class/lib/model.js~Model.html#static-method-hasMany
          foreignKey: 'ownerUserId', // モデル両方に指定
        }
      },
      {
        model: 'CardMaster',
        options: {
          as: 'OwnedMasters',
          foreignKey: 'ownerUserId',
        }
      }
    ]
  }

  generateAccessToken() {
    this.accessToken = randtoken.generate(50);
  }

  tieProviderId(providerName, providerId) {
    console.log(providerId);
    this[providerName + 'Id'] = providerId;
  }
}

User.init({
  userId: {
    type: DataTypes.TEXT,
    validate: {
      is: /^\w+$/,
      len: [0, 30]
    },
  },
  displayName: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 30]
    },
  },
  accessToken: {
    type: DataTypes.STRING
  },
  googleId: {
    type: DataTypes.TEXT
  },
  iconUrl: {
    type: DataTypes.TEXT
  },
}, {sequelize});

module.exports = User;