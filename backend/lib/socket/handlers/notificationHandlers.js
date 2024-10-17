const models = require("../../models");
const { MessageRead , Message, ChatRoomParticipant } = models;
const { countUnreadMessages } = require("../handlers/statusHandlers");
const { findMutualChatRoomsForUsers } = require("../handlers/messageHandler");
const { Op } = require("sequelize");

//메세지의 sender와 receiver의 정보를 받는 함수 
const requestUserData = async( socket, roomId, sender, receiver) => {
    try{
        const msgSender = sender;
        const msgReceiver = receiver;
        console.log(`채팅방ID : ${roomId}, 보낸사람ID: ${msgSender}, 받는사람 ID: ${msgReceiver}`);

        socket.emit("userDataResponse", {
          message: ` 채팅방 ID : ${roomId},
                     보낸사람 ID : ${msgSender}.
                     받는사람 ID : ${msgReceiver}`
        })
      }catch(error) {
        socket.emit("error",{
          message: "채팅방 사용자 정보 처리 중 오류 발생",
          details : error.message,
        })
      }
    }

//새로운 메세지가 있을 때
const getNewMsg = async (socket, userId, roomId) => {
    try {
      const receiver = userId;
      await requestUserData(socket, roomId, sender, receiver); 
      const newMsg = await Message.findAll({
        where: {
          roomId : roomId,
          userId : sender,
        },
        include: [{
          model: MessageRead,
          required: false,  // MessageRead 테이블에 데이터가 없어도 메시지를 가져오게 설정 (LEFT JOIN)
          where: {
            userId: receiver,  // 메시지를 받는 사람 (receiver)의 ID
          },
        }],
      });
  
      if (newMsg.length > 0) {
        socket.emit("newMsgNoti", {
          message: `${newMsg.length}개의 새로운 메세지가 있습니다.`,
          messages: newMsg 
        });
      } else {
        console.log("새로운 메시지가 없습니다.");
      }
      return newMsg; // 읽지 않은 새로운 메시지 반환
    } catch (error) {
      socket.emit("error", {
        message: "새로운 메세지 알림 처리 중 오류 발생",
        details: error.message,
      });
    }
  };  

//읽지 않은 메세지가 있을 때 
const getUnreadMsg = async (socket, userId, roomId) => {

    try{
       const receiver = userId;
        await requestUserData(socket, roomId, sender, receiver);
        const unreadMessages = await countUnreadMessages(userId, roomId);
        if(unreadMessages.length > 0 ){
            socket.emit("unreadNoti", {
                message : `${unreadMessages.length}개의 안읽은 메세지가 있습니다.`,
                roomId: roomId,
                unreadMessages : unreadMessages
            });
        }
    }catch(error){
        socket.emit("error", {
            message: "읽지 않은 메세지 알림 처리 중 오류 발생",
            details: error.message,
        })
    };
};

module.exports = {
    requestUserData,
    getNewMsg,
    getUnreadMsg,
};