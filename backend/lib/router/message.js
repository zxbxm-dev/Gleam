module.exports = (app) => {
  const userChatConstroller = require("../controller/messenger/userChatData");// 테스트 진행중 클라이언트에서는 사용하지 말아주세요.
  const messageConstroller = require("../controller/messenger/messages");

  const express = require("express");
  const router = express.Router();

  router.get("/:userId", userChatConstroller.getUser);  // 테스트 진행중 클라이언트에서는 사용하지 말아주세요.

  router.post("/rooms", messageConstroller.createChatRoom);
  router.get("/rooms/:roomId/messages", messageConstroller.getChatRoomMessages);
  router.post("/rooms/:roomId/messages", messageConstroller.sendMessage);

  app.use("/api", router);
};
