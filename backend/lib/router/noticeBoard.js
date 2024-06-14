module.exports = (app) => {
  const writeBoardController = require("../controller/noticeBoard/createBoard");
  const checkBoardController = require("../controller/noticeBoard/checkBoard")
  const multerMiddleware = require("../controller/noticeBoard/multerMiddleware");

  const express = require("express");
  const router = express.Router();

  // 공지사항 작성
  router.post("/writeAnno", multerMiddleware.single("attachment"), writeBoardController.writeAnnouncement);
  // 공지사항 수정
  router.put("/editAnno/:id", multerMiddleware.single("attachment"), writeBoardController.editAnnouncement);
  // 공지사항 삭제
  router.delete("/deleteAnno/:id", multerMiddleware.single("attachment"), writeBoardController.deleteAnnouncement);
  // 공지사항 목록 조회
  router.get("/checkAnno", checkBoardController.getAllAnnouncements);
  // 공지사항 상세 조회
  router.get("/detailAnno/:id", checkBoardController.getAnnouncementById);

  // 사내규정 작성
  router.post("/writeRegul", multerMiddleware.single("attachment"), writeBoardController.writeRegulation);
  //사내규정 수정
  router.put("/editRegul/:id", multerMiddleware.single("attachment"), writeBoardController.editRegulation);
  //사내규정 삭제
  router.delete("/deleteRegul/:id", multerMiddleware.single("attachment"), writeBoardController.deleteRegulation);
  //사내규정 목록 조회
  router.get("/checkRegul", checkBoardController.getAllRegulations);
  //사내규정 상세 조회
  router.get("/detailRegul/:id", checkBoardController.getRegulationById);

  app.use("/api", router);
};
