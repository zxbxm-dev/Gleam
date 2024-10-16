const models = require("../../models");
const { MessageRead , Message, } = models;
const { countUnreadMessages } = require("../handlers/statusHandlers");

//새로운 메세지가 있을 때 - roomId가 있을 때 
const getNewMsg = async (socket, userId) => {
    try {
      const newMsg = await Message.findAll({
        include: [{
          model: MessageRead,
          required: false, // message, messageRead 테이블에 동시 포함되지 않는 데이터를 가져오게 설정
          where: {
            userId: userId,
          },
        }],
        having: Sequelize.literal('messageRead.messageId is null'), //읽지 않은 메세지 필터링
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
    getNewMsg,
    getUnreadMsg,
};