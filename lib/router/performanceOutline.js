const multerMiddleware = require("../controller/noticeBoard/multerMiddleware");

module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const path = require("path");

    const evalOutlineController = require("../controller/performance/EvalOutline");
    
  //인사평가 개요 파일 서빙 설정
  app.use(
    "/uploads",
    express.static(path.join(__dirname,"../../../uploads/perfOutlineFile"))
  );

  //인사평가 개요 파일 업로드
  router.post("/uploadOutline", multerMiddleware.single("file"), evalOutlineController.uploadEvalOutline);
  //인사평가 개요 파일 조회
  router.get("/getOutline",evalOutlineController.getEvalOutline);
    
    app.use("/api", router);
};