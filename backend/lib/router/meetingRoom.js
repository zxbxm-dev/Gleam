module.exports = (app) => {
    const meetingRoomController = require("../controller/meetingRoom/addMeetingRoom");
    
    const express = require("express");
    const router = express.Router();

    // ⚠️⚠️회의실 예약 router ----------------------------------------------------------------------- ⚠️⚠️
    router.post("/addMeeting", meetingRoomController.addMeetingRoom);
    router.get("/checkMeeting", meetingRoomController.getAllMeetingRoom);
    //회의실 예약 수정 라우트
    router.put(
        "/editMeeting/:Meeting_id",
        meetingRoomController.editMeetingRoom
    );
    //회의실 예약 삭제 라우트
    router.delete(
        "/deleteMeeting/:Meeting_id",
        meetingRoomController.deleteMeetingRoom
    );

    app.use("/api", router);
};