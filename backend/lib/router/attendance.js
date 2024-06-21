module.exports = (app) => {
  const annualLeaveConstroller = require("../controller/attendance/annualLeave");

  const express = require("express");
  const router = express.Router();

  // 일반 유저 휴가 관리 라우터
  router.post("/writecalender", annualLeaveConstroller.AddVacation);
  router.get("/checkCalender", annualLeaveConstroller.getAllCalendarEvents);
  // 일정 수정 라우트
  router.put("/editCalender/:event_id", annualLeaveConstroller.editCalendarEvent);
  // 일정 삭제 라우트
  router.delete("/deleteCalender/:event_id", annualLeaveConstroller.deleteCalendarEvent);

  // 관리자 연차 관리 라우터
  router.get("/checkAnnual", annualLeaveConstroller.administratorCalendar);
  // 관리자 연차 관리 라우터
  router.put("/editAnnual", annualLeaveConstroller.updateUserAnnualLeave);

  app.use("/api", router);
};
