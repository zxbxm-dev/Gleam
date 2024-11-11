module.exports = (app) => {
  const messageConstroller = require("../controller/messenger/messages");

  const express = require("express");
  const router = express.Router();
  const upload = require("../controller/messenger/multerMiddleware");

  // 단체 채팅방 생성 라우트
  router.post("/rooms", upload.single("profileImage"), messageConstroller.createChatRoom);
  router.put("/putProfileData/:roomId", messageConstroller.editChatRoom);
  router.put("/puthostId", messageConstroller.AdminChange);

  app.use("/api", router);
};
