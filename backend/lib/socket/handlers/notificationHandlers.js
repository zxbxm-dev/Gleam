// const socket = require("..");
const models = require("../../models");
const { Message } = models;

//새로운 메세지가 있을 때
const getNewMsg = async (socket, messageData) => {
    try {
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

// //읽지 않은 메세지가 있을 때 
// const getUnreadMsg = async (socket, userId, roomId) => {

//     try{
//        const unreadMessages = await countUnreadMessages(socket, userId, roomId);

//         if(unreadMessages.length > 0 ){
//             socket.emit("unreadNoti", {
//                 message : `${unreadMessages.length}개의 안읽은 메세지가 있습니다.`,
//                 roomId: roomId,
//                 unreadMessages : unreadMessages
//             });
//         }
        
//     }catch(error){
//         socket.emit("error", {
//             message: "읽지 않은 메세지 알림 처리 중 오류 발생",
//             details: error.message,
//         })
//     };
// };

module.exports = {
    getNewMsg,
    // getUnreadMsg,
};