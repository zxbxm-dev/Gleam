module.exports = (app) => {
    const pjscheduleController = require("../controller/pjschedule/projectSchedule");

    const express = require("express");
    const router = express.Router();

    // ⚠️⚠️프로젝트 일정 router ----------------------------------------------------------------------- ⚠️⚠️
    router.post("/addProject/:mainprojectIndex?", pjscheduleController.addProject);
    router.get("/checkProject", pjscheduleController.getAllProject);
    //프로젝트 수정 라우트
    router.patch(
        "/editProject/:mainprojectIndex/:subprojectIndex?",
        pjscheduleController.editProject
    );
    //프로젝트 삭제 라우트
    router.delete(
        "/deleteProject/:mainprojectIndex/:subprojectIndex?",
        pjscheduleController.deleteProject
    );

    app.use("/api", router);
};