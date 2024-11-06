const models = require("../../models");
const { Message, User, ChatRoomParticipant, ChatRoom, MessageRead } = models;
const { Op, Sequelize, where } = require("sequelize");
const socketUtills = require("../socketUtills");
const {
  sendMessageToRoomParticipants,
  findMutualChatRoomsForUsers,
  findChatRoomsForMe,
} = require("./messageHandler");


// 사용자 조회 함수
const getUserById = async (userId) => User.findOne({ where: { userId } });
const getUsersByIds = async (userIds) =>
  User.findAll({ where: { userId: userIds } });

// 사용자 제목 파싱 함수
const parseUserTitle = (userTitle, userId) => {
  let parsedTitle = {};
  if (typeof userTitle === "string") {
    try {
      parsedTitle = JSON.parse(userTitle);
    } catch (error) {
      console.error("userTitle 파싱 오류:", error);
    }
  } else {
    parsedTitle = userTitle || {};
  }
  return parsedTitle;
};

// 채팅방 제목 결정 함수
const getOthertitle = (roomData, userTitle, userId) => {
  if (roomData.isGroup) {
    return roomData.title;
  }

  const otherUserId = Object.keys(userTitle).find((id) => id !== userId);
  if (otherUserId) {
    const otherUser = userTitle[otherUserId];
    if (otherUser.team) return `${otherUser.team} ${otherUser.username}`;
    if (otherUser.department)
      return `${otherUser.department} ${otherUser.username}`;
    return otherUser.username;
  }

  return roomData.title;
};

const getNextRoomId = async () => {
  try {
    // 현재 최대 roomId 조회
    const maxRoom = await ChatRoom.findOne({
      attributes: [[Sequelize.fn("MAX", Sequelize.col("roomId")), "maxRoomId"]],
    });

    // 새로운 roomId 생성
    const nextRoomId =
      maxRoom && maxRoom.dataValues.maxRoomId
        ? maxRoom.dataValues.maxRoomId + 1
        : 1;

    return nextRoomId;
  } catch (error) {
    console.error("다음 방 ID를 가져오는 중 오류 발생:", error);
    throw new Error("방 ID 조회 오류");
  }
};

