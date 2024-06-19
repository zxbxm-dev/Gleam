module.exports = (app) => {
    const annualLeaveConstroller = require("../controller/attendance/annualLeave");
  
    const express = require("express");
    const router = express.Router();

    // 일반 유저 휴가 관리 라우터
    router.post('/writecalender', annualLeaveConstroller.AddVacation);
    router.get('/checkCalender', annualLeaveConstroller.getAllCalendarEvents);

    // 관리자 연차 관리 라우터
    router.get('/checkAnnual', annualLeaveConstroller.administratorCalendar);

    app.use("/api", router);
  };
  