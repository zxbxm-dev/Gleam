module.exports = (app) => {
    const checkController = require("../controller/personal/checkPersonal");
    const express = require("express");
    const router = express.Router();
  
    router.post("/checkHrInfo", checkController.getAllPersonal);
  
    app.use("/api", router);
  };
  