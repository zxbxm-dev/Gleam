const messageHandlers = require("../handlers/messageHandler");

module.exports = (io, socket) => {
  if (!socket) {
    console.error("Socket 객체가 정의되지 않았습니다.");
    return;
  }

  // 사용자의 채팅방 메시지 조회 처리
  socket.on("fetchMessages", async (data) => {
    await messageHandlers.fetchMessages(socket, data);
  });
};
