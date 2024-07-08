const models = require("../../models");
const evaluation = models.Evaluation;
const sanitizeFilename = require("sanitize-filename");

// 인사평가서 제출
const submitEvaluation = async (req, res) => {
  try {
    const { userID, username, team, department, company } = req.body;

    // 파일이 업로드된 경우
    let files = [];
    let filenames = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const originalFilename = Buffer.from(file.originalname, 'latin1').toString('utf8');
        files.push({
          path: file.path,
          filename: originalFilename,
        });
        filenames.push(originalFilename);
      }
    }

    // 데이터베이스에 저장할 데이터
    const reportData = {
      userId: userID,
      username,
      team,
      department,
      company,
      files: JSON.stringify(files),
      filename: JSON.stringify(filenames),
      isFormerEmployee: false,
    };

    // 인사평가서 생성 및 저장
    const newReport = await evaluation.create(reportData);

    res.status(201).json({
      message: "인사평가서가 성공적으로 제출되었습니다.",
      report: newReport,
    });
  } catch (error) {
    console.error("인사평가서 제출 중 에러:", error);
    res.status(500).json({
      message: "서버 오류로 인해 인사평가서 제출에 실패하였습니다.",
      error: error.message,
    });
  }
};

module.exports = {
  submitEvaluation,
};
