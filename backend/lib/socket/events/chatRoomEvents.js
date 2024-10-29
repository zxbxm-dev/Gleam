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

  //특정 채팅방 socket 참여 처리 - roomId 가 있을 때 
  socket.on("socketJoinChatRoom", async (roomId) => {
    try{
      if(!roomId){
        throw new Error("참여자의 방 정보가 제공되지 않았습니다.");
      }
      await chatRoomHandlers.socketJoinChatRoom(socket, roomId);
      console.log(`사용자가 ${roomId}에 참여했습니다.`);
      //socket.emit("joinedRoom", { roomId });
    }catch(error) {
      console.error("socket Join 처리에 실패했습니다." , error);
      socket.emit("error", {message: "socket Join 처리에 실패했습니다."});
    };
  })

  //특정 채팅방 socket 참여 처리 - roomId가 없을 때
  socket.on("socketJoinNoRoomId", async(userId) => {
    try{
      if(!userId){
        throw new Error("사용자 정보를 찾을 수 없습니다.");
      }
      await chatRoomHandlers.socketJoinNoRoomId(socket, userId);
      console.log(`${userId}가 새로운 채팅방을 생성했습니다.`);  // ...
    }catch(error) {
      console.error("socket Join 처리에 실패했습니다.");
      socket.emit("error", {message: "socket Join 처리에 실패했습니다."});
    }
  })

  // 새 채팅방 생성 요청 처리
  socket.on("createPrivateRoom", async (data) => {
    console.log("Received data:", data);
    try {
      if (!data || !data.userId || typeof data.content !== 'string' || !data.invitedUserIds) {

        throw new Error("필수 데이터가 누락되었습니다.");
      }
      await chatRoomHandlers.createPrivateRoom(io, socket, data);
    } catch (error) {
      console.error("채팅방 생성 요청 처리 오류:", error);
      socket.emit("error", { message: "채팅방 생성 중 오류가 발생했습니다." });
    }
  });

  // 채팅방 참여 요청 처리
  socket.on("joinRoom", async (roomId, userIds) => {
    try {
      if (!roomId) {
        throw new Error("방 ID가 제공되지 않았습니다.");
      }
      await chatRoomHandlers.joinRoom(io, socket, roomId, userIds);
    } catch (error) {
      console.error("채팅방 참여 요청 처리 오류:", error);
      socket.emit("error", { message: "채팅방 참여 중 오류가 발생했습니다." });
    }
  });

  // 채팅방 내보내기 요청 처리
  socket.on("KickRoom", async ({ roomId, userId }) => {
    try {
      if (!roomId) {
        throw new Error("방 ID가 제공되지 않았습니다.");
      }

      await chatRoomHandlers.kickOutFromRoom(io, socket, roomId, userId);
    } catch (error) {
      console.error("채팅방 내보내기 요청 처리 오류:", error);
      socket.emit("error", { message: "채팅방 내보내기 중 오류가 발생했습니다." });
    }
  });

  // 채팅방에서 나가기 요청 처리
  socket.on("exitRoom", async (roomId, userId) => {
    try {
      if (!roomId || !userId) {
        throw new Error("방 ID 또는 사용자 ID가 제공되지 않았습니다.");
      }

      // 채팅방 나가기 처리
      await chatRoomHandlers.exitRoom(io, socket, { roomId, userId });

      console.log(`User ${userId} left room ${roomId}`);

    } catch (error) {
      console.error("채팅방 나가기 요청 처리 오류:", error.message);

      // 에러 메시지를 클라이언트로 보냄
      socket.emit("error", { message: error.message });
    }
  });

  // socket leave 처리 
  socket.on("socketLeave", async ( socket, {roomId, userId} ) => {
    try{
    if(!userId || !roomId) {
      throw new Error("방 ID 또는 사용자 ID가 제공되지 않았습니다.");
    }
    await chatRoomHandlers.socketLeave(socket, roomId, userId);
    console.log(`사용자 socket이 ${roomId}번 채팅방에서 해제되었습니다.`);
    
    }catch(error){
    console.error("socket 해제 처리 중 오류가 발생했습니다.", error);
    socket.emit("error", { message: "socket 해제 처리 중 오류가 발생했습니다."});
    } 
  });
};