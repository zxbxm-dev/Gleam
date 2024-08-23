const models = require("../../models");
const { ChatRoom, ChatRoomParticipant, Message } = models;
const { Op, Sequelize } = require("sequelize");

// 사용자가 참여한 채팅방 목록을 조회하여 클라이언트에 전송
const sendUserChatRooms = async (socket, userId) => {
  try {
    const chatRooms = await ChatRoomParticipant.findAll({
      where: { userId },
      include: [{ model: ChatRoom }],
    });

    const roomsWithDetails = chatRooms.map(
      (participant) => participant.ChatRoom
    );

    socket.emit("chatRooms", roomsWithDetails);
  } catch (error) {
    console.error("채팅방 조회 오류:", error);
    socket.emit("error", { message: "채팅방 조회 오류" });
  }
};

// 새로운 채팅방을 생성하거나 기존 채팅방을 조회
const createPrivateRoom = async (io, socket, data) => {
  try {
    console.log("서버에서 수신한 데이터:", data);

    const { userId, content, invitedUserIds } = data;

    // 사용자의 정보와 초대된 사용자들의 정보를 조회
    const user = await models.User.findOne({ where: { userId } });
    const targets = await models.User.findAll({
      where: { userId: invitedUserIds },
    });

    if (!user || targets.length !== invitedUserIds.length) {
      return socket.emit("error", { message: "사용자를 찾을 수 없습니다" });
    }

    // 초대된 사용자의 정보와 이름을 배열로 생성
    const invitedUsers = targets.map((target) => ({
      userId: target.userId,
      username: target.username,
      department: target.department,
      team: target.team,
      position: target.position,
    }));

    // 기존 채팅방을 조회
    let chatRoom = await ChatRoom.findOne({
      where: {
        isGroup: false,
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
    });

    if (!chatRoom) {
      // 새로운 채팅방 생성
      const otherUser = invitedUsers[0]; // 초대된 사용자가 1명일 때 상대방

      // 각 사용자의 관점에서 상대방의 이름을 제목으로 설정
      const userTitle = JSON.stringify({
        [userId]: otherUser.username, // A 사용자에게는 B의 이름
        [otherUser.userId]: user.username, // B 사용자에게는 A의 이름
      });

      chatRoom = await ChatRoom.create({
        isGroup: false,
        hostUserId: userId,
        hostName: user.username,
        hostDepartment: user.department,
        hostTeam: user.team,
        hostPosition: user.position,
        title: otherUser.username, // 기본 제목 설정
        userTitle: userTitle, // JSON 형태로 저장된 사용자별 제목
      });

      // 채팅방 참가자 추가
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

    // 메시지를 데이터베이스에 저장
    const savedMessage = await Message.create({
      content,
      userId,
      roomId: chatRoom.roomId,
    });

    // 저장된 메시지를 해당 채팅방의 모든 사용자에게 전송
    io.to(chatRoom.roomId.toString()).emit("message", {
      ...savedMessage.toJSON(),
      userId,
      timestamp: savedMessage.createdAt,
      title: chatRoom.title,
    });

    console.log("메시지가 저장되고, 채팅방에 전송되었습니다.");

    // 채팅방 목록을 클라이언트에게 전달
    sendUserChatRooms(socket, userId);
  } catch (error) {
    console.error("채팅방 생성 및 메시지 저장 오류:", error);
    socket.emit("error", { message: "채팅 생성 서버 오류" });
  }
};

// 채팅방에 참여한 사용자들에게만 메시지를 전송하는 함수
const sendMessageToRoomParticipants = async (io, roomId, content, senderId) => {
  try {
    // 채팅방의 참여자 정보를 조회
    const participants = await ChatRoomParticipant.findAll({
      where: { roomId },
    });

    if (participants.length === 0) {
      console.error("채팅방에 참여자가 없습니다.");
      return;
    }

    // 참여자의 ID 목록을 추출
    const participantIds = participants.map((p) => p.userId);

    // 메시지를 데이터베이스에 저장
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

// 채팅방에 참여
const joinRoom = async (socket, roomId) => {
  try {
    const chatRoom = await ChatRoom.findOne({ where: { roomId } });

    if (chatRoom) {
      const userId = socket.id;

      // 사용자가 해당 채팅방의 멤버인지 확인
      const isMember = await ChatRoomParticipant.findOne({
        where: { roomId, userId },
      });

      if (isMember) {
        socket.join(roomId.toString()); // 채팅방에 참여
        console.log(`합류한 유저: ${socket.id} 합류한 방: ${roomId}`);
      } else {
        socket.emit("error", { message: "이 방에 참여할 권한이 없습니다." });
      }
    } else {
      socket.emit("error", { message: "방을 찾을 수 없습니다" });
    }
  } catch (error) {
    console.error("채팅방에 참여하는 중에 오류가 발생했습니다.:", error);
    socket.emit("error", { message: "채팅방 참여 서버 오류" });
  }
};

// 채팅방에서 나가기
const exitRoom = (socket, roomId) => {
  socket.leave(roomId.toString());
  console.log(`User ${socket.id} left room ${roomId}`);
};

module.exports = {
  sendUserChatRooms,
  createPrivateRoom,
  sendMessageToRoomParticipants,
  joinRoom,
  exitRoom,
};
