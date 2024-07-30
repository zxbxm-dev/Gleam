const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const secure = require("express-force-https");
const cors = require("cors");

const app = express();

// 리다이렉트 라이브러리
app.use(secure);

//sequlize 동기화
const { sequelize } = require("./lib/models");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터 베이스 연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

// 옵션 설정
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// 클라이언트 연결
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

// 라우터 불러오기
require("./lib/router/user")(app);
require("./lib/router/expense")(app);
require("./lib/router/noticeBoard")(app);
require("./lib/router/attendance")(app);
require("./lib/router/workLog")(app);
require("./lib/router/employment")(app);
require("./lib/router/performance")(app);
require("./lib/router/management")(app);
require("./lib/router/meetingRoom")(app);
require("./lib/router/pjschedule")(app);
require("./lib/router/performanceOutline")(app);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 404에러 핸들러
app.use(function (req, res, next) {
  next(createError(404));
});

// 오류 처리
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // 에러페이지 랜딩
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
