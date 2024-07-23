module.exports = (app) => {
    const pjscheduleController = require("../controller/pjschedule/projectSchedule");

    const express = require("express");
    const router = express.Router();

    // ⚠️⚠️프로젝트 일정 router ----------------------------------------------------------------------- ⚠️⚠️
    router.post("/addProject", pjscheduleController.addProject);
    router.get("/checkProject", pjscheduleController.getAllProject);
    //프로젝트 수정 라우트
    router.put(
        "/editProject/:projectindex/:subprojectIndex?",
        pjscheduleController.editProject
    );
    //프로젝트 삭제 라우트
    router.delete(
        "/deleteProject/:projectindex/:subprojectIndex?",
        pjscheduleController.deleteProject
    );

    app.use("api", router);
};