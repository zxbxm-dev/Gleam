const notificationHandlers = require("../handlers/notificationHandlers")
const models = require("../../models");
const { Message, User, ChatRoomParticipant, ChatRoom, MessageRead } = models;

module.exports = (io, socket, connectedUsers) => {
    if(!socket) {
        console.error("Socket 객체가 정의되지 않았습니다.");
        return;
    }

//사용자에게 새로운 메세지가 전달됐을 때 
socket.on("getNewMsg",async (messageData) => {
    try{
        if(!messageData.senderId) {
            throw new Error("사용자 ID가 제공되지 않았습니다.");
        }

        const senderInfo = await ChatRoomParticipant.findOne({
            where: { userId : messageData.senderId },
            attributes: ["userId", "username", "department", "team", "position"],
          })
      
          const newMessage = await Message.findOne({
            roomId: messageData.roomId,
            userId: messageData.senderId,
            receiverId : messageData.receiverId,
            content: messageData.content,
          });

            messageData = {
            messageId: newMessage.messageId,
            content: newMessage.content,
            roomId: newMessage.roomId,
            senderId: newMessage.userId,
            receiverId: newMessage.receiverId,
            timestamp: newMessage.createdAt,
            fileValue: newMessage.filePath ? 1 : 0,
            senderUsername: senderInfo.dataValues.username,
            senderDepartment: senderInfo.dataValues.department,
            senderTeam: senderInfo.dataValues.team,
            senderPosition: senderInfo.dataValues.position,
          };
      
        await notificationHandlers.getNewMsg(socket, messageData, connectedUsers)

    }catch(error) {
        console.error("메세지알림 요청 처리 중 에러 발생 : ", error);
        socket.emit("error", { message: "메세지알림을 가져오는 중 오류가 발생했습니다."});
    }
});

//통합알람이 왔을 때 
// socket.on("getIntegratedNoti", async (smthing) => {
//     try{

//     }catch(error)
// })

};
