const models = require("../../models");
const { Message, User, ChatRoomParticipant, ChatRoom } = models;
const { Op } = require("sequelize");

// 특정 사용자가 포함된 채팅방을 찾는 함수
const findChatRoomsForUser = async (userId) => {
  try {
    console.log(`사용자의 채팅방을 찾았습니다: ${userId}`);
    const chatRooms = await ChatRoomParticipant.findAll({
      where: { userId },
      attributes: ["roomId"],
    });

    const roomIds = [
      ...new Set(chatRooms.map((participant) => participant.roomId)),
    ];
    console.log(`사용자의 채팅방을 찾았습니다 ${userId}: ${roomIds}`);
    return roomIds;
  } catch (error) {
    console.error("채팅방 조회 오류:", error);
    throw new Error("채팅방 조회 오류");
  }
};

// 두 사용자가 공통으로 속한 채팅방을 찾는 함수
const findMutualChatRoomsForUsers = async (userId1, userId2) => {
  try {
    console.log(`사용자 실제 채팅방 ${userId1} 의 ${userId2}`);
    const [user1Rooms, user2Rooms] = await Promise.all([
      findChatRoomsForUser(userId1),
      findChatRoomsForUser(userId2),
    ]);
    const mutualRooms = user1Rooms.filter((roomId) => user2Rooms.includes(roomId));
    console.log(`사용자 실제 채팅방 ${userId1} 의 ${userId2}: ${mutualRooms}`);
    return mutualRooms;
  } catch (error) {
    console.error("공통 채팅방 조회 오류:", error);
    throw new Error("공통 채팅방 조회 오류");
  }
};

// 나와의 데이터만 가져오기
const findChatRoomsForMe = async (userId) => {
  try {
    console.log(`사용자의 셀프 채팅방 찾기: ${userId}`);
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

    console.log(`사용자의 셀프 채팅방을 찾았습니다. ${userId}: ${validRoomIds}`);
    return validRoomIds;
  } catch (error) {
    console.error("채팅방 조회 오류:", error);
    throw new Error("채팅방 조회 오류");
  }
};

// 나와의 채팅방의 과거 메시지를 조회하는 함수
const getChatHistoryForUser = async (socket, selectedUserId, requesterId) => {
  try {
    console.log(`요청자의 채팅 기록을 가져오는 중: ${requesterId}, 발신자: ${selectedUserId}`);
    
    if (selectedUserId === requesterId) {
      // 자신과의 채팅 기록을 가져오는 경우
      console.log(`사용자의 자체 채팅 기록을 가져오는 중: ${requesterId}`);
      const chatRoomIds = await findChatRoomsForMe(requesterId);

      if (chatRoomIds.length === 0) {
        console.log("사용자 자신의 채팅 기록이 없습니다.");
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
        console.log("셀프 채팅방에 메시지가 없습니다");
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
      // 다른 사용자와의 채팅 기록을 가져오는 경우
      console.log(`사용자의 채팅 기록을 가져오는 중: ${requesterId} 그리고 ${selectedUserId}`);
      
      // 유저의 상태를 확인하여 participant가 true인지 false인지 확인
      const participant = await ChatRoomParticipant.findOne({
        where: {
          userId: selectedUserId,
          RoomId: {
            [Op.in]: await findMutualChatRoomsForUsers(requesterId, selectedUserId),
          },
        },
        attributes: ['participant', 'updatedAt'],
      });

      if (!participant) {
        console.log(`사용자 ${selectedUserId}는 현재 채팅방에 참여 중이 아닙니다.`);
        socket.emit("noChatRooms");
        return;
      }

      const mutualChatRoomIds = await findMutualChatRoomsForUsers(requesterId, selectedUserId);

      if (mutualChatRoomIds.length === 0) {
        console.log("채팅방을 찾을 수 없습니다");
        socket.emit("noChatRooms");
        return;
      }

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

      const chatRoom = await ChatRoom.findOne({ where: { roomId: mutualChatRoomIds[0] } });
      const hostId = chatRoom ? chatRoom.hostUserId : null;

      // 상대방과의 모든 채팅 기록을 클라이언트에 발신
      socket.emit("chatHistoryForOthers", { chatHistory, joinIds: [requesterId, selectedUserId], hostId });
      
      // 메시지가 없을 경우 noChatHistory 이벤트 발신
      if (chatHistory.length === 0) {
        socket.emit("noChatHistory", { joinIds: [requesterId, selectedUserId] });
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
      where: { roomId: actualRoomId }, // roomId를 실제 값으로 전달
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

    const chatRoom = await ChatRoom.findOne({ where: { roomId: actualRoomId } });
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
    console.log(`방에 메시지 보내는 중: ${roomId}, 발신자: ${senderId}, 내용: ${content}`);
    let room = await ChatRoom.findOne({ where: { roomId } });

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
    console.error("메시지 전송 오류:", error);
    throw new Error("메시지 전송 오류 발생");
  }
};

// 클라이언트로 새로운 메시지 전송을 위한 별도 함수
const broadcastNewMessage = (io, roomId, content, senderId) => {
  try {
    console.log(`새 메시지를 방에 브로드캐스트하는 중: ${roomId}, 발신자: ${senderId}`);
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
