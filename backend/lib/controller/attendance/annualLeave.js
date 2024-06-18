const models = require("../../models");
const vacation = models.annualLeaveData;

// 연차 등록
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
    console.error("Error adding calendar event:", error);
    res.status(500).json({ message: "일정 추가에 실패했습니다." });
  }
};

module.exports = {
  AddVacation,
};
