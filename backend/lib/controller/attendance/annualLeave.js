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

  console.log("요청 본문 받음:", req.body);

  try {
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

    // 사용자 '아이디'의 사용 가능 연차 정보 조회
    const userVacation = await vacation.findOne({ where: { userId: userID } });

    if (userVacation) {
      // availableDatem업데이트
      newCalendar.availableDate = userVacation.availableDate;
      await newCalendar.save();

      if (!userVacation.memo && !userVacation.title) {
        await userVacation.destroy(); // memo와 title이 빈 값일 때만 삭제
      }
    } else {
      console.error(
        `사용자 '${userID}'의 사용 가능 연차 정보를 찾을 수 없습니다.`
      );
    }

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
    res.status(200).json(events);
  } catch (error) {
    console.error("캘린더 일정을 가져오는 중에 오류가 발생했습니다.:", error);
    res.status(500).json({ error: "캘린더 일정 불러오기에 실패했습니다." });
  }
};

// 일정 수정 하기
const editCalendarEvent = async (req, res) => {
  const { userID, startDate, endDate, title, memo } = req.body.data;
  const { event_id: eventId } = req.params;

  console.log("요청 파라미터:", req.params);
  console.log("요청 본문:", req.body);

  if (!eventId) {
    return res
      .status(400)
      .json({ message: "이벤트 ID가 제공되지 않았습니다." });
  }
  try {
    const event = await vacation.findOne({
      where: { id: eventId, userId: userID },
    });
    if (!event) {
      return res
        .status(404)
        .json({ message: "해당 이벤트를 찾을 수 없습니다." });
    }
    event.title = title;
    event.memo = memo;
    event.startDate = startDate;
    event.endDate = endDate;

    await event.save();

    res.status(200).json(event);
  } catch (error) {
    console.error("캘린더 일정을 수정하는 중에 오류가 발생했습니다.:", error);
    res.status(500).json({ message: "일정 수정에 실패했습니다." });
  }
};

// 일정 삭제 함수
const deleteCalendarEvent = async (req, res) => {
  const eventId = req.params.event_id;
  try {
    const deletedEvent = await vacation.findByPk(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ error: "일정을 찾을 수 없습니다." });
    }
    await deletedEvent.destroy();

    res.status(200).json({ message: "일정이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("일정 삭제 중 오류 발생:", error);
    res.status(500).json({ error: "일정 삭제에 실패했습니다." });
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
      await vacation.update(
        { leavedate: quitter.leavedate },
        {
          where: {
            userId: quitter.userId,
          },
        }
      );
    }
    const updatedAnnualLeaves = await vacation.findAll();
    res.status(200).json(updatedAnnualLeaves);
  } catch (error) {
    console.error("연차 데이터 업데이트 중 오류 발생:", error);
    res.status(500).json({ error: "연차 데이터 업데이트에 실패했습니다." });
  }
};

// 🔥🔥연차 관리 일괄 수정(관리자)🔥🔥
const updateUserAnnualLeave = async (req, res) => {
  try {
    const updatedVacations = req.body;

    for (const vacationInfo of updatedVacations) {
      const { userID, username, availableDate } = vacationInfo;

      let userVacation = await vacation.findOne({
        where: {
          userId: userID,
        },
      });

      if (!userVacation) {
        // 사용자의 연차 정보가 없는 경우 새로 생성
        userVacation = await vacation.create({
          userId: userID,
          username: username,
          availableDate: availableDate,
        });
      } else {
        // 이미 연차 정보가 있는 경우 모든 필드 업데이트
        await vacation.update(
          { availableDate: availableDate },
          {
            where: {
              userId: userID,
              username: username,
            },
          }
        );
      }
    }

    res
      .status(200)
      .json({ message: "사용 가능한 연차가 일괄 업데이트되었습니다." });
  } catch (error) {
    console.error("연차 데이터 일괄 업데이트 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "연차 데이터 일괄 업데이트에 실패했습니다." });
  }
};

module.exports = {
  AddVacation,
  getAllCalendarEvents,
  editCalendarEvent,
  deleteCalendarEvent,
  administratorCalendar,
  updateUserAnnualLeave,
};
