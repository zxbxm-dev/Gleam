const models = require("../../models");
const Report = models.Report;
const ReportOpinion = models.ReportOpinion;
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

    // 파일 스트림을 HTTP 응답 스트림으로 파이핑
    fileStream.pipe(res);

  } catch (error) {
    console.error("보고서 조회 중 오류 발생:", error);
    res.status(500).json({ error: "내부 서버 오류입니다." });
  }
};

//보고서 의견,반려사유, 취소사유 조회--------------------------------------------------------------------------------
const getReportOpinionById = async( req, res ) => {
  const { report_id } = req.params;
 
  try{
    const report = await Report.findByPk(report_id);
    if(!report){
      return res.status(404).json({ error: " 보고서를 찾을 수 없습니다. "});
    };

    const opinions = await ReportOpinion.findAll({
      where: { reportId : report_id },
    });
    res.status(200).json(opinions);

  }catch(error){
    console.error("보고서 의견을 가져오는 중 오류가 발생했습니다.:", error);
    res.status(500).json({ error: "보고서 의견 조회에 실패했습니다." });
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

// 보고서 반려요청 ----------------------------------------------------------------------------
const requestReject = async ( req, res ) => {
  const { report_id } = req.params;
  const { opinion, userID, username, position } = req.body;

  try{
    const report = await Report.findByPk(report_id);
    if(!report){ 
      return res.status(404).json({error: "해당 보고서를 찾을 수 없습니다."})
    }

   //반려 요청 사유 작성자의 문서결재명칭 추출
   const {assignPosition} = await models.User.findOne({
    where:{
      userId: userID,
    },
    attributes:["assignPosition"],
    raw: true,
  });

  //반려 요청 사유 
  await ReportOpinion.create({
    reportId : report_id,
    username: username,
    position: position,
    assignPosition: assignPosition,
    content: opinion,
    type: 'requestRejection',
    });

//현재 결재자 확인 
const personSigning = report.personSigning.split(", ");
const currentSigner = personSigning[personSigning.length - 1];

//status 변경
report.status = "반려 요청";
//DB 저장 
await report.save();  

return res.status(200).json({ message: "보고서 반려 요청을 성공적으로 완료했습니다.",report});

  }catch(error){
    console.log("반려요청 중 에러가 발생했습니다.", error)
    return res.status(500).json({ error : "보고서 반려 요청에 실패했습니다."})
  }
};

// 보고서 반려 --------------------------------------------------------------------------------
const rejectReportById = async (req, res) => {
  const { report_id } = req.params;
  const { opinion, userID, username, position, type } = req.body;

  try {

    //보고서 반려자의 문서결재명칭 추출
    const {assignPosition} = await models.User.findOne({
      where:{
        userId: userID,
      },
      attributes:["assignPosition"],
      raw: true,
    });


    const report = await Report.findByPk(report_id);

    if (!report) {
      return res.status(404).json({ error: "해당 보고서를 찾을 수 없습니다." });
    }

    console.log("현재 보고서:", report);

    // 현재 결재자가 아닌 경우 오류 반환
    if (!report.personSigning.includes(username)) {
      return res.status(403).json({ error: "현재 결재자가 아닙니다." });
    }

    // 현재 pending 리스트 조회
    let pendingSigners = report.pending
      ? report.pending.split(",").map((s) => s.trim())
      : [];
    let rejectedSigners = report.rejected
      ? report.rejected.split(",").map((s) => s.trim())
      : [];
    let personSigningList = report.personSigning
      ? report.personSigning.split(",").map((s) => s.trim())
      : [];

    console.log("현재 pendingSigners:", pendingSigners);
    console.log("현재 rejectedSigners:", rejectedSigners);
    console.log("현재 personSigningList:", personSigningList);

    // 모든 pendingSigners를 rejected로 이동
    pendingSigners.forEach((signer) => {
      if (!rejectedSigners.includes(signer)) {
        rejectedSigners.push(signer);
      }
    });

    // 반려한 사람도 rejected에 추가
    if (!rejectedSigners.includes(username)) {
      rejectedSigners.push(username);
    }

    // 작성자도 rejected에 추가
    if (!rejectedSigners.includes(report.username)) {
      rejectedSigners.push(report.username);
    }

    // 반려 내용을 저장
    report.rejectName = `${username} (${assignPosition})`; // 반려/ 결재 취소한 사람의 이름
    report.rejectContent = opinion; // 반려/ 결재 취소 사유

    // pending 비우기
    report.pending = ""; // pendingSigners 배열을 비움
    report.rejected = rejectedSigners.join(","); // rejectedSigners를 문자열로 저장

    // personSigning 비우기
    report.personSigning = ""; // 모든 결재자 제거

    console.log("변경 후 report.personSigning:", report.personSigning);

    await ReportOpinion.create({
      reportId : report_id,
      username: username,
      position: position,
      assignPosition: assignPosition,
      content: opinion,
      type: type,
      });
      
    // 상태 업데이트 저장
    await report.save();

    console.log("저장 후 report.personSigning:", report.personSigning);

    res.status(200).json({ message: "보고서가 반려 / 결재취소 되었습니다." });
  } catch (error) {
    console.error("보고서 반려 / 결재취소 처리 중 오류 발생:", error);
    res.status(500).json({ error: "내부 서버 오류입니다." });
  }
};

// 보고서 의견 --------------------------------------------------------------------------------
const opinionReportById = async (req, res) => {
  const { report_id } = req.params;
  const { opinion, userID, username, position } = req.body;

  try {

    //보고서 의견 작성자의 문서결재명칭 추출
    const {assignPosition} = await models.User.findOne({
      where:{
        userId: userID,
      },
      attributes:["assignPosition"],
      raw: true,
    });

    const report = await Report.findByPk(report_id);

    if (!report) {
      return res.status(404).json({ error: "해당 보고서를 찾을 수 없습니다." });
    }

    // 기존 의견이 있다면 추가하는 형태로 업데이트
    const existingOpinions = report.opinionContent ? report.opinionContent.split(",") : [];

    // 새 의견 추가
    const newOpinion = `${username} (${position}): ${opinion}`;
    existingOpinions.push(newOpinion);

    await ReportOpinion.create({
      reportId : report_id,
      username: username,
      position: position,
      assignPosition: assignPosition,
      content: opinion,
      type: 'opinion',
      });

    // 의견 내용 업데이트
    report.opinionContent = existingOpinions.join(", ");
    
    // 의견 작성자 정보 업데이트
    report.opinionName = `${username} (${assignPosition})`;

    // 상태 업데이트 저장
    await report.save();

    res.status(200).json({ message: "의견이 성공적으로 저장되었습니다." });
  } catch (error) {
    console.error("의견 저장 중 오류 발생:", error);
    res.status(500).json({ error: "내부 서버 오류입니다." });
  }
};

module.exports = { opinionReportById };


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

    console.log("현재 보고서:", report);

    // 현재 결재자가 아닌 경우 오류 반환
    if (!report.personSigning.includes(username)) {
      return res.status(403).json({ error: "현재 결재자가 아닙니다." });
    }

    // 이미 결재한 경우 오류 반환
    let pendingSigners = report.pending ? report.pending.split(",") : [];
    let completedSigners = report.completed ? report.completed.split(",") : [];

    // 결재자가 결재를 진행한 경우만 approval 증가
    if (!pendingSigners.includes(username)) {
      pendingSigners.push(username);
      report.approveDate = report.approveDate
        ? `${report.approveDate},${approveDate}`
        : approveDate;
      report.approval = (report.approval || 0) + 1;
    }

    console.log("결재 후 pendingSigners:", pendingSigners);

    // personSigning에서 username 제거
    const personSigningList = report.personSigning.split(",");
    const updatedPersonSigningList = personSigningList.filter(
      (signer) => signer.trim() !== username.trim()
    );
    report.personSigning = updatedPersonSigningList.join(",");

    console.log("업데이트된 personSigningList:", updatedPersonSigningList);

    // 모든 결재 진행자가 결재를 완료했는지 확인
    if (updatedPersonSigningList.length === 0) {
      // 모든 결재자가 결재를 완료한 경우 completed 배열에 모든 결재자 추가
      completedSigners = completedSigners.concat(pendingSigners);

      // pending 배열 초기화
      pendingSigners = [];

      // 변경 사항 저장
      report.completed = completedSigners.join(",");
    }

    console.log("최종 completedSigners:", completedSigners);

    // 변경 사항 저장
    report.pending = pendingSigners.join(",");

    await report.save();

    res
      .status(200)
      .json({ message: "보고서 결재 진행이 업데이트 되었습니다." });
  } catch (error) {
    console.error("보고서 결재 진행 업데이트 중 오류 발생:", error);
    res.status(500).json({ error: "내부 서버 오류입니다." });
  }
};

