const email = require("../models/email/email");

module.exports = (app) => {
    const getEmailController = require("../controller/email/checkEmail");
    const sendEmailController = require("../controller/email/sendEmail");
    const draftEmailController = require("../controller/email/draftEmail");

    const express = require("express");
    const router = express.Router();

        // ⚠️⚠️ 이메일 router  ⚠️⚠️
        router.get("/checkEmail/:userId",getEmailController.getAllEmail);
        router.post("/sendEmail",sendEmailController.sendMail);
        router.delete("/deleteEmail",getEmailController.deleteEmail);


        app.use("/api", router);
};