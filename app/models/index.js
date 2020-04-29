const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const sequelize = require("../../config/db.js");
const db = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-8) === 'model.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  const assoc = db[modelName].associate;
  if (assoc) {
    console.log(assoc);
    Object.keys(assoc).forEach(relation => {
      const model = db[assoc[relation].model];
      const options = assoc[relation].options;

      if (options) {
        db[modelName][relation](model, options);
      } else {
        db[modelName][relation](model);
      }
    });
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
