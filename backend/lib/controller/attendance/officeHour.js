const models = require("../../models");
const Attendance = models.Attendance;
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const csv = require("csv-parser");
const iconv = require("iconv-lite");
const moment = require("moment");

// 출근부 조회 -----------------------------------------------------------------------------------------------------------
const getAllAttendance = async (req, res) => {
  try {
    const events = await Attendance.findAll();
    res.status(200).json(events);
  } catch (error) {
    console.error("출근부 조회 중에 오류가 발생했습니다.:", error);
    res.status(500).json({ error: "출근부 불러오기에 실패했습니다." });
  }
};

// 출근부 수정 -----------------------------------------------------------------------------------------------------------

// /api/editAttendance
const createAttendance = async (req, res) => {
  try {
    const { username, Date, data } = req.body;

    // 필수 입력 값 및 데이터 형식 유효성 검사
    if (!username || !Date || !data || data.length !== 3) {
      return res.status(400).json({ error: "입력 값이 올바르지 않습니다" });
    }

    const [startTime, endTime, mode] = data;

    // 동일한 사용자와 날짜의 출석 데이터가 이미 존재하는지 확인
    const existingAttendance = await Attendance.findOne({
      where: {
        username: username,
        Date: Date,
      },
    });

    if (existingAttendance) {
      return res
        .status(400)
        .json({ error: "해당 날짜의 출석 데이터는 이미 존재합니다" });
    }

    // 새로운 출석 데이터 생성
    const newAttendance = await Attendance.create({
      username: username,
      Date: Date,
      DataList: [
        startTime === undefined ? "" : startTime,
        endTime === undefined ? "" : endTime,
        mode === undefined ? "" : mode,
      ], // DataList를 배열 형태로 저장
    });

    res
      .status(200)
      .json({
        message: "출석 데이터가 성공적으로 생성되었습니다",
        attendance: newAttendance,
      });
  } catch (error) {
    console.error("출석 데이터 생성 중 오류 발생:", error);
    res.status(500).json({ error: "출석 데이터 생성에 실패하였습니다" });
  }
};

// /api/editAttendance/:attend_id
const updateAttendance = async (req, res) => {
  try {
    const { attend_id } = req.params;
    const { username, Date, data } = req.body;

    // 필수 입력 값 및 데이터 형식 유효성 검사
    if (!username || !Date || !data || data.length !== 3) {
      return res.status(400).json({ error: "입력 값이 올바르지 않습니다" });
    }

    const [startTime, endTime, mode] = data;

    // 출석 데이터가 모두 빈 문자열인 경우, 기존 데이터 유지
    // if (startTime === "" && endTime === "" && mode === "") {
    //   const existingAttendance = await Attendance.findByPk(attend_id);

    //   if (!existingAttendance) {
    //     return res
    //       .status(404)
    //       .json({ error: "해당 ID의 출석 데이터를 찾을 수 없습니다" });
    //   }

    //   res
    //     .status(200)
    //     .json({
    //       message: "출석 데이터가 성공적으로 업데이트되었습니다",
    //       attendance: existingAttendance,
    //     });
    //   return; // 함수 종료
    // }

    // data 배열 각 요소의 유효성 검사
    // if (!startTime && !endTime && !mode) {
    //   return res
    //     .status(400)
    //     .json({
    //       error: "출근 시간, 퇴근 시간, 구분 값 중 적어도 하나는 필요합니다",
    //     });
    // }

    // 출석 데이터가 존재하는지 확인
    const existingAttendance = await Attendance.findByPk(attend_id);

    if (!existingAttendance) {
      return res
        .status(404)
        .json({ error: "해당 ID의 출석 데이터를 찾을 수 없습니다" });
    }

    // 출석 데이터 업데이트
    await existingAttendance.update({
      username: username,
      Date: Date,
      DataList: [
        startTime !== "" ? startTime : "",
        endTime !== "" ? endTime : "",
        mode !== "" ? mode : "",
      ],
    });

    res
      .status(200)
      .json({
        message: "출석 데이터가 성공적으로 업데이트되었습니다",
        attendance: existingAttendance,
      });
  } catch (error) {
    console.error("출석 데이터 업데이트 중 오류 발생:", error);
    res.status(500).json({ error: "출석 데이터 업데이트에 실패하였습니다" });
  }
};

