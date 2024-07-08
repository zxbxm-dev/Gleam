module.exports = (app) => {
  const upload = require("../controller/performance/multerMiddleware");
  const evaluationController = require("../controller/performance/submit_Evaluation");
  const checkEvaluation = require("../controller/performance/check_Evaluation");
  const express = require("express");
  const router = express.Router();
  const path = require('path');

  router.post("/writePerform", upload, evaluationController.submitEvaluation);
  router.get("/checkPerform", checkEvaluation.getMyEvaluation);

  // 정적 파일 서빙 설정
  app.use("/uploads", express.static(path.join(__dirname, 'uploads', 'performanceFile')));

  app.use("/api", router);
};
