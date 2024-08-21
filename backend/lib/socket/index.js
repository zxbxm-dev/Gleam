const chatRoomEvents = require('./events/chatRoomEvents');
const messageEvents = require('./events/messageEvents');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('새로운 사용자 연결:', socket.id);

    // 채팅방 관련 이벤트 처리
    chatRoomEvents(io, socket);

    // 메시지 관련 이벤트 처리
    messageEvents(io, socket);

    // 연결 종료 처리
    socket.on('disconnect', () => {
      console.log('사용자가 연결을 종료함:', socket.id);
    });
  });
};