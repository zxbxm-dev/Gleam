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

  // 관리자 연차 관리 라우터
  router.get("/checkAnnual", annualLeaveController.administratorCalendar);
  // 관리자 연차 관리 라우터
  router.put("/editAnnual", annualLeaveController.updateUserAnnualLeave);

  // ⚠️⚠️출근부 router ----------------------------------------------------------------------- ⚠️⚠️
  // 출근부 관리 라우터
  router.get("/checkAttendance", officeHourController.getAllAttendance);
  // 출근부 작성 라우터
  router.post("/writeAttendance", upload.single("handleFileSubmit"), // 클라이언트의 필드명과 동일하도록
  officeHourController.writeAttendance
  );

  app.use("/api", router);
};
