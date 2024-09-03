const models = require("../../models");
const { Message, User, ChatRoomParticipant } = models;
const { Op } = require('sequelize');

// 특정 사용자가 포함된 채팅방을 찾는 함수 -------------------------------------------------------------
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

// 두 사용자가 공통으로 속한 채팅방을 찾는 함수 -------------------------------------------------------------
const findMutualChatRoomsForUsers = async (userId1, userId2) => {
  try {
    console.log(`findMutualChatRoomsForUsers 호출됨: userId1=${userId1}, userId2=${userId2}`);

    const [user1Rooms, user2Rooms] = await Promise.all([
      findChatRoomsForUser(userId1),
      findChatRoomsForUser(userId2),
    ]);

    const mutualRooms = user1Rooms.filter(roomId => user2Rooms.includes(roomId));

    console.log(`공통으로 속한 채팅방 ID들: ${mutualRooms}`);
    return mutualRooms;
  } catch (error) {
    console.error("공통 채팅방 조회 오류:", error.message);
    throw new Error("공통 채팅방 조회 오류");
  }
};

// 선택한 사용자와 관련된 채팅방의 과거 메시지를 조회하는 함수 -----------------------------------------------------------------------
const getChatHistoryForUser = async (socket, selectedUserId, requesterId) => {
  try {
    console.log(`getChatHistoryForUser 호출됨: selectedUserId=${selectedUserId}, requesterId=${requesterId}`);

    if (selectedUserId === requesterId) {
      // 자신을 클릭한 경우 - 자신에게 보낸 메시지만 조회
      const chatRoomIds = await findChatRoomsForUser(requesterId);

      if (chatRoomIds.length === 0) {
        console.log("자신과의 채팅방이 없습니다.");
        socket.emit("chatHistory", []); // 채팅방이 없으면 빈 배열 전송
        return;
      }

      const selfMessages = await Message.findAll({
        where: {
          roomId: {
            [Op.in]: chatRoomIds
          },
          userId: requesterId
        },
        include: [
          {
            model: User,
            as: 'User',
            attributes: ["userId", "username", "team"],
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      if (selfMessages.length === 0) {
        console.log("자신에게 보낸 메시지가 없습니다.");
        socket.emit("chatHistory", []); // 자신에게 보낸 메시지가 없으면 빈 배열 전송
        return;
      }

      const chatHistory = selfMessages.map(message => ({
        messageId: message.messageId,
        content: message.content,
        userId: message.User.userId,
        username: `${message.User.team} ${message.User.username}`,
        timestamp: message.createdAt,
      }));

      console.log(`자신에게 보낸 메시지 기록 전송: ${chatHistory.length}개 메시지`);
      socket.emit("chatHistory", chatHistory);

    } else {
      // 다른 사용자를 클릭한 경우
      const mutualChatRoomIds = await findMutualChatRoomsForUsers(requesterId, selectedUserId);

      if (mutualChatRoomIds.length === 0) {
        console.log(`선택한 사용자 ${selectedUserId}와 관련된 채팅방이 없음.`);
        socket.emit("chatHistory", []);
        return;
      }

      const messages = await Message.findAll({
        where: {
          roomId: {
            [Op.in]: mutualChatRoomIds
          },
        },
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

      console.log(`다른 사용자와의 메시지 기록 전송: ${chatHistory.length}개 메시지`);
      socket.emit("chatHistory", chatHistory);
    }
  } catch (error) {
    console.error("채팅 기록 조회 오류:", error.message);
    socket.emit("error", { message: "채팅 기록 조회 오류 발생. 나중에 다시 시도해 주세요." });
  }
};

// 특정 채팅방의 과거 메시지를 조회하는 함수 -----------------------------------------------------------------------
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
    socket.emit("chatHistory", chatHistory);
  } catch (error) {
    console.error("채팅 기록 조회 오류:", error.message);
    socket.emit("error", { message: "채팅 기록 조회 오류 발생. 나중에 다시 시도해 주세요." });
  }
};

// 채팅방의 모든 참가자에게 메시지를 전송하는 함수 -----------------------------------------------------------------------
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

    io.to(roomId.toString()).emit("message", {
      messageId: savedMessage.messageId,
      content: savedMessage.content,
      userId: senderId,
      timestamp: savedMessage.createdAt,
    });

    console.log("메시지가 저장되고, 채팅방에 전송되었습니다.");
  } catch (error) {
    console.error("메시지 전송 오류:", error);
  }
};

// 클라이언트로 새로운 메시지 전송을 위한 별도 함수 -----------------------------------------------------------------------
const broadcastNewMessage = (io, roomId, content, senderId) => {
  try {
    console.log(`broadcastNewMessage 호출됨: roomId=${roomId}, content=${content}, senderId=${senderId}`);

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