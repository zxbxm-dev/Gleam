const models = require("../../models");
const vacation = models.AnnualLeave;
const Quitter = models.Quitter;

// 휴가 관리 등록
const AddVacation = async (req, res) => {
  const {
    userID,
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
      userId: userID,
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

// 🔥🔥연차 관리 조회 (관리자)🔥🔥
const administratorCalendar = async (req, res) => {
  try {
    // 퇴사 상태인 사용자를 모두 조회
    const quitters = await Quitter.findAll({
      where: {
        status: "quitter",
      },
    });

    for (const quitter of quitters) {
      // 같은 userId를 가진 leavedate를 업데이트
      await vacation.update(
        { leavedate: quitter.leavedate },
        {
          where: {
            userId: quitter.userId,
          },
        }
      );
    }
    //퇴자사들의 leavedate 업데이트 이후 클라이언트 응답
    const updatedAnnualLeaves = await vacation.findAll();
    res.status(200).json(updatedAnnualLeaves);
  } catch (error) {
    console.error("연차 데이터 업데이트 중 오류 발생:", error);
    res.status(500).json({ error: "연차 데이터 업데이트에 실패했습니다." });
  }
};

// 🔥🔥연차 관리 수정(관리자)🔥🔥

module.exports = {
  AddVacation,
  getAllCalendarEvents,
  administratorCalendar,
};
