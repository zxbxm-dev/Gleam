const { Op } = require("sequelize");
const models = require("../../models");
const Report = models.Report;

// 내 문서 목록 조회
const getMyReports = async (req, res) => {
  const { username, userID } = req.query;
  
  try {
    const reports = await Report.findAll({
      where: {
        [Op.or]: [
          { userId: userID }, // 내가 작성한 보고서
          {
            // 보고서 상세 보기에 따라 수정 할것
            [Op.or]: [
              { pending: { [Op.like]: `%${username}%` } },
              { rejected: { [Op.like]: `%${username}%` } },
              { completed: { [Op.like]: `%${username}%` } },
              { referName: { [Op.like]: `%${username}%` } }
            ]
          }
        ]
      }
    });

    const reportsToSend = reports.map(report => report.toJSON());

    console.log("클라이언트에게 전달할 내 문서 목록:");
    console.log(reportsToSend);

    res.status(200).json(reportsToSend);
  } catch (error) {
    console.error("내 문서 목록을 가져오는 중에 오류가 발생했습니다.:", error);
    res.status(500).json({ error: "내 문서 목록 불러오기에 실패했습니다." });
  }
};

// 결제할 문서 목록 조회
const getDocumentsToApprove = async (req, res) => {
  const { username } = req.query;
  
  try {
    const reports = await Report.findAll({
      where: {
        [Op.or]: [
          { personSigning: { [Op.like]: `%${username}%` } }, // 결제 진행자
        ]
      }
    });

    const reportsToSend = reports.map(report => report.toJSON());

    console.log("클라이언트에게 결제할 문서 목록:");
    console.log(reportsToSend);

    res.status(200).json(reportsToSend);
  } catch (error) {
    console.error("결제할 문서 목록을 가져오는 중에 오류가 발생했습니다.:", error);
    res.status(500).json({ error: "보결제할 문서 목록 불러오기에 실패했습니다." });
  }
};

// 결재 진행 중인 문서 목록 조회
const getDocumentsInProgress = async (req, res) => {
  const { username } = req.query;
  
  try {
    const reports = await Report.findAll({
      where: {
        [Op.or]: [
          { pending: { [Op.like]: `%${username}%` } }, // 결제 진행중
        ]
      }
    });

    const reportsToSend = reports.map(report => report.toJSON());

    console.log("클라이언트에게 결제할 문서 목록:");
    console.log(reportsToSend);

    res.status(200).json(reportsToSend);
  } catch (error) {
    console.error("결제할 문서 목록을 가져오는 중에 오류가 발생했습니다.:", error);
    res.status(500).json({ error: "보결제할 문서 목록 불러오기에 실패했습니다." });
  }
};

// 반려된 문서 목록 조회
const getRejectedDocuments = async (req, res) => {
  const { username } = req.query;
  
  try {
    const reports = await Report.findAll({
      where: {
        [Op.or]: [
          { rejected: { [Op.like]: `%${username}%` } }, // 결제 진행중
        ]
      }
    });

    const reportsToSend = reports.map(report => report.toJSON());

    console.log("클라이언트에게 결제할 문서 목록:");
    console.log(reportsToSend);

    res.status(200).json(reportsToSend);
  } catch (error) {
    console.error("결제할 문서 목록을 가져오는 중에 오류가 발생했습니다.:", error);
    res.status(500).json({ error: "보결제할 문서 목록 불러오기에 실패했습니다." });
  }
};

// 결재 완료된 문서 목록 조회
const getApprovedDocuments = async (req, res) => {
  const { username } = req.query;
  
  try {
    const reports = await Report.findAll({
      where: {
        [Op.or]: [
          { completed: { [Op.like]: `%${username}%` } }, // 결제 진행중
        ]
      }
    });

    const reportsToSend = reports.map(report => report.toJSON());

    console.log("클라이언트에게 결제할 문서 목록:");
    console.log(reportsToSend);

    res.status(200).json(reportsToSend);
  } catch (error) {
    console.error("결제할 문서 목록을 가져오는 중에 오류가 발생했습니다.:", error);
    res.status(500).json({ error: "보결제할 문서 목록 불러오기에 실패했습니다." });
  }
};

module.exports = {
  getMyReports,
  getDocumentsToApprove,
  getDocumentsInProgress,
  getRejectedDocuments,
  getApprovedDocuments,
};
