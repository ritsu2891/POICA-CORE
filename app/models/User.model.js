const { Sequelize, DataTypes } = require('sequelize');
var sequelize = require("../../config/db.js");

const User = sequelize.define('User', {
    ID: {
        type: DataTypes.INET,
        primaryKey: true
    },
    DisplayName: {
        type: DataTypes.STRING,
    },
    AccessToken: {
        type: DataTypes.STRING
    }
});

module.exports = User;