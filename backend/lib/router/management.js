module.exports = (app) => {
  const managementController = require("../controller/management/submit_Management");
  const management_retouch = require("../controller/management/check_management");
  const multerMiddleware = require("../controller/management/multerMiddleware");

  const express = require("express");
  const router = express.Router();

  const path = require("path");

  // 인사 정보 관리 파일 등록
  router.post("/writeHrInfo", multerMiddleware.single("attachment"), managementController.savedGreeting_card);
  // 인사 정보 관리 파일 등록
  router.put("/editHrInfo/:hrinfo_id", multerMiddleware.single("attachment"), management_retouch.updateGreetingCard);
  // 인사 이동 조회
  router.get('/checkAppointment', management_retouch.checkAppointment);

  app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads", "management"))
  );

  app.use("/api", router);
};
