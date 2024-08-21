const models = require("../../models");
const { Message, User } = models;

const fetchMessages = async (socket, { roomId, limit = 25 }) => {
  try {
    // 메시지와 함께 사용자 정보를 조회
    const messages = await Message.findAll({
      where: { roomId },
      order: [["createdAt", "DESC"]],
      limit, // 불러올 메신저 갯수
      include: [
        { model: User, attributes: ["userId", "username", "profileImage"] },
      ], // User 모델을 포함시킵니다.
    });

    // 메시지 순서 변경 및 클라이언트에 전송
    socket.emit("messages", {
      roomId,
      messages: messages.reverse(), // 최신 메시지가 마지막에 보이도록 순서 변경
    });
  } catch (error) {
    console.error("메시지 조회 오류:", error.message);
    socket.emit("error", { message: "메시지 조회 오류" });
  }
};

module.exports = {
  fetchMessages,
};
