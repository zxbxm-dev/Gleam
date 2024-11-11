const messageHandlers = require("../handlers/messageHandler");

module.exports = (io, socket, connectedUsers) => {
  if (!socket) {
    console.error("Socket 객체가 정의되지 않았습니다.");
    return;
  }

  // 서버에서 메시지 전송 이벤트 처리
  socket.on("sendMessage", async (data) => {
  try {
    await messageHandlers.sendMessageToRoomParticipants(io, socket, data.roomId, data.content, data.senderId, data.receiverId, connectedUsers);
  } catch (error) {
    console.error(`메시지 전송 중 오류 발생: ${error.message}`);
    socket.emit("error", { message: error.message });
  }
});

  // 특정 채팅방의 과거 메시지 요청 처리
  socket.on("getChatHistory", async (roomId, requesterId) => {
    await messageHandlers.getChatHistory(socket, roomId, requesterId);
  });

  // 개인 메시지 기록 요청 처리
  socket.on("personCheckMsg", async ({ selectedUserId, requesterId }) => {
    try {
      console.log(`사용자의 채팅 기록을 가져오는 중 ${selectedUserId}`);
      await messageHandlers.getChatHistoryForUser(
        io,
        socket,
        selectedUserId,
        requesterId
      );
    } catch (error) {
      console.error("personCheckMsg 이벤트 처리 오류:", error.message);
      socket.emit("error", {
        message: "채팅 기록 조회 오류 발생. 나중에 다시 시도해 주세요.",
      });
    }
  });

  // 그룹 채팅방 과거 메시지 요청 처리
  socket.on("getGroupChatHistory", async (roomId) => {
    try {
      await messageHandlers.getGroupChatHistory(socket, roomId);
    } catch (error) {
      console.error("getGroupChatHistory 이벤트 처리 오류:", error.message);
      socket.emit("error", {
        message: "그룹 채팅 기록 조회 오류 발생. 나중에 다시 시도해 주세요.",
      });
    }
  });

  // 메세지 실시간 화면 노출
  socket.on("broadcastNewMessage", async ({ roomId, content }) => {
    try {
      // 클라이언트에서의 새로운 메시지를 방송
      await messageHandlers.broadcastNewMessage(io, roomId, content, socket.id);
    } catch (error) {
      console.error("broadcastNewMessage 이벤트 처리 오류:", error.message);
      socket.emit("error", {
        message: "메시지 전송 오류 발생. 나중에 다시 시도해 주세요.",
      });
    }
  });
};
