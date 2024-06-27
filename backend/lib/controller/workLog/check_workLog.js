const { Op } = require("sequelize");
const models = require("../../models");
const Report = models.Report;

// 내 문서 목록 조회
const getMyReports = async (req, res) => {
  const { username, userID } = req.query;
  try {
    // Report 모델에서 해당 username과 userID를 가진 보고서들을 조회
    const reports = await Report.findAll({
      where: {
        [Op.or]: [
          { userId: userID }, // 내가 작성한 보고서
          { // 참조된 보고서
            Payment: {
              [Op.like]: `%${username}%`
            }
          }
        ]
      }
    });

    // 클라이언트에게 전달할 보고서 목록
    const reportsToSend = reports.map(report => {
      let reportData = report.toJSON();
      reportData.reference = ""; // 초기화

      // Payment 필드의 JSON 문자열 파싱 및 참조 여부 확인
      let paymentData = [];
      try {
        paymentData = JSON.parse(report.Payment);
      } catch (error) {
        console.error("Payment 데이터 파싱 중 오류 발생:", error);
      }

      // Payment 데이터가 배열 형태인지 확인 후 username이 포함되었는지 검사
      if (Array.isArray(paymentData)) {
        paymentData.forEach(item => {
          if (Array.isArray(item.selectedMembers) && item.selectedMembers.flat().includes(username)) {
            reportData.reference = "참조";
          }
          if (item.selectedMember && item.selectedMember.includes(username)) {
            reportData.reference = "참조";
          }
        });
      }

      return reportData;
    });

    console.log("클라이언트에게 전달할 보고서 목록:");
    console.log(reportsToSend);

    res.status(200).json(reportsToSend);
  } catch (error) {
    console.error("보고서 목록을 가져오는 중에 오류가 발생했습니다.:", error);
    res.status(500).json({ error: "보고서 목록 불러오기에 실패했습니다." });
  }
};


// 결제할 문서 목록 조회
const getDocumentsToApprove = async (req, res) => {
  const userName = req.query.username;

  try {
    const reports = await Report.findAll({
      where: {
        approval: "draft",
        Payment: {
          [Op.like]: `%${userName}%`,
        },
      },
      attributes: [
        "id",
        "userId",
        "username",
        "dept",
        "currentSigner",
        "selectForm",
        "Payment",
        "attachment",
        "pdffile",
        "receiptDate",
        "sendDate",
        "stopDate",
        "opinionName",
        "opinionContent",
        "rejectName",
        "rejectContent",
        "approval",
        "status",
        "currentSigner",
        "createdAt",
        "updatedAt",
      ],
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

// 결재 진행 중인 문서 목록 조회
const getDocumentsInProgress = async (req, res) => {
  const userName = req.query.username;

  try {
    const reports = await Report.findAll({
      where: {
        approval: "pending",
        Payment: {
          [Op.like]: `%${userName}%`,
        },
      },
      attributes: [
        "id",
        "userId",
        "username",
        "dept",
        "currentSigner",
        "selectForm",
        "Payment",
        "attachment",
        "pdffile",
        "receiptDate",
        "sendDate",
        "stopDate",
        "opinionName",
        "opinionContent",
        "rejectName",
        "rejectContent",
        "approval",
        "status",
        "currentSigner",
        "createdAt",
        "updatedAt",
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
  const userName = req.query.username;

  try {
    const reports = await Report.findAll({
      where: {
        approval: "rejected",
        Payment: {
          [Op.like]: `%${userName}%`,
        },
      },
      attributes: [
        "id",
        "userId",
        "username",
        "dept",
        "currentSigner",
        "selectForm",
        "Payment",
        "attachment",
        "pdffile",
        "receiptDate",
        "sendDate",
        "stopDate",
        "opinionName",
        "opinionContent",
        "rejectName",
        "rejectContent",
        "approval",
        "status",
        "currentSigner",
        "createdAt",
        "updatedAt",
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
  const userName = req.query.username;

  try {
    const reports = await Report.findAll({
      where: {
        approval: "completed",
        Payment: {
          [Op.like]: `%${userName}%`,
        },
      },
      attributes: [
        "id",
        "userId",
        "username",
        "dept",
        "currentSigner",
        "selectForm",
        "Payment",
        "attachment",
        "pdffile",
        "receiptDate",
        "sendDate",
        "stopDate",
        "opinionName",
        "opinionContent",
        "rejectName",
        "rejectContent",
        "approval",
        "status",
        "currentSigner",
        "createdAt",
        "updatedAt",
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
