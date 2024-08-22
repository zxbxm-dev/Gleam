import api from "../../api/auth";

// 1:1 대화방 생성
// const sendMessageToServer = async (roomId, userId, message) => {
//   try {
//     const response = await api.post('/api/messages', {
//       roomId,
//       userId,
//       message,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error sending message:", error);
//     throw error;
//   }
// };

// 본인이 포함된 모든 대화방 목록 조회
// const getChatRooms = (userId) => {
//   return api.get(`/${userId}`);
// };

const createRoom = (payload) => {
  return api.post("/rooms", payload);
};


export { createRoom };
