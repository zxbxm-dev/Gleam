const chatRoomHandlers = require("../handlers/chatRoomHandler");

module.exports = (io, socket) => {
  if (!socket) {
    console.error("Socket 객체가 정의되지 않았습니다.");
    return;
  }

  // 사용자의 채팅방 목록 요청 처리
  socket.on("getChatRooms", async (userId) => {
    try {
      if (!userId) {
        throw new Error("사용자 ID가 제공되지 않았습니다.");
      }
      await chatRoomHandlers.sendUserChatRooms(socket, userId);
    } catch (error) {
      console.error("채팅방 목록 요청 처리 오류:", error);
      socket.emit("error", { message: "채팅방 목록을 가져오는 중 오류가 발생했습니다." });
    }
  });

  // 새 채팅방 생성 요청 처리
  socket.on("createPrivateRoom", async (data) => {
    console.log("Received data:", data);
    try {
      if (!data || !data.userId || !data.content || !data.invitedUserIds) {
        throw new Error("필수 데이터가 누락되었습니다.");
      }
      await chatRoomHandlers.createPrivateRoom(io, socket, data);
    } catch (error) {
      console.error("채팅방 생성 요청 처리 오류:", error);
      socket.emit("error", { message: "채팅방 생성 중 오류가 발생했습니다." });
    }
  });

  // 채팅방 참여 요청 처리
  socket.on("joinRoom", async (roomId) => {
    try {
      if (!roomId) {
        throw new Error("방 ID가 제공되지 않았습니다.");
      }
      await chatRoomHandlers.joinRoom(socket, roomId);
    } catch (error) {
      console.error("채팅방 참여 요청 처리 오류:", error);
      socket.emit("error", { message: "채팅방 참여 중 오류가 발생했습니다." });
    }
  });

  // 채팅방에서 나가기 요청 처리
  socket.on("exitRoom", (roomId) => {
    try {
      if (!roomId) {
        throw new Error("방 ID가 제공되지 않았습니다.");
      }
      chatRoomHandlers.exitRoom(socket, roomId);
    } catch (error) {
      console.error("채팅방 나가기 요청 처리 오류:", error);
      socket.emit("error", { message: "채팅방 나가기 중 오류가 발생했습니다." });
    }
  });
};