//보고서 결재취소 요청 -------------------------------------------------------------------
const requestCancle  = async (req, res) => {
  const {report_id} = req.params;  
  const { opinion, userID, username, position } = req.body;
  try{
    const report = await Report.findByPk(report_id);
    if(!report){ 
      return res.status(404).json({error: "해당 보고서를 찾을 수 없습니다."})
    }

    //결재 취소 요청 사유 작성자의 문서결재명칭 추출
   const {assignPosition} = await models.User.findOne({
    where:{
      userId: userID,
    },
    attributes:["assignPosition"],
    raw: true,
    });

  //결재 취소 요청 사유 
  await ReportOpinion.create({
    reportId : report_id,
    username: username,
    position: position,
    assignPosition: assignPosition,
    content: opinion,
    type: 'requestCancle',
    });

    //status 변경
    report.status = "결재 취소 요청";
    await report.save();  

    return res.status(200).json({ message: "보고서 결재 취소 요청을 성공적으로 완료했습니다.",report});

  }catch(error){
    console.error("결재 취소 요청 중 에러가 발생했습니다.", error);
    res.status(500).json({ error : " 보고서 결재 취소 요청에 실패했습니다."})
  }
};


module.exports = {
  getReportById,
  deleteReportById,
  rejectReportById, 
  opinionReportById,
  SignProgress,
  getReportOpinionById,
  requestReject,
  requestCancle,
};
