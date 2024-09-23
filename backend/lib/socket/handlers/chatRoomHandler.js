const models = require("../../models");
const { Message, User, ChatRoomParticipant, ChatRoom } = models;
const { Op, Sequelize } = require("sequelize");
const {
  sendMessageToRoomParticipants,
  findMutualChatRoomsForUsers,
  findChatRoomsForMe,
} = require("./messageHandler");

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

const getNextRoomId = async () => {
  try {
    // 현재 최대 roomId 조회
    const maxRoom = await ChatRoom.findOne({
      attributes: [[Sequelize.fn("MAX", Sequelize.col("roomId")), "maxRoomId"]],
    });

    // 새로운 roomId 생성
    const nextRoomId =
      maxRoom && maxRoom.dataValues.maxRoomId
        ? maxRoom.dataValues.maxRoomId + 1
        : 1;

    return nextRoomId;
  } catch (error) {
    console.error("다음 방 ID를 가져오는 중 오류 발생:", error);
    throw new Error("방 ID 조회 오류");
  }
};

// 새로운 개인 채팅방을 생성하거나 기존 채팅방을 조회
const createPrivateRoom = async (io, socket, data) => {
  try {
    console.log("서버에서 수신한 데이터:", data);

    let { userId, content, invitedUserIds } = data;

    if (!userId || !invitedUserIds || invitedUserIds.length === 0) {
      console.error("userId 또는 invitedUserIds가 정의되지 않았습니다.");
      return socket.emit("error", { message: "잘못된 데이터입니다" });
    }

    // 초대된 사용자 목록에서 호스트 사용자 제외
    invitedUserIds = invitedUserIds.filter((id) => id !== userId);

    if (invitedUserIds.length === 0) {
      // 자신에게 메시지를 보내는 경우
      console.log("자신에게 메시지를 보냅니다.");
      const chatRoomIds = await findChatRoomsForMe(userId);

      let chatRoom;
      if (chatRoomIds.length > 0) {
        chatRoom = await ChatRoom.findOne({
          where: { roomId: chatRoomIds[0], isGroup: false },
        });
      } else {
        const nextRoomId = await getNextRoomId();
        const user = await getUserById(userId);

        chatRoom = await ChatRoom.create({
          roomId: nextRoomId,
          isGroup: false,
          isSelfChat: true, // 자신과의 채팅인 경우
          participant: true, // 참여 상태를 true로 설정
          hostUserId: userId,
          hostName: user.username,
          hostDepartment: user.department || null,
          hostTeam: user.team || null,
          hostPosition: user.position || null,
          title: null,
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
          }),
        });
      }

      // 자신의 채팅방 참가자 추가
      await ChatRoomParticipant.findOrCreate({
        where: { roomId: chatRoom.roomId, userId },
        defaults: {
          username: (await getUserById(userId)).username,
          department: (await getUserById(userId)).department || null,
          team: (await getUserById(userId)).team || null,
          position: (await getUserById(userId)).position || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // 메시지 저장
      if (content) {
        console.log(`새로운 메시지 전송: ${content}`);
        await sendMessageToRoomParticipants(
          io,
          chatRoom.roomId,
          content,
          userId
        );
      }

      // 클라이언트에게 채팅 방 정보 전송
      socket.emit("chatRoomCreated", {
        roomId: chatRoom.roomId,
        isSelfChat: chatRoom.isSelfChat,
        title: chatRoom.title,
        profileColor: chatRoom.profileColor,
        profileImage: chatRoom.profileImage,
      });

      return;
    }

    // 개인 채팅방은 정확히 한 명의 사용자만 초대하도록 제한
    if (invitedUserIds.length !== 1) {
      console.error(
        "개인 채팅방은 정확히 한 명의 사용자만 초대할 수 있습니다."
      );
      return socket.emit("error", {
        message: "개인 채팅방은 한 명만 초대할 수 있습니다",
      });
    }

    const invitedUserId = invitedUserIds[0];
    const user = await getUserById(userId);
    const targetUser = await getUserById(invitedUserId);

    if (!user || !targetUser) {
      console.error("사용자 또는 초대된 사용자를 찾을 수 없습니다.");
      return socket.emit("error", { message: "사용자를 찾을 수 없습니다" });
    }

    // 상호 채팅방 검색 시 isGroup: false 필터링 추가
    const mutualChatRoomIds = await findMutualChatRoomsForUsers(
      userId,
      invitedUserId
    );

    let chatRoom;
    let created = false;

    if (mutualChatRoomIds.length > 0) {
      // 이미 존재하는 개인 채팅방 사용
      chatRoom = await ChatRoom.findOne({
        where: { roomId: mutualChatRoomIds[0], isGroup: false },
      });
      if (!chatRoom) {
        // 만약 기존 채팅방이 그룹 채팅방이라면 새로 생성
        mutualChatRoomIds.shift(); // 첫 번째 결과가 그룹 채팅방인 경우 제거
      }

      if (chatRoom) {
        await ChatRoomParticipant.update(
          { participant: false },
          { where: { roomId: chatRoom.roomId, userId: userId } }
        );
        await ChatRoomParticipant.update(
          { participant: false },
          { where: { roomId: chatRoom.roomId, userId: invitedUserId } }
        );
    }
    }

    if (!chatRoom) {
      const nextRoomId = await getNextRoomId();
      chatRoom = await ChatRoom.create({
        roomId: nextRoomId,
        isGroup: false,
        isSelfChat: false, // 개인 채팅방인 경우
        participant: true, // 참여 상태를 true로 설정
        hostUserId: userId,
        hostName: user.username,
        hostDepartment: user.department,
        hostTeam: user.team,
        hostPosition: user.position,
        title: null,
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
          [invitedUserId]: {
            userId: invitedUserId,
            username: targetUser.username,
            company: targetUser.company || null,
            department: targetUser.department || null,
            team: targetUser.team || null,
            position: targetUser.position || null,
            spot: targetUser.spot || null,
            attachment: targetUser.attachment || null,
          },
        }),
      });
      created = true;
    }

    // 채팅방 참가자 추가
    if (created) {
      await ChatRoomParticipant.bulkCreate(
        [
          {
            roomId: chatRoom.roomId,
            userId,
            username: user.username,
            department: user.department || null,
            team: user.team || null,
            position: user.position || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roomId: chatRoom.roomId,
            userId: invitedUserId,
            username: targetUser.username,
            department: targetUser.department || null,
            team: targetUser.team || null,
            position: targetUser.position || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { updateOnDuplicate: ["roomId", "userId"] }
      );
    }
    // await sendUserChatRooms(socket, userId);
    
    // 메시지 전송
    if (content) {
      console.log(`새로운 메시지 전송: ${content}`);
      await sendMessageToRoomParticipants(io, chatRoom.roomId, content, userId);
    }

    // 채팅방 제목 설정
    const othertitle = getOthertitle(
      chatRoom,
      parseUserTitle(chatRoom.userTitle, userId),
      userId
    );

    // 클라이언트에게 채팅방 생성 이벤트 전송
    socket.emit("chatRoomCreated", {
      roomId: chatRoom.roomId,
      isSelfChat: chatRoom.isSelfChat,
      title: othertitle,
      profileColor: chatRoom.profileColor,
      profileImage: chatRoom.profileImage,
    });
  } catch (error) {
    console.error("채팅방 생성 오류:", error);
    socket.emit("error", { message: "채팅방 생성 중 오류 발생" });
  }
};

// 채팅방 조회 후 클라이언트에게 파싱
const sendUserChatRooms = async (socket, userId) => {
  try {
    // 사용자가 참여한 채팅방 목록 조회
    const chatRooms = await ChatRoomParticipant.findAll({
      where: {
        userId,
        participant: false, // 참여 중인 상태만 필터링
      },
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
      const room = participant.ChatRoom;

      if (!roomParticipantsMap[roomId]) {
        const roomData = room.toJSON();
        const userTitle = parseUserTitle(roomData.userTitle, userId);

        // 단체방인 경우 ChatRoom의 title을 사용
        let othertitle;
        let isSelfChat = false;
        if (roomData.isGroup) {
          othertitle = roomData.title; // 단체방 제목 사용
        } else {
          othertitle = getOthertitle(roomData, userTitle, userId); // 개인방은 기존 방식대로 처리

          // 개인 (나와의 채팅) 여부 판단
          const participants = await ChatRoomParticipant.findAll({
            where: { roomId },
          });
          if (participants.length === 1 && participants[0].userId === userId) {
            isSelfChat = true;
          }
        }

        roomParticipantsMap[roomId] = {
          othertitle,
          userTitle,
          dataValues: roomData,
          isSelfChat,
        };
      }
    }

    // 필터링된 채팅방 목록을 클라이언트에 전송
    socket.emit("chatRooms", Object.values(roomParticipantsMap));
  } catch (error) {
    socket.emit("error", { message: "채팅방 조회 오류" });
  }
};

// 채팅방에 참여
const joinRoom = async (io, socket, roomId) => {
  try {
    if (!roomId || roomId <= 0) {
      throw new Error("유효하지 않은 방 ID입니다.");
    }

    const chatRoom = await ChatRoom.findOne({ where: { roomId } });

    if (chatRoom) {
      const userId = socket.userId;

      if (!userId) {
        return socket.emit("error", {
          message: "유저 ID가 정의되지 않았습니다.",
        });
      }

      const isMember = await ChatRoomParticipant.findOne({
        where: { roomId, userId },
      });

      if (!isMember) {
        // 사용자가 이미 멤버가 아니라면 방에 참가자로 추가
        await ChatRoomParticipant.create({
          roomId,
          userId,
          username: (await getUserById(userId)).username,
          department: (await getUserById(userId)).department || null,
          team: (await getUserById(userId)).team || null,
          position: (await getUserById(userId)).position || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      socket.join(roomId.toString()); // 방에 참여

      // 1:1 채팅인지 확인
      const participantsCount = await ChatRoomParticipant.count({
        where: { roomId },
      });

      if (participantsCount === 2 && !chatRoom.isGroup) {
        // 개인 채팅방이면 createPrivateRoom 호출
        const invitedUserId = (await ChatRoomParticipant.findAll({
          where: { roomId, userId: { [Op.ne]: userId } },
        })).map(participant => participant.userId)[0];

        if (invitedUserId) {
          await createPrivateRoom(io, socket, {
            userId,
            invitedUserIds: [invitedUserId],
          });
        }
      }

      socket.emit("roomJoined", { roomId });
    } else {
      socket.emit("error", { message: "방을 찾을 수 없습니다" });
    }
  } catch (error) {
    socket.emit("error", { message: "채팅방 참여 서버 오류" });
  }
};

// 채팅방에서 나가기 -----------------------------------------------------------------------------------------------------
const exitRoom = async (io, socket, data) => {
  const { roomId, userId } = data;

  try {
    // 채팅방 정보 가져오기
    const chatRoom = await ChatRoom.findByPk(roomId);

    if (!chatRoom) {
      socket.emit("error", { message: "채팅방을 찾을 수 없습니다." });
      return;
    }

    // 참가자 정보 가져오기
    const participants = await ChatRoomParticipant.findAll({
      where: { roomId },
    });

    // 1. 자신과의 채팅 (Self Chat) 처리
    if (chatRoom.isSelfChat) {
      // 모든 관련 정보 삭제 (채팅방, 참가자, 메시지)
      await ChatRoomParticipant.destroy({ where: { roomId } });
      await Message.destroy({ where: { roomId } });
      await ChatRoom.destroy({ where: { roomId } });

      // 삭제 알림 전송
      socket.emit("chatRoomDeleted", {
        message: `${roomId}의 채팅방이 삭제되었습니다.`,
      });
      return;
    }

    // 2. 개인 채팅 (1:1 채팅) 처리
    if (!chatRoom.isGroup && participants.length === 2) {
      // 나가는 사용자의 상태를 업데이트
      await ChatRoomParticipant.update(
        { participant: true },
        { where: { roomId, userId } }
      );

      // 나간 후 남은 사용자에게 알림
      const remainingUser = participants.find((p) => p.userId !== userId);
      if (remainingUser) {
        socket.to(roomId).emit("roomUpdated", {
          roomId,
          message: `${userId}님이 방을 나갔습니다.`,
        });
      }

      // 모든 참가자가 나간 경우 방과 메시지 삭제
      const updatedParticipants = await ChatRoomParticipant.findAll({
        where: { roomId, participant: true },
      });

      if (updatedParticipants.length === participants.length) {
        await ChatRoomParticipant.destroy({ where: { roomId } });
        await Message.destroy({ where: { roomId } });
        await ChatRoom.destroy({ where: { roomId } });
        
        socket.emit("chatRoomDeleted", {
          message: `${roomId}의 채팅방이 삭제되었습니다.`,
        });
      }
      return;
    }

    // 3. 단체 채팅방 (Group Chat) 처리
    if (chatRoom.isGroup) {
      // 나가는 사용자의 상태를 업데이트
      await ChatRoomParticipant.update(
        { participant: false },
        { where: { roomId, userId } }
      );

      // 남은 사용자에게 알림
      const remainingUser = participants.find((p) => p.userId !== userId);
      if (remainingUser) {
        socket.to(roomId).emit("roomUpdated", {
          roomId,
          message: `${userId}님이 방을 나갔습니다.`,
        });
      }

      // 모든 참가자가 나간 경우 방과 메시지 삭제
      const updatedParticipants = await ChatRoomParticipant.findAll({
        where: { roomId, participant: false },
      });

      if (updatedParticipants.length === participants.length) {
        await ChatRoomParticipant.destroy({ where: { roomId } });
        await Message.destroy({ where: { roomId } });
        await ChatRoom.destroy({ where: { roomId } });

        socket.emit("chatRoomDeleted", {
          message: `${roomId}의 채팅방이 삭제되었습니다.`,
        });
      }
      return;
    }
  } catch (error) {
    console.error("채팅방에서 나가는 중 오류 발생:", error);
    socket.emit("error", { message: "채팅방 나가기 오류" });
  }
};

module.exports = {
  sendUserChatRooms,
  createPrivateRoom,
  joinRoom,
  exitRoom,
};