const email = require("../models/email/email");
const multerMiddleware = require('../controller/email/multerMiddleware');


module.exports = (app) => {
    const getEmailController = require("../controller/email/checkEmail");
    const sendEmailController = require("../controller/email/sendEmail");
    const draftEmailController = require("../controller/email/draftEmail");
    const QueueEmailController = require("../controller/email/emailQueue");
    const emailActionController = require("../controller/email/emailAction");

    const express = require("express");
    const router = express.Router();

        // ⚠️⚠️ 이메일 router  ⚠️⚠️
        router.get("/checkEmail/:userId",getEmailController.getAllEmail);
        router.post("/sendEmail",multerMiddleware.array('attachment'),sendEmailController.sendMail);
        router.delete("/deleteEmail/:Id/:messageId",getEmailController.deleteEmail);
        
        //이메일 임시저장하기
        router.post("/draftEmail",draftEmailController.draftEmails);

        //중요 이메일 등록하기 
        router.put("/starringEmail",emailActionController.starringEmail);

        //예약 이메일 취소하기
        router.delete("/cancleEmail/:Id",QueueEmailController.deleteQueueEmail);

        app.use("/api", router);
};