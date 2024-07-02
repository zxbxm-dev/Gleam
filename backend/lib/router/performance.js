module.exports = (app) => {
  const upload = require("../controller/performance/multerMiddleware");
  const evaluationController = require("../controller/performance/submit_Evaluation");
  const express = require("express");
  const router = express.Router();

  router.post("/writePerform", upload, evaluationController.submitReport);

  app.use("/api", router);
};
