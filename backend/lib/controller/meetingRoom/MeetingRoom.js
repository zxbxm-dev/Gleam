const models = require("../../models");
const meeting = models.Meeting;
const { Op } = require("sequelize");

//회의 예약 추가
const addMeetingRoom = async (req, res) => {
  const{
    userID,
    username,
    company,
    department,
    team,
    title,
    meetpeople,
    startDate,
    endDate,
    startTime,
    endTime,
    place,
    memo,
    year,
    force,
} = req.body;

console.log("요청 본문 받음:", req.body);

try{

 //회의실 예약 시간 중복 확인
 const overlappedMeeting = await meeting.findAll({
    
    where:{
        // startTime < meeting.endTime && endTime > meeting.startTime
        [Op.and]:[
            {startDate: startDate},
            {place: place},
        ],       
        [Op.or]:[
            {[Op.and]:[
                { startTime: { [Op.lt]: endTime } }, // 새로운 예약의 시작 시간이 기존 예약의 종료 시간보다 이전
                { endTime: { [Op.gt]: startTime } }, // 새로운 예약의 종료 시간이 기존 예약의 시작 시간보다 이후
            ]},
            {[Op.and]:[
                { startTime: { [Op.lte]: startTime } },//새로운 예약의 시작 시간이 기존 예약의 시작 시간보다 같거나 이전
                { endTime: { [Op.gte]: endTime } }, //새로운 예약의 종료 시간이 기존 예약의 종료 시간보다 같거나 이후
            ]}
         ],
    }
});

if (overlappedMeeting.length > 0) {
    return res.status(409).json({message: "이미 예약된 회의가 존재합니다."})
}
}catch(error){
    console.error("회의실 예약 중복 확인 중 오류 발생:", error);
    res.status(500).json({ message: "회의실 예약 중복 확인 중 오류가 발생했습니다." });
};


try{
//회의 참가자 중복 확인 
const overlappedMeeting = await meeting.findAll({
    where:{
         startDate: startDate,
        [Op.or]:[
        {[Op.and]:[
            { startTime: { [Op.lt]: endTime } }, // 새로운 예약의 시작 시간이 기존 예약의 종료 시간보다 이전
            { endTime: { [Op.gt]: startTime } }, // 새로운 예약의 종료 시간이 기존 예약의 시작 시간보다 이후
        ]},
        {[Op.and]:[
            { startTime: { [Op.lte]: startTime } },//새로운 예약의 시작 시간이 기존 예약의 시작 시간보다 같거나 이전
            { endTime: { [Op.gte]: endTime } }, //새로운 예약의 종료 시간이 기존 예약의 종료 시간보다 같거나 이후
        ]}
     ],
    }
});

// 중복 참가자 필터링
const filteredMeeting = overlappedMeeting.filter(meeting => {
    return meeting.meetpeople.some(attendee => meetpeople.includes(attendee));
});

if(filteredMeeting.length > 0 && force !== true){
    return res.status(418).json({message: "선택한 회의 참여자가 이미 회의 참여 중입니다. "})
}
}catch(error){
    console.error("회의 참여자 중복 확인 중 오류 발생:", error);
    res.status(500).json({ message: "회의 참여자 중복 확인 중 오류가 발생했습니다." });
};

try{
    const newMeetingRoom = await meeting.create({
        userId: userID,
        username,
        company,
        department,
        team,
        title,
        meetpeople,
        startDate,
        endDate,
        startTime,
        endTime,
        place,
        memo,
        year,
    });
    res.status(201).json({message: "회의실 예약이 완료되었습니다", newMeetingRoom});
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
    const { userID, startDate, endDate, title, memo, meetpeople, place, startTime, endTime ,force } = req.body.data;
    const { Meeting_id: meetingId } = req.params;

    console.log("요청 파라미터:", req.params);
    console.log("요청 본문:", req.body);

    if(!meetingId) {
        return res
        .status(400)
        .json({ message: "회의실 예약 ID가 제공되지 않았습니다." });
    }    
    try{

        //회의실 예약 시간 중복 확인
        const overlappedMeeting = await meeting.findAll({
           
           where:{
                //수정하는 회의실예약 데이터 제외 
                meetingId: { [Op.ne]: meetingId },
               // startTime < meeting.endTime && endTime > meeting.startTime
               [Op.and]:[
                   {startDate: startDate},
                   {place: place},
               ],       
               [Op.or]:[
                   {[Op.and]:[
                       { startTime: { [Op.lt]: endTime } }, // 새로운 예약의 시작 시간이 기존 예약의 종료 시간보다 이전
                       { endTime: { [Op.gt]: startTime } }, // 새로운 예약의 종료 시간이 기존 예약의 시작 시간보다 이후
                   ]},
                   {[Op.and]:[
                       { startTime: { [Op.lte]: startTime } },//새로운 예약의 시작 시간이 기존 예약의 시작 시간보다 같거나 이전
                       { endTime: { [Op.gte]: endTime } }, //새로운 예약의 종료 시간이 기존 예약의 종료 시간보다 같거나 이후
                   ]}
                ],
           }
       });
       
       if (overlappedMeeting.length > 0) {
           return res.status(409).json({message: "이미 예약된 회의가 존재합니다."})
       }
       }catch(error){
           console.error("회의실 예약 중복 확인 중 오류 발생:", error);
           res.status(500).json({ message: "회의실 예약 중복 확인 중 오류가 발생했습니다." });
       };
    
    
       try{
        //회의 참가자 중복 확인 
        const overlappedMeeting = await meeting.findAll({
            where:{
                //수정하는 회의실예약 데이터 제외 
                meetingId: { [Op.ne]: meetingId },
                 startDate: startDate,
                [Op.or]:[
                {[Op.and]:[
                    { startTime: { [Op.lt]: endTime } }, // 새로운 예약의 시작 시간이 기존 예약의 종료 시간보다 이전
                    { endTime: { [Op.gt]: startTime } }, // 새로운 예약의 종료 시간이 기존 예약의 시작 시간보다 이후
                ]},
                {[Op.and]:[
                    { startTime: { [Op.lte]: startTime } },//새로운 예약의 시작 시간이 기존 예약의 시작 시간보다 같거나 이전
                    { endTime: { [Op.gte]: endTime } }, //새로운 예약의 종료 시간이 기존 예약의 종료 시간보다 같거나 이후
                ]}
             ],
            }
        });
        
        // 중복 참가자 필터링
        const filteredMeeting = overlappedMeeting.filter(meeting => {
            return meeting.meetpeople.some(attendee => meetpeople.includes(attendee));
        });
        
        if(filteredMeeting.length > 0 && force !== true){
            return res.status(418).json({message: "선택한 회의 참여자가 이미 회의 참여 중입니다. "})
        }
        }catch(error){
            console.error("회의 참여자 중복 확인 중 오류 발생:", error);
            res.status(500).json({ message: "회의 참여자 중복 확인 중 오류가 발생했습니다." });
        };

   try{
    const meetingRoom = await meeting.findOne({
        where: { meetingId: meetingId },
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
    meetingRoom.startTime = startTime;
    meetingRoom.endTime = endTime;
    meetingRoom.meetpeople = meetpeople;
    meetingRoom.place = place;

    await meetingRoom.save();

    res.status(200).json({message: "예약 수정이 완료되었습니다.",meetingRoom});
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