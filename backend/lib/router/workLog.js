module.exports = (app) => {
  const reportController = require("../controller/workLog/submit_workLog");
  const checkReportController = require("../controller/workLog/check_workLog");
  const writeReportController = require("../controller/workLog/write_workLog");

  const express = require("express");
  const router = express.Router();
  const multerMiddleware = require("../controller/workLog/multerMiddleware");

  // 보고서 제출 API 라우트
  router.post(
    "/submitReport",
    multerMiddleware.single("handleSubmit"),
    reportController.submitReport
  );

  // ⚠️⚠️ 문서 조회 router ----------------------------------------------------------------------- ⚠️⚠️
  router.get("/getMyReports", checkReportController.getMyReports);
  router.get(
    "/getDocumentsToApprove",
    checkReportController.getDocumentsToApprove
  );
  router.get(
    "/getDocumentsInProgress",
    checkReportController.getDocumentsInProgress
  );
  router.get(
    "/getRejectedDocuments",
    checkReportController.getRejectedDocuments
  );
  router.get(
    "/getApprovedDocuments",
    checkReportController.getApprovedDocuments
  );

  // ⚠️⚠️ 문서 수정 및 삭제 router ----------------------------------------------------------------------- ⚠️⚠️
  router.get("/checkReport/:report_id", writeReportController.getReportById);
  router.delete(
    "/deleteReport/:report_id",
    writeReportController.deleteReportById
  );
  router.post("/writeApproval/:report_id", writeReportController.cancelReportById);

  // ⚠️⚠️ 문서 결제 router ----------------------------------------------------------------------- ⚠️⚠️
  router.post("/handleApproval/:report_id", writeReportController.SignProgress);

  // 싸인 이미지 정적 서빙
  router.use("/uploads", express.static("uploads"));

  app.use("/api", router);
};
