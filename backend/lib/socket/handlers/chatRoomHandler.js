const models = require("../../models");
const { User, ChatRoom, ChatRoomParticipant, Message } = models;
const { Op, Sequelize } = require("sequelize");
const { sendMessageToRoomParticipants } = require("./messageHandler");

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
        // 개인 채팅방일 경우 title을 설정하지 않음
        title: null,
        userTitle: JSON.stringify(
          invitedUsers.reduce((acc, invitedUser) => {
            acc[userId] = {
              userId,
              username: user.username,
              company: user.company || null,
              department: user.department || null,
              team: user.team || null,
              position: user.position || null,
              spot: user.spot || null,
              attachment: user.attachment || null,
            };
            acc[invitedUser.userId] = invitedUser; // 초대된 사용자에 대한 정보
            return acc;
          }, {})
        ),
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
    sendUserChatRooms(socket, userId);

    // 전체 채팅방 목록을 클라이언트에 전송
    const allChatRooms = await ChatRoom.findAll({
      include: [{ model: ChatRoomParticipant }],
    });

    io.emit(
      "chatRooms",
      allChatRooms.map((room) => {
        const roomData = room.toJSON(); // Sequelize 모델 인스턴스를 JSON으로 변환

        // userTitle이 문자열일 경우만 파싱
        let userTitle;
        if (roomData.userTitle && typeof roomData.userTitle === "string") {
          try {
            userTitle = JSON.parse(roomData.userTitle);
          } catch (error) {
            console.error("userTitle 파싱 오류:", error);
            userTitle = {};
          }
        } else {
          userTitle = roomData.userTitle || {};
        }

        // othertitle 변수를 정의하고 사용
        let othertitle;
        if (roomData.isGroup) {
          // 단체방의 경우 기존 제목을 사용
          othertitle = roomData.title;
        } else {
          // 개인 채팅방의 경우 상대방의 이름을 제목으로 설정
          const otherUserId = Object.keys(userTitle).find((id) => id !== userId);
          if (otherUserId) {
            const otherUser = userTitle[otherUserId];
            if (otherUser.team) {
              othertitle = `${otherUser.team} ${otherUser.username}`;
            } else if (otherUser.department) {
              othertitle = `${otherUser.department} ${otherUser.username}`;
            } else {
              othertitle = otherUser.username;
            }
          } else {
            othertitle = roomData.title;
          }
        }

        // 필요한 필드만 포함된 객체를 반환
        return {
          othertitle,
          userTitle,
          dataValues: roomData,
        };
      })
    );

    // 생성된 채팅방의 메시지 저장 및 전송
    await sendMessageToRoomParticipants(io, chatRoom.roomId, content, userId);
  } catch (error) {
    console.error("채팅방 생성 및 메시지 저장 오류:", error);
    socket.emit("error", { message: "채팅 생성 서버 오류" });
  }
};

// 채팅방 조회 후 클라이언트에게 파싱
const sendUserChatRooms = async (socket, userId) => {
  try {
    const chatRooms = await ChatRoomParticipant.findAll({
      where: { userId },
      include: [{ model: ChatRoom }],
    });

    // 각 사용자가 참여한 채팅방의 userTitle을 파싱해서 각 사용자에게 맞는 제목을 설정
    const roomsWithDetails = chatRooms.map((participant) => {
      const room = participant.ChatRoom;
      const roomData = room.toJSON(); // Sequelize 모델 인스턴스를 JSON으로 변환

      const userTitle = JSON.parse(roomData.userTitle || "{}");

      // 현재 로그인된 사용자(userId)를 제외한 첫 번째 사용자의 제목을 제목으로 설정
      let othertitle;
      if (roomData.isGroup) {
        // 단체방의 경우 기존 제목을 사용
        othertitle = roomData.title;
      } else {
        // 개인 채팅방의 경우 상대방의 이름을 제목으로 설정
        const otherUserId = Object.keys(userTitle).find((id) => id !== userId);
        if (otherUserId) {
          const otherUser = userTitle[otherUserId];
          if (otherUser.team) {
            othertitle = `${otherUser.team} ${otherUser.username}`;
          } else if (otherUser.department) {
            othertitle = `${otherUser.department} ${otherUser.username}`;
          } else {
            othertitle = otherUser.username;
          }
        } else {
          othertitle = roomData.title;
        }
      }

      console.log("클라이언트에게 전달될 제목:", othertitle);

      return {
        othertitle,
        userTitle,
        dataValues: roomData,
      };
    });

    // 채팅방 목록을 클라이언트에 전송합니다.
    socket.emit("chatRooms", roomsWithDetails);

    console.log("최종 채팅방 목록:", roomsWithDetails);
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
      const userId = socket.id; // 사용자 ID를 적절히 설정

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