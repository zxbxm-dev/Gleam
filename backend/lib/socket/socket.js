const models = require('../models');
const ChatRoom = models.ChatRoom;
const Message = models.Message;
const User = models.User;
const { Op } = require('sequelize');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('사용자가 연결됨:', socket.id);

    // 사용자 ID로 모든 참여 채팅방을 조회하여 클라이언트에게 전달
    const sendUserChatRooms = async (userId) => {
      try {
        // 사용자가 참여한 모든 채팅방 조회
        const chatRooms = await ChatRoom.findAll({
          where: {
            [Op.or]: [
              { hostUserId: userId },
              {
                invitedUserIds: {
                  [Op.like]: `%${userId}%`
                }
              }
            ]
          }
        });

        // 클라이언트에게 채팅방 리스트 전송
        socket.emit('chatRooms', chatRooms.map(room => room.toJSON()));
      } catch (error) {
        console.error('채팅방 조회 오류:', error);
        socket.emit('error', { message: '채팅방 조회 오류' });
      }
    };

    // 클라이언트 연결 시 사용자 ID로 모든 참여 채팅방 전달
    socket.on('getChatRooms', async (userId) => {
      await sendUserChatRooms(userId);
    });

    // 'createPrivateRoom' 이벤트를 처리하는 함수
    socket.on('createPrivateRoom', async (data) => {
      try {
        const { userId, content, invitedUserIds } = data;

        // 요청한 사용자의 정보를 데이터베이스에서 조회
        const user = await User.findOne({ where: { userId } });
        // 초대된 사용자들의 정보를 데이터베이스에서 조회
        const targets = await User.findAll({ where: { userId: invitedUserIds } });

        // 사용자가 없거나 초대된 사용자가 모두 조회되지 않은 경우 에러를 반환
        if (!user || targets.length !== invitedUserIds.length) {
          return socket.emit('error', { message: '사용자를 찾을 수 없습니다' });
        }

        // 초대된 사용자 수에 따라 개인방 또는 그룹방 여부를 설정
        const isGroup = invitedUserIds.length > 1;

        // 초대된 사용자 ID를 정렬하고 문자열로 변환
        const sortedInvitedUserIds = invitedUserIds.slice().sort().join(',');

        // 기존의 동일한 사용자 간의 채팅방이 있는지 확인
        let chatRoom = await ChatRoom.findOne({
          where: {
            isGroup,
            [Op.or]: [
              {
                hostUserId: userId,
                invitedUserIds: {
                  [Op.like]: `%${sortedInvitedUserIds}%`
                }
              },
              {
                hostUserId: {
                  [Op.in]: invitedUserIds,
                },
                invitedUserIds: {
                  [Op.like]: `%${userId}%`
                }
              }
            ]
          }
        });

        let title = null;

        // 기존 채팅방이 없을 경우, 새로 생성
        if (!chatRoom) {
          // 개인 메신저일 경우에만 방 제목을 설정
          if (!isGroup) {
            const invitedUser = targets[0]; // 개인 메시지의 경우 초대된 사용자는 한 명입니다.
            
            // team이 없으면 department로 대체
            const teamOrDepartment = invitedUser.team || invitedUser.department;
            title = `${teamOrDepartment} ${invitedUser.username}`;
          }

          chatRoom = await ChatRoom.create({
            isGroup,
            hostUserId: userId,
            invitedUserIds: JSON.stringify(invitedUserIds),
            title, // 방 제목을 저장 (개인 메신저일 경우에만 설정됨)
          });
          console.log('새로운 채팅방이 생성되었습니다:', chatRoom.roomId);
        } else {
          console.log('기존 채팅방을 찾았습니다:', chatRoom.roomId);
        }

        // 방 제목 로그로 확인
        if (title) {
          console.log(`채팅방 제목: ${title}`); //삭제해도 무방함
        }

        // 메시지를 데이터베이스에 저장
        const savedMessage = await Message.create({
          content,
          userId,
          roomId: chatRoom.roomId,
        });

        // 저장된 메시지를 해당 채팅방의 모든 사용자에게 전송
        io.to(chatRoom.roomId.toString()).emit('message', {
          ...savedMessage.toJSON(),
          userId,
          timestamp: savedMessage.createdAt,
          title,  // 클라이언트에게 방 제목을 반환
        });

        console.log('채팅방이 생성되었고, 메시지가 저장되었습니다.');

        // 새로 생성된 채팅방을 클라이언트에게 전달
        sendUserChatRooms(userId);
      } catch (error) {
        console.error('채팅방 생성 및 메시지 저장 오류:', error);
        socket.emit('error', { message: '채팅 생성 서버 오류' });
      }
    });

    // 'joinRoom' 이벤트를 처리하는 함수
    socket.on('joinRoom', async (roomId) => {
      try {
        // 주어진 roomId로 채팅방을 조회
        const chatRoom = await ChatRoom.findOne({ where: { roomId } });

        if (chatRoom) {
          const userId = socket.id;
          const invitedUserIds = JSON.parse(chatRoom.invitedUserIds);

          // 사용자가 해당 채팅방의 멤버인지 확인
          const isMember = chatRoom.hostUserId === userId || invitedUserIds.includes(userId);

          if (isMember) {
            // 채팅방의 멤버인 경우, 채팅방에 참여
            socket.join(roomId.toString());
            console.log(`합류한 유저: ${socket.id} 합류한 방: ${roomId}`);
          } else {
            // 채팅방의 멤버가 아닌 경우, 에러 메시지를 반환
            socket.emit('error', { message: '이 방에 참여할 권한이 없습니다.' });
          }
        } else {
          // 채팅방을 찾지 못한 경우, 에러 메시지를 반환
          socket.emit('error', { message: '방을 찾을 수 없습니다' });
        }
      } catch (error) {
        console.error('채팅방에 참여하는 중에 오류가 발생했습니다.:', error);
        socket.emit('error', { message: '채팅방 참여 서버 오류' });
      }
    });

    // 'exitRoom' 이벤트를 처리하는 함수
    socket.on('exitRoom', (roomId) => {
      socket.leave(roomId.toString());
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    // 'fetchMessages' 이벤트를 처리하는 함수
    socket.on('fetchMessages', async (data) => {
      try {
        const { roomId, limit = 50, offset = 0 } = data;

        // 방의 과거 메시지들을 데이터베이스에서 조회
        const messages = await Message.findAll({
          where: { roomId },
          limit,    // 가져올 메시지 수
          offset,   // 시작 위치
          order: [['createdAt', 'ASC']] // 메시지 생성일 기준으로 오름차순 정렬
        });

        // 클라이언트에게 메시지 목록 전송
        socket.emit('messages', messages.map(message => message.toJSON()));
      } catch (error) {
        console.error('과거 메시지 조회 오류:', error);
        socket.emit('error', { message: '메시지 조회 서버 오류' });
      }
    });

    // 사용자가 연결을 끊었을 때 처리하는 함수
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};