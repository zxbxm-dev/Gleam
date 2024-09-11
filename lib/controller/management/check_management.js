const models = require("../../models");
const Management = models.Management;
const fs_promises = require("fs").promises;
const fs = require("fs")
const path = require("path");

// 인사정보 수정 --------------------------------------------------------------------------------------------
const updateGreetingCard = async (req, res) => {
  const { username, team, dept, TabData } = req.body;
  const attachment = req.file
    ? {
        fileUrl: req.file.path,
        fileName: req.file.filename,
      }
    : null;

  try {
    // 기존 인사정보 조회
    const management = await Management.findOne({
      where : {
        username: username,
        team: team,
        dept: dept,
        TabData: TabData,
      }
    });

    if (!management) {
      return res.status(404).json({ error: "해당 인사정보를 찾을 수 없습니다." });
    }

    // 이전 파일 삭제
    if (management.pdffile && req.file) {
      await fs_promises.unlink(path.join(__dirname, "../../../", management.pdffile));
    }

    // 인사정보 업데이트
    management.team = team || management.team;
    management.dept = dept || management.dept;
    management.TabData = TabData || management.TabData;
    management.attachment = req.file ? attachment : management.attachment;
    management.pdffile = req.file ? req.file.path : management.pdffile;

    // 변경 사항 저장
    await management.save();

    console.log(`인사정보 업데이트 완료: ${management}`);

    res.status(200).json({
      message: "인사정보가 성공적으로 업데이트되었습니다.",
      Management: management,
    });
  } catch (error) {
    console.error("인사정보 업데이트 에러:", error);
    res.status(500).json({ error: "인사정보 업데이트 중 오류가 발생했습니다." });
  }
};

// 인사정보관리 조회 --------------------------------------------------------------------------------------------
const checkAppointment = async (req, res) => {
  const { username, TabData } = req.query;


  try {
    const movement = await Management.findOne({
      where : {
        username: username,
        TabData: TabData,
      }
    }); // 특정 회원의 인사정보

    const filePath = path.join(__dirname, '../../../uploads/management', movement.attachment.fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "파일을 찾을 수 없습니다." });
    }

    // MIME 타입 설정
    res.setHeader("Content-Type", "application/pdf");

    // 로그에 파일 경로 출력
    console.log(`경로: ${filePath}`);

    // 파일 스트림을 통해 전송
    const fileStream = fs.createReadStream(filePath);

    // 파일 스트림을 HTTP 응답 스트림으로 파이핑
    fileStream.pipe(res);
  } catch (error) {
    console.error('인사이동 정보 조회 에러:', error);
    res.status(500).json({ error: '인사이동 정보 조회 중 오류가 발생했습니다.' });
  }
};

module.exports = {
  updateGreetingCard,
  checkAppointment
};
