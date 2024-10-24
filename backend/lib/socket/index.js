const chatRoomEvents = require("./events/chatRoomEvents");
const messageEvents = require("./events/messageEvents");
const notificationEvent = require("./events/notificationEvent");
const statusEvents = require("./events/statusEvents");

// 사용자 소켓 관리 객체
const connectedUsers = {};

console.log("객체상태 관리: ",connectedUsers)

module.exports = (io) => {
  io.on("connection", (socket) => {
    // console.log("새로운 사용자 연결:", socket.id);

    // 사용자 ID를 클라이언트로부터 받기 위한 이벤트 처리
    socket.on("registerUser", (userId) => {
      if (!userId || typeof userId !== 'string') {
        console.error("유효하지 않은 사용자 ID:", userId);
        return socket.emit("error", { message: "유효하지 않은 사용자 ID입니다." });
      }
      console.log('================',userId)

      // 기존 사용자의 소켓이 있으면 해제
      if (connectedUsers[userId]) {
        connectedUsers[userId].disconnect(true); // true로 설정하면 클라이언트에게 연결 종료 신호 전송
      }

      // 새로운 소켓 등록
      connectedUsers[userId] = socket;
      console.log(`사용자 ${userId}의 소켓 등록 완료`);
      
      Object.keys(connectedUsers).forEach(key => {
        console.log('등록된 사용자 명',key)
      })
      console.log(connectedUsers)
    });

    // 채팅방 관련 이벤트 처리
    try {
      chatRoomEvents(io, socket);
      messageEvents(io, socket);
      statusEvents(io, socket);
      notificationEvent(io, socket);
    } catch (error) {
      console.error("이벤트 처리 중 오류 발생:", error);
      socket.emit("error", { message: "이벤트 처리 서버 오류" });
    }

    // 연결 종료 처리
    socket.on("disconnect", () => {
      console.log("사용자가 연결을 종료함:", socket.id);

      for (const [userId, userSocket] of Object.entries(connectedUsers)) {
        if (userSocket === socket) {
          delete connectedUsers[userId];
          console.log(`사용자 ${userId}의 소켓 연결 해제`);
          break;
        }
      }
    });

    // 에러 처리
    socket.on("error", (err) => {
      console.error("소켓 에러:", err);
      socket.emit("error", { message: "소켓 통신 오류 발생" });
    });

    // //네임스페이스 등록
    // const noti = io.of('/notification');

    // //noti 네임스페이스 전용 이벤트 
    // noti.on('connection', (socket) => {
    //   console.log('noti 네임스페이스에 접속');

    //   require('../../lib/socket/events/notificationEvent')(noti, socket);
      
    // });
  });
};