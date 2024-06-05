const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const userData = require("./user/user");
const quitterUser = require("./user/quitter");

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.userData = userData(sequelize, Sequelize);
db.quitterUser = quitterUser(sequelize, Sequelize);

module.exports = db;
