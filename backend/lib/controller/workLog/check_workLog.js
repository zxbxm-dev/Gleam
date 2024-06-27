const { Op } = require("sequelize");
const models = require("../../models");
const Report = models.Report;

// 내 문서 목록 조회
const getMyReports = async (req, res) => {
  const {userId} = req.query.userID;
  const userName = decodeURIComponent(userId);

  try {
    const reports = await Report.findAll({
      where: {
        [Op.or]: [
          { userId: userId },
          {
            Payment: {
              [Op.like]: `%${userName}%`,
            },
          },
        ],
      },
      attributes: [
        "id",
        "userId",
        "username",
        "dept",
        "currentSigner",
        "selectForm",
        "Signsituation",
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

    const modifiedReports = reports.map(report => {
      // Payment 데이터를 파싱
      let paymentData;
      try {
        paymentData = JSON.parse(report.Payment);
      } catch (e) {
        console.error("Payment 데이터 파싱 오류:", e);
        paymentData = [];
      }

      // 사용자가 참조된 목록에 포함되어 있는지 확인
      const isReferUser = paymentData.some(payment => 
        payment.selectedMembers?.some(member => member[0] === userName)
      );

      // 상태 설정
      let status;
      if (isReferUser) {
        status = "refer";
      } else if (report.userId === userId) {
        switch (report.approval) {
          case "draft":
            status = "draft";
            break;
          case "pending":
            status = "pending";
            break;
          case "rejected":
            status = "rejected";
            break;
          case "completed":
            status = "completed";
            break;
          default:
            status = report.status;
        }
      } else {
        status = report.status;
      }

      return {
        ...report.toJSON(),
        status: status,
      };
    });

    res.status(200).json({
      success: true,
      message: "내 문서 목록 조회 성공",
      reports: modifiedReports,
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
        "Signsituation",
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
        "Signsituation",
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
        "Signsituation",
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
        "Signsituation",
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
