module.exports = (app) => {
    const workLogController  = require("../controller/workLog/submit_workLog");
  
    const express = require("express");
    const router = express.Router();
  
    router.post('/submitReport', workLogController.submitReport);

    app.use("/api", router);
  };
  