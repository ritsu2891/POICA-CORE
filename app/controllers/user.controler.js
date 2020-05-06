const models = require('../models');
const User = models.User;

const { Op } = require("sequelize");

const { filterObject } = require('../util.js');

module.exports.searchByDisplayName = async function(displayName) {
  const users = await User.findAll({
    where: {
      displayName: {
        [Op.like]: `%${displayName}%`
      },
    }
  });
  return users.map(user => user.toJSON());
}