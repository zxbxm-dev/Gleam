const models = require("../../models");
const { Message, ChatRoomParticipant, User} = models;

// 특정 채팅방의 과거 메시지를 조회하는 함수
const getChatHistory = async (socket, roomId) => {
  try {
    const messages = await Message.findAll({
      where: { roomId: roomId },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ["userId", "username", "team"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    const chatHistory = messages.map(message => ({
      messageId: message.messageId,
      content: message.content,
      userId: message.User.userId,
      username: `${message.User.team} ${message.User.username}`,
      timestamp: message.createdAt,
    }));

    socket.emit("chatHistory", chatHistory);
  } catch (error) {
    console.error("채팅 기록 조회 오류:", error.message);
    socket.emit("error", { message: "채팅 기록 조회 오류 발생. 나중에 다시 시도해 주세요." });
  }
};


// 채팅방의 모든 참가자에게 메시지를 전송하는 함수
const sendMessageToRoomParticipants = async (io, roomId, content, senderId) => {
  try {
    const participants = await ChatRoomParticipant.findAll({
      where: { roomId },
    });

    if (participants.length === 0) {
      console.error("채팅방에 참여자가 없습니다.");
      return;
    }

    const savedMessage = await Message.create({
      content,
      userId: senderId,
      roomId,
    });

    // 저장된 메시지를 해당 채팅방의 참여자들에게 전송
    io.to(roomId.toString()).emit("message", {
      ...savedMessage.toJSON(),
      userId: senderId,
      timestamp: savedMessage.createdAt,
    });

    console.log("메시지가 저장되고, 채팅방에 전송되었습니다.");
  } catch (error) {
    console.error("메시지 전송 오류:", error);
  }
};

module.exports = {
  getChatHistory,
  sendMessageToRoomParticipants,
};
