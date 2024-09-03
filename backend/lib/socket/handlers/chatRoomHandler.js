const models = require("../../models");
const { User, ChatRoom, ChatRoomParticipant } = models;
const { Op, Sequelize } = require("sequelize");
const { sendMessageToRoomParticipants } = require("./messageHandler");

// 사용자 조회 함수
const getUserById = async (userId) => User.findOne({ where: { userId } });
const getUsersByIds = async (userIds) =>
  User.findAll({ where: { userId: userIds } });

// 사용자 제목 파싱 함수
const parseUserTitle = (userTitle, userId) => {
  let parsedTitle = {};
  if (typeof userTitle === "string") {
    try {
      parsedTitle = JSON.parse(userTitle);
    } catch (error) {
      console.error("userTitle 파싱 오류:", error);
    }
  } else {
    parsedTitle = userTitle || {};
  }
  return parsedTitle;
};

// 채팅방 제목 결정 함수
const getOthertitle = (roomData, userTitle, userId) => {
  if (roomData.isGroup) {
    return roomData.title;
  }

  const otherUserId = Object.keys(userTitle).find((id) => id !== userId);
  if (otherUserId) {
    const otherUser = userTitle[otherUserId];
    if (otherUser.team) return `${otherUser.team} ${otherUser.username}`;
    if (otherUser.department)
      return `${otherUser.department} ${otherUser.username}`;
    return otherUser.username;
  }

  return roomData.title;
};

// 새로운 개인 채팅방을 생성하거나 기존 채팅방을 조회
const createPrivateRoom = async (io, socket, data) => {
  try {
    console.log("서버에서 수신한 데이터:", data);

    const { userId, content, invitedUserIds } = data;

    if (!userId || !invitedUserIds || invitedUserIds.length === 0) {
      console.error("userId 또는 invitedUserIds가 정의되지 않았습니다.");
      return socket.emit("error", { message: "잘못된 데이터입니다" });
    }

    // 사용자 및 초대된 사용자 조회
    const user = await getUserById(userId);
    const targets = await getUsersByIds(invitedUserIds);

    if (!user || targets.length !== invitedUserIds.length) {
      console.error("사용자 또는 초대된 사용자를 찾을 수 없습니다.");
      return socket.emit("error", { message: "사용자를 찾을 수 없습니다" });
    }

    // 초대된 사용자 정보 배열 생성
    const invitedUsers = targets.map((target) => ({
      userId: target.userId,
      username: target.username,
      company: target.company || null,
      department: target.department || null,
      team: target.team || null,
      position: target.position || null,
      spot: target.spot || null,
      attachment: target.attachment || null,
    }));

    // 기존 채팅방을 조회하거나 새로운 채팅방을 생성
    const [chatRoom, created] = await ChatRoom.findOrCreate({
      where: {
        isGroup: false,
        [Op.and]: [
          {
            roomId: {
              [Op.in]: Sequelize.literal(`(
                SELECT roomId
                FROM chatroom_participant
                WHERE userId IN (${invitedUserIds
                  .map((id) => `'${id}'`)
                  .join(", ")}, '${userId}')
                GROUP BY roomId
                HAVING COUNT(*) = ${invitedUserIds.length + 1}
              )`),
            },
          },
        ],
      },
      defaults: {
        isGroup: false,
        hostUserId: userId,
        hostName: user.username,
        hostDepartment: user.department,
        hostTeam: user.team,
        hostPosition: user.position,
        title: null, // 개인 채팅방일 경우 title을 설정하지 않음
        userTitle: JSON.stringify({
          [userId]: {
            userId,
            username: user.username,
            company: user.company || null,
            department: user.department || null,
            team: user.team || null,
            position: user.position || null,
            spot: user.spot || null,
            attachment: user.attachment || null,
          },
          ...invitedUsers.reduce(
            (acc, invitedUser) => ({
              ...acc,
              [invitedUser.userId]: invitedUser, // 초대된 사용자에 대한 정보
            }),
            {}
          ),
        }),
      },
    });

    // 새로운 채팅방이 생성된 경우 참가자를 추가
    if (created) {
      const participants = [
        ...invitedUsers.map((invitedUser) => ({
          roomId: chatRoom.roomId,
          userId: invitedUser.userId,
          username: invitedUser.username,
          department: invitedUser.department,
          team: invitedUser.team,
          position: invitedUser.position,
        })),
        {
          roomId: chatRoom.roomId,
          userId,
          username: user.username,
          department: user.department,
          team: user.team,
          position: user.position,
        },
      ];
      await ChatRoomParticipant.bulkCreate(participants);
    }

    // 사용자의 채팅방 목록을 클라이언트에게 전송
    await sendUserChatRooms(socket, userId);

    // 생성된 채팅방의 메시지 저장 및 전송
    if (content) {
      console.log(`새로운 메시지 전송: ${content}`);
      await sendMessageToRoomParticipants(io, chatRoom.roomId, content, userId);
    }
  } catch (error) {
    console.error("채팅방 생성 및 메시지 저장 오류:", error);
    socket.emit("error", { message: "채팅 생성 서버 오류" });
  }
};

