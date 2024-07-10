module.exports = (app) => {
  const annualLeaveController = require("../controller/attendance/annualLeave");
  const officeHourController = require("../controller/attendance/officeHour");

  const express = require("express");
  const router = express.Router();
  const multer = require("multer");
  const upload = multer();

  // ⚠️⚠️연차관리 router ----------------------------------------------------------------------- ⚠️⚠️
  // 일반 유저 휴가 관리 라우터
  router.post("/writecalender", annualLeaveController.AddVacation);
  router.get("/checkCalender", annualLeaveController.getAllCalendarEvents);
  // 일정 수정 라우트
  router.put(
    "/editCalender/:event_id",
    annualLeaveController.editCalendarEvent
  );
  // 일정 삭제 라우트
  router.delete(
    "/deleteCalender/:event_id",
    annualLeaveController.deleteCalendarEvent
  );

  // 관리자 관리 관리 조회
  router.get("/checkAnnual", annualLeaveController.administratorCalendar);
  // 관리자 연차 관리 수정
  router.put("/editAnnual", annualLeaveController.updateUserAnnualLeave);

  // ⚠️⚠️출근부 router ----------------------------------------------------------------------- ⚠️⚠️
  // 출근부 조회
  router.get("/checkAttendance", officeHourController.getAllAttendance);
  // 출근부 수정
  router.get("/editAttendance/:attend_id", officeHourController.updateAttendance);
  // 출근부 파일 업로드
  router.post("/writeAttendance", upload.single("handleFileSubmit"),
  officeHourController.writeAttendance
  );

  app.use("/api", router);
};
