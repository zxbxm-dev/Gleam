const models = require("../../models");
const Attendance = models.Attendance;
// CSV 파일 파싱 라이브러리
const csvParser = require("csv-parser");
const { Readable } = require("stream");

// 출근부 조회
const getAllAttendance = async (req, res) => {
    try {
      const events = await Attendance.findAll();
      res.status(200).json(events);
    } catch (error) {
      console.error("출근부 조회 중에 오류가 발생했습니다.:", error);
      res.status(500).json({ error: "출근부 불러오기에 실패했습니다." });
    }
  };

// 출근부 작성 함수 (CSV 파일 업로드)
const writeAttendance = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "업로드된 파일이 없습니다" });
    }

    const fileBuffer = req.file.buffer.toString("utf8");
    const jsonArray = [];

    const stream = Readable.from(fileBuffer);
    stream
    // CSV 파일 파싱 후 각 행을 jsonArray 저장
      .pipe(csvParser({ headers: true }))
      .on("data", async (row) => {
        jsonArray.push({
          occurrenceDate: row["발생일자"].trim(),
          occurrenceTime: row["발생시각"].trim(),
          terminalId: parseInt(row["단말기ID"]),
          userId: parseInt(row["사용자ID"]),
          name: row["이름"].trim(),
          employeeNumber: row["사원번호"] ? row["사원번호"].trim() : null,
          position: row["직급"] ? row["직급"].trim() : null,
          category: row["구분"].trim(),
          mode: row["모드"].trim(),
          authentication: row["인증"].trim(),
          result: row["결과"].trim(),
        });
      })
      .on("end", async () => {
        try {
          for (const record of jsonArray) {
            await Attendance.create(record);
          }
          res
            .status(200)
            .json({ message: "출근부 데이터가 성공적으로 업로드되었습니다" });
        } catch (error) {
          console.error("DB 저장 중 오류 발생:", error);
          res
            .status(500)
            .json({ error: "출근부 데이터 업로드에 실패하였습니다" });
        }
      })
      .on("error", (error) => {
        console.error("CSV 파싱 중 오류 발생:", error);
        res
          .status(500)
          .json({ error: "출근부 데이터 업로드에 실패하였습니다" });
      });
  } catch (error) {
    console.error("출근부 작성 중 오류 발생:", error);
    res.status(500).json({ error: "출근부 데이터 업로드에 실패하였습니다" });
  }
};

module.exports = {
  writeAttendance,
  getAllAttendance,
};
