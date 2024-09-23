const statusHandlers = require("../handlers/StatusHandlers");

module.exports = (io, socket) => {
  if (!socket) {
    console.error("Socket 객체가 정의되지 않았습니다.");
    return;
  }

  // 메시지 읽음 상태 기록 이벤트 처리
  socket.on("markMessageAsRead", async ({ messageId, userId }) => {
    await statusHandlers.markMessageAsRead(socket, messageId, userId);
  });

  // 특정 메시지의 읽음 상태 요청 이벤트 처리
  socket.on("getReadStatus", async (messageId) => {
    await statusHandlers.getReadStatus(socket, messageId);
  });

  // 읽지 않은 메시지 개수 요청 이벤트 처리 (추가)
  socket.on("countUnreadMessages", async ({ userId, roomId }) => {
    await statusHandlers.countUnreadMessages(socket, userId, roomId);
  });
};
