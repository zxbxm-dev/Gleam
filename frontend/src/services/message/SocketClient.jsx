import io from "socket.io-client";

const socket = io("localhost:3002", {
  transports: ["websocket"],
});

// 채팅방 접속
const joinChatRoom = (roomId) => {
  socket.emit("joinRoom", roomId);
};

// 메시지 송신
const sendMsg = (roomId, msg) => {
  console.log("send >>", roomId, msg);
  socket.emit("sendMsg", { roomId, msg });
};

// 메시지 수신
const receiveMsg = (callback) => {
  socket.on("receiveMsg", (msg) => {
    callback(msg);
  });
};

export { joinChatRoom, sendMsg, receiveMsg };
