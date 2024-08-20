const models = require('../../models');
const Message = models.Message;

// 채팅방의 메시지를 조회
const fetchMessages = async (socket, data) => {
  try {
    // 클라이언트로부터 받은 데이터에서 roomId(채팅방 ID), limit(가져올 메시지 수), offset(시작 위치)을 추출
    const { roomId, limit = 25, offset = 0 } = data;

    const messages = await Message.findAll({
      where: { roomId }, // 조회할 채팅방의 ID
      limit, // 가져올 메시지의 최대 수 (한번에 가져올 메신저의 최대 갯수, 한번 요청에 대해 최대 25개를 가져오고 있음)
      offset, // 메시지의 시작 위치
      order: [['createdAt', 'ASC']] // 메시지 생성일을 기준으로 오름차순 정렬
      // order: [['createdAt', 'DESC']] // 최신 메시지부터 내림차순 정렬하고 싶을때 사용
    });

    // 조회된 메시지를 JSON 형식으로 변환하여 클라이언트에 전송
    socket.emit('messages', messages.map(message => message.toJSON()));
  } catch (error) {
    console.error('과거 메시지 조회 오류:', error);
    socket.emit('error', { message: '메시지 조회 서버 오류' });
  }
};

module.exports = {
  fetchMessages
};