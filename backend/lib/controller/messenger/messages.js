const models = require("../../models");
const chatRoomData = models.ChatRoom;
const chatRoomParticipantData = models.ChatRoomParticipant;
const user = models.User;
const userData = models.User;

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
      userTitle, // JSON 형식의 초대된 사람들 정보
      title,
      profileColor,
      invitedUserIds = [],
    } = req.body;

    let profileImage = null;
    if (req.file) {
      profileImage = req.file.path;
    }
       
    // 채팅방 생성
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

    // 관리자 정보 가져오기
    const hostUser = await userData.findByPk(hostUserId);
    if (!hostUser) {
      throw new Error('호스트 사용자를 찾을 수 없습니다.');
    }

    // userTitle JSON을 파싱
    const parsedUserTitle = JSON.parse(userTitle);

    //참가자 데이터를 배열로 변환 
    const participantsFromTitle = Object.values(parsedUserTitle).map(user => ({
      roomId: chatRoom.roomId,
      userId: user.userId,
      username: user.username,
      department: user.department,
      team: user.team,
      position: user.position,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // invitedUserIds 배열에 있는 사용자들 추가
    // const invitedParticipants = await Promise.all(invitedUserIds.map(async (userId) => {
    //   const user = await userData.findByPk(userId);
    //   return user ? {
    //     roomId: chatRoom.roomId,
    //     userId: user.userId,
    //     username: user.username,
    //     department: user.department,
    //     team: user.team,
    //     position: user.position,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   } : null;
    // }));
    
 

    // 참가자 데이터 합치기
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
      ...participantsFromTitle, // userTitle에서 파싱한 참가자들
      // ...invitedParticipants.filter(item => item !== null), // 초대된 참가자들
    ];

    // 중복된 userId를 가진 참가자 제거
    const uniqueParticipants = Array.from(new Map(participants.map(p => [p.userId, p])).values());

    // 로그를 추가하여 데이터 확인
    console.log("참가자 데이터||", uniqueParticipants);

    // 채팅방 참가자 추가
    await chatRoomParticipantData.bulkCreate(uniqueParticipants);

    res.status(201).json(chatRoom);
  } catch (error) {
    console.error("채팅방 생성 및 참가자 저장 오류:", error);
    res.status(400).json({ error: error.message });
  }
};


const editChatRoom = async (req, res) => {
  const { othertitle, profileColor } = req.body;
  const { roomId } = req.params;

  if(!roomId) {
    return res.status(400).json({ message: "회의실 예약 ID가 제공되지 않았습니다." });
  }  

  try {
    await chatRoomData.update(
      { title: othertitle, profileColor: profileColor },
      { where: { roomId } }
    );
    res.status(201).json({message: "대화방 프로필 설정이 변경되었습니다."});
  } catch (error) {
    console.log("대화방 프로필 설정 변경에 실패하였습니다.");
    res.status(500).json({message: "대화방 프로필 설정 변경에 실패하였습니다."});
  }
};

const AdminChange = async (req, res) => {
  const { roomId, newAdminId, currentAdminId } = req.body;

  if (!roomId || !newAdminId || !currentAdminId) {
    return res.status(400).json({ message: "모든 매개변수를 제공해야 합니다." });
  }

  try {

    //어드민으로 변경되는 유저의 정보
    const newAdminInfo  =await user.findOne({ where:{userId : newAdminId}});

    await chatRoomData.update(
      { hostUserId: newAdminId,
        hostName: newAdminInfo.username,
        hostDepartment: newAdminInfo.department,
        hostTeam: newAdminInfo.team,
        hostPosition: newAdminInfo.position,
      },
      { where: { roomId } }
    );
    res.status(200).json({ message: "관리자가 성공적으로 변경되었습니다." });
  } catch (error) {
    console.error("관리자 변경 오류:", error);
    res.status(500).json({ message: "관리자 변경에 실패했습니다." });
  }
};

module.exports = { createChatRoom, editChatRoom, AdminChange };
