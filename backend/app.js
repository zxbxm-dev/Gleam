const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const secure = require("express-force-https");
const cors = require("cors");

// Socket.IO와 HTTP 서버 설정
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Sequelize 동기화
const { sequelize } = require("./lib/models");

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

// 리다이렉트 라이브러리
app.use(secure);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

// 라우터 불러오기
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
  "message"
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

// Socket.IO 이벤트 처리
io.on("connection", (socket) => {
  console.log("실시간 연결이 완료 되었습니다.");
  // 사용자가 특정 방에 참여
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`사용자가 방에 참여했습니다. ${roomId}`);
  });

  // 메신저 전송
  socket.on("sendMessage", async ({ content, roomId, userId }) => {
    try {
      // 메시지를 데이터베이스에 저장
      const Message = require("./lib/models").Message;
      const message = await Message.create({ content, roomId, userId });

      // 채팅방에 있는 모든 클라이언트에 메시지 전송
      io.to(roomId).emit("message", message);
    } catch (error) {
      console.error('실시간 메시지 보내기 오류:', error);
    }
  });

  // 사용자가 연결을 종료
  socket.on("disconnect", () => {
    console.log("사용자가 종료하였습니다.");
  });
});

module.exports = { app, server };
