const multer = require("multer");
const fs = require("fs-extra");

// multer 설정
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = "./uploads/management";

    // 업로드 디렉토리가 없으면 생성
    try {
      await fs.ensureDir(uploadDir);
      cb(null, uploadDir);
    } catch (err) {
      console.error("업로드 디렉토리 생성 실패:", err);
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8')); // 오리지널 파일 이름으로 저장
  },
});

const multerMiddleware = multer({
  storage: storage,
});

module.exports = multerMiddleware;
