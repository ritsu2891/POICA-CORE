const _ = require('lodash');

const models = require('../models');
const User = models.User;

const { Op } = require("sequelize");

const { currentUser } = require('../auth.js');

module.exports.checkIdDupl = async function(opt) {
  if (!opt) {
    throw new Error('EMPTY_INPUT');
  }
  if (currentUser() && opt.userId == currentUser().userId) return false;
  const duplUser = await User.findOne({
    where: {
      userId: opt.userId,
    }
  });
  return !!duplUser;
}

module.exports.updateMyProfile = async function(profile) {
  if (!profile) return;
  profile = _.pick(profile, [
    'userId', 'displayName'
  ]);
  const cUser = currentUser();
  try {
    if (profile.userId) {
      cUser.userId = profile.userId;
    }
    if (profile.displayName) {
      cUser.displayName = profile.displayName;
    }
    if (profile.userId) {
      cUser.init = false;
    }
    await cUser.save();
  } catch (e) {
    if (e.errors && e.errors.length > 0 && e.errors[0].type == 'Validation error') {
      throw new Error('WRONG_INPUT');
    }
    throw new Error('SOMETHING_WRONG');
  }
}

module.exports.myProfile = async function() {
  return currentUser();
}

module.exports.searchByUserId = async function(userId) {
  const users = await User.findAll({
    where: {
      userId: {
        [Op.like]: `%${userId}%`
      },
    }
  });
  return users.map(user => _.omit(user.toJSON(), ['accessToken', 'googleId']));
};

module.exports.searchByDisplayName = async function(displayName) {
  const users = await User.findAll({
    where: {
      displayName: {
        [Op.like]: `%${displayName}%`
      },
    }
  });
  return users.map(user => _.omit(user.toJSON(), ['accessToken', 'googleId']));
}