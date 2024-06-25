module.exports = (app) => {
    const jobPostingConstroller = require("../controller/employment/jobPosting");
  
    const express = require("express");
    const router = express.Router();
  
    router.post('/writeEmploy', jobPostingConstroller.createJobPosting);
    router.get('/checkEmploy', jobPostingConstroller.getAllJobPosting);
    router.put('/editEmploy/:employ_id', jobPostingConstroller.editJobPosting);
    router.delete('/deleteEmploy/:employ_id', jobPostingConstroller.deleteJobPosting);

    app.use("/api", router);
  };
  