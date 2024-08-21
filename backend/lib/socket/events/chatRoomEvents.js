const chatRoomHandlers = require("../handlers/chatRoomHandler");

module.exports = (io, socket) => {
  if (!socket) {
    console.error("Socket 객체가 정의되지 않았습니다.");
    return;
  }

  // 사용자의 채팅방 목록 요청 처리
  socket.on("getChatRooms", async (userId) => {
    await chatRoomHandlers.sendUserChatRooms(socket, userId);
  });

  // 새 채팅방 생성 요청 처리
  socket.on("createPrivateRoom", async (data) => {
    await chatRoomHandlers.createPrivateRoom(io, socket, data);
  });

  // 채팅방 참여 요청 처리
  socket.on("joinRoom", async (roomId) => {
    await chatRoomHandlers.joinRoom(socket, roomId);
  });

  // 채팅방에서 나가기 요청 처리
  socket.on("exitRoom", (roomId) => {
    chatRoomHandlers.exitRoom(socket, roomId);
  });
};
