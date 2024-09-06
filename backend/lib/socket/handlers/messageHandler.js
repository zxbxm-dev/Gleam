const models = require("../../models");
const { Message, User, ChatRoomParticipant, ChatRoom } = models;
const { Op } = require('sequelize');

// 특정 사용자가 포함된 채팅방을 찾는 함수
const findChatRoomsForUser = async (userId) => {
  try {
    const chatRooms = await ChatRoomParticipant.findAll({
      where: { userId },
      attributes: ['roomId'],
    });

    // 중복된 roomId 제거
    const roomIds = [...new Set(chatRooms.map(participant => participant.roomId))];
    return roomIds;
  } catch (error) {
    throw new Error("채팅방 조회 오류");
  }
};

// 두 사용자가 공통으로 속한 채팅방을 찾는 함수
const findMutualChatRoomsForUsers = async (userId1, userId2) => {
  try {
    const [user1Rooms, user2Rooms] = await Promise.all([
      findChatRoomsForUser(userId1),
      findChatRoomsForUser(userId2),
    ]); 
    return user1Rooms.filter(roomId => user2Rooms.includes(roomId));
  } catch (error) {
    throw new Error("공통 채팅방 조회 오류");
  }
};

//나와의 데이터만 가져오기
const findChatRoomsForMe = async (userId) => {
  try {
    const chatRooms = await ChatRoomParticipant.findAll({
      where: { userId },
      attributes: ['roomId'],
    });

    // 중복된 roomId 제거
    const roomIds = [...new Set(chatRooms.map(participant => participant.roomId))];

    // roomId와 userId가 같은 경우만 필터링
    const validRoomIds = [];
    for (const roomId of roomIds) {
      const participants = await ChatRoomParticipant.findAll({ where: { roomId } });
      if (participants.length > 1) { // 동일 roomId에 여러 사용자
        const sameUserCount = participants.filter(p => p.userId === userId).length;
        if (sameUserCount > 1) {
          validRoomIds.push(roomId);
        }
      }
    }

    return validRoomIds;
  } catch (error) {
    throw new Error("채팅방 조회 오류");
  }
};

// 나와의 채팅방의 과거 메시지를 조회하는 함수
const getChatHistoryForUser = async (socket, selectedUserId, requesterId) => {
  try {
    if (selectedUserId === requesterId) {
      // 자신을 클릭한 경우
      const chatRoomIds = await findChatRoomsForMe(requesterId);

      // 자신과 관련된 채팅방이 있는지 확인
      if (chatRoomIds.length === 0) {
        socket.emit("noChatRoomsForUser"); // 자신과의 채팅방이 없으면 별도의 이벤트 전송
        return;
      }

      // 동일한 ID를 가진 사용자가 두 명 이상인지 확인
      const sameIdUsers = await User.count({ where: { userId: requesterId } });
      if (sameIdUsers > 2) {
        socket.emit("noChatRoomsForUser"); // 동일한 ID를 가진 사용자가 두 명 이상이 아닐 경우
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
        socket.emit("noChatRoomsForUser"); // 자신에게 보낸 메시지가 없으면 별도의 이벤트 전송
        return;
      }

      const chatHistory = selfMessages.map(message => ({
        messageId: message.messageId,
        content: message.content,
        userId: message.User.userId,
        username: `${message.User.team} ${message.User.username}`,
        timestamp: message.createdAt,
      }));

      socket.emit("chatHistoryForUser", chatHistory); // 나와의 채팅방 메시지 전송

    } else {
      // 다른 사용자를 클릭한 경우
      const mutualChatRoomIds = await findMutualChatRoomsForUsers(requesterId, selectedUserId);

      if (mutualChatRoomIds.length === 0) {
        socket.emit("chatHistory"); // 공통 채팅방이 없으면 별도의 이벤트 전송
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

      socket.emit("chatHistoryForOthers", {chatHistory, joinIds, hostId}); // 다른 사용자와의 채팅방 메시지 전송
    }
  } catch (error) {
    socket.emit("error", { message: "채팅 기록 조회 오류 발생. 나중에 다시 시도해 주세요." });
  }
};

// 특정 채팅방의 과거 메시지를 조회하는 함수
const getChatHistory = async (socket, roomId) => {
  try {
    // 메시지 조회
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

    // 채팅방 참가자 정보 조회
    const participants = await ChatRoomParticipant.findAll({
      where: { roomId },
      attributes: ["userId", "username", "department", "team", "position"],
    });

    // 참가자 정보를 빠르게 조회할 수 있도록 객체로 변환
    const participantMap = participants.reduce((acc, participant) => {
      acc[participant.userId] = participant;
      return acc;
    }, {});

    // 참가자의 userId를 joinIds로 설정
    const joinIds = participants.map(participant => participant.userId);

    // 호스트 정보 조회 (여기서 ChatRoom이 데이터베이스에서 호스트 정보를 조회하는 부분을 구현해야 합니다)
    const chatRoom = await ChatRoom.findOne({ where: { roomId } });
    const hostId = chatRoom ? chatRoom.hostUserId : null;

    // 메시지와 참가자 정보를 합치기
    const chatHistory = messages.map(message => {
      const participant = participantMap[message.User.userId];
      return {
        messageId: message.messageId,
        content: message.content,
        userId: message.User.userId,
        username: `${participant?.team || ''} ${participant?.username || ''}`,
        timestamp: message.createdAt,
      };
    });

    // chatHistory와 joinIds, hostId 객체 형태로 전송
    socket.emit("chatHistory", { chatHistory, joinIds, hostId });
  } catch (error) {
    console.error("채팅 기록 조회 오류:", error);
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
      return;
    }

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
  } catch (error) {
    console.error("메시지 전송 오류:", error);
  }
};

// 클라이언트로 새로운 메시지 전송을 위한 별도 함수
const broadcastNewMessage = (io, roomId, content, senderId) => {
  try {
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