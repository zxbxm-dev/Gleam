const chatRoomHandler = require("../socket/handlers/chatRoomHandler")


//socket 채팅방 참여 
const socketJoinChatRoom = async ( socket, roomId ) => {
    try{
     socket.join(roomId);
     console.log(`ChatRoom : ${roomId}번`);
     return roomId;
    }catch(error){
     console.error("socket Join 처리 중 오류가 발생했습니다.", error);
     socket.emit("error", { message: "socket Join 처리에 실패했습니다."});
    }
 };

 //socket 채팅방 참여 - roomId 없을 때 
const socketJoinNoRoomId = async ( socket, userId ) => {
    try{
      const roomId = chatRoomHandler.getNextRoomId();
      socket.join(roomId);
      console.log(`사용자가 ${roomId}번 채팅방에 참여했습니다.`);
    }catch(error){
      console.error("socket Join 처리 중 오류가 발생했습니다.", error );
      socket.emit("error", {message : "socket Join 처리 중 오류가 발생했습니다."});
    }
  }

  //기존 연결되어있던 socketJoin 해제 처리 - 모듈 추가
  const socketJoinRemove = async(socket, roomId) => {

  const currentJoinSocketRoom = Array.from(socket.rooms);
  for(const roomId of currentJoinSocketRoom ) {
    if(actualRoomId !== roomId){
      socket.leave(roomId);
    };
  };
  console.log("Joined Room: ", Array.from(socket.rooms ));

  };
  

  module.exports = {
    socketJoinChatRoom,
    socketJoinNoRoomId,
  }