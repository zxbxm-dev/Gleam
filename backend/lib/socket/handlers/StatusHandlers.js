const models = require("../../models");
const { MessageRead, Message, User } = models;

// 특정 메시지를 읽은 것으로 표시 함수 --------------------------------------------------------------
const markMessageAsRead = async (socket, messageId, userId) => {
  try {
    // 메시지가 존재하는지 확인
    const message = await Message.findOne({ where: { messageId: messageId } });
    if (!message) {
      socket.emit("error", { message: "메시지를 찾을 수 없습니다." });
      return;
    }

    // 이미 읽은 메시지인지 확인
    const existingRead = await MessageRead.findOne({
      where: { messageId, userId },
    });

    

    if (!existingRead) {
      // 읽은 상태로 메시지 기록 생성
      await MessageRead.create({
        messageId,
        userId,
        readAt: new Date(), // 현재 시간을 기록
        isRead: true, // 읽음 상태
      });
      socket.emit("messageRead", { messageId, userId });
    } else {
      // 이미 읽은 메시지인 경우, 읽은 시간만 업데이트
      await MessageRead.update(
        { readAt: new Date() },
        { where: { messageId, userId } }
      );
      socket.emit("messageAlreadyRead", { messageId, userId });
    }
  } catch (error) {
    console.error("메시지 읽음 처리 오류:", error);
    socket.emit("error", { message: "메시지 읽음 처리 오류 발생." });
  }
};

// 특정 메시지의 읽음 상태를 조회, 읽은 사용자 확인 함수 --------------------------------------------------------------
const getReadStatus = async (socket, messageId) => {
  try {
    const reads = await MessageRead.findAll({ where: { messageId } });
    const readUserIds = reads.map(read => read.userId);
    socket.emit("readStatus", { messageId, readUserIds });
  } catch (error) {
    console.error("읽음 상태 조회 오류:", error);
    socket.emit("error", { message: "읽음 상태 조회 오류 발생." });
  }
};

// 읽지 않은 메신저 갯수 확인 함수 --------------------------------------------------------------
const countUnreadMessages = async (socket, userId, roomId) => {
  try {
    // 사용자가 읽지 않은 메시지의 ID를 가져오기
    const unreadMessages = await Message.findAll({
      where: {
        roomId, // 특정 방의 메시지를 필터링
      },
      include: [{
        model: MessageRead,
        required: false,
        where: { userId },
        as : 'reads',
      }],
    });

    // 읽지 않은 메시지 카운트
    const unreadCount = unreadMessages.filter(message => 
      !message.MessageReads || message.MessageReads.length === 0
    ).length;

    // 클라이언트에 읽지 않은 메시지 개수 전송
    socket.emit("unreadMessageCount", { count: unreadCount });

    //읽지 않은 메세지 개수 반환
    return unreadCount;

  } catch (error) {
    console.error("읽지 않은 메시지 개수 조회 오류:", error);
    socket.emit("error", { message: "읽지 않은 메시지 개수 조회 오류 발생." });
    //오류 발생 시 null 값 반환
    return null;  
  }
};

//단체채팅방 읽음 처리 -------------------------------------------------------------------------------------------------------------------------------------------

// 메세지 읽음 처리 
const GCmarkMessageAsRead = async (socket, messageId, userId) => {

  console.log("<GCmarkMessageAsRead>: ", userId);
  try {
    // 메시지가 존재하는지 확인
    const message = await Message.findOne({ where: { messageId: messageId } });
    if (!message) {
      socket.emit("error", { message: "메시지를 찾을 수 없습니다." });
      return;
    }

    // 이미 읽은 메시지인지 확인
    const existingRead = await MessageRead.findOne({
      where: { messageId, userId },
    });

    if (!existingRead) {
      // 읽은 상태로 메시지 기록 생성
      await MessageRead.create({
        messageId,
        userId,
        readAt: new Date(), // 현재 시간을 기록
        isRead: true, // 읽음 상태
      });
      socket.emit("messageRead", { messageId, userId });
    } else {
      // 이미 읽은 메시지인 경우, 읽은 시간만 업데이트
      await MessageRead.update(
        { readAt: new Date() },
        { where: { messageId, userId } }
      );
      socket.emit("messageAlreadyRead", { messageId, userId });
    }
  } catch (error) {
    console.error("메시지 읽음 처리 오류:", error);
    socket.emit("error", { message: "< GC > 메시지 읽음 처리 오류 발생." });
  }
};




module.exports = {
  markMessageAsRead,
  getReadStatus,
  countUnreadMessages,
  GCmarkMessageAsRead,

};