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
    const fileStatuses = files.map(file => {
      const filePath = path.join(__dirname, '../../../uploads/performanceFile', file.filename);
      return {
        filename: file.filename,
        exists: fs.existsSync(filePath),
        path: filePath
      };
    });

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

// 인사평가 파일 상세 조회 ---------------------------------------------------------------------------
const getFileDetails = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({ error: "filename은 필수입니다." });
    }

    const filePath = path.join(__dirname, '../../../uploads/performanceFile', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "파일을 찾을 수 없습니다." });
    }

    const fileStat = fs.statSync(filePath);

    // 파일 메타데이터
    const fileDetails = {
      filename: path.basename(filePath),
      size: fileStat.size,
      createdAt: fileStat.birthtime,
      updatedAt: fileStat.mtime,
      url: `/uploads/performanceFile/${filename}`
    };

    res.status(200).json(fileDetails);
  } catch (error) {
    console.error("파일 상세 조회 중 오류 발생:", error);
    res.status(500).json({ error: "내부 서버 오류입니다." });
  }
};

// 인사평가 특정 파일 삭제 --------------------------------------------------------------------------------
const deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    if (!filename) {
      return res.status(400).json({ error: "filename은 필수입니다." });
    }

    const filePath = path.join(__dirname, '../../../uploads/performanceFile', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "파일을 찾을 수 없습니다." });
    }

    // 데이터베이스에서 파일 정보 삭제
    const evaluation = await Evaluation.findOne({
      where: { files: { [Op.like]: `%${filename}%` } }
    });

    if (!evaluation) {
      return res.status(404).json({ error: "파일 정보를 데이터베이스에서 찾을 수 없습니다." });
    }

    const updatedFiles = evaluation.files.filter(file => file.filename !== filename);

    await evaluation.update({ files: JSON.stringify(updatedFiles) });

    // 파일 삭제
    fs.unlinkSync(filePath);

    res.status(200).json({ message: "파일이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("파일 삭제 중 오류 발생:", error);
    res.status(500).json({ error: "내부 서버 오류입니다." });
  }
};

module.exports = {
  getMyEvaluation,
  getFileDetails,
  deleteFile
};