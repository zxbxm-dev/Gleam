const chatRoomHandlers = require("../handlers/messageHandler");

module.exports = (io, socket) => {
  if (!socket) {
    console.error("Socket 객체가 정의되지 않았습니다.");
    return;
  }

  // 서버에서 메시지 전송 이벤트 처리 ( 단순 메신지 전송 / 알림에 활용 )
  socket.on("sendMessage", async ({ roomId, content }) => {
    await chatRoomHandlers.sendMessageToRoomParticipants(
      io,
      roomId,
      content,
      socket.id
    );
  });

  // 특정 채팅방의 과거 메시지 요청 처리
  socket.on("getChatHistory", async (roomId) => {
    await chatRoomHandlers.getChatHistory(socket, roomId);
  });
  
}