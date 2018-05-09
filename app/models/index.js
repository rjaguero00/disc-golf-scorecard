"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};


fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

Object.keys(db).forEach(modelName => {
  // Look for 'classMethods in the options object for the current model.
  if ('classMethods' in db[modelName].options) {
    // Look for 'associate' method in the 'classMethods' object of the current model.
    if ('associate' in db[modelName].options.classMethods) {
      // Call the assciate method on the current model.
      db[modelName].options.classMethods.associate(db);
    }
  }
});

module.exports = db;