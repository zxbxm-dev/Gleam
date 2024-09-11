const models = require("../../models");
const Evaluation = models.Evaluation;
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize'); 

// 인사평가 조회 --------------------------------------------------------------------------------
const getMyEvaluation = async (req, res) => {
  try {
    const { username, userID } = req.query;

    if (!username || !userID) {
      return res.status(400).json({ error: "사용자 정보가 올바르지 않습니다." });
    }

    const evaluations = await Evaluation.findAll({ where: { userId: userID } });

    if (!evaluations || evaluations.length === 0) {
      return res.status(404).json({ error: "해당 사용자의 인사평가 데이터를 찾을 수 없습니다." });
    }

    const allFiles = evaluations.flatMap(evaluation => JSON.parse(evaluation.files));
    const fileStatuses = allFiles.map(file => {
      const filePath = path.join(__dirname, '../../../uploads/performanceFile', file.filename);
      console.log(`Checking file path: ${filePath}`);
      return {
        filename: file.filename,
        exists: fs.existsSync(filePath),
        path: filePath,
      };
    });

    // 평가 데이터에 날짜 포함
    const evaluationsWithDate = evaluations.map(evaluation => {
      return {
        ...evaluation.dataValues,
        date: evaluation.createdAt.toISOString().split('T')[0] // YYYY-MM-DD 형식으로 날짜 변환
      };
    });

    // 클라이언트에게 전달할 데이터 구성
    const response = { evaluations: evaluationsWithDate, files: fileStatuses };
    res.status(200).json(response);
  } catch (error) {
    console.error("인사평가 데이터 조회 중 오류 발생:", error);
    res.status(500).json({ error: "내부 서버 오류입니다." });
  }
};


// 파일 상세 조회 ---------------------------------------------------------------------------
const getFileDetails = async (req, res) => {
  const { filename } = req.query;

  console.log("파일 이름:", req.query);

  try {
    const evaluation = await Evaluation.findOne({
      where: {
        files: {
          [Op.like]: `%${filename}%`
        }
      }
    });

    if (!evaluation) {
      return res.status(404).json({ error: "해당 보고서를 찾을 수 없습니다." });
    }

    const files = JSON.parse(evaluation.files);
    const fileDetails = files.find(file => file.filename === filename);

    if (!fileDetails) {
      return res.status(404).json({ error: "보고서 파일을 찾을 수 없습니다." });
    }

    const filePath = path.join(__dirname, '../../../uploads/performanceFile', filename);

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
    console.error("보고서 조회 중 오류 발생:", error);
    res.status(500).json({ error: "내부 서버 오류입니다." });
  }
};


// 파일 삭제 --------------------------------------------------------------------------------
const deleteFile = async (req, res) => {
  try {
    const { filename } = req.query;

    if (!filename) {
      return res.status(400).json({ error: "filename은 필수입니다." });
    }

    const filePath = path.join(__dirname, '../../../uploads/performanceFile', filename);
    console.log(`Deleting file path: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "파일을 찾을 수 없습니다." });
    }

    const evaluation = await Evaluation.findOne({ where: { files: { [Op.like]: `%${filename}%` } } });

    if (!evaluation) {
      return res.status(404).json({ error: "파일 정보를 데이터베이스에서 찾을 수 없습니다." });
    }

    const updatedFiles = JSON.parse(evaluation.files).filter(file => file.filename !== filename);
    await evaluation.update({ files: JSON.stringify(updatedFiles) });

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