module.exports = (app) => {
  const reportController = require("../controller/workLog/submit_workLog");
  const checkReportController = require("../controller/workLog/check_workLog");
  const writeReportController = require("../controller/workLog/write_workLog");

  const express = require("express");
  const router = express.Router();
  const multerMiddleware = require("../controller/noticeBoard/multerMiddleware");
  
  // 보고서 제출 API 라우트
  router.post("/submitReport", multerMiddleware.single("handleSubmit"), reportController.submitReport);

  // ⚠️⚠️ 문서 조회 router ----------------------------------------------------------------------- ⚠️⚠️
  router.get("/getMyReports", checkReportController.getMyReports);
  router.get("/getDocumentsToApprove", checkReportController.getDocumentsToApprove);
  router.get("/getDocumentsInProgress", checkReportController.getDocumentsInProgress);
  router.get("/getRejectedDocuments", checkReportController.getRejectedDocuments);
  router.get("/getApprovedDocuments", checkReportController.getApprovedDocuments);

  // ⚠️⚠️ 문서 수정 및 삭제 router ----------------------------------------------------------------------- ⚠️⚠️
  router.get("/checkReport/:report_id", writeReportController.getReportById);
  router.delete("/deleteReport/:report_id", writeReportController.deleteReportById);

  app.use("/api", router);
};