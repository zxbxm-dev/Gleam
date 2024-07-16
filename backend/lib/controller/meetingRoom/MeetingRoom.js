const models = require("../../models");
const meeting = models.Meeting;

//회의 예약 추가
const addMeetingRoom = async (req, res) => {
  const{
    Meeting_id,
    userID,
    username,
    company,
    department,
    team,
    title,
    Meetpeople,
    startDate,
    endDate,
    place,
    memo,
    year,
} = req.body;

console.log("요청 본문 받음:", req.body);

try{
    const newMeetingRoom = await meeting.create({
        meetingId: Meeting_id,
        userId: userID,
        username,
        company,
        department,
        team,
        title,
        Meetpeople,
        startDate,
        endDate,
        place,
        memo,
        year,
    });
    res.status(201).json(newMeetingRoom);
 }catch(error){
        console.error("회의실 예약 일정을 추가하는 중에 오류가 발생했습니다.:", error);
        res.status(500).json({ message: "회의실 예약 일정 추가에 실패했습니다." });
 }
};

//회의실 예약 조회
const getAllMeetingRoom = async (req, res) => {
    try {
        const meetingRooms = await meeting.findAll();
        res.status(200).json(meetingRooms);
    }catch(error) {
        console.error("회의실 예약 일정을 가져오는 중에 오류가 발생했습니다.:", error);
        res.status(500).json({ error: "회의실 예약 일정 불러오기에 실패했습니다." });
    }
};

//회의실 예약 수정하기 
const editMeetingRoom = async (req, res) => {
    const { userID, startDate, endDate, title, memo } = req.body.data;
    const { meetingId: Meeting_id } = req.params;

    console.log("요청 파라미터:", req.params);
    console.log("요청 본문:", req.body);

    if(!Meeting_id) {
        return res
        .status(400)
        .json({ message: "회의실 예약 ID가 제공되지 않았습니다." });
    }
   try{
    const meetingRoom = await meeting.findOne({
        where: { meetingId: Meeting_id },
    });
    if (!meetingRoom) {
        return res
        .status(404)
        .json({ message: "해당 회의실 예약 정보를 찾을 수 없습니다." });
    }
    meetingRoom.title = title;
    meetingRoom.memo = memo;
    meetingRoom.startDate = startDate;
    meetingRoom.endDate = endDate;
    meetingRoom.Meetpeople = Meetpeople;
    meetingRoom.place = place;

    await meetingRoom.save();

    res.status(200).json(meetingRoom);
   }catch(error){
    console.error("회의실 예약 일정을 수정하는 중에 오류가 발생했습니다.:", error);
    res.status(500).json({ message: "회의실 예약 일정 수정에 실패했습니다." });
   }
};

//회의실 예약 삭제하기
const deleteMeetingRoom = async (req, res) => {
    const meetingRoomId = req.params.Meeting_id;
    try{
        const deletedMeeting = await meeting.findByPk(meetingRoomId);

        if(!deletedMeeting) {
            return res.status(404).json({ error: "회의실 예약 정보를 찾을 수 없습니다." });
        }
        await deletedMeeting.destroy();

        res.status(200).json({ message: "회의실 예약 일정이 성공적으로 삭제되었습니다." });
    }catch(error) {
      console.error("회의실 예약 일정 삭제 중 오류 발생:", error);
      res.status(500).json({ error: "회의실 예약 일정 삭제에 실패했습니다." });
    }
};

module.exports = {
    addMeetingRoom,
    getAllMeetingRoom,
    editMeetingRoom,
    deleteMeetingRoom,
}