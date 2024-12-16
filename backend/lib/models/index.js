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
const ReportOpinion = require("./workLog/workLogOpinion");
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
const chatRoomParticipant = require("./messenger/chatRoomParticipant");
const messageRead = require("./messenger/messageRead");
//이메일
const email = require("./email/email");
const emailAttachments= require("./email/emailAttachments");  
const junkList = require("./email/JunkList");     
const emailAction = require("./email/emailAction");
//문서번호 관리 
const docNumManagement = require("./management/docNumManagement");

const db = {};

// 모델 정의 및 관계 설정
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 모델 로드
db.User = userData(sequelize, Sequelize);
db.Quitter = quitterUser(sequelize, Sequelize);
db.Expenses = expenses(sequelize, Sequelize);
db.Notice = noticeBoard(sequelize, Sequelize);
db.AnnualLeave = annualLeaveData(sequelize, Sequelize);
db.Attendance = attendance(sequelize, Sequelize);
db.Report = report(sequelize, Sequelize);
db.ReportOpinion = ReportOpinion(sequelize, Sequelize);
db.JobPosting = jobPosting(sequelize, Sequelize);
db.Evaluation = evaluation(sequelize, Sequelize);
db.evalOutline = evalOutline(sequelize, Sequelize);
db.TransferPosition = Transfer(sequelize, Sequelize);
db.Management = management(sequelize, Sequelize);
db.Meeting = meetingRoom(sequelize, Sequelize);
db.mainProject = mainProject(sequelize, Sequelize);
db.subProject = subProject(sequelize, Sequelize);
db.ChatRoom = chatRoom(sequelize, Sequelize);
db.ChatRoomParticipant = chatRoomParticipant(sequelize, Sequelize);
db.Message = message(sequelize, Sequelize);
db.MessageRead = messageRead(sequelize, Sequelize);
db.Email = email(sequelize, Sequelize);
db.EmailAttachment = emailAttachments(sequelize, Sequelize);
db.JunkList = junkList(sequelize, Sequelize);
db.EmailAction = emailAction(sequelize, Sequelize);
db.docNumManagement = docNumManagement(sequelize, Sequelize);

// 모델 관계 설정
// 프로젝트 관계 설정
db.mainProject.hasMany(db.subProject, { foreignKey: "mainprojectIndex", onDelete: "cascade" });
db.subProject.belongsTo(db.mainProject, { foreignKey: "mainprojectIndex", onDelete: "cascade" });

// 메신저 관계 설정
// User와 Message 간의 관계 설정
db.User.hasMany(db.Message, { foreignKey: "userId", as: "Messages" });
db.Message.belongsTo(db.User, { foreignKey: "userId", as: "User" });

// ChatRoom과 Message 간의 관계 설정
db.ChatRoom.hasMany(db.Message, { foreignKey: "roomId" });
db.Message.belongsTo(db.ChatRoom, { foreignKey: "roomId" });

// ChatRoom과 ChatRoomParticipant 간의 관계 설정
db.ChatRoom.hasMany(db.ChatRoomParticipant, { foreignKey: "roomId" });
db.ChatRoomParticipant.belongsTo(db.ChatRoom, { foreignKey: "roomId" });

// User와 ChatRoomParticipant 간의 관계 설정
db.User.hasMany(db.ChatRoomParticipant, { foreignKey: "userId" });
db.ChatRoomParticipant.belongsTo(db.User, { foreignKey: "userId" });

// ChatRoomParticipant와 Message 간의 관계 설정
db.ChatRoomParticipant.hasMany(db.Message, { foreignKey: "userId" });
db.Message.belongsTo(db.ChatRoomParticipant, { foreignKey: "userId", as: "Participant" });

//Email 과 EmailAttachments 간의 관계설정 
db.Email.hasMany(db.EmailAttachment, { foreignKey: "emailId", onDelete: "cascade" });
db.EmailAttachment.belongsTo(db.Email, { foreignKey: "emailId", onDelete: "cascade" });

// 메신저 읽음 상태 표시 관계설정
db.Message.hasMany(db.MessageRead, { foreignKey: "messageId", as: "reads" });
db.MessageRead.belongsTo(db.Message, { foreignKey: "messageId", as: "message" });

// User와 MessageRead 간의 관계 설정
db.User.hasMany(db.MessageRead, { foreignKey: "userId", as: "reads" });
db.MessageRead.belongsTo(db.User, { foreignKey: "userId", as: "user" });

//보고서 관계 설정
//Report와 reportOpinion 간의 관계 설정
db.Report.hasMany(db.ReportOpinion, { foreignKey: "reportId", as: "opinion"});
db.ReportOpinion.belongsTo(db.Report, { foreignKey: "reportId", as: "report"});

module.exports = db;
