// const socket = require("..");
const models = require("../../models");
const { Message } = models;

//새로운 메세지가 있을 때
const getNewMsg = async (socket, messageData, connectedUsers) => {
    try {

      //수신자의 온라인 여부를 확인하는 코드
      if(Object.keys(connectedUsers).includes(messageData.receiverId)){
        await onlineUser(socket, messageData);
      }else(
        await offlineUser(socket, messageData)
      );

      //새로운 메세지 알람 
      const messageId = messageData.messageId;
      const receiver = messageData.receiverId;

      const newMsg = await Message.findAll({
      where:{
        messageId : messageId,
        receiverId : receiver,
      },
    });

      if (newMsg) {
        socket.emit("newMsgNoti", {
          message: `새로운 메세지가 있습니다.`,
          messages: newMsg          
        });
      } else {
        console.log("새로운 메시지가 없습니다.");
      }

      return newMsg;
    
    } catch (error) {
      socket.emit("error", {
        message: "새로운 메세지 알림 처리 중 오류 발생",
        details: error.message,
      });
    }
  }; 
  
  //온라인 사용자에게 알림
const onlineUser = async (socket, messageData) =>{
  try{
    console.log("🔔새로운 알림이 도착했습니다.")
    socket.emit("notiForOnline", messageData);
   
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