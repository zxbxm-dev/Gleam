import api from "../../api/auth";

//모달창 이용 채팅방 생성
const createRoom = (payload) => {
  return api.post("/rooms", payload);
};


//채팅방 관리자 변경
const changeAdminApi = (roomId, newAdminId, currentAdminId) => {
  return api.put("/puthostId", {
    roomId,
    newAdminId,
    currentAdminId,
  });
};

//단체방 프로필 수정
const changeRoomData = (roomId, othertitle, profileColor) => {
  return api.put("/putProfileData", {
    roomId,
    othertitle,
    profileColor,
  });
};

//메신저 첨부파일 전송
const messageFile = (content, userId, roomId, file) => {
  return api.post("/messenger_upload", {
    content,
    userId,
    roomId,
    file
  }, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const getFile = (messageId) => {
  return api.get(`/messenger_download/${messageId}`, {
    responseType: 'blob',
  });
};


export { createRoom, changeAdminApi, changeRoomData, messageFile, getFile };
