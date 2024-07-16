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
// 근태관리
const annualLeaveData = require("./attendance/annualLeave");
const attendance = require("./attendance/officeHour");
// 보고서
const report = require("./workLog/workLog");
// 인사평가
const evaluation = require("./performance/performance");
// 인사 정보 관리
const management = require("./management/management");
// 인사 이동
const Transfer = require("./management/personnel_transfer");
// 채용공고
const jobPosting = require("./employment/JobPosting");
//회의실
const meetingRoom = require('./meetingRoom/meetingRoom');

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = userData(sequelize, Sequelize);
db.Quitter = quitterUser(sequelize, Sequelize);
db.Expenses = expenses(sequelize, Sequelize);
db.Notice = noticeBoard(sequelize, Sequelize);
db.AnnualLeave = annualLeaveData(sequelize, Sequelize);
db.Attendance = attendance(sequelize, Sequelize);
db.Report = report(sequelize, Sequelize);
db.JobPosting = jobPosting(sequelize, Sequelize);
db.Evaluation = evaluation(sequelize, Sequelize);
db.TransferPosition = Transfer(sequelize, Sequelize);
db.Management = management(sequelize, Sequelize);
db.Meeting = meetingRoom(sequelize, Sequelize);

module.exports = db;
