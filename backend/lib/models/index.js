const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

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
const evalOutline = require("./performance/performanceOutline");
// 인사 정보 관리
const management = require("./management/management");
// 인사 이동
const Transfer = require("./management/personnel_transfer");
// 채용공고
const jobPosting = require("./employment/JobPosting");
//회의실
const meetingRoom = require("./meetingRoom/meetingRoom");
//프로젝트
const mainProject = require("./pjschedule/mainProject");
const subProject = require("./pjschedule/subProject");
//채팅방
const chatRoom = require("./messenger/chatRoom");
const message = require("./messenger/message");
//이메일
const email = require("./email/email");


const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

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
db.evalOutline = evalOutline(sequelize, Sequelize);
db.TransferPosition = Transfer(sequelize, Sequelize);
db.Management = management(sequelize, Sequelize);
db.Meeting = meetingRoom(sequelize, Sequelize);
db.mainProject = mainProject(sequelize, Sequelize);
db.subProject = subProject(sequelize, Sequelize);
db.ChatRoom = chatRoom(sequelize, Sequelize);
db.Message = message(sequelize, Sequelize);
db.email = email(sequelize, Sequelize);


// 모델 관계 설정
// 프로젝트 관계 설정
db.mainProject.hasMany(db.subProject, {
  foreignKey: "mainprojectIndex",
  onDelete: "cascade",
});
db.subProject.belongsTo(db.mainProject, {
  foreignKey: "mainprojectIndex",
  onDelete: "cascade",
});

// 메신저 관계 설정
db.Message.belongsTo(db.ChatRoom, { foreignKey: 'roomId' });
db.ChatRoom.hasMany(db.Message, { foreignKey: 'roomId' });

module.exports = db;
