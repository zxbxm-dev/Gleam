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
      order:[
        ['id','desc'],
      ],
    });
    // 내가 참조로 들어간 문서 조회
    const referencedDocuments = await Report.findAll({
      where: {
        referName: {
          [Op.like]: `%${username}%`,
        },
        order:[
          ['id','desc'],
        ],
      },
    });

    // 문서 상태 설정
    const documentsWithStatus = myDocuments.map((doc) => {
      let status = "결재 진행 중";

      // 결재 완료 확인
      if (doc.completed && doc.completed.includes(username)) {
        status = "결재 완료";
      } else if (doc.rejected && doc.rejected.includes(username)) {
        status = "반려됨";
      } else if (doc.pending && doc.pending.includes(username)) {
        status = "결재 진행 중";
      }

      // 결재 진행중 문서 확인
      if (doc.personSigning && doc.personSigning.includes(username)) {
        if (doc.pending && doc.pending.includes(username)) {
          status = "결재 진행 중";
        } else {
          // 결재 싸인을 한명이라도 완료한 사람
          const signers = doc.personSigning.split(",");
          const pendingSigners = doc.pending ? doc.pending.split(",") : [];
          const intersection = signers.filter((signer) =>
            pendingSigners.includes(signer)
          );
          if (intersection.length > 0) {
            status = "결재 진행 중";
          }
        }
      }
      // currentSigner와 approval이 같은 경우, 결재 완료 상태로 설정
      if (doc.currentSigner === doc.approval) {
        status = "결재 완료";
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

// 결재할 문서 목록 조회 --------------------------------------------------------------------------------
const getDocumentsToApprove = async (req, res) => {
  const { username } = req.query;

  try {
    // personSigning에서 이름이 끝부분에 있는 문서들을 조회
    const documents = await Report.findAll({
      where: {
        personSigning: {
          [Op.like]: `%${username}`, // 이름이 personSigning의 끝부분에 있는 경우
        },
        order:[
          ['id','desc'],
        ],
      },
    });

    // 필터링: pending에 이름이 있는 문서는 다음 결재자의 이름을 가져옴
    const filteredDocuments = documents.map(document => {
      const personSigningList = document.personSigning.split(",");
      const pendingList = document.pending ? document.pending.split(",") : [];

      // personSigning의 마지막 이름이 현재 username이고 pending에 같은 이름이 있다면
      if (personSigningList[personSigningList.length - 1] === username && pendingList.includes(username)) {
        // 다음 사람의 이름을 가져옴
        const nextSigner = personSigningList[personSigningList.indexOf(username) + 1];
        return {
          ...document.toJSON(),
          nextSigner,
        };
      }
      return document;
    });

    // 조회된 문서 목록을 클라이언트에게 반환
    res.json(filteredDocuments);
  } catch (error) {
    console.error('문서를 검색하는 중 오류가 발생:', error);
    res.status(500).json({ error: '내부 서버 오류입니다.' });
  }
};

// 결재 진행 중인 문서 목록 조회 --------------------------------------------------------------------------------
const getDocumentsInProgress = async (req, res) => {
  const { username } = req.query;
console.log(req.query);
  try {
    const reports = await Report.findAll({
      where: {
        [Op.or]: [
          { pending: { [Op.like]: `%${username}%` } },
        ],
        order:[
          ['id','desc'],
        ],
      },
    });

    const reportsToSend = reports.map((report) => report.toJSON());

    console.log("클라이언트에게 결재할 문서 목록:");
    console.log(reportsToSend);

    res.status(200).json(reportsToSend);
  } catch (error) {
    console.error(
      "결재할 문서 목록을 가져오는 중에 오류가 발생했습니다.:",
      error
    );
    res
      .status(500)
      .json({ error: "결재할 문서 목록 불러오기에 실패했습니다." });
  }
};

// 반려된 문서 목록 조회 --------------------------------------------------------------------------------
const getRejectedDocuments = async (req, res) => {
  const { username } = req.query;

  try {
    const reports = await Report.findAll({
      where: {
        [Op.and]: [
          { rejected: { [Op.like]: `%${username}%` } }, // 반려된 문서 중에서
          { username: { [Op.ne]: username } } // 작성자가 현재 사용자가 아닌 문서만 선택
        ],
        order:[
          ['id','desc'],
        ],
      },
    });

    const reportsToSend = reports.map((report) => report.toJSON());

    console.log("클라이언트에게 반려된 문서 목록:");
    console.log(reportsToSend);

    res.status(200).json(reportsToSend);
  } catch (error) {
    console.error("반려된 문서 목록을 가져오는 중에 오류가 발생했습니다.:", error);
    res.status(500).json({ error: "반려된 문서 목록 불러오기에 실패했습니다." });
  }
};

// 결재 완료된 문서 목록 조회 --------------------------------------------------------------------------------
const getApprovedDocuments = async (req, res) => {
  const { username } = req.query;

  try {
    const reports = await Report.findAll({
      where: {
        [Op.or]: [
          { completed: { [Op.like]: `%${username}%` } },
        ],
        order:[
          ['id','desc'],
        ],
      },
    });

    const reportsToSend = reports.map((report) => report.toJSON());

    console.log("클라이언트에게 결재할 문서 목록:");
    console.log(reportsToSend);

    res.status(200).json(reportsToSend);
  } catch (error) {
    console.error(
      "결재할 문서 목록을 가져오는 중에 오류가 발생했습니다.:",
      error
    );
    res
      .status(500)
      .json({ error: "결재할 문서 목록 불러오기에 실패했습니다." });
  }
};

module.exports = {
  getMyReports,
  getDocumentsToApprove,
  getDocumentsInProgress,
  getRejectedDocuments,
  getApprovedDocuments,
};
