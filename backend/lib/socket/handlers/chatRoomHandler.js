const models = require("../../models");
const { User, ChatRoom, ChatRoomParticipant, Message } = models;
const { Op, Sequelize } = require("sequelize");
const { sendMessageToRoomParticipants } = require("./messageHandler"); // 함수가 정의된 파일을 임포트


// 새로운 개인 채팅방을 생성하거나 기존 채팅방을 조회
// 생성된 채팅방에 메시지를 저장하고 해당 채팅방의 사용자들에게 메시지를 전송
const createPrivateRoom = async (io, socket, data) => {
  try {
    console.log("서버에서 수신한 데이터:", data);

    const { userId, content, invitedUserIds } = data;

    // 현재 사용자와 초대된 사용자들을 조회
    const user = await User.findOne({ where: { userId } });
    const targets = await User.findAll({ where: { userId: invitedUserIds } });

    if (!user || targets.length !== invitedUserIds.length) {
      return socket.emit("error", { message: "사용자를 찾을 수 없습니다" });
    }

    // 초대된 사용자들의 정보를 배열로 생성
    const invitedUsers = targets.map(target => ({
      userId: target.userId,
      username: target.username,
      department: target.department,
      team: target.team,
      position: target.position,
    }));

    // 사용자 이름에 팀 이름을 붙여서 생성
    const userDisplayName = `${user.team} ${user.username}`;
    const invitedUserDisplayName = `${invitedUsers[0]?.team} ${invitedUsers[0]?.username}`;

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
                WHERE userId IN (${invitedUserIds.map(id => `'${id}'`).join(", ")}, '${userId}')
                GROUP BY roomId
                HAVING COUNT(*) = ${invitedUserIds.length + 1}
              )`),
            }
          }
        ],
      },
      defaults: {
        isGroup: false,
        hostUserId: userId,
        hostName: user.username,
        hostDepartment: user.department,
        hostTeam: user.team,
        hostPosition: user.position,
        title: invitedUserDisplayName || null,
        userTitle: JSON.stringify(
          invitedUsers.reduce((acc, invitedUser) => {
            acc[userId] = `${invitedUser.team} ${invitedUser.username}`;  // 현재 사용자에게 상대방의 팀과 이름을 보여줌
            acc[invitedUser.userId] = userDisplayName;  // 초대된 사용자에게는 현재 사용자의 팀과 이름을 보여줌
            return acc;
          }, {})
        ),
      },
    });

    if (created) {
      // 채팅방에 참가자를 추가
      const participants = [
        ...invitedUsers.map(invitedUser => ({
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
    sendUserChatRooms(socket, userId);

    // 생성된 채팅방의 메시지 저장 및 전송
    await sendMessageToRoomParticipants(io, chatRoom.roomId, content, userId);
  } catch (error) {
    console.error("채팅방 생성 및 메시지 저장 오류:", error);
    socket.emit("error", { message: "채팅 생성 서버 오류" });
  }
};

const sendUserChatRooms = async (socket, userId) => {
  try {
    const chatRooms = await ChatRoomParticipant.findAll({
      where: { userId },
      include: [{ model: ChatRoom }],
    });
  
    // 각 사용자가 참여한 채팅방의 userTitle을 파싱해서 각 사용자에게 맞는 제목을 설정
    const roomsWithDetails = chatRooms.map(participant => {
      const room = participant.ChatRoom;
      const userTitle = JSON.parse(room.userTitle || '{}');
      const title = userTitle[userId] || room.title;
      return { ...room, title };
    });

    // 채팅방 목록을 클라이언트에 전송합니다.
    socket.emit("chatRooms", roomsWithDetails);
  } catch (error) {
    console.error("채팅방 조회 오류:", error);
    socket.emit("error", { message: "채팅방 조회 오류" });
  }
};

// 채팅방에 참여
const joinRoom = async (socket, roomId) => {
  try {
    const chatRoom = await ChatRoom.findOne({ where: { roomId } });

    if (chatRoom) {
      const userId = socket.id; // Verify if this should be used

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
  joinRoom,
  exitRoom,
};