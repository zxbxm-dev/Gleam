module.exports = (app) => {
    const annualLeaveConstroller = require("../controller/attendance/annualLeave");
  
    const express = require("express");
    const router = express.Router();
  
    router.post('/writecalender', annualLeaveConstroller.AddVacation);

    app.use("/api", router);
  };
  