module.exports = (app) => {
    const jobPostingConstroller = require("../controller/employment/jobPosting");
  
    const express = require("express");
    const router = express.Router();
  
    router.post('/writeEmploy', jobPostingConstroller.createJobPosting);

    app.use("/api", router);
  };
  