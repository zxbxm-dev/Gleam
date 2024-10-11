module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const upload = require("./upload");
  const messageController = require("./uploadController");

  // 파일 업로드
  router.post("/messenger_upload", upload.single("file"), messageController.sendMessage);

  // 파일 다운로드
  router.get("/messenger_download/:messageId", messageController.downloadFile);

  app.use("/api", router);
};
