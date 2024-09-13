const models = require("../../models");
const { Message, User, ChatRoomParticipant, ChatRoom } = models;
const { Op } = require("sequelize");

// 특정 사용자가 포함된 채팅방을 찾는 함수
const findChatRoomsForUser = async (userId) => {
  try {
    const chatRooms = await ChatRoomParticipant.findAll({
      where: { userId },
      attributes: ["roomId"],
    });

    // 중복된 roomId 제거
    const roomIds = [
      ...new Set(chatRooms.map((participant) => participant.roomId)),
    ];
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
    return user1Rooms.filter((roomId) => user2Rooms.includes(roomId));
  } catch (error) {
    throw new Error("공통 채팅방 조회 오류");
  }
};

// 나와의 데이터만 가져오기
const findChatRoomsForMe = async (userId) => {
  try {
    const chatRooms = await ChatRoomParticipant.findAll({
      where: { userId },
      attributes: ["roomId"],
    });

    const roomIds = [
      ...new Set(chatRooms.map((participant) => participant.roomId)),
    ];

    // 자신과의 채팅방 필터링 (참여자가 자기 자신인 방만 조회)
    const validRoomIds = [];
    for (const roomId of roomIds) {
      const participants = await ChatRoomParticipant.findAll({
        where: { roomId },
      });
      const sameUserCount = participants.filter(
        (p) => p.userId === userId
      ).length;

      if (sameUserCount === participants.length) {
        validRoomIds.push(roomId);
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

      if (chatRoomIds.length === 0) {
        socket.emit("noChatRoomsForUser");
        return;
      }

      const selfMessages = await Message.findAll({
        where: {
          roomId: {
            [Op.in]: chatRoomIds,
          },
          userId: requesterId,
        },
        include: [
          {
            model: User,
            as: "User",
            attributes: ["userId", "username", "team"],
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      if (selfMessages.length === 0) {
        socket.emit("noChatRoomsForUser");
        return;
      }

      const joinIds = requesterId;
      const hostId = requesterId;

      const chatHistory = selfMessages.map((message) => ({
        messageId: message.messageId,
        content: message.content,
        userId: message.User.userId,
        username: `${message.User.team} ${message.User.username}`,
        timestamp: message.createdAt,
      }));
      socket.emit("chatHistoryForUser", { chatHistory, joinIds, hostId });
    } else {
      // 다른 사용자를 클릭한 경우
      const mutualChatRoomIds = await findMutualChatRoomsForUsers(requesterId, selectedUserId);

      if (mutualChatRoomIds.length === 0) {
        socket.emit("noChatRooms");
        return;
      }

      // 각 방의 참가자 수 확인 (개인 채팅: 2명, 단체 채팅: 2명 이상)
      const validRoomIds = [];
      for (const roomId of mutualChatRoomIds) {
        const participants = await ChatRoomParticipant.findAll({
          where: { roomId },
        });

        if (participants.length === 2) {
          // 개인 채팅
          validRoomIds.push(roomId);
        }
      }

      if (validRoomIds.length === 0) {
        socket.emit("noChatRooms");
        return;
      }

      const messages = await Message.findAll({
        where: {
          roomId: {
            [Op.in]: validRoomIds,
          },
        },
        include: [
          {
            model: User,
            as: "User",
            attributes: ["userId", "username", "team"],
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      const chatHistory = messages.map((message) => ({
        messageId: message.messageId,
        content: message.content,
        userId: message.User.userId,
        username: `${message.User.team} ${message.User.username}`,
        timestamp: message.createdAt,
      }));

      const joinIds = [requesterId, selectedUserId];
      const chatRoom = await ChatRoom.findOne({ where: { roomId: validRoomIds[0] } });
      const hostId = chatRoom ? chatRoom.hostUserId : null;

      socket.emit("chatHistoryForOthers", { chatHistory, joinIds, hostId });
    }
  } catch (error) {
    socket.emit("error", {
      message: "채팅 기록 조회 오류 발생. 나중에 다시 시도해 주세요.",
    });
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
          as: "User",
          attributes: ["userId", "username", "team"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // 채팅방 참가자 정보 조회
    const participants = await ChatRoomParticipant.findAll({
      where: { roomId },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "username", "department", "team", "position"],
        },
      ],
    });

    // 참가자 정보를 빠르게 조회할 수 있도록 객체로 변환
    const participantMap = participants.reduce((acc, participant) => {
      acc[participant.User.userId] = participant.User; // 올바르게 User 객체를 매핑
      return acc;
    }, {});

    // 참가자의 userId를 joinIds로 설정
    const joinIds = participants.map((participant) => participant.User.userId);

    // 호스트 정보 조회
    const chatRoom = await ChatRoom.findOne({ where: { roomId } });
    const hostId = chatRoom ? chatRoom.hostUserId : null;

    // 메시지와 참가자 정보를 합치기
    const chatHistory = messages.map((message) => {
      const participant = participantMap[message.User.userId];
      return {
        messageId: message.messageId,
        content: message.content,
        userId: message.User.userId,
        username: `${participant?.team || ""} ${participant?.username || ""}`,
        timestamp: message.createdAt,
      };
    });

    // chatHistory와 joinIds, hostId 객체 형태로 전송
    socket.emit("chatHistory", { chatHistory, joinIds, hostId });
  } catch (error) {
    console.error("채팅 기록 조회 오류:", error);
    socket.emit("error", {
      message: "채팅 기록 조회 오류 발생. 나중에 다시 시도해 주세요.",
    });
  }
};

// 채팅방의 모든 참가자에게 메시지를 전송하는 함수
const sendMessageToRoomParticipants = async (io, roomId, content, senderId) => {
  try {
    let room = await ChatRoom.findOne({ where: { roomId } });
console.log("aaaa",content);

    if (!room) {
      console.error(
        `방 ${roomId}이 존재하지 않습니다. 새로운 방을 생성합니다.`
      );
      room = await ChatRoom.create({
        roomId,
        isGroup: false,
        hostUserId: senderId,
        hostName: "시스템",
        hostDepartment: "시스템",
        hostTeam: "시스템",
        hostPosition: "시스템",
        title: "새로운 방",
      });
    }

    const participants = await ChatRoomParticipant.findAll({
      where: { roomId },
      attributes: ["userId", "username", "department", "team", "position"],
    });

    if (participants.length === 0) {
      console.error(`방 ${roomId}에 참가자가 없습니다.`);
      return;
    }

    const savedMessage = await Message.create({
      content,
      userId: senderId,
      roomId,
    });

    if (participants.length === 1 && participants[0].userId === senderId) {
      io.to(senderId.toString()).emit("message", {
        messageId: savedMessage.messageId,
        content: savedMessage.content,
        userId: senderId,
        timestamp: savedMessage.createdAt,
      });
    } else {
      io.to(roomId.toString()).emit("message", {
        messageId: savedMessage.messageId,
        content: savedMessage.content,
        userId: senderId,
        timestamp: savedMessage.createdAt,
      });
    }
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
  broadcastNewMessage,
  findMutualChatRoomsForUsers,
  findChatRoomsForMe,
};