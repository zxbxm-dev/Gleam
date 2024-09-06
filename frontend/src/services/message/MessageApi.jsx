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

export { createRoom, changeAdminApi, changeRoomData };
