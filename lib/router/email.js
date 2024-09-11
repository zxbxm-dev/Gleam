const email = require("../models/email/email");
const multerMiddleware = require('../controller/email/multerMiddleware');


module.exports = (app) => {
    const getEmailController = require("../controller/email/checkEmail");
    const sendEmailController = require("../controller/email/sendEmail");
    const draftEmailController = require("../controller/email/draftEmail");
    const QueueEmailController = require("../controller/email/emailQueue");
    const emailActionController = require("../controller/email/emailAction");
    const JunkController = require("../controller/email/JunkEmail");

    const express = require("express");
    const router = express.Router();

        // ⚠️⚠️ 이메일 router  ⚠️⚠️
        router.get("/checkEmail/:userId",getEmailController.getAllEmail);
        router.post("/sendEmail",multerMiddleware.array('attachment'),sendEmailController.sendMail);
        router.delete("/deleteEmail/:Id/:messageId",getEmailController.deleteEmail);
        router.put("/readEmail",emailActionController.readEmail);
        
        //이메일 임시저장하기
        router.post("/draftEmail",draftEmailController.draftEmails);

        //중요 이메일 등록하기 
        router.put("/starringEmail",emailActionController.starringEmail);

        //예약 이메일 취소하기
        router.delete("/cancleQueueEmail/:Id",QueueEmailController.cancleQueueEmail);

        //스팸 이메일
        router.put("/registerJunk/:Id",JunkController.junkController);
        router.post("/addJunkList",JunkController.addJunkList);
        router.get("/getJunkList",JunkController.getAllJunkList);
        router.delete("/removeJunklist/:junkId",JunkController.removeFromJunkList);

        app.use("/api", router);
};