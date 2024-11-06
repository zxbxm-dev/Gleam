const models = require("../../models");
const { Message, User, ChatRoomParticipant, ChatRoom, MessageRead } = models;
const notificationHandler = require("../handlers/notificationHandlers");
const socketUtills = require("../socketUtills");
const { Op, where } = require("sequelize");
const connectedUsers = require("../index");

// 특정 사용자가 포함된 채팅방을 찾는 함수
const findChatRoomsForUser = async (userId) => {
  try {
    const chatRooms = await ChatRoomParticipant.findAll({
      where: { userId },
      attributes: ["roomId"],
    });

    const roomIds = [...new Set(chatRooms.map((participant) => participant.roomId))];
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

    const roomIds = [...new Set(chatRooms.map((participant) => participant.roomId))];
    const validRoomIds = [];

    for (const roomId of roomIds) {
      const participants = await ChatRoomParticipant.findAll({
        where: { roomId },
      });
      const sameUserCount = participants.filter((p) => p.userId === userId).length;

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

    const sendNotAGroupChatError = (socket) => {
      socket.emit("error", {
        message: "그룹 채팅방이 아닙니다.",
      });
    };

    // 해당 채팅방이 그룹 채팅방인지 확인
    const chatRoom = await ChatRoom.findOne({
      where: { roomId: actualRoomId },
    });
    if (!chatRoom || !chatRoom.isGroup) {
      sendNotAGroupChatError(socket);
      return;
    }

    //기존에 연결되어있는 socketJoin 해제 처리
    const currentJoinSocketRoom = Array.from(socket.rooms);
    for(const roomId of currentJoinSocketRoom ) {
      if(actualRoomId !== roomId){
        socket.leave(roomId);
      };
    };
    //console.log("<getGroupChatHistory> - Joined Room : ", Array.from(socket.rooms ));

    // 채팅방의 모든 메시지를 가져오기
    const messages = await Message.findAll({
      where: { roomId: actualRoomId,
        },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "username", "team"],
        },
        {
          model: MessageRead,
          as: "reads",
          attributes: ["userId", "isRead"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // 채팅방의 모든 참가자 정보 가져오기
    const participants = await ChatRoomParticipant.findAll({
      where: { roomId: actualRoomId, participant: 0 },
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

      // 메시지를 읽지 않은 사용자들 조회
      const unreadCount = participants.length - message.reads.filter(read => read.isRead).length - 1;

      return {
        messageId: message.messageId,
        content: message.content,
        userId: message.User.userId,
        username: `${participant?.team || ""} ${participant?.username || ""}`,
        timestamp: message.createdAt,
        unreadCount,
        fileValue: message.filePath ? 1 : 0,
        contentType: message.contentType,
      };
    });

    // console.log("단체방 클라이언트 전달 데이터", chatHistory)

    const sendGroupChatHistoryToClient = (socket, chatHistory, joinIds, hostId) => {
      socket.emit("groupChatHistory", { chatHistory, joinIds, hostId });
    };

    sendGroupChatHistoryToClient(socket, chatHistory, joinIds, hostId);
  } catch (error) {
    console.error("그룹 채팅 기록 조회 오류:", error);

    const sendErrorToClient = (socket, message, details) => {
      socket.emit("error", {
        message,
        details,
      });
    };
    sendErrorToClient(socket, "그룹 채팅 기록 조회 오류 발생. 나중에 다시 시도해 주세요.", error.message);
  }
};

// 나와 상대방의 채팅 기록을 조회하고 전송하는 함수
const getChatHistoryForUser = async (socket, selectedUserId, requesterId) => {
  try {
    if (selectedUserId === requesterId) {
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

      const chatHistory = selfMessages.map((message) => ({
        messageId: message.messageId,
        content: message.content,
        userId: message.User.userId,
        username: `${message.User.team} ${message.User.username}`,
        timestamp: message.createdAt,
        fileValue: message.filePath ? 1 : 0,
        isRead: message.reads && message.reads.length > 0 ? message.reads[0].isRead : 1, // 읽음 상태 기본값 설정
      }));
      socket.emit("chatHistoryForUser", { chatHistory, joinIds: [requesterId], hostId: requesterId });
    } else {
      const mutualChatRoomIds = await findMutualChatRoomsForUsers(requesterId, selectedUserId);

      // 두 사용자가 참여하는 방만 필터링
      const filteredChatRoomIds = await Promise.all(mutualChatRoomIds.map(async (roomId) => {
        const participants = await ChatRoomParticipant.count({
          where: { roomId }
        });
        return participants === 2 ? roomId : null;
      }));

      if (filteredChatRoomIds.length === 0) {
        socket.emit("noChatRoomsForUser");
        return;
      }

      const validChatRoomIds = filteredChatRoomIds.filter(Boolean);

      if (validChatRoomIds.length === 0) {
        socket.emit("noChatRooms");
        return;
      }

      const ChatRoomIds = Array.from(validChatRoomIds);
        // socket Join 처리 
      const socketJoinRoom = await socketUtills.socketJoinChatRoom(socket, ChatRoomIds); 

          //기존에 연결되어있는 socketJoin 해제 처리
          const currentJoinSocketRoom = Array.from(socket.rooms);
          for(const roomId of currentJoinSocketRoom ) {
            if(!ChatRoomIds.includes(roomId)){  
              socket.leave(roomId);
            };
          };
          //console.log("<personTab_getChatHistory> - Joined Room : ", Array.from(socket.rooms ));

      const messages = await Message.findAll({
        where: {
          roomId: {
            [Op.in]: validChatRoomIds,
          },
        },
        include: [
          {
            model: User,
            as: "User",
            attributes: ["userId", "username", "team"],
          },
          {
            model: MessageRead,
            as: "reads",
            where: { userId: selectedUserId },
            required: false,
            attributes: ["isRead"],
          },
        ],
        order: [["createdAt", "ASC"]],
      });
  
      const chatHistory = messages.map((message) => {
        //console.log("메시지 데이터:", message);
        // console.log("reads 배열:", messageRead.reads);

        return {
          messageId: message.messageId,
          content: message.content,
          userId: message.User.userId,
          username: `${message.User.team} ${message.User.username}`,
          timestamp: message.createdAt,
          isReadOther: message.reads && message.reads.length > 0 ? message.reads[0].isRead : 0,
          fileValue: message.filePath ? 1 : 0,
        };
      });
      const chatRoom = await ChatRoom.findOne({
        where: { roomId: validChatRoomIds[0] },
      });
      const hostId = chatRoom ? chatRoom.hostUserId : null;

      console.log("상대방 채팅 데이터 전달" , chatHistory);

      socket.emit("chatHistoryForOthers", {
        chatHistory,
        joinIds: [requesterId, selectedUserId],
        hostId,
      });

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
    const actualRoomId = roomId.roomId || roomId;

    //기존 연결되어있던 socketJoin 해제 처리
    const currentJoinSocketRoom = Array.from(socket.rooms);
    for(const roomId of currentJoinSocketRoom ) {
      if(actualRoomId !== roomId){
        socket.leave(roomId);
      };
    };
    //console.log("<GetChatHistory> - Joined Room: ", Array.from(socket.rooms )); 


    const messages = await Message.findAll({
      where: { roomId: actualRoomId,
              },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "username", "team"],
        },
        {
          model: MessageRead,
          as: "reads",
          attributes: ["isRead"],
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
        isReadOther: message.reads && message.reads.length > 0 ? message.reads[0].isRead : 0,
        fileValue: message.filePath ? 1 : 0,
        contentType: message.contentType,
      };
    });

    // console.log ("특정 채팅방 데이터 전달",chatHistory);

    socket.emit("chatHistory", { chatHistory, joinIds, hostId });
  } catch (error) {
    console.error("채팅 기록 조회 오류:", error);
    socket.emit("error", {
      message: "채팅 기록 조회 오류 발생. 나중에 다시 시도해 주세요.",
    });
  }
};

// 채팅방의 모든 참가자에게 메시지를 전송하는 함수
const sendMessageToRoomParticipants = async (io,socket, roomId, content, senderId, receiverId) => {
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

    const senderInfo = await ChatRoomParticipant.findOne({
      where: { userId : senderId },
      attributes: ["userId", "username", "department", "team", "position"],
    })

    const newMessage = await Message.create({
      roomId,
      userId: senderId,
      receiverId,
      content,
    });

    const messageData = {
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

    // participants.forEach((participant) => {
    //   io.to(participant.userId).emit("newMessage", messageData);
    // });

    console.log('socket room 정보', io.sockets.adapter.rooms)
    io.to(roomId).emit("newMsgData", messageData);

    await ChatRoom.update(

      { updatedAt: new Date() },
      { where: { roomId } }
    );
    
  } catch (error) {
    console.error(`메시지 전송 오류 발생: ${error.message}`);
    throw new Error("메시지 전송 오류 발생");
  }
};

// 클라이언트로 새로운 메시지 전송을 위한 별도 함수
const broadcastNewMessage = (io, roomId, content, senderId) => {
  try {
    sendMessageToRoomParticipants(io,socket, roomId, content, senderId);
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