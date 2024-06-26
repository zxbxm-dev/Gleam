const models = require("../../models");
const Report = models.Report;

// 내 문서 목록 조회
const getMyReports = async (req, res) => {
  //const userId = req.params.userId;
  const { userName, userId } = req.body.username;

  try {
    const reports = await Report.findAll({
      where: {
        userId: userId,
        userName: userName,
      },
      // 필요한 필드 조회
      attributes: [
        "id",
        "userId",
        "username",
        "selectForm",
        "sendDate",
        "status",
      ],
      // sendDate 기준으로 내림차순 정렬
      order: [["sendDate", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "내 문서 목록 조회 성공",
      reports: reports,
    });
  } catch (error) {
    console.error("내 문서 목록 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류로 인해 내 문서 목록 조회 실패",
    });
  }
};

// 결제할 문서 목록 조회
const getDocumentsToApprove = async (req, res) => {
  const userName = req.body.username;

  try {
    const reports = await Report.findAll({
      where: {
        // 결재 진행 중인 문서만 조회
        approval: "pending",
        // Payment 필드에 userName이 포함된 경우
        Payment: {
          [Op.like]: `%${userName}%`,
        },
      },
      attributes: [
        "id",
        "userId",
        "username",
        "selectForm",
        "sendDate",
        "status",
      ], // 필요한 필드 선택
      order: [["sendDate", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "결제할 문서 목록 조회 성공",
      reports: reports,
    });
  } catch (error) {
    console.error("결제할 문서 목록 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류로 인해 결제할 문서 목록 조회 실패",
    });
  }
};

// 결제 진행 중인 문서 목록 조회
const getDocumentsInProgress = async (req, res) => {
  const userName = req.body.username;

  try {
    const reports = await Report.findAll({
      where: {
        // 결재 진행 중인 문서만 조회
        approval: "processing",
          Payment: {
            [Op.like]: `%${userName}%`,
          },
      },
      attributes: [
        "id",
        "userId",
        "username",
        "selectForm",
        "sendDate",
        "status",
      ],
      order: [["sendDate", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "결제 진행 중인 문서 목록 조회 성공",
      reports: reports,
    });
  } catch (error) {
    console.error("결제 진행 중인 문서 목록 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류로 인해 결제 진행 중인 문서 목록 조회 실패",
    });
  }
};

// 반려된 문서 목록 조회
const getRejectedDocuments = async (req, res) => {
  const userName = req.body.username;

  try {
    const reports = await Report.findAll({
      where: {
        // 반려된 문서만 조회
        approval: "rejected", 
           Payment: {
            [Op.like]: `%${userName}%`,
          },
      },
      attributes: [
        "id",
        "userId",
        "username",
        "selectForm",
        "sendDate",
        "status",
      ],
      order: [["sendDate", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "반려된 문서 목록 조회 성공",
      reports: reports,
    });
  } catch (error) {
    console.error("반려된 문서 목록 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류로 인해 반려된 문서 목록 조회 실패",
    });
  }
};

// 결재 완료된 문서 목록 조회
const getApprovedDocuments = async (req, res) => {
  const userName = req.body.username;

  try {
    const reports = await Report.findAll({
      where: {
        // 결재 완료된 문서만 조회
        approval: "approved",
        Payment: {
          [Op.like]: `%${userName}%`,
        },
      },
      attributes: [
        "id",
        "userId",
        "username",
        "selectForm",
        "sendDate",
        "status",
      ],
      order: [["sendDate", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "결재 완료된 문서 목록 조회 성공",
      reports: reports,
    });
  } catch (error) {
    console.error("결재 완료된 문서 목록 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류로 인해 결재 완료된 문서 목록 조회 실패",
    });
  }
};

module.exports = {
  getMyReports,
  getDocumentsToApprove,
  getDocumentsInProgress,
  getRejectedDocuments,
  getApprovedDocuments,
};
