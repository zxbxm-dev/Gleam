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

// 그룹 채팅방의 과거 메시지를 조회하는 함수
const getGroupChatHistory = async (socket, roomId) => {
  try {
    const actualRoomId = roomId.roomId || roomId;

    console.log(`그룹 채팅방 채팅 기록을 가져오는 중: ${actualRoomId}`);

    // 해당 채팅방이 그룹 채팅방인지 확인
    const chatRoom = await ChatRoom.findOne({
      where: { roomId: actualRoomId },
    });
    if (!chatRoom || !chatRoom.isGroup) {
      sendNotAGroupChatError(socket);
      return;
    }

    // 채팅방의 모든 메시지를 가져오기
    const messages = await Message.findAll({
      where: { roomId: actualRoomId },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "username", "team"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // 채팅방의 모든 참가자 정보 가져오기
    const participants = await ChatRoomParticipant.findAll({
      where: { roomId: actualRoomId },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "username", "department", "team", "position"],
        },
      ],
    });

    const participantMap = participants.reduce((acc, participant) => {
      acc[participant.User.userId] = participant.User;
      return acc;
    }, {});

    const joinIds = participants.map((participant) => participant.User.userId);
    const hostId = chatRoom.hostUserId;

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

    sendGroupChatHistoryToClient(socket, chatHistory, joinIds, hostId);
  } catch (error) {
    console.error("그룹 채팅 기록 조회 오류:", error);
    sendErrorToClient(
      socket,
      "그룹 채팅 기록 조회 오류 발생. 나중에 다시 시도해 주세요.",
      error.message
    );
  }
};

// 나와 상대방의 채팅 기록을 조회하고 전송하는 함수
const getChatHistoryForUser = async (socket, selectedUserId, requesterId) => {
  try {
    if (selectedUserId === requesterId) {
      // 자신과의 채팅 기록을 가져오는 경우
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
      const participant = await ChatRoomParticipant.findOne({
        where: {
          userId: requesterId,
          roomId: {
            [Op.in]: await findMutualChatRoomsForUsers(
              requesterId,
              selectedUserId
            ),
          },
        },
      });

      // participant 값이 1일 경우(나간 사용자) 메시지를 숨김
      if (participant && participant.participant === true) {
        socket.emit("noChatRooms");
        return;
      }

      const mutualChatRoomIds = await findMutualChatRoomsForUsers(
        requesterId,
        selectedUserId
      );

      if (mutualChatRoomIds.length === 0) {
        socket.emit("noChatRooms");
        return;
      }

      // 참가자 상태와 관계없이 메시지 조회
      const messages = await Message.findAll({
        where: {
          roomId: {
            [Op.in]: mutualChatRoomIds,
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

      const chatRoom = await ChatRoom.findOne({
        where: { roomId: mutualChatRoomIds[0] },
      });
      const hostId = chatRoom ? chatRoom.hostUserId : null;

      if (participant && participant.participant) {
        socket.emit("chatHistoryForOthers", {
          chatHistory,
          joinIds: [requesterId, selectedUserId],
          hostId,
        });
      } else {
        socket.emit("chatHistoryForOthers", {
          chatHistory,
          joinIds: [requesterId, selectedUserId],
          hostId,
        });
      }

      // 메시지가 없을 경우 noChatHistory 이벤트 발신
      if (chatHistory.length === 0) {
        socket.emit("noChatHistory", {
          joinIds: [requesterId, selectedUserId],
        });
      }
    }
  } catch (error) {
    console.error("채팅 기록 조회 오류:", error);
    socket.emit("error", {
      message: "채팅 기록 조회 오류 발생. 나중에 다시 시도해 주세요.",
      details: error.message,
    });
  }
};

// 특정 채팅방의 과거 메시지를 조회하는 함수
const getChatHistory = async (socket, roomId) => {
  try {
    // roomId가 객체로 들어왔을 경우, 올바르게 추출
    const actualRoomId = roomId.roomId || roomId;

    console.log(`채팅방 채팅 기록을 가져오는 중: ${actualRoomId}`);

    const messages = await Message.findAll({
      where: { roomId: actualRoomId },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "username", "team"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    const participants = await ChatRoomParticipant.findAll({
      where: { roomId: actualRoomId },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "username", "department", "team", "position"],
        },
      ],
    });

    const participantMap = participants.reduce((acc, participant) => {
      acc[participant.User.userId] = participant.User;
      return acc;
    }, {});

    const joinIds = participants.map((participant) => participant.User.userId);

    const chatRoom = await ChatRoom.findOne({
      where: { roomId: actualRoomId },
    });
    const hostId = chatRoom ? chatRoom.hostUserId : null;

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

    const participants = await ChatRoomParticipant.findAll({
      where: { roomId },
      attributes: ["userId", "username", "department", "team", "position"],
    });

    if (participants.length === 0) {
      console.error(`방 ${roomId}에 참가자가 없습니다.`);
      return;
    }

    const newMessage = await Message.create({
      roomId,
      userId: senderId,
      content,
    });

    const messageData = {
      messageId: newMessage.messageId,
      content: newMessage.content,
      roomId: newMessage.roomId,
      senderId: newMessage.userId,
      timestamp: newMessage.createdAt,
    };

    participants.forEach((participant) => {
      io.to(participant.userId).emit("newMessage", messageData);
    });
  } catch (error) {
    throw new Error("메시지 전송 오류 발생");
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
  getGroupChatHistory,
};
