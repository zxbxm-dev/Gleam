const models = require("../../models");
const Evaluation = models.Evaluation;
const path = require('path');
const fs = require('fs');

// 인사평가 조회 --------------------------------------------------------------------------------
const getMyEvaluation = async (req, res) => {
  try {
    const { username, userID } = req.query;

    if (!username || !userID) {
      return res.status(400).json({ error: "username과 userID는 필수입니다." });
    }

    // 인사평가 데이터 조회
    const evaluation = await Evaluation.findOne({
      where: { userId: userID }
    });

    if (!evaluation) {
      return res.status(404).json({ error: "해당 사용자의 인사평가 데이터를 찾을 수 없습니다." });
    }

    // 파일 경로 파싱
    const files = JSON.parse(evaluation.files);
    const filePaths = files.map(file => ({
      filename: file.filename,
      path: path.join(__dirname, 'uploads', 'performanceFile', file.filename)
    }));

    // 파일 존재 여부 확인
    const fileStatuses = filePaths.map(file => ({
      filename: file.filename,
      exists: fs.existsSync(file.path)
    }));

    const response = {
      evaluation,
      files: fileStatuses
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("인사평가 데이터 조회 중 오류 발생:", error);
    res.status(500).json({ error: "내부 서버 오류입니다." });
  }
};


module.exports = {
  getMyEvaluation,
};
