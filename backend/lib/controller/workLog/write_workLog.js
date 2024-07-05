const models = require("../../models");
const Report = models.Report;
const fs = require("fs");

// 보고서 상세 조회 --------------------------------------------------------------------------------
const getReportById = async (req, res) => {
  const { report_id } = req.params;

  try {
    const report = await Report.findByPk(report_id);

    if (!report) {
      return res.status(404).json({ error: "해당 보고서를 찾을 수 없습니다." });
    }

    const filePath = report.attachment;

    if (!filePath) {
      return res.status(404).json({ error: "보고서 파일을 찾을 수 없습니다." });
    }

    // MIME 타입 설정
    res.setHeader("Content-Type", "application/pdf");

    // 로그에 파일 경로 출력
    console.log(` 경로: ${filePath}`);

    // 파일 스트림을 통해 전송
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // 파일 스트림을 HTTP 응답 스트림으로 파이핑
    fileStream.pipe(res);
  } catch (error) {
    console.error("보고서 조회 중 오류 발생:", error);
    res.status(500).json({ error: "내부 서버 오류입니다." });
  }
};

// 보고서 삭제 --------------------------------------------------------------------------------
const deleteReportById = async (req, res) => {
  const { report_id } = req.params;

  try {
    const report = await Report.findByPk(report_id);

    if (!report) {
      return res.status(404).json({ error: "해당 보고서를 찾을 수 없습니다." });
    }

    const filePath = report.attachment;

    if (filePath) {
      // 디버깅 출력
      console.log(`Deleting file from path: ${filePath}`);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("파일 삭제 중 오류 발생:", err);
          return res
            .status(500)
            .json({ error: "파일 삭제 중 오류가 발생했습니다." });
        }
      });
    }
    await report.destroy();
    res.status(200).json({ message: "보고서가 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("보고서 삭제 중 오류 발생:", error);
    res.status(500).json({ error: "내부 서버 오류입니다." });
  }
};

// 보고서 반려 --------------------------------------------------------------------------------
const cancelReportById = async (req, res) => {
  const { report_id } = req.params;
  const { rejection, userID, username, position } = req.body;

  try {
    // 보고서 조회
    const report = await Report.findByPk(report_id);

    if (!report) {
      return res.status(404).json({ error: "해당 보고서를 찾을 수 없습니다." });
    }

    console.log('현재 보고서:', report);

    // 현재 결재자가 아닌 경우 오류 반환
    if (!report.personSigning.includes(username)) {
      return res.status(403).json({ error: "현재 결재자가 아닙니다." });
    }

    // 현재 pending 리스트 조회
    let pendingSigners = report.pending ? report.pending.split(",") : [];
    let rejectedSigners = report.rejected ? report.rejected.split(",") : [];

    console.log('현재 pendingSigners:', pendingSigners);
    console.log('현재 rejectedSigners:', rejectedSigners);

    // pending에서 반려한 사람 제거
    const index = pendingSigners.indexOf(username);
    if (index !== -1) {
      pendingSigners.splice(index, 1);
    }

    // 모든 pendingSigners도 rejected로 이동
    pendingSigners.forEach((signer) => {
      if (!rejectedSigners.includes(signer)) {
        rejectedSigners.push(signer);
      }
    });

    // 반려한 사람도 personSigning에서 rejected로 옮기기
    if (!rejectedSigners.includes(username)) {
      rejectedSigners.push(username);
    }

    // 반려 내용을 저장
    report.rejectName = username; // 반려한 사람의 이름
    report.rejectContent = rejection; // 반려 내용

    // 변경 사항 저장
    report.pending = ""; // pending 비우기
    report.rejected = rejectedSigners.join(",");

    // personSigning에서 반려한 사람 제거
    const personSigningList = report.personSigning ? report.personSigning.split(",") : [];
    const personSigningIndex = personSigningList.indexOf(username);
    if (personSigningIndex !== -1) {
      personSigningList.splice(personSigningIndex, 1);
      report.personSigning = personSigningList.join(",");
    }

    // 상태 업데이트 저장
    await report.save();

    res.status(200).json({ message: "보고서가 반려되었습니다." });
  } catch (error) {
    console.error("보고서 반려 처리 중 오류 발생:", error);
    res.status(500).json({ error: "내부 서버 오류입니다." });
  }
};


// 보고서 의견 --------------------------------------------------------------------------------
const opinionReportById = async (res, req) => {
  
}

// 보고서 결재 진행 --------------------------------------------------------------------------------
const SignProgress = async (req, res) => {
  const { report_id } = req.params;
  const { userID, username, approveDate } = req.body;

  try {
    // 보고서 조회
    const report = await Report.findByPk(report_id);

    if (!report) {
      return res.status(404).json({ error: "해당 보고서를 찾을 수 없습니다." });
    }

    console.log('현재 보고서:', report);

    // 현재 결재자가 아닌 경우 오류 반환
    if (!report.personSigning.includes(username)) {
      return res.status(403).json({ error: "현재 결재자가 아닙니다." });
    }

    // 이미 결재한 경우 오류 반환
    let pendingSigners = report.pending ? report.pending.split(",") : [];
    let completedSigners = report.completed ? report.completed.split(",") : [];

    if (pendingSigners.includes(username) || completedSigners.includes(username)) {
      return res.status(403).json({ error: "이미 결재를 완료한 사용자입니다." });
    }

    console.log('현재 pendingSigners:', pendingSigners);
    console.log('현재 completedSigners:', completedSigners);

    // 결재자가 결재를 진행한 경우만 approval 증가
    if (!pendingSigners.includes(username)) {
      pendingSigners.push(username);
      report.approveDate = report.approveDate ? `${report.approveDate},${approveDate}` : approveDate;
      report.approval = (report.approval || 0) + 1;
    }

    console.log('결재 후 pendingSigners:', pendingSigners);

    // personSigning에서 username 제거
    const personSigningList = report.personSigning.split(",");
    const updatedPersonSigningList = personSigningList.filter(signer => signer.trim() !== username.trim());
    report.personSigning = updatedPersonSigningList.join(",");

    console.log('업데이트된 personSigningList:', updatedPersonSigningList);

    // 모든 결재 진행자가 결재를 완료했는지 확인
    if (updatedPersonSigningList.length === 0) {
      // 모든 결재자가 결재를 완료한 경우 completed 배열에 모든 결재자 추가
      completedSigners = completedSigners.concat(pendingSigners);

      // pending 배열 초기화
      pendingSigners = [];

      // 변경 사항 저장
      report.completed = completedSigners.join(",");
    }

    console.log('최종 completedSigners:', completedSigners);

    // 변경 사항 저장
    report.pending = pendingSigners.join(",");
    
    await report.save();

    res.status(200).json({ message: "보고서 결재 진행이 업데이트 되었습니다." });
  } catch (error) {
    console.error("보고서 결재 진행 업데이트 중 오류 발생:", error);
    res.status(500).json({ error: "내부 서버 오류입니다." });
  }
};


module.exports = {
  getReportById,
  deleteReportById,
  cancelReportById,
  opinionReportById,
  SignProgress
};
