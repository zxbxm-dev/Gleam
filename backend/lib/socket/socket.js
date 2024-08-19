const models = require('../models');
const ChatRoom = models.ChatRoom;
const Message = models.Message;
const User = models.User;
const { Op } = require('sequelize');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // 'createPrivateRoom' 이벤트를 처리하는 함수
    // 사용자가 개인 또는 그룹 채팅방을 생성하고 메시지를 보내는 요청을 처리합니다.
    socket.on('createPrivateRoom', async (data) => {
      try {
        const { userId, content, invitedUserIds } = data;

        // 요청한 사용자의 정보를 데이터베이스에서 조회합니다.
        const user = await User.findOne({ where: { userId } });
        // 초대된 사용자들의 정보를 데이터베이스에서 조회합니다.
        const targets = await User.findAll({ where: { userId: invitedUserIds } });

        // 사용자가 없거나 초대된 사용자가 모두 조회되지 않은 경우 에러를 반환합니다.
        if (!user || targets.length !== invitedUserIds.length) {
          return socket.emit('error', { message: 'User(s) not found' });
        }

        // 초대된 사용자 수에 따라 개인방 또는 그룹방 여부를 설정합니다.
        const isGroup = invitedUserIds.length > 1;

        // 초대된 사용자 ID를 정렬하고 문자열로 변환합니다.
        const sortedInvitedUserIds = invitedUserIds.slice().sort().join(',');

        // 기존의 동일한 사용자 간의 채팅방이 있는지 확인합니다.
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

        // 기존 채팅방이 없을 경우, 새로 생성합니다.
        if (!chatRoom) {
          chatRoom = await ChatRoom.create({
            isGroup,
            hostUserId: userId,
            invitedUserIds: JSON.stringify(invitedUserIds),
          });
          console.log('New chat room created:', chatRoom.roomId);
        } else {
          console.log('Existing chat room found:', chatRoom.roomId);
        }

        // 메시지를 데이터베이스에 저장합니다.
        const savedMessage = await Message.create({
          content,
          userId,
          roomId: chatRoom.roomId,
        });

        // 저장된 메시지를 해당 채팅방의 모든 사용자에게 전송합니다.
        io.to(chatRoom.roomId.toString()).emit('message', {
          ...savedMessage.toJSON(),
          userId,
          timestamp: savedMessage.createdAt,
        });

        console.log('채팅방이 생성되었고, 메시지가 저장되었습니다.');
      } catch (error) {
        console.error('채팅방 생성 및 메시지 저장 오류:', error);
        socket.emit('error', { message: 'Internal server error' });
      }
    });

    // 'joinRoom' 이벤트를 처리하는 함수
    // 사용자가 특정 채팅방에 참여하는 요청을 처리합니다.
    socket.on('joinRoom', async (roomId) => {
      try {
        // 주어진 roomId로 채팅방을 조회합니다.
        const chatRoom = await ChatRoom.findOne({ where: { roomId } });

        if (chatRoom) {
          const userId = socket.id;
          // 사용자가 해당 채팅방의 멤버인지 확인합니다.
          const isMember = chatRoom.hostUserId === userId || JSON.parse(chatRoom.invitedUserIds).includes(userId);

          if (isMember) {
            // 채팅방의 멤버인 경우, 채팅방에 참여시킵니다.
            socket.join(roomId.toString());
            console.log(`User ${socket.id} joined room ${roomId}`);
          } else {
            // 채팅방의 멤버가 아닌 경우, 에러 메시지를 반환합니다.
            socket.emit('error', { message: 'Not authorized to join this room' });
          }
        } else {
          // 채팅방을 찾지 못한 경우, 에러 메시지를 반환합니다.
          socket.emit('error', { message: 'Room not found' });
        }
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Internal server error' });
      }
    });

    // 'exitRoom' 이벤트를 처리하는 함수
    // 사용자가 특정 채팅방에서 나가는 요청을 처리합니다.
    socket.on('exitRoom', (roomId) => {
      socket.leave(roomId.toString());
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    // 사용자가 연결을 끊었을 때 처리하는 함수
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};