// 새로운 개인 채팅방을 생성하거나 기존 채팅방을 조회
const createPrivateRoom = async (io, socket, data) => {
  try {
    console.log("서버에서 수신한 데이터:", data);

    let { userId, content, invitedUserIds, receiverId } = data;

    if (!userId || !invitedUserIds || invitedUserIds.length === 0) {
      console.error("userId 또는 invitedUserIds가 정의되지 않았습니다.");
      return socket.emit("error", { message: "잘못된 데이터입니다" });
    }

    // 초대된 사용자 목록에서 호스트 사용자 제외
    invitedUserIds = invitedUserIds.filter((id) => id !== userId);

    if (invitedUserIds.length === 0) {
      // 자신에게 메시지를 보내는 경우
      console.log("자신에게 메시지를 보냅니다.");
      const chatRoomIds = await findChatRoomsForMe(userId);
      const socketJoinChatRoomForMe = await socketUtills.socketJoinChatRoom( socket, chatRoomIds );

      let chatRoom;
      if (chatRoomIds.length > 0) {
        chatRoom = await ChatRoom.findOne({
          where: { roomId: chatRoomIds[0], isGroup: false },
        });
      } else {
        const nextRoomId = await getNextRoomId();
        const user = await getUserById(userId);

        chatRoom = await ChatRoom.create({
          roomId: nextRoomId,
          isGroup: false,
          isSelfChat: true, // 자신과의 채팅인 경우
          participant: true, // 참여 상태를 true로 설정
          hostUserId: userId,
          hostName: user.username,
          hostDepartment: user.department || null,
          hostTeam: user.team || null,
          hostPosition: user.position || null,
          title: null,
          userTitle: JSON.stringify({
            [userId]: {
              userId,
              username: user.username,
              company: user.company || null,
              department: user.department || null,
              team: user.team || null,
              position: user.position || null,
              spot: user.spot || null,
              attachment: user.attachment || null,
            },
          }),
        });
      }

      // 자신의 채팅방 참가자 추가
      await ChatRoomParticipant.findOrCreate({
        where: { roomId: chatRoom.roomId, userId },
        defaults: {
          username: (await getUserById(userId)).username,
          department: (await getUserById(userId)).department || null,
          team: (await getUserById(userId)).team || null,
          position: (await getUserById(userId)).position || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // 메시지 저장
      if (content) {
        console.log(`새로운 메시지 전송: ${content}`);
        await sendMessageToRoomParticipants(
          io,
          socket,
          chatRoom.roomId,
          content,
          receiverId,
          userId
        );
      }

      // 클라이언트에게 채팅 방 정보 전송
      socket.emit("chatRoomCreated", {
        roomId: chatRoom.roomId,
        isSelfChat: chatRoom.isSelfChat,
        title: chatRoom.title,
        profileColor: chatRoom.profileColor,
        profileImage: chatRoom.profileImage,
      });

      return;
    }

    const invitedUserId = invitedUserIds[0];
    const user = await getUserById(userId);
    const targetUser = await getUserById(invitedUserId);

    if (!user || !targetUser) {
      console.error("사용자 또는 초대된 사용자를 찾을 수 없습니다.");
      return socket.emit("error", { message: "사용자를 찾을 수 없습니다" });
    }

    // 상호 채팅방 검색 시 isGroup: false 필터링 추가
    const mutualChatRoomIds = await findMutualChatRoomsForUsers(
      userId,
      invitedUserId
    );

    let chatRoom;
    let created = false;

    if (mutualChatRoomIds.length > 0) {
      // 이미 존재하는 개인 채팅방 사용
      chatRoom = await ChatRoom.findOne({
        where: { roomId: mutualChatRoomIds[0], isGroup: false },
      });
      if (!chatRoom) {
        // 만약 기존 채팅방이 그룹 채팅방이라면 새로 생성
        mutualChatRoomIds.shift(); // 첫 번째 결과가 그룹 채팅방인 경우 제거
      }

      if (chatRoom) {
        await ChatRoomParticipant.update(
          { participant: false },
          { where: { roomId: chatRoom.roomId, userId: userId } }
        );
        await ChatRoomParticipant.update(
          { participant: false },
          { where: { roomId: chatRoom.roomId, userId: invitedUserId } }
        );
      }
    }

    if (!chatRoom) {
      const nextRoomId = await getNextRoomId();
      chatRoom = await ChatRoom.create({
        roomId: nextRoomId,
        isGroup: false,
        isSelfChat: false, // 개인 채팅방인 경우
        participant: true, // 참여 상태를 true로 설정
        hostUserId: userId,
        hostName: user.username,
        hostDepartment: user.department,
        hostTeam: user.team,
        hostPosition: user.position,
        title: null,
        userTitle: JSON.stringify({
          [userId]: {
            userId,
            username: user.username,
            company: user.company || null,
            department: user.department || null,
            team: user.team || null,
            position: user.position || null,
            spot: user.spot || null,
            attachment: user.attachment || null,
          },
          [invitedUserId]: {
            userId: invitedUserId,
            username: targetUser.username,
            company: targetUser.company || null,
            department: targetUser.department || null,
            team: targetUser.team || null,
            position: targetUser.position || null,
            spot: targetUser.spot || null,
            attachment: targetUser.attachment || null,
          },
        }),
      });
      created = true;
    }

    // 채팅방 참가자 추가
    if (created) {
      await ChatRoomParticipant.bulkCreate(
        [
          {
            roomId: chatRoom.roomId,
            userId,
            username: user.username,
            department: user.department || null,
            team: user.team || null,
            position: user.position || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roomId: chatRoom.roomId,
            userId: invitedUserId,
            username: targetUser.username,
            department: targetUser.department || null,
            team: targetUser.team || null,
            position: targetUser.position || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { updateOnDuplicate: ["roomId", "userId"] }
      );
    }
    // await sendUserChatRooms(socket, userId);

    // 메시지 전송
    if (content) {
      console.log(`새로운 메시지 전송: ${content}`);
      await sendMessageToRoomParticipants(io, socket, chatRoom.roomId, content, userId, receiverId);
    }

    // 채팅방 제목 설정
    const othertitle = getOthertitle(
      chatRoom,
      parseUserTitle(chatRoom.userTitle, userId),
      userId
    );

    // 클라이언트에게 채팅방 생성 이벤트 전송
    socket.emit("chatRoomCreated", {
      roomId: chatRoom.roomId,
      isSelfChat: chatRoom.isSelfChat,
      title: othertitle,
      profileColor: chatRoom.profileColor,
      profileImage: chatRoom.profileImage,
    });
  } catch (error) {
    console.error("채팅방 생성 오류:", error);
    socket.emit("error", { message: "채팅방 생성 중 오류 발생" });
  }
};

// 채팅방 조회 후 클라이언트에게 파싱
const sendUserChatRooms = async (socket, userId) => {
  try {
    // 사용자가 참여한 채팅방 목록 조회
    const chatRooms = await ChatRoomParticipant.findAll({
      where: {
        userId,
        participant: false, // 참여 중인 상태만 필터링
      },
      include: [{ model: ChatRoom }],
    });

    // console.log(
    //   "사용자 채팅방 목록:",
    //   chatRooms.map((participant) => participant.ChatRoom.roomId)
    // );

    // 채팅방 ID와 관련된 참가자 정보를 담을 맵
    const roomParticipantsMap = {};

    for (const participant of chatRooms) {
      const roomId = participant.ChatRoom.roomId;
      const room = participant.ChatRoom;

      if (!roomParticipantsMap[roomId]) {
        const roomData = room.toJSON();
        const userTitle = parseUserTitle(roomData.userTitle, userId);

        let othertitle;
        let isSelfChat = false;
        if (roomData.isGroup) {
          othertitle = roomData.title; // 단체방 제목 사용
        } else {
          othertitle = getOthertitle(roomData, userTitle, userId); // 개인방은 기존 방식대로 처리

          // 개인 (나와의 채팅) 여부 판단
          const participants = await ChatRoomParticipant.findAll({
            where: { roomId },
          });
          if (participants.length === 1 && participants[0].userId === userId) {
            isSelfChat = true;
          }
        }

        // 읽지 않은 메시지 개수 계산
        const unreadCount = await countUnreadMessages(roomId, userId);

        roomParticipantsMap[roomId] = {
          othertitle,
          userTitle,
          dataValues: roomData,
          isSelfChat,
          unreadCount, // 읽지 않은 메시지 개수 추가
        };
      }
    }

    const roomDataToSend = Object.values(roomParticipantsMap);
    // 추후 로그 삭제할것
    // console.log("클라이언트로 전달될 채팅방 데이터: ", roomDataToSend);
    // 필터링된 채팅방 목록을 클라이언트에 전송
    socket.emit("chatRooms", roomDataToSend);
  } catch (error) {
    console.error("채팅방 조회 오류:", error);
    socket.emit("error", { message: "채팅방 조회 오류" });
  }
};

// ----------------------------------------------------------------------------------
const countUnreadMessages = async (roomId, userId) => {
  try {
    // 상대방이 보낸 메시지 개수 조회 (내가 보낸 메시지는 제외)
    const unreadMessagesCount = await Message.count({
      where: {
        roomId,
        userId: { [Op.ne]: userId },
        messageId: {
          [Op.notIn]: Sequelize.literal(`(SELECT messageId FROM messageRead WHERE userId = '${userId}')`), // 읽은 메시지 제외
        },
      },
    });

    return unreadMessagesCount; // 읽지 않은 메시지 개수 반환
  } catch (error) {
    console.error("읽지 않은 메시지 개수 조회 오류:", error);
    throw error;
  }
};
// ----------------------------------------------------------------------------------


// 채팅방에 참여
const joinRoom = async (io, socket, roomId, userIds) => {
  try {
      if (!roomId || roomId <= 0) {
          throw new Error("유효하지 않은 방 ID입니다.");
      }

      const chatRoom = await ChatRoom.findOne({ where: { roomId } });
      if (chatRoom) {
          for (const userId of userIds) {
              const isMember = await ChatRoomParticipant.findOne({
                  where: { roomId, userId },
              });

              if (!isMember) {
                  // 사용자가 이미 멤버가 아니라면 방에 참가자로 추가
                  const user = await getUserById(userId);
                  await ChatRoomParticipant.create({
                      roomId,
                      userId,
                      username: user.username,
                      department: user.department || null,
                      team: user.team || null,
                      position: user.position || null,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                  });
              }
          }

          socket.join(roomId.toString()); // 방에 참여
          console.log(`${socket.id}가 방 ${roomId}에 참가했습니다.`);

          socket.emit("roomJoined", { roomId });
      } else {
          socket.emit("error", { message: "방을 찾을 수 없습니다" });
      }
  } catch (error) {
      console.error("채팅방 참여 오류:", error);
      socket.emit("error", { message: "채팅방 참여 서버 오류" });
  }
};

//채팅방에서 내보내기------------------------------------------------------------
const kickOutFromRoom = async (io, socket, roomId, userId,loginUser) => {
  try {
    if (!roomId || roomId <= 0) {
      throw new Error("유효하지 않은 방 ID입니다.");
    }
    const chatRoom = await ChatRoom.findOne({ where: { roomId } });

    if (!chatRoom) {
      socket.emit("error", { message: "방을 찾을 수 없습니다." });
      return;
    }

    const isMember = await ChatRoomParticipant.findOne({
      where: { roomId, userId },
    });

    if (!isMember) {
      socket.emit("error", { message: "사용자가 방의 참가자가 아닙니다." });
      return;
    }
    // 내보내려는 사용자가 자기 자신인지 확인
    if(loginUser === userId){
      socket.emit("error", {message:"자기 자신은 강제퇴장 시킬 수 없습니다."});
      console.log("현재 로그인한 아이디:["+loginUser+"]");
      console.log("내보내려는 아이디 :["+userId+"]");
      return;
    };

    //참가여부(participant) 상태값 변경 (0->1)
    await ChatRoomParticipant.update(
       {participant: true},
       {where:{roomId,userId}}
      );
    
    //내보내지는 사용자의 정보
    const kickoutInfo = await leaveUserInfo(userId,roomId);
    console.log("내보내지는사람의 정보:["+kickoutInfo+"]");


    // 로그메시지 저장
    await insertLeaveMsg(kickoutInfo,roomId,userId);
  
    socket.leave(roomId);

    console.log(`소켓 해제[+${socket.id}+]`);

    const info = await Message.findOne({
        attributes:["content","createdAt"],
        where : {
          roomId,
          userId,
        },
        order:[["createdAt","DESC"]], // 가장 최근 퇴장 로그
    });
   
    socket.emit("userKicked", {content: info.content ,timestamp: info.createdAt});

  } catch (error) {
    console.error("채팅방 내보내기 오류:", error);
    socket.emit("error", { message: "채팅방 내보내기 서버 오류" });
  }
};


// 채팅방에서 나가기 -----------------------------------------------------------------------------------------------------
const exitRoom = async (io, socket, data) => {
  const { roomId, userId } = data; 

  try {
    // 채팅방 정보 가져오기
    const chatRoom = await ChatRoom.findByPk(roomId);

    if (!chatRoom) {
      socket.emit("error", { message: "채팅방을 찾을 수 없습니다." });
      return;
    }

    // 참가자 정보 가져오기
    const participants = await ChatRoomParticipant.findAll({
      where: { roomId },
    });

    // 나가는 사람의 정보(이름,직책,부서이름)
    const leaveMessage = await leaveUserInfo(userId,roomId);
    console.log(`나가는 사람의 정보:${leaveMessage}`);

    // 1. 자신과의 채팅 (Self Chat) 처리
    if (chatRoom.isSelfChat) {
      // 모든 관련 정보 삭제 (채팅방, 참가자, 메시지)
      await ChatRoomParticipant.destroy({ where: { roomId } });
      await Message.destroy({ where: { roomId } });
      await ChatRoom.destroy({ where: { roomId } });

      // 삭제 알림 전송
      socket.emit("chatRoomDeleted", {
        message: `${roomId}의 채팅방이 삭제되었습니다.`,
      });
      socketLeave( socket,data );
      return;
    }

    // 2. 개인 채팅 (1:1 채팅) 처리
    if (!chatRoom.isGroup && participants.length === 2) {
      
      //나가는 사용자가 어드민인지 확인
      const admain = await adminCheck(roomId,userId);
      const currentAdminUserId =  admain ? admain.hostUserId : null;
      console.log("어드민:"+admain?.hostUserId);
      
      //나가는 사용자가 어드민인 경우
      if(currentAdminUserId){

        //어드민이 아닌 사용자 목록 가져오기
        const remainUserList = await remainUsers(currentAdminUserId,roomId);
    
        if(remainUserList.length > 0){
        const selectUser = remainUserList[0];
        await updateNewAdmin(selectUser, roomId); //새 어드민으로 변경
        console.log(`어드민 변경: ${selectUser.userId}`);
          }else {
            console.log("어드민을 넘겨줄 수 없습니다.(남은 사용자 없음)");
           }
    }else{
      //나가는 사용자가 어드민이 아닌 경우
      console.log("나가는 사용자가 어드민이 아닙니다.");
    }

     // 나가는 사용자의 상태를 업데이트
     await ChatRoomParticipant.update(
      { participant: true },
      { where: { roomId, userId } }
    );

    //message테이블에 ooo부 oo팀 xxx님이 방을 나갔습니다. insert
    await insertLeaveMsg(leaveMessage,roomId,userId);

    const info = await Message.findOne({
      attributes:["content","createdAt"],
      where : {
        roomId,
        userId,
      },
      order:[["createdAt","DESC"]], // 가장 최근 퇴장 로그
  });
  console.log(`로그:${info.content} || 시간:${info.createdAt}`);

    // 나간 후 남은 사용자에게 알림
    const remainingUser = participants.find((p) => p.userId !== userId);
    if (remainingUser) {
      socket.to(roomId).emit("roomUpdated", {
          content: info.content,
          timestamp: info.createdAt,
      });
    }

    // 모든 참가자가 나간 경우 방과 메시지 삭제
    const updatedParticipants = await ChatRoomParticipant.findAll({
      where: { roomId, participant: true },
    });

    if (updatedParticipants.length === participants.length) {
      await ChatRoomParticipant.destroy({ where: { roomId } });
      await Message.destroy({ where: { roomId } });
      await ChatRoom.destroy({ where: { roomId } });

      socket.emit("chatRoomDeleted", {
        message: `${roomId}의 채팅방이 삭제되었습니다.`,
      });
    }
    socketLeave( socket,data );
    return;
  }
    // 3. 단체 채팅방 (Group Chat) 처리
    if (chatRoom.isGroup) {
      
      //나가는 사용자가 어드민인지 확인
      const admain = await adminCheck(roomId,userId);
      const currentAdminUserId = admain ? admain.hostUserId : null;
      console.log("어드민:"+admain?.hostUserId);

      //나가는 사용자가 어드민인 경우
      if(currentAdminUserId){

        //어드민이 아닌 사용자 목록 가져오기
        const remainUserList = await remainUsers(currentAdminUserId,roomId);

        if(remainUserList.length > 0){

          //남은 유저중 랜덤하게 호스트 지정
          const randomIndex = Math.floor(Math.random() * remainUserList.length);
          const selectUser = remainUserList[randomIndex];
          await updateNewAdmin(selectUser, roomId); //새 어드민으로 변경
          console.log(`어드민 변경: ${selectUser.userId}`);
        }else {
          console.log("어드민을 넘겨줄 수 없습니다.(남은 사용자 없음)");
        }
      }else{
        //나가는 사용자가 어드민이 아닌 경우
        console.log("나가는 사용자가 어드민이 아닙니다.");
      }

      // 나가는 사용자의 상태를 업데이트
      await ChatRoomParticipant.update(
        { participant: true },   
        { where: { roomId, userId } }
      );
      
     //message테이블에 ooo부 oo팀 xxx님이 방을 나갔습니다. insert
     await insertLeaveMsg(leaveMessage,roomId,userId);

     const info = await Message.findOne({
      attributes:["content","createdAt"],
      where : {
        roomId,
        userId,
      },
      order:[["createdAt","DESC"]], // 가장 최근 퇴장 로그
    });

    console.log(`로그:${info.content} || 시간:${info.createdAt}`);
      
      // 남은 사용자에게 알림
      const remainingUser = participants.find((p) => p.userId !== userId);
      if (remainingUser) {
        socket.to(roomId).emit("roomUpdated", {
            content: info.content,
            timestamp: info.createdAt,
        });
      }

      
      // 채팅방을 나간 참가자 정보
      const updatedParticipants = await ChatRoomParticipant.findAll({
        where: { roomId, participant: true },
      });
     
      // 모든 참가자가 나간 경우 방과 메시지 삭제
      if (updatedParticipants.length === participants.length) {
        await ChatRoomParticipant.destroy({ where: { roomId } });
        await Message.destroy({ where: { roomId } });
        await ChatRoom.destroy({ where: { roomId } });

        socket.emit("chatRoomDeleted", {
          message: `${roomId}의 채팅방이 삭제되었습니다.`,
        });
      }

      socketLeave( socket,data );
      return;
    }
  } catch (error) {
    console.error("채팅방에서 나가는 중 오류 발생:", error);
    socket.emit("error", { message: "채팅방 나가기 오류" });
  }
}

//socket leave  처리
const socketLeave = async ( socket, data ) => {
  const { roomId, userId } = data;

   try{
    socket.leave(roomId);
    console.log(`${roomId}번 채팅방 소켓 해제 : ${socket.id}`)
   }catch(error){
    console.error("socket leave 처리 중 오류가 발생했습니다.", error );
    socket.emit("error", {message: " socket leave 처리 중 오류가 발생했습니다." });
   }
}

 // 내보내지는(나가는) 사람의 정보(이름,직책,부서이름)
const leaveUserInfo  =async(userId, roomId)=>{
    try{
        const leaveInfo = await ChatRoomParticipant.findOne({
        where:{userId: userId,
              roomId: roomId
              },
         attributes: ["username","department","position","team"],
        });
        const leaveMessage = leaveInfo.department+" "+(leaveInfo.team ? leaveInfo.team+" "+leaveInfo.position+" "+leaveInfo.username : leaveInfo.position+" "+leaveInfo.username);
         return leaveMessage;
    }catch(error){  
        console.error(error.message);
    } 
  }

//나가는 사용자가 어드민인지 확인
const adminCheck = async(roomId,userId)=>{
  const isAdmin = await ChatRoom.findOne({
    attributes:["hostUserId"],
    where:{hostUserId : userId,
           roomId,
          }
  });

  return isAdmin;
}

//채팅방에서 어드민이 아닌 사용자 목록 가져오기 
const remainUsers = async(currentAdminUserId,roomId)=>{
  const notAdminparticipant = await ChatRoomParticipant.findAll({
    where:{
      roomId,
      userId : {
        [Op.ne]:currentAdminUserId,
      }
    }
  });

  return notAdminparticipant;
}

//새 어드민으로 변경하기
const updateNewAdmin = async(selectUser, roomId)=>{
      
      await ChatRoom.update(
        {
          hostUserId : selectUser.userId,
          hostName : selectUser.username,
          hostDepartment : selectUser?.department,
          hostTeam : selectUser?.team,
          hostPosition : selectUser?.position,
        },
        {where: {roomId}},
      );
}

//채팅방 나갈때 로그 저장하기
const insertLeaveMsg = async(leaveMessage,roomId,userId)=>{
  await Message.create({
          content : `${leaveMessage} 님이 방을 나갔습니다.`,
          userId : userId,
          roomId : roomId,
          receiverId : "deleted",
          contentType : "leave",
        });
}

module.exports = {
  sendUserChatRooms,
  createPrivateRoom,
  joinRoom,
  kickOutFromRoom,
  exitRoom,
  socketLeave,
};