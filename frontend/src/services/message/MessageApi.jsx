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

export { createRoom, changeAdminApi };
