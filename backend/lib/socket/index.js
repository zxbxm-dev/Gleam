const chatRoomEvents = require('./events/chatRoomEvents');
const messageEvents = require('./events/messageEvents');

module.exports = (io) => {
  // 사용자 연결 처리
  io.on('connection', (socket) => {
    console.log('사용자가 연결됨:', socket.id);

    // 이벤트 핸들러 등록
    chatRoomEvents(io, socket);
    messageEvents(io, socket);

    // 사용자 연결 해제 처리
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
