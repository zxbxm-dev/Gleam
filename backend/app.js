const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const secure = require("express-force-https");
const cors = require("cors");
const http = require("http");

// 모델
const { sequelize } = require("./lib/models");

// Express와 HTTP 서버 설정
const app = express();
const server = http.createServer(app);

// 서버 설정 및 `io` 객체 생성 후
const io = require('socket.io')(server);

// 소켓 설정
require('./lib/socket/index')(io);

// 데이터베이스 연결
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error("데이터베이스 연결 실패:", err);
  });

// Express 설정
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(secure); // HTTPS 강제 리다이렉트
app.use(logger("dev")); // 요청 로깅
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: false })); // URL-encoded 데이터 파싱
app.use(cookieParser()); // 쿠키 파싱
app.use(express.static(path.join(__dirname, "public"))); // 정적 파일 제공

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

// 라우터 설정
const routers = [
  "user",
  "expense",
  "noticeBoard",
  "attendance",
  "workLog",
  "employment",
  "performance",
  "management",
  "meetingRoom",
  "pjschedule",
  "performanceOutline",
  "message",
  "email",
];

routers.forEach((route) => {
  require(`./lib/router/${route}`)(app);
});

// 404 에러 핸들러
app.use((req, res, next) => {
  next(createError(404));
});

// 오류 처리
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = { app, server };
