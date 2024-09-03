const models = require("../../models");
const chatRoomData = models.ChatRoom;

// 채팅방 생성
const createChatRoom = async (req, res) => {
  try {
    const {
      roomId,
      hostUserId,
      hostName,
      hostDepartment,
      hostTeam,
      hostPosition,
      userTitle,
      title,
      profileColor,
      // invitedUserIds
    } = req.body;

    let profileImage = null;

    // 프로필 이미지가 있으면 경로 설정
    if (req.file) {
      profileImage = req.file.path;
    }

    const chatRoom = await chatRoomData.create({
      roomId,
      isGroup: true,
      hostUserId,
      hostName,
      hostDepartment,
      hostTeam,
      hostPosition,
      userTitle,
      title,
      profileColor,
      profileImage,
      // invitedUserIds, // 초대받은 사용자 설정
    });

    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createChatRoom };