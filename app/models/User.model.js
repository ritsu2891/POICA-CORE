const { Sequelize, DataTypes, Model } = require('sequelize');
var sequelize = require("../../config/db.js");

class User extends Model {
  static associate = {
    hasMany: {
      model: 'Card',
      options: {
        as: 'RegisteredCards', // 複数形限定! https://sequelize.org/master/class/lib/model.js~Model.html#static-method-hasMany
        foreignKey: 'OwnerUserID', // モデル両方に指定
      }
    }
  }
}

User.init({
  // ID: {
  //   type: DataTypes.INET,
  //   primaryKey: true
  // },
  DisplayName: {
    type: DataTypes.STRING,
  },
  AccessToken: {
    type: DataTypes.STRING
  }
}, {sequelize});

module.exports = User;