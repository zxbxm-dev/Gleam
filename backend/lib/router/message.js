module.exports = (app) => {
  const messageConstroller = require("../controller/messenger/messages");

  const express = require("express");
  const router = express.Router();
  const upload = require("../controller/messenger/multerMiddleware");

  // 단채 채팅방 생성 라우트
  router.post("/rooms", upload.single("profileImage"), messageConstroller);

  app.use("/api", router);
};
