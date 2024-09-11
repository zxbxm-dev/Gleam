module.exports = (app) => {
  const userController = require("../controller/user/signup");
  const signinController = require("../controller/user/signin");
  const userListController = require("../controller/user/memberList");

  const express = require("express");
  const router = express.Router();

  router.post("/postResData", userController.createUser);
  router.post("/RescheckID", userController.checkDuplicate);
  router.get("/checkUserManagement", userController.getAllUsers);
  router.post("/approveUserManagement/:userId", userController.approveUser);
  router.delete("/deleteUserManagement/:userId", userController.deleteUser);
  router.post("/editchainlinker", userController.userleaves);

  router.post("/login", signinController.login);
  router.post("/logout", signinController.logout);
  router.post("/postFindID", signinController.findUsername);
  router.post("/postresetpw", signinController.resetPassword);

  // 이미지 파일 업로드 및 회원 정보 수정을 위한 라우터
  const upload = require('../controller/user/multerMiddleware');
  // 회원 정보 수정
  router.post('/postResEditData', upload.fields([{ name: 'attachment' }, { name: 'sign' }]), signinController.editRegistration);
  
  // 유저 정보 전달
  router.get('/checkInformation', userListController.getAllUserList);

  // 탈퇴한 회원 리스트 전달
  router.get('/checkQuitterList', userListController.getAllQuitterList);

  app.use("/api", router);
};
