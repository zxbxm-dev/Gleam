const models = require("../../models");
const chatRoomData = models.ChatRoom;

// 채팅방 생성
const createChatRoom = async (req, res) => {
  try {
    const {
      roomId,  //방번호
      hostUserId,  //관리자아이디
      hostName, //관리자 이름
      hostDepartment,  //관리자 부서
      hostTeam,  //관리자 팀
      hostPosition,  //관리자 직책
      userTitle, //초대된 사람 (JSON)
      title,  //단체방이름
      profileColor,  //단체방 프로필 색상
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