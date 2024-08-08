import api from "../../api/auth";

// 1:1 대화방 생성
const createChatRoom = (myId, otherUserId) => {
  const userIds = [myId, otherUserId];
  return api.post("/createChatRoom", userIds);
};

// 본인이 포함된 모든 대화방 목록 조회
const getChatRooms = (userId) => {
  return api.get("/getChatRooms", { params: { userId } });
};

export { createChatRoom, getChatRooms };
