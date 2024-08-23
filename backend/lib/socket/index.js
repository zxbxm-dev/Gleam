const chatRoomEvents = require("./events/chatRoomEvents");
const messageEvents = require("./events/messageEvents");

// 사용자 소켓 관리 객체
const connectedUsers = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("새로운 사용자 연결:", socket.id);

    // 사용자 ID를 클라이언트로부터 받기 위한 이벤트 처리
    socket.on("registerUser", (userId) => {
      // 기존 사용자의 소켓이 있으면 해제
      if (connectedUsers[userId]) {
        // 기존 소켓을 찾아서 연결 해제
        connectedUsers[userId].disconnect(true); // true로 설정하면 클라이언트에게 연결 종료 신호 전송
      }

      // 새로운 소켓 등록
      connectedUsers[userId] = socket;
      console.log(`사용자 ${userId}의 소켓 등록 완료`);
    });

    // 채팅방 관련 이벤트 처리
    chatRoomEvents(io, socket);

    // 메시지 관련 이벤트 처리
    messageEvents(io, socket);

    // 연결 종료 처리
    socket.on("disconnect", () => {
      console.log("사용자가 연결을 종료함:", socket.id);

      // 연결 종료 시 사용자 ID를 찾고, 관리 객체에서 삭제
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
    });
  });
};