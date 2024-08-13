const { ChatRoom, Message, User } = require('../models');
const { Op, Sequelize } = require('sequelize');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // 채팅방 생성 및 메시지 전송 처리
    socket.on("createPrivateRoom", async (data) => {
      try {
        const { userID, message: messageContent, TargetID } = data;

        // 사용자 정보 확인
        const user = await User.findOne({ where: { userId: userID } });
        const targetUser = await User.findOne({ where: { userId: TargetID } });

        if (!user || !targetUser) {
          return socket.emit('error', { message: 'User not found' });
        }

        // 채팅방이 존재하는지 확인
        let chatRoom = await ChatRoom.findOne({
          where: {
            [Op.or]: [
              Sequelize.literal(`(hostUserId = '${userID}' AND JSON_CONTAINS(invitedUserIds, '["${TargetID}"]'))`),
              Sequelize.literal(`(hostUserId = '${TargetID}' AND JSON_CONTAINS(invitedUserIds, '["${userID}"]'))`)
            ]
          }
        });

        if (!chatRoom) {
          const invitedUserIds = [TargetID];
          const isGroup = invitedUserIds.length > 1;

          chatRoom = await ChatRoom.create({
            isGroup: isGroup,
            hostUserId: userID,
            invitedUserIds: invitedUserIds
          });
        }

        // 메시지를 데이터베이스에 저장
        const savedMessage = await Message.create({
          content: messageContent,
          userId: userID,
          roomId: chatRoom.roomId
        });

        // 채팅방에 있는 모든 클라이언트에 메시지 전송
        io.to(chatRoom.roomId).emit("message", {
          ...savedMessage.toJSON(),
          userID,
          timestamp: savedMessage.createdAt
        });

        console.log("채팅방이 생성되었고, 메시지가 저장되었습니다.");
      } catch (error) {
        console.error('채팅방 생성 및 메시지 저장 오류:', error);
        socket.emit('error', { message: 'Internal server error' });
      }
    });

    // 클라이언트가 방에 입장하는 경우
    socket.on('joinRoom', async (roomId) => {
      try {
        // 채팅방 정보 확인
        const chatRoom = await ChatRoom.findOne({ where: { roomId } });

        if (chatRoom) {
          const userID = socket.id;

          // 사용자가 채팅방의 멤버인지 확인
          const isMember = chatRoom.hostUserId === userID || chatRoom.invitedUserIds.includes(userID);

          if (isMember) {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
          } else {
            socket.emit('error', { message: 'Not authorized to join this room' });
          }
        } else {
          socket.emit('error', { message: 'Room not found' });
        }
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Internal server error' });
      }
    });

    // 클라이언트가 방을 나가는 경우
    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    // 연결 해제 처리
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
