const models = require("../../models");
const Attendance = models.Attendance;
const csv = require("csv-parser");
const iconv = require("iconv-lite");
const fs = require("fs");
const path = require("path");

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

// 출근부 작성 (CSV 파일 업로드 및 데이터베이스 저장)
const writeAttendance = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "업로드된 파일이 없습니다" });
    }
    // 다음 경로에 csv파일 저장 및 원본파일 이름 저장
    const originalFileName = req.file.originalname;
    const uploadDir = path.join(__dirname, "../../../uploads/officeHourFile");
    // 폴더가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, originalFileName);
    fs.writeFileSync(filePath, req.file.buffer);

    const jsonArray = [];
    // 파일을 읽고 인코딩을 EUC-KR에서 UTF-8로 변환하여 CSV 파싱
    fs.createReadStream(filePath)
      // EUC-KR 인코딩에서 UTF-8로 변환
      .pipe(iconv.decodeStream("euc-kr"))
      .pipe(
        csv({
          // CSV 파일의 헤더를 매핑하여 올바르게 인식하도록 설정
          mapHeaders: ({ header }) => {
            switch (header) {
              case "占쌩삼옙占쏙옙占쏙옙":
                return "발생일자";
              case "占쌩삼옙占시곤옙":
                return "발생시각";
              case "占쌤몌옙占쏙옙ID":
                return "단말기ID";
              case "占쏙옙占쏙옙占폠D":
                return "사용자ID";
              case "占싱몌옙":
                return "이름";
              case "占쏙옙占쏙옙占싫�":
                return "사원번호";
              case "占쏙옙占쏙옙":
                return "직급";
              case "占쏙옙占�":
                return "구분";
              default:
                return header;
            }
          },
        })
      )
      .on("data", (row) => {
        // 발생일자와 발생시각 필드가 있는 경우에만 데이터를 추가
        if (row["발생일자"] && row["발생시각"]) {
          jsonArray.push({
            occurrenceDate: row["발생일자"].trim(),
            occurrenceTime: row["발생시각"].trim(),
            terminalId: parseInt(row["단말기ID"]) || 0,
            userId: parseInt(row["사용자ID"]) || 0,
            name: row["이름"] ? row["이름"].trim() : null,
            employeeNumber: row["사원번호"] ? row["사원번호"].trim() : null,
            position: row["직급"] ? row["직급"].trim() : null,
            category: row["구분"] ? row["구분"].trim() : null,
            mode: row["모드"] ? row["모드"].trim() : null,
            authentication: row["인증"] ? row["인증"].trim() : null,
            result: row["결과"] ? row["결과"].trim() : null,
          });
        } else {
          console.error(
            "필수 필드(occurrenceDate, occurrenceTime)가 누락된 행 발생:",
            row
          );
        }
      })
      .on("end", async () => {
        try {
          for (const record of jsonArray) {
            if (record.occurrenceDate && record.occurrenceTime) {
              await Attendance.create(record);
            }
          }
          res
            .status(200)
            .json({ message: "출근부 데이터가 성공적으로 업로드되었습니다" });
        } catch (error) {
          console.error("DB 저장 중 오류 발생:", error);
          res
            .status(400)
            .json({ error: "데이터 저장 중 오류가 발생했습니다." });
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
