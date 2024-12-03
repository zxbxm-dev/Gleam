module.exports = (app) => {
  const managementController = require("../controller/management/submit_Management");
  const management_retouch = require("../controller/management/check_management");
  const PersonnelTransfer = require("../controller/management/personnel_transfer");
  const docNumManagement = require("../controller/management/docNumManagement");
  const multerMiddleware = require("../controller/management/multerMiddleware");

  const express = require("express");
  const router = express.Router();

  const path = require("path");

  // 정적 파일 서빙 설정
  app.use(
    "/uploads",
    express.static(path.join(__dirname, "../../../uploads/management"))
  );

  // 인사 정보 관리 파일 등록
  router.post("/writeHrInfo", multerMiddleware.single("attachment"), managementController.savedGreeting_card);
  // 인사 정보 관리 파일 등록
  router.put("/editHrInfo", multerMiddleware.single("attachment"), management_retouch.updateGreetingCard);
  // 인사 정보 조회
  router.get('/checkHrInfo', management_retouch.checkAppointment);
  // 인사이동 등록
  router.post('/writeAppointment', PersonnelTransfer.PersonnelTransfer);
  // 인사이동 조회
  router.get('/checkAppointment', PersonnelTransfer.checkTransfer);
  // 인사이동 수정
  router.put('/editAppointment/:appoint_id', PersonnelTransfer.updateTransfer);  
  // 인사이동 삭제
  router.delete('/deleteAppointment/:appoint_id', PersonnelTransfer.deleteTransfer);  
  // 직무변경
  router.patch('/editUserInfoManagement/:userID',PersonnelTransfer.editUserInfoManagement);
  //문서 추가 
  router.post('/addDocument/:userID', docNumManagement.addDocument);
  //문서 조회
  router.get('/getAllDocument/:userID', docNumManagement.getAllDocument);
  //문서번호 수정 
  router.put('/updatedocuments/:selectedId', docNumManagement.editDocNumber);
  //문서 수정
  router.patch('/editDocument',docNumManagement.editDocument);
  //문서 삭제
  router.delete('/deleteDocument', docNumManagement.deleteDocument);

  app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads", "management"))
  );

  app.use("/api", router);
};
