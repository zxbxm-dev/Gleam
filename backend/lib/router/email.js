module.exports = (app) => {
    const emailController = require("../controller/email/checkEmail");

    const express = require("express");
    const router = express.Router();

        // ⚠️⚠️mailcow 이메일 가져오기 router  ⚠️⚠️
        router.get("/checkEmail/:userId",emailController.getAllEmail);
        router.post("/")

        app.use("/api", router);
};