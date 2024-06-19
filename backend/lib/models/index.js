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
//연차관리 (관리자)
const annualLeaveData = require("./attendance/annualLeave");



const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = userData(sequelize, Sequelize);
db.Quitter = quitterUser(sequelize, Sequelize);
db.Expenses = expenses(sequelize, Sequelize);
db.Notice = noticeBoard(sequelize, Sequelize);
db.AnnualLeave = annualLeaveData(sequelize, Sequelize);

// 관계 설정
if (db.User.associate) {
    db.User.associate(db);
  }
  if (db.AnnualLeave.associate) {
    db.AnnualLeave.associate(db);
  }


module.exports = db;
