const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer 인스턴스 생성
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(
      __dirname,
      "../../../uploads/reportFile"
    );
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().getTime();
    cb(null, `${timestamp}_${Buffer.from(file.originalname, 'latin1').toString('utf8')}`);
  },
});

// 파일 필터링: PDF 파일만 가능
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("PDF 파일만 업로드 가능합니다."), false);
  }
};

// Multer 인스턴스 생성
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
