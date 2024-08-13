const { ChatRoom, Message } = require('../models');

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("사용자가 연결되었습니다.");

    // 개인 채팅방 생성 및 메시지 저장
    socket.on("createPrivateRoom", async (data) => {
      try {
        const { userID, message, TargetID, chatAdmin, PrivateTitle, Targetinfo } = data;

        // 채팅방이 존재하지 않으면 생성
        let chatRoom = await ChatRoom.findOne({
          where: {
            [Op.or]: [
              { hostUserId: userID, invitedUserIds: { [Op.contains]: [TargetID] } },
              { hostUserId: TargetID, invitedUserIds: { [Op.contains]: [userID] } }
            ]
          }
        });

        if (!chatRoom) {
          chatRoom = await ChatRoom.create({
            name: PrivateTitle || null,
            isGroup: false,
            hostUserId: userID,
            invitedUserIds: [TargetID]
          });
        }

        // 메시지를 데이터베이스에 저장
        const savedMessage = await Message.create({
          content: message,
          userId: userID,
          roomId: chatRoom.roomId
        });

        // 채팅방에 있는 모든 클라이언트에 메시지 전송
        io.to(chatRoom.roomId).emit("message", {
          ...savedMessage.toJSON(),
          userID,
          timestamp: savedMessage.timestamp
        });

        console.log("개인 채팅방이 생성되었고, 메시지가 저장되었습니다.");
      } catch (error) {
        console.error('채팅방 생성 및 메시지 저장 오류:', error);
      }
    });

    // 사용자가 특정 방에 참여
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`사용자가 방에 참여했습니다. ${roomId}`);
    });

    // 사용자가 메시지를 보냄
    socket.on("sendMessage", async ({ content, roomId, userId }) => {
      try {
        // 메시지를 데이터베이스에 저장
        const message = await Message.create({ content, roomId, userId });

        // 채팅방에 있는 모든 클라이언트에 메시지 전송
        io.to(roomId).emit("message", {
          ...message.toJSON(),
          timestamp: message.timestamp
        });
      } catch (error) {
        console.error('메시지 전송 오류:', error);
      }
    });

    // 사용자가 연결을 종료
    socket.on("disconnect", () => {
      console.log("사용자가 종료하였습니다.");
    });
  });
};
