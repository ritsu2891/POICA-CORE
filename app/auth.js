var express = require("express");
var app = express();

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const { isEmpty } = require('./util.js');

const models = require('./models');
const User = models.User;

const allowProviderNames = ['google'];

// Google
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SELF_URL}/auth/google/done`
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('profile');
    (async function () {
      const providerName = 'google';
      let loginUser = null;
      loginUser = await login(providerName, profile.id);
      if (!loginUser) {
        let iconUrl = null;
        if (profile.photos && Array.isArray(profile.photos) && profile.photos.length > 0 && profile.photos[0]) {
          iconUrl = profile.photos[0].value;
        }
        loginUser = await register(providerName, profile.id, profile.displayName, iconUrl);
      }
      done(null, loginUser);
    })();
  }
));

async function login(providerName, providerId) {
  if (!allowProviderNames.includes(providerName)) {
    throw new Error('INVALID_PROVIDER');
  }
  whereProp = {};
  whereProp[providerName + 'Id'] = providerId;
  const candUser = await User.findOne({
    where: whereProp
  });
  if ( isEmpty(candUser) ) {
    return null;
  } else {
    candUser.generateAccessToken();
    await candUser.save();
    return candUser;
  }
}

async function register(providerName, providerId, tmpName, iconUrl) {
  if (!allowProviderNames.includes(providerName)) {
    throw new Error('INVALID_PROVIDER');
  }
  const newUser = await User.create({
    displayName: tmpName,
    iconUrl: iconUrl,
    init: true
  });
  newUser.generateAccessToken();
  newUser.tieProviderId(providerName, providerId);
  await newUser.save();
  return newUser;
}

async function authorize(accessToken) {
  const currentUser = await User.findOne({
    where: {
      accessToken: accessToken
    }
  });
  if (isEmpty(currentUser)) {
    throw new Error('INVALID_TOKEN');
  }
  app.set('currentUser', currentUser);
  return currentUser;
}

function currentUser() {
  return app.get('currentUser');
}

module.exports.passport = passport;
module.exports.login = login;
module.exports.register = register;
module.exports.authorize = authorize;
module.exports.currentUser = currentUser;
