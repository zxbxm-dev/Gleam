const models = require('../../models');
const ChatRoom = models.ChatRoom;
const Message = models.Message;
const User = models.User;
const { Op } = require('sequelize');

// 사용자가 참여한 채팅방 목록을 조회하여 클라이언트에 전송
const sendUserChatRooms = async (socket, userId) => {
  if (!userId) {
    console.error('Invalid userId:', userId);
    return socket.emit('error', { message: '유효하지 않은 사용자 ID입니다.' });
  }

  try {
    const chatRooms = await ChatRoom.findAll({
      where: {
        [Op.or]: [
          { hostUserId: userId }, // 사용자가 방장인 채팅방
          {
            invitedUsers: {
              [Op.or]: [
                { [Op.like]: `%${userId}%` }, // 사용자가 초대된 채팅방 (일반 텍스트 검색용)
                { [Op.jsonContains]: JSON.stringify([userId]) } // JSON 배열 검색용
              ]
            }
          }
        ]
      }
    });

    // 각 채팅방에 대해 사용자 정보를 추가하여 클라이언트에 전송
    const chatRoomData = await Promise.all(
      chatRooms.map(async (room) => {
        const roomJson = room.toJSON();
        
        // `invitedUsers`가 JSON 문자열일 경우 파싱
        if (typeof roomJson.invitedUsers === 'string') {
          roomJson.invitedUsers = JSON.parse(roomJson.invitedUsers);
        }

        // 방장과 초대된 사용자의 정보를 포함
        const hostUser = await User.findOne({ where: { userId: roomJson.hostUserId } });
        roomJson.hostUser = hostUser ? {
          userId: hostUser.userId,
          username: hostUser.username || null,
          department: hostUser.department || null,
          team: hostUser.team || null,
          position: hostUser.position || null
        } : null;

        roomJson.invitedUsers = await Promise.all(
          roomJson.invitedUsers.map(async (invitedUser) => {
            const user = await User.findOne({ where: { userId: invitedUser.userId } });
            return user ? {
              userId: user.userId,
              username: user.username || null,
              department: user.department || null,
              team: user.team || null,
              position: user.position || null
            } : null;
          })
        );

        return roomJson;
      })
    );

    socket.emit('chatRooms', chatRoomData);
  } catch (error) {
    console.error('채팅방 조회 오류:', error);
    socket.emit('error', { message: '채팅방 조회 오류' });
  }
};

// 새로운 채팅방을 생성하거나 기존 채팅방을 조회
const createPrivateRoom = async (io, socket, data) => {
  const { userId, content, invitedUserIds } = data;

  if (!userId || !Array.isArray(invitedUserIds)) {
    console.error('Invalid parameters:', { userId, invitedUserIds });
    return socket.emit('error', { message: '유효하지 않은 요청 데이터입니다.' });
  }

  try {
    // 사용자와 초대된 사용자의 정보를 조회
    const user = await User.findOne({ where: { userId } });
    const targets = await User.findAll({ where: { userId: invitedUserIds } });

    if (!user || targets.length !== invitedUserIds.length) {
      return socket.emit('error', { message: '사용자를 찾을 수 없습니다' });
    }

    const invitedUsers = targets.map(target => ({
      userId: target.userId,
      username: target.username || null,
      department: target.department || null,
      team: target.team || null,
      position: target.position || null
    }));

    let title = null;
    let hostDepartment = user.department || null;
    let hostTeam = user.team || null;
    let hostPosition = user.position || null;
    let hostName = user.username || null;

    // 기존 채팅방이 있는지 확인
    let chatRoom = await ChatRoom.findOne({
      where: {
        isGroup: false,  // 개인 채팅인 경우
        [Op.or]: [
          {
            [Op.and]: [
              { hostUserId: userId },
              { invitedUsers: { [Op.jsonContains]: JSON.stringify(invitedUserIds) } }
            ]
          },
          {
            [Op.and]: [
              { hostUserId: { [Op.in]: invitedUserIds } },
              { invitedUsers: { [Op.jsonContains]: JSON.stringify([userId]) } }
            ]
          }
        ]
      }
    });

    if (!chatRoom) {
      // 개인 메시지의 경우 방 제목 설정
      if (invitedUserIds.length === 1) {
        const invitedUser = targets[0];
        title = `${invitedUser.team || invitedUser.department || ''} ${invitedUser.username}`;
      }

      // 채팅방 생성
      chatRoom = await ChatRoom.create({
        isGroup: false,  // 개인 채팅인 경우
        hostUserId: userId,
        hostName,
        hostDepartment,
        hostTeam,
        hostPosition,
        invitedUsers: JSON.stringify(invitedUsers),
        title,
      });
      console.log('새로운 채팅방이 생성되었습니다:', chatRoom.roomId);
    } else {
      console.log('기존 채팅방을 찾았습니다:', chatRoom.roomId);
    }

    // 메시지 저장
    const savedMessage = await Message.create({
      content,
      userId,
      roomId: chatRoom.roomId,
    });

    // 메시지를 채팅방에 전송
    io.to(chatRoom.roomId.toString()).emit('message', {
      ...savedMessage.toJSON(),
      userId,
      timestamp: savedMessage.createdAt,
      title,
      invitedUsers: chatRoom.invitedUsers,
      hostUser: {
        userId: userId,
        username: user.username,
        department: hostDepartment,
        team: hostTeam,
        position: hostPosition
      }
    });

    console.log('채팅방이 생성되었고, 메시지가 저장되었습니다.');

    // 사용자에게 채팅방 목록 전송
    sendUserChatRooms(socket, userId);
    io.emit('chatRooms', (await ChatRoom.findAll()).map(room => room.toJSON()));
  } catch (error) {
    console.error('채팅방 생성 및 메시지 저장 오류:', error);
    socket.emit('error', { message: '채팅 생성 서버 오류' });
  }
};


// 채팅방에 참여
const joinRoom = async (socket, roomId) => {
  try {
    const chatRoom = await ChatRoom.findOne({ where: { roomId } });

    if (chatRoom) {
      const userId = socket.id;
      const invitedUsers = chatRoom.invitedUsers;

      // 사용자가 해당 채팅방의 멤버인지 확인
      const isMember = chatRoom.hostUserId === userId || invitedUsers.some(user => user.userId === userId);

      if (isMember) {
        socket.join(roomId.toString());  // 채팅방에 참여
        console.log(`합류한 유저: ${socket.id} 합류한 방: ${roomId}`);
      } else {
        socket.emit('error', { message: '이 방에 참여할 권한이 없습니다.' });
      }
    } else {
      socket.emit('error', { message: '방을 찾을 수 없습니다' });
    }
  } catch (error) {
    console.error('채팅방에 참여하는 중에 오류가 발생했습니다.:', error);
    socket.emit('error', { message: '채팅방 참여 서버 오류' });
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
  exitRoom
};