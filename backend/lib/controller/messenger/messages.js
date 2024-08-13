const models = require("../../models");
const chatRoomData = models.ChatRoom;
const messageData = models.Message;

const createChatRoom = async (req, res) => {
  try {
    const { name, isGroup, color, title, hostUserId, invitedUserIds } = req.body;

    // 채팅방 생성
    const chatRoom = await chatRoomData.create({
      name,
      isGroup,
      color,
      title,
      hostUserId, // 방장 설정
      invitedUserIds, // 초대받은 사용자 설정
    });

    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getChatRoomMessages = async (req, res) => {
  try {
    const messages = await messageData.findAll({
      where: { roomId: req.params.roomId },
      include: [{ model: models.User, attributes: ["username"] }],
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const message = await messageData.create(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createChatRoom, getChatRoomMessages, sendMessage };