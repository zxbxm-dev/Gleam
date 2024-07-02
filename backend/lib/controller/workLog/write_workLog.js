const models = require("../../models");
const Report = models.Report;
const path = require("path");
const fs = require("fs");

// 보고서 상세 조회
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

// 보고서 삭제
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

// 보고서 결제
const SignProgress = async (req, res) => {
  
};


module.exports = {
  getReportById,
  deleteReportById,
  SignProgress
};
