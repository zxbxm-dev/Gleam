const models = require("../../models");
const chatRoomData = models.ChatRoom;
const chatRoomParticipantData = models.ChatRoomParticipant;
const userData = models.User;

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
      invitedUserIds = [],
    } = req.body;

    let profileImage = null;

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
    });

    const hostUser = await userData.findByPk(hostUserId);
    if (!hostUser) {
      throw new Error('호스트 사용자를 찾을 수 없습니다.');
    }

    const participants = [
      {
        roomId: chatRoom.roomId,
        userId: hostUser.userId,
        username: hostUser.username,
        department: hostUser.department,
        team: hostUser.team,
        position: hostUser.position,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ...await Promise.all(invitedUserIds.map(async (userId) => {
        if (userId !== hostUserId) { // 로그인된 호스트 사용자는 제외
          const user = await userData.findByPk(userId);
          return user ? {
            roomId: chatRoom.roomId,
            userId: user.userId,
            username: user.username,
            department: user.department,
            team: user.team,
            position: user.position,
            createdAt: new Date(),
            updatedAt: new Date(),
          } : null;
        }
        return null;
      })).then(results => results.filter(item => item !== null))
    ];

    console.log("참가자 데이터:", participants);

    await chatRoomParticipantData.bulkCreate(participants);

    res.status(201).json(chatRoom);
  } catch (error) {
    console.error("채팅방 생성 및 참가자 저장 오류:", error);
    res.status(400).json({ error: error.message });
  }
};


module.exports = { createChatRoom };