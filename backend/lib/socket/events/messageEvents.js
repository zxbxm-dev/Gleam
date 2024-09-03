const messageHandlers = require("../handlers/messageHandler");

module.exports = (io, socket) => {
  if (!socket) {
    console.error("Socket 객체가 정의되지 않았습니다.");
    return;
  }

  // 서버에서 메시지 전송 이벤트 처리
  socket.on("sendMessage", async ({ roomId, content }) => {
    await messageHandlers.sendMessageToRoomParticipants(
      io,
      roomId,
      content,
      socket.id
    );
  });

  // 특정 채팅방의 과거 메시지 요청 처리
  socket.on("getChatHistory", async (roomId) => {
    await messageHandlers.getChatHistory(socket, roomId);
  });

  // 개인 메시지 기록 요청 처리
  socket.on('personCheckMsg', async ({ selectedUserId, userId }) => {
    try {
      console.log(`사용자의 채팅 기록을 가져오는 중 ${selectedUserId}`);
      await messageHandlers.getChatHistoryForUser(socket, selectedUserId, userId);
    } catch (error) {
      console.error("personCheckMsg 이벤트 처리 오류:", error.message);
      socket.emit("error", { message: "채팅 기록 조회 오류 발생. 나중에 다시 시도해 주세요." });
    }
  });

  // 메세지 실시간 화면 노출
  socket.on("broadcastNewMessage", async ({ roomId, content }) => {
    try {
      // 클라이언트에서의 새로운 메시지를 방송
      await messageHandlers.broadcastNewMessage(io, roomId, content, socket.id);
    } catch (error) {
      console.error("broadcastNewMessage 이벤트 처리 오류:", error.message);
      socket.emit("error", { message: "메시지 전송 오류 발생. 나중에 다시 시도해 주세요." });
    }
  });

//   // 나와의 채팅방이 있을 때만 메시지를 보여주기 위한 이벤트 핸들러
//   socket.on("noChatRoomsForUser", () => {
//     // 나와의 채팅방이 없을 때 클라이언트에 알림
//     socket.emit("noChatRoomsForUser", { message: "자신과의 채팅방이 없습니다." });
//   });

//   // 다른 사용자의 채팅 기록을 가져올 때 공통 채팅방이 없을 경우
//   socket.on("noMutualChatRooms", () => {
//     // 공통 채팅방이 없을 때 클라이언트에 알림
//     socket.emit("noMutualChatRooms", { message: "공통 채팅방이 없습니다." });
//   });
};