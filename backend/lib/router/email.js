module.exports = (app) => {
    const emailController = require("../controller/email/checkEmail");

    const express = require("express");
    const router = express.Router();

        // ⚠️⚠️mailcow 이메일 가져오기 router  ⚠️⚠️
    

        //이메일 조회하기
        router.get("/checkEmail",emailController.getAllEmail);

        app.use("/api", router);
};