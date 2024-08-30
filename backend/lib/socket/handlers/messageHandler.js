const models = require("../../models");
const { Message, User, ChatRoomParticipant } = models;

// 사용자와 관련된 채팅방을 찾는 함수 . getChatHistoryForUser에 사용-------------------------------------------------------------
const findChatRoomsForUser = async (userId) => {
  try {
    console.log(`findChatRoomsForUser 호출됨: userId=${userId}`);
    
    const chatRooms = await ChatRoomParticipant.findAll({
      where: { userId },
      attributes: ['roomId'],
    });

    const roomIds = chatRooms.map(participant => participant.roomId);
    console.log(`사용자 ${userId}와 관련된 채팅방 ID들: ${roomIds}`);
    
    return roomIds;
  } catch (error) {
    console.error("채팅방 조회 오류:", error.message);
    throw new Error("채팅방 조회 오류");
  }
};

// 선택한 사용자와 관련된 채팅방의 과거 메시지를 조회하는 함수  -----------------------------------------------------------------------
const getChatHistoryForUser = async (socket, selectedUserId, requesterId) => {
  try {
    console.log(`getChatHistoryForUser 호출됨: selectedUserId=${selectedUserId}, requesterId=${requesterId}`);
    
    // 선택한 사용자와 관련된 채팅방 찾기
    const chatRoomIds = await findChatRoomsForUser(selectedUserId);

    if (chatRoomIds.length === 0) {
      console.log(`선택한 사용자 ${selectedUserId}와 관련된 채팅방이 없음.`);
      socket.emit("chatHistory", []);
      return;
    }

    console.log(`선택한 사용자 ${selectedUserId}의 채팅방 ID들: ${chatRoomIds}`);

    // 메시지 조회
    const messages = await Message.findAll({
      where: { roomId: chatRoomIds },
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

    console.log(`채팅 기록 전송: ${chatHistory.length}개 메시지`);
    // 클라이언트로 채팅 기록 전송
    socket.emit("chatHistory", chatHistory);
  } catch (error) {
    console.error("채팅 기록 조회 오류:", error.message);
    socket.emit("error", { message: "채팅 기록 조회 오류 발생. 나중에 다시 시도해 주세요." });
  }
};

// 특정 채팅방의 과거 메시지를 조회하는 함수  -----------------------------------------------------------------------
const getChatHistory = async (socket, roomId) => {
  try {
    console.log(`getChatHistory 호출됨: roomId=${roomId}`);

    const messages = await Message.findAll({
      where: { roomId },
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

    console.log(`채팅 기록 전송: ${chatHistory.length}개 메시지`);
    // 클라이언트로 채팅 기록 전송
    socket.emit("chatHistory", chatHistory);
  } catch (error) {
    console.error("채팅 기록 조회 오류:", error.message);
    socket.emit("error", { message: "채팅 기록 조회 오류 발생. 나중에 다시 시도해 주세요." });
  }
};

// 채팅방의 모든 참가자에게 메시지를 전송하는 함수  -----------------------------------------------------------------------
const sendMessageToRoomParticipants = async (io, roomId, content, senderId) => {
  try {
    console.log(`sendMessageToRoomParticipants 호출됨: roomId=${roomId}, content=${content}, senderId=${senderId}`);

    const participants = await ChatRoomParticipant.findAll({
      where: { roomId },
    });

    if (participants.length === 0) {
      console.error("채팅방에 참여자가 없습니다.");
      return;
    }

    console.log(`채팅방 ${roomId}의 참여자 수: ${participants.length}`);

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

// 클라이언트로 새로운 메시지 전송을 위한 별도 함수  -----------------------------------------------------------------------
const broadcastNewMessage = (io, roomId, content, senderId) => {
  try {
    console.log(`broadcastNewMessage 호출됨: roomId=${roomId}, content=${content}, senderId=${senderId}`);

    // 메시지를 데이터베이스에 저장하고 클라이언트에게 전송
    sendMessageToRoomParticipants(io, roomId, content, senderId);
  } catch (error) {
    console.error("새 메시지 방송 오류:", error);
  }
};

module.exports = {
  getChatHistoryForUser,
  getChatHistory,
  sendMessageToRoomParticipants,
  broadcastNewMessage
};