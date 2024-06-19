const models = require("../../models");
const vacation = models.AnnualLeave;
const User = models.User

// 휴가 관리 등록
const AddVacation = async (req, res) => {
  const {
    name,
    company,
    department,
    team,
    title,
    startDate,
    endDate,
    dateType,
    memo,
    year,
    backgroundColor,
  } = req.body;

  console.log("Received request body:", req.body);

  try {
    // 데이터베이스에 일정 추가
    const newCalendar = await vacation.create({
      username: name,
      company,
      department,
      team,
      title,
      startDate,
      endDate,
      dateType,
      memo,
      year,
      backgroundColor,
    });

    res.status(201).json(newCalendar);
  } catch (error) {
    console.error("캘린더 일정을 추가하는 중에 오류가 발생했습니다.:", error);
    res.status(500).json({ message: "일정 추가에 실패했습니다." });
  }
};

// 휴가 관리 조회
const getAllCalendarEvents = async (req, res) => {
  try {
    const events = await vacation.findAll();

    // 클라이언트 응답
    res.status(200).json(events);
  } catch (error) {
    console.error("캘린더 일정을 가져오는 중에 오류가 발생했습니다.:", error);
    res.status(500).json({ error: "캘린더 일정 불러오기에 실패했습니다." });
  }
};
// 퇴사 회원의 leavedate 업데이트 (user 데이터베이스에서 퇴사자의 정보를 가져와 annualLeave에 업데이트)
// 🔥🔥연차 관리 조회 (관리자)🔥🔥
const administratorCalendar = async (req, res) => {
  try {
    const events = await vacation.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['status', 'leavedate'],
        },
      ],
    });

    // 퇴사 회원의 leavedate 업데이트
    const updatePromises = events.map(async (event) => {
      if (event.user && event.user.status === 'quitter') {
        event.leavedate = event.user.leavedate;
        return event.save();
      }
    });

    // 모든 업데이트 작업 완료 후 응답
    await Promise.all(updatePromises);

    // 클라이언트 응답
    res.status(200).json(events);
  } catch (error) {
    console.error('관리자 연차 관리 조회 정보를 가져오는 중에 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '관리자 연차 일정 불러오기에 실패했습니다.' });
  }
};


// 🔥🔥연차 관리 수정(관리자)🔥🔥

module.exports = {
  AddVacation,
  getAllCalendarEvents,
  administratorCalendar
};
