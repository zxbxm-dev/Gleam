const models = require("../../models");
const Operating = models.Expenses;

//운영비 관리 작성 등록
const writeOperating = async (req, res) => {
  try {
    // 클라이언트에서 보낸 데이터 확인
    const {
      common811, //공용
      common812,
      common813,
      common814,
      common815,
      common818,
      common819,
      management, //관리팀
      support, //지원팀
      devOne, //개발 1팀
      devTwo, //개발 2탐
      blockchain, //블록체인1팀
      design, //디자인팀
      planning, //기획팀
      percent,
    } = req.body;

    // 클라이언트로 부터 전달 받은 데이터를 팀별로 구분 및 배열로 처리
    const teamsData = [
      { team: "common811", data: common811 },
      { team: "common812", data: common812 },
      { team: "common813", data: common813 },
      { team: "common814", data: common814 },
      { team: "common815", data: common815 },
      { team: "common818", data: common818 },
      { team: "common819", data: common819 },
      { team: "management", data: management },
      { team: "support", data: support },
      { team: "devOne", data: devOne },
      { team: "devTwo", data: devTwo },
      { team: "blockchain", data: blockchain },
      { team: "design", data: design },
      { team: "planning", data: planning },
    ];

    // 저장할 새로운 데이터와 기존 데이터를 비교하기 위해 새로운 데이터의 키 집합 생성
    const newKeys = new Set(); //중복된 값 금지
    teamsData.forEach((teamData) => {
      if (Array.isArray(teamData.data)) {
        teamData.data.forEach((row) => {
          const [accountCode, accountName, cost ] = row;
          if (accountCode && accountName && cost) {
            newKeys.add(`${teamData.team}_${accountCode}`);
          }
        });
      }
    });

    // 데이터베이스의 기존 항목 가져오기 (날짜를 기준으로 찾음)
    const existingData = await Operating.findAll({
      where: { year: new Date().getFullYear() },
    });

    // 삭제할 항목 식별 및 삭제
    for (const item of existingData) {
      if (!newKeys.has(`${item.team}_${item.accountCode}`)) {
        await item.destroy();
      }
    }

    // 새로운 데이터 추가 또는 업데이트
    for (const teamData of teamsData) {
      // 팀 데이터가 올바르게 배열로 구성되어 있는지 확인
      if (
        !Array.isArray(teamData.data) ||
        teamData.data.some((row) => !Array.isArray(row) || row.length !== 4)
      ) {
        throw new Error(`Invalid team data format for ${teamData.team}`);
      }

      // 팀 데이터가 비어있는지 확인
      const isEmpty = teamData.data.every((row) =>
        row.every((cell) => cell === "")
      );
      if (!isEmpty) {
        // 팀 데이터 반복하며 데이터베이스에 저장 또는 업데이트
        for (const row of teamData.data) {
          const [accountCode, accountName, cost, note] = row;

          // 빈 데이터가 아닌 경우에만 처리 (계정코드 또는 계정명 또는 연간편성액)
          if (accountCode || accountName || cost) {
            // 기존 데이터베이스에 해당 팀과 계정 코드를 가진 항목이 있는지 확인
            const existingItem = await Operating.findOne({
              where: { team: teamData.team, accountCode: accountCode },
            });

            if (existingItem) {
              // 이미 데이터베이스에 있는 경우 업데이트
              await existingItem.update({
                accountName: accountName || existingItem.accountName,
                // 값이 없으면 0으로 처리, 쉽표 제거하고 정수로 변환
                cost: parseInt(cost.replace(/,/g, "")) || existingItem.cost,
                Percent: percent || existingItem.Percent,
                note: note || existingItem.note, // 값이 없으면 빈 문자열
                year: new Date().getFullYear(), // 현재 연도
              });
            } else {
              // 새로운 데이터인 경우 추가
              await Operating.create({
                team: teamData.team,
                accountCode: accountCode,
                accountName: accountName,
                Percent:percent,
                cost: parseInt(cost.replace(/,/g, "")) || 0,
                note: note || "",
                year: new Date().getFullYear(), // 현재 연도
              });
            }
          }
        }
      }
    }

    // 처리 완료 후 응답
    res
      .status(201)
      .json({ success: "운영 데이터가 성공적으로 작성되었습니다." });
  } catch (error) {
    console.error("운영 데이터 작성 중 오류 발생:", error);
    res.status(500).json({
      message: "운영 데이터 작성에 실패했습니다.",
      error: error.message,
    });
  }
};

//운영비 관리 조회
const checkOperating = async (req, res) => {
    try {
      // 데이터베이스에서 현재 연도의 모든 운영비 데이터 조회
      const currentYear = new Date().getFullYear();
      const operatingData = await Operating.findAll({
        where: { year: currentYear },
      });
  
      // 조회된 데이터를 클라이언트에게 전달
      res.status(200).json(operatingData);
    } catch (error) {
      console.error("운영 데이터 조회 중 오류 발생:", error);
      res.status(500).json({
        message: "운영 데이터 조회에 실패했습니다.",
        error: error.message,
      });
    }
  };

module.exports = {
  writeOperating,
  checkOperating
};