// 출근부 작성 (CSV 파일 업로드 및 데이터베이스 저장) -----------------------------------------------------------------------------------------------------------
const writeAttendance = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "업로드된 파일이 없습니다" });
    }

    // 파일 저장 경로 설정
    const originalFileName = req.file.originalname;
    const uploadDir = path.join(__dirname, "../../../uploads/officeHourFile");

    // 폴더가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, originalFileName);
    fs.writeFileSync(filePath, req.file.buffer);

    const fileExtension = path.extname(originalFileName).toLowerCase();
    let jsonArray = [];

    if (fileExtension === ".csv") {
      // CSV 파일 처리
      jsonArray = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(iconv.decodeStream("euc-kr"))
          .pipe(
            csv({
              // CSV 파일의 헤더를 매핑하여 올바르게 인식하도록 설정
              mapHeaders: ({ header }) => {
                switch (header) {
                  case "이름":
                    return "username";
                  case "발생일자":
                    return "Date";
                  case "발생시각":
                    return "Time";
                  case "모드":
                    return "Mode";
                  default:
                    return header;
                }
              },
            })
          )
          .on("data", (data) => results.push(data))
          .on("end", () => resolve(results))
          .on("error", (error) => reject(error));
      });

      // 시간 데이터 포맷팅
      jsonArray.forEach((row) => {
        if (row.Time) {
          // 시간 데이터를 HH:mm:ss 형식으로 변환하여 저장
          row.Time = moment(row.Time, "HH:mm:ss").format("HH:mm:ss");
        }
      });
    } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
      // 엑셀 파일 처리는 이전과 동일하게 진행
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      jsonArray = xlsx.utils.sheet_to_json(worksheet, {
        raw: true,
        defval: null,
        header: 1,
      });

      const headers = jsonArray[0];
      const dataRows = jsonArray.slice(1);

      jsonArray = dataRows.map((row) => {
        const rowData = {};
        headers.forEach((header, index) => {
          switch (header) {
            case "이름":
              rowData.username = row[index] ? row[index].trim() : null;
              break;
            case "발생일자":
              rowData.Date = row[index] ? row[index].trim() : null;
              break;
            case "발생시각":
              // 시간 데이터를 HH:mm:ss 형식으로 변환하여 저장
              rowData.Time = row[index]
                ? moment(row[index], "HH:mm:ss").format("HH:mm:ss")
                : null;
              break;
            case "모드":
              rowData.Mode = row[index] ? row[index].trim() : null;
              break;
          }
        });
        return rowData;
      });
    } else {
      return res.status(400).json({ error: "지원되지 않는 파일 형식입니다" });
    }

    // 데이터 가공 및 저장
    const formattedData = jsonArray.reduce((acc, row) => {
      if (row.username && row.Date && row.Time && row.Mode) {
        const key = `${row.username}-${row.Date}`;
        if (!acc[key]) {
          acc[key] = {
            username: row.username,
            Date: row.Date,
            DataList: { 출근시간: null, 퇴근시간: null, 구분: null },
          };
        }

        if (row.Mode === "출근") {
          acc[key].DataList.출근시간 = row.Time;
        } else if (row.Mode === "퇴근") {
          acc[key].DataList.퇴근시간 = row.Time;
        } else if (row.Mode === "구분") {
          acc[key].DataList.구분 = row.Time;
        }
      }
      return acc;
    }, {});

    // 데이터베이스 저장
    try {
      for (const key in formattedData) {
        const record = formattedData[key];

        // 데이터베이스에 이미 해당 사용자와 날짜의 데이터가 있는지 확인
        const existingAttendance = await Attendance.findOne({
          where: {
            username: record.username,
            Date: record.Date,
          },
        });

        if (existingAttendance) {
          // 이미 데이터가 있으면 업데이트
          await Attendance.update(
            {
              DataList: [
                record.DataList.출근시간,
                record.DataList.퇴근시간,
                record.DataList.구분,
              ],
            },
            {
              where: {
                username: record.username,
                Date: record.Date,
              },
            }
          );
        } else {
          // 데이터가 없으면 새로 생성
          await Attendance.create({
            username: record.username,
            Date: record.Date,
            DataList: [
              record.DataList.출근시간,
              record.DataList.퇴근시간,
              record.DataList.구분,
            ],
          });
        }
      }
      res
        .status(200)
        .json({ message: "출근부 데이터가 성공적으로 업로드되었습니다" });
    } catch (error) {
      console.error("DB 저장 중 오류 발생:", error);
      res.status(400).json({ error: "데이터 저장 중 오류가 발생했습니다." });
    }
  } catch (error) {
    console.error("출근부 작성 중 오류 발생:", error);
    res.status(500).json({ error: "출근부 데이터 업로드에 실패하였습니다" });
  }
};

module.exports = {
  writeAttendance,
  getAllAttendance,

  createAttendance,
  updateAttendance,
};
