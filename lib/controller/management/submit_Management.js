const models = require("../../models");
const Management = models.Management;

// 인사 정보 관리 파일 등록
const savedGreeting_card = async (req, res) => {
  try {
    const { username, team, dept, TabData } = req.body;
    const attachment = req.file
      ? {
          fileUrl: req.file.path,
          fileName: req.file.filename,
        }
      : null;

    // 데이터베이스에 새로운 인사 정보 등록
    const newManagement = await Management.create({
      username: username,
      team: team,
      dept: dept,
      attachment: attachment,
      pdffile: req.file ? req.file.path : null,
      TabData: TabData
    });

    console.log(`새로운 인사정보 파일 등록: ${newManagement}`);
    res.status(201).json({
      message: "새로운 인사정보 파일 등록이 완료되었습니다.",
      Management: newManagement,
    });
  } catch (error) {
    console.error("인사정보 파일 등록 에러:", error);
    res.status(500).json({ error: "인사정보 파일 등록 중 오류가 발생했습니다." });
  }
};

module.exports = {
  savedGreeting_card
};
