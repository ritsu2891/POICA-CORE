const { Sequelize, DataTypes } = require('sequelize');
var sequelize = require("../../config/db.js");

const Card = sequelize.define('Card', {
    Master: {
        type: DataTypes.BIGINT
    },
    Point: {
        type: DataTypes.INET
    },
    OwnerUser: {
        type: DataTypes.BIGINT
    }
});

module.exports = Card;