const models = require("../../models");
const { Op } = require("sequelize");
const Report = models.Report;

// 내 문서 조회 --------------------------------------------------------------------------------
const getMyReports = async (req, res) => {
  const { userID, username } = req.query;

  if (!userID || !username) {
    return res.status(400).json({ error: "userID와 username이 필요합니다." });
  }

  try {
    // 내가 작성한 문서 조회
    const myDocuments = await Report.findAll({
      where: {
        userId: userID,
      },
    });
    // 내가 참조로 들어간 문서 조회
    const referencedDocuments = await Report.findAll({
      where: {
        referName: {
          [Op.like]: `%${username}%`,
        },
      },
    });

    // 문서 상태 설정
    const documentsWithStatus = myDocuments.map((doc) => {
      let status = "결제 진행 중";

      // 결제 완료 확인
      if (doc.completed && doc.completed.includes(username)) {
        status = "결제 완료";
      } else if (doc.rejected && doc.rejected.includes(username)) {
        status = "반려됨";
      } else if (doc.pending && doc.pending.includes(username)) {
        status = "결제 진행 중";
      }

      // 결제 진행중 문서 확인
      if (doc.personSigning && doc.personSigning.includes(username)) {
        if (doc.pending && doc.pending.includes(username)) {
          status = "결제 진행 중";
        } else {
          // 결제 싸인을 한명이라도 완료한 사람
          const signers = doc.personSigning.split(",");
          const pendingSigners = doc.pending ? doc.pending.split(",") : [];
          const intersection = signers.filter((signer) =>
            pendingSigners.includes(signer)
          );
          if (intersection.length > 0) {
            status = "결제 진행 중";
          }
        }
      }
      // currentSigner와 approval이 같은 경우, 결제 완료 상태로 설정
      if (doc.currentSigner === doc.approval) {
        status = "결제 완료";
      }
      console.log(`문서 ${doc.id}의 상태: ${status}`); // ❌로그 나중에 삭제할것❌
      return {
        ...doc.toJSON(),
        status,
      };
    });

    // 참조 문서 상태 설정
    const referencedWithStatus = referencedDocuments.map((doc) => {
      const status = "참조";
      console.log(`문서 ${doc.id}의 상태: ${status}`);// ❌로그 나중에 삭제할것❌
      return {
        ...doc.toJSON(),
        status
      };
    });
    // 전체 문서와 상태 결합하여 클라이언트에게 전달
    const allDocuments = [...documentsWithStatus, ...referencedWithStatus];
    res.status(200).json(allDocuments);
  } catch (error) {
    console.error("문서 조회 중 오류 발생:", error);
    res.status(500).json({ error: "내부 서버 오류입니다." });
  }
};

// 결제할 문서 목록 조회 --------------------------------------------------------------------------------
const getDocumentsToApprove = async (req, res) => {
  const { username } = req.query;

  try {
    const reports = await Report.findAll({
      where: {
        [Op.or]: [
          { personSigning: { [Op.like]: `%${username}%` } }, // 결제 진행자
        ],
      },
    });

    const reportsToSend = reports.map((report) => report.toJSON());

    console.log("클라이언트에게 결제할 문서 목록:");
    console.log(reportsToSend);

    res.status(200).json(reportsToSend);
  } catch (error) {
    console.error(
      "결제할 문서 목록을 가져오는 중에 오류가 발생했습니다.:",
      error
    );
    res
      .status(500)
      .json({ error: "보결제할 문서 목록 불러오기에 실패했습니다." });
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
        ],
      },
    });

    const reportsToSend = reports.map((report) => report.toJSON());

    console.log("클라이언트에게 결제할 문서 목록:");
    console.log(reportsToSend);

    res.status(200).json(reportsToSend);
  } catch (error) {
    console.error(
      "결제할 문서 목록을 가져오는 중에 오류가 발생했습니다.:",
      error
    );
    res
      .status(500)
      .json({ error: "보결제할 문서 목록 불러오기에 실패했습니다." });
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
        ],
      },
    });

    const reportsToSend = reports.map((report) => report.toJSON());

    console.log("클라이언트에게 결제할 문서 목록:");
    console.log(reportsToSend);

    res.status(200).json(reportsToSend);
  } catch (error) {
    console.error(
      "결제할 문서 목록을 가져오는 중에 오류가 발생했습니다.:",
      error
    );
    res
      .status(500)
      .json({ error: "보결제할 문서 목록 불러오기에 실패했습니다." });
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
        ],
      },
    });

    const reportsToSend = reports.map((report) => report.toJSON());

    console.log("클라이언트에게 결제할 문서 목록:");
    console.log(reportsToSend);

    res.status(200).json(reportsToSend);
  } catch (error) {
    console.error(
      "결제할 문서 목록을 가져오는 중에 오류가 발생했습니다.:",
      error
    );
    res
      .status(500)
      .json({ error: "보결제할 문서 목록 불러오기에 실패했습니다." });
  }
};

module.exports = {
  getMyReports,
  getDocumentsToApprove,
  getDocumentsInProgress,
  getRejectedDocuments,
  getApprovedDocuments,
};
