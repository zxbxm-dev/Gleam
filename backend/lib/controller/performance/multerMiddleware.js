const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer 인스턴스 생성
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../../uploads/performanceFile");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8')); // 원본 파일 이름 사용
  },
});

// Multer 인스턴스 생성 -- 인사평가 개요 업로드용
const outlineStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const outlineUploadDir = path.join(__dirname, "../../../uploads/perfOutlineFile");
    if (!fs.existsSync(outlineUploadDir)) {
      fs.mkdirSync(outlineUploadDir, { recursive: true });
    }
    cb(null, outlineUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8')); // 원본 파일 이름 사용
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
const upload = multer({ storage: storage, fileFilter: fileFilter, outlineStorage: outlineStorage }).array("files", 10);

module.exports = upload;
