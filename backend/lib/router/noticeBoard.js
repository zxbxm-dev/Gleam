module.exports = (app) => {
  const writeBoardController = require("../controller/noticeBoard/crtBoard");
  const multerMiddleware = require("../controller/noticeBoard/multerMiddleware");

  const express = require("express");
  const router = express.Router();

  // 공지사항 작성
  router.post("/writeAnno", multerMiddleware.single("attachment"), writeBoardController.writeAnnouncement);
  // 공지사항 수정
  router.put("/editAnno/:id", multerMiddleware.single("attachment"), writeBoardController.editAnnouncement);
  
  // 사내규정 작성
  router.post("/writeRegul", multerMiddleware.single("attachment"), writeBoardController.writeRegulation);
  //사내규정 수정
  router.post("/editRegul/:id", multerMiddleware.single("attachment"), writeBoardController.editRegulation);

  app.use("/api", router);
};
