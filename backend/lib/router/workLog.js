module.exports = (app) => {
  const reportController = require("../controller/workLog/submit_workLog");
  const checkReportController = require("../controller/workLog/check_workLog");
  const writeReportController = require("../controller/workLog/write_workLog");

  const express = require("express");
  const router = express.Router();
  const multer = require("multer");

  const path = require("path");
  const fs = require("fs");

  // Multer 인스턴스 생성
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(
        __dirname,
        "../../../backend/uploads/reportFile"
      );
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const timestamp = new Date().getTime();
      cb(null, `${timestamp}_${file.originalname}`);
    },
  });

  // 파일 필터링: PDF 파일만 가능
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("PDF 파일만 업로드 가능합니다."), false);
    }
  };

  // Multer 인스턴스 생성
  const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
    "handleSubmit"
  );

  // 보고서 제출 API 라우트
  router.post("/submitReport", upload, reportController.submitReport);

  // ⚠️⚠️문서 조회 router ----------------------------------------------------------------------- ⚠️⚠️
  //내 문서 목록 조회
  router.get("/getMyReports", checkReportController.getMyReports);
  // 결제 할 문서
  router.get("/getDocumentsToApprove", checkReportController.getDocumentsToApprove);
  // 결제 진행중 문서
  router.get("/getDocumentsInProgress", checkReportController.getDocumentsInProgress);
  // 반련한 문서
  router.get("/getRejectedDocuments", checkReportController.getRejectedDocuments);
  // 결제 완료한 문서
  router.get("/getApprovedDocuments", checkReportController.getApprovedDocuments);

  // ⚠️⚠️문서 수정 및 삭제 router ----------------------------------------------------------------------- ⚠️⚠️

  router.get("/checkReport/:report_id", writeReportController.getReportById);

  app.use("/api", router);
};