// 채팅방 조회 후 클라이언트에게 파싱
const sendUserChatRooms = async (socket, userId) => {
  try {
    // 사용자가 참여한 채팅방 목록 조회
    const chatRooms = await ChatRoomParticipant.findAll({
      where: { userId },
      include: [{ model: ChatRoom }],
    });

    console.log(
      "사용자 채팅방 목록:",
      chatRooms.map((participant) => participant.ChatRoom.roomId)
    );

    // 채팅방 ID와 관련된 참가자 정보를 담을 맵
    const roomParticipantsMap = {};

    for (const participant of chatRooms) {
      const roomId = participant.ChatRoom.roomId;
      
      // 채팅방의 참가자 목록을 조회
      const participants = await ChatRoomParticipant.findAll({
        where: { roomId },
        attributes: ['userId']
      });

      // 참가자가 여러 명일 경우
      if (participants.length > 1) {
        // 중복된 참가자가 있는지 체크
        const participantCount = participants.reduce((countMap, p) => {
          countMap[p.userId] = (countMap[p.userId] || 0) + 1;
          return countMap;
        }, {});

        const hasDuplicates = Object.values(participantCount).some(count => count > 1);

        // 중복된 참가자가 있는 채팅방은 제외
        if (!hasDuplicates) {
          if (!roomParticipantsMap[roomId]) {
            const room = participant.ChatRoom;
            const roomData = room.toJSON();
            const userTitle = parseUserTitle(roomData.userTitle, userId);
            const othertitle = getOthertitle(roomData, userTitle, userId);

            roomParticipantsMap[roomId] = {
              othertitle,
              userTitle,
              dataValues: roomData,
            };
          }
        }
      }
    }

    // 필터링된 채팅방 목록을 클라이언트에 전송합니다.
    socket.emit("chatRooms", Object.values(roomParticipantsMap));
    console.log("최종 채팅방 목록:", Object.values(roomParticipantsMap));
  } catch (error) {
    console.error("채팅방 조회 오류:", error);
    socket.emit("error", { message: "채팅방 조회 오류" });
  }
};

// 채팅방에 참여
const joinRoom = async (socket, roomId) => {
  try {
    if (!roomId || roomId <= 0) {
      throw new Error("유효하지 않은 방 ID입니다.");
    }

    const chatRoom = await ChatRoom.findOne({ where: { roomId } });

    if (chatRoom) {
      const userId = socket.userId;

      if (!userId) {
        // console.error("유저 ID가 정의되지 않았습니다.");
        return socket.emit("error", {
          message: "유저 ID가 정의되지 않았습니다.",
        });
      }

      const isMember = await ChatRoomParticipant.findOne({
        where: { roomId, userId },
      });

      if (isMember) {
        socket.join(roomId.toString()); // 채팅방에 참여
        // console.log(`합류한 유저: ${socket.userId} 합류한 방: ${roomId}`);
      } else {
        // console.error("이 방에 참여할 권한이 없습니다.", { roomId, userId });
        socket.emit("error", { message: "이 방에 참여할 권한이 없습니다." });
      }
    } else {
      // console.error("방을 찾을 수 없습니다:", roomId);
      socket.emit("error", { message: "방을 찾을 수 없습니다" });
    }
  } catch (error) {
    // console.error("채팅방에 참여하는 중에 오류가 발생했습니다.:", error);
    socket.emit("error", { message: "채팅방 참여 서버 오류" });
  }
};

// 채팅방에서 나가기
const exitRoom = (socket, roomId) => {
  socket.leave(roomId.toString());
  console.log(`User ${socket.userId} left room ${roomId}`);
};

module.exports = {
  sendUserChatRooms,
  createPrivateRoom,
  joinRoom,
  exitRoom,
};
