const models = require('../models');
const User = models.User;

const { Op } = require("sequelize");

const { currentUser } = require('../auth.js');
const { filterObject } = require('../util.js');

module.exports.myProfile = async function() {
  return currentUser();
}

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