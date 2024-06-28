const models = require("../../models");
const Report = models.Report;
const path = require("path");
const fs = require("fs");

// 보고서 상세 조회
const getAbsoluteFilePath = (filePath) => {
  return path.join(__dirname, '..', '..', '..', 'backend', 'uploads', 'reportFile', filePath);
};

const getReportById = async (req, res, next) => {
  const { report_id } = req.params;

  try {
    const report = await Report.findByPk(report_id);

    if (!report) {
      return res.status(404).json({ error: "해당 보고서를 찾을 수 없습니다." });
    }

    const fileName = report.pdffile;
    const filePath = report.attachment;

    if (!filePath || !fileName) {
      return res.status(404).json({ error: "보고서 파일을 찾을 수 없습니다." });
    }

    const absolutePath = getAbsoluteFilePath(filePath);
    res.sendFile(absolutePath);
  } catch (error) {
    console.error("보고서 조회 중 오류 발생:", error);
    res.status(500).json({ error: "내부 서버 오류입니다." });
  }
};

// 보고서 삭제
const deleteReportById = async (req, res, next) => {
  const { report_id } = req.params;

  try {
    const report = await Report.findByPk(report_id);

    if (!report) {
      return res.status(404).json({ error: '해당 보고서를 찾을 수 없습니다.' });
    }

    const filePath = report.attachment;

    if (filePath) {
      const absolutePath = getAbsoluteFilePath(filePath);
      await fs.unlink(absolutePath);
    }

    await report.destroy();

    res.status(200).json({ message: '보고서가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('보고서 삭제 중 오류 발생:', error);
    res.status(500).json({ error: '내부 서버 오류입니다.' });
  }
};

module.exports = {
  getReportById,
  deleteReportById
};
