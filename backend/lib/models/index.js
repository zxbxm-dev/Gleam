const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

// 유저관리
const userData = require("./user/user");
const quitterUser = require("./user/quitter");
// 운영비관리
const expenses = require("./expense/costOperation");
// 게시판관리
const noticeBoard = require("./noticeBoard/noticeBoard");



const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.userData = userData(sequelize, Sequelize);
db.quitterUser = quitterUser(sequelize, Sequelize);
db.expenses = expenses(sequelize, Sequelize);
db.noticeBoard = noticeBoard(sequelize, Sequelize);

module.exports = db;
