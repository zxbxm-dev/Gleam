module.exports = (app) => {
  const userChatConstroller = require("../controller/messenger/userChatData");
  const messageConstroller = require("../controller/messenger/messages");

  const express = require("express");
  const router = express.Router();

  router.post("/userChat", userChatConstroller.createUser);
  router.get("/:userId", userChatConstroller.getUser);

  router.post("/rooms", messageConstroller.createChatRoom);
  router.get("/rooms/:roomId/messages", messageConstroller.getChatRoomMessages);
  router.post("/rooms/:roomId/messages", messageConstroller.sendMessage);

  app.use("/api", router);
};
