module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const path = require("path");

  const upload = require("../controller/performance/multerMiddleware");
  const evaluationController = require("../controller/performance/submit_Evaluation");
  const checkEvaluation = require("../controller/performance/check_Evaluation");

  // 정적 파일 서빙 설정
  app.use(
    "/uploads",
    express.static(path.join(__dirname, "../../../uploads/performanceFile"))
  );

  // 인사평가 제출
  router.post("/writePerform", upload, evaluationController.submitEvaluation);
  // 인사평가 목록 조회
  router.get("/checkPerform", checkEvaluation.getMyEvaluation);
  // 특정 파일 상세 조회
  router.get("/fileDetails", checkEvaluation.getFileDetails);
  // 인사평가 삭제
  router.delete("/deleteFile", checkEvaluation.deleteFile);

  app.use("/api", router);
};
