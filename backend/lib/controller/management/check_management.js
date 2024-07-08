const models = require("../../models");
const Management = models.Management;
const fs = require("fs").promises;
const path = require("path");

// 인사정보 수정
const updateGreetingCard = async (req, res) => {
  const { hrinfo_id } = req.params;
  const { team, dept, TabData } = req.body;
  const attachment = req.file
    ? {
        fileUrl: req.file.path,
        fileName: req.file.filename,
      }
    : null;

  try {
    // 기존 인사정보 조회
    let management = await Management.findByPk(hrinfo_id);

    if (!management) {
      return res.status(404).json({ error: "해당 인사정보를 찾을 수 없습니다." });
    }

    // 이전 파일 삭제
    if (management.pdffile && req.file) {
      await fs.unlink(path.join(__dirname, "../../../", management.pdffile));
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

// 인사정보 조회
const checkAppointment = async (req, res) => {
  try {
    const movements = await Management.findAll(); // 모든 인사이동 정보를 조회

    res.status(200).json({ movements }); // 조회된 정보를 클라이언트에게 전달
  } catch (error) {
    console.error('인사이동 정보 조회 에러:', error);
    res.status(500).json({ error: '인사이동 정보 조회 중 오류가 발생했습니다.' });
  }
};

module.exports = {
  updateGreetingCard,
  checkAppointment
};
