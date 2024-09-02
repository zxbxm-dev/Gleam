const models = require("../../models");
const chatRoomData = models.ChatRoom;

// 채팅방 생성
const createChatRoom = async (req, res) => {
  try {
    const {
      name,
      isGroup,
      color,
      title,
      subContent,
      profileColor,
      hostUserId,
      hostName,
      hostDepartment,
      hostTeam,
      hostPosition,
      invitedUserIds,
    } = req.body;

    let profileImage = null;

    // 프로필 이미지가 있으면 경로 설정
    if (req.file) {
      profileImage = req.file.path;
    }

    const chatRoom = await chatRoomData.create({
      name,
      isGroup: true,
      color,
      title,
      subContent,
      profileColor,
      profileImage,
      hostUserId,
      hostName,
      hostDepartment,
      hostTeam,
      hostPosition,
      invitedUserIds, // 초대받은 사용자 설정
    });

    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createChatRoom };