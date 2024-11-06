// const socket = require("..");
const models = require("../../models");
const message = require("../../models/messenger/message");
const { Message, User } = models;

//새로운 메세지가 있을 때
const getNewMsg = async (socket, messageData, connectedUsers) => {
    try {

      //수신자 정보 유효성 검사  
      const existUser = await User.findOne ({
      where : {
        userId : messageData.receiverId,
      }
     });
     if(!existUser){
      console.log("사용자 정보를 찾을 수 없습니다.");
      console.error("사용자 정보 조회 오류 :", error);
      return;
     }

     //수신자의 socketId 
     const receiverSocketId = connectedUsers[messageData.receiverId]; 
     
      // 수신자의 온라인 여부를 확인하는 코드
      if(Object.keys(connectedUsers).includes(messageData.receiverId)){
        await onlineUser( receiverSocketId, messageData);
      }else(
        await offlineUser(receiverSocketId, messageData)
      );

    } catch (error) {
      socket.emit("error", {
        message: "수신자 온라인 여부 확인 처리 중 오류 발생",
        details: error.message,
      });
    }
  }; 
  
  //온라인 사용자에게 알림
const onlineUser = async (socket, messageData) =>{
  const currentJoinSocketRoom = Array.from(socket.rooms || []);

  //수신인이 채팅방에 접속 중인지 확인하는 조건 
  try{
     if(messageData.roomId !== currentJoinSocketRoom[0]){
    console.log("🔔새로운 알림이 도착했습니다.")
    socket.emit("notiForOnline", messageData);
    socket.emit("googleNoti", messageData);
     }   
  }catch(error){
    console.error("메세지 알림 전송 중 에러 발생 : ", error);
    socket.emit("error", { message: "메세지 알림 전송 중 오류가 발생했습니다."})
  }
};

//오프라인 사용자에게 알림
const offlineUser = async (socket, messageData) => {
  try{
    console.log("🔔새로운 알림이 도착했습니다.");
    socket.emit("notiForOffline", messageData);
  }catch(error){
    console.error("메세지 알림 전송 중 에러 발생 : ", error);
    socket.emit("error", { message: "메세지 알림 전송 중 오류가 발생했습니다."})
  }

};

module.exports = {
    getNewMsg,
    onlineUser,
    offlineUser,
};