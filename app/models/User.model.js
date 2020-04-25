const { Sequelize, DataTypes } = require('sequelize');
var sequelize = require("../../config/db.js");

const User = sequelize.define('User', {
    DisplayName: {
        type: DataTypes.STRING,
    },
    AccessToken: {
        type: DataTypes.STRING
    }
});

module.exports = User;