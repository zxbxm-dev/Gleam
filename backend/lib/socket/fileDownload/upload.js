const multer = require('multer');
const path = require('path');
const fs = require("fs-extra");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = "uploads/message";

    // 업로드 디렉토리가 없으면 생성
    try {
      await fs.ensureDir(uploadDir);
      cb(null, uploadDir);
    } catch (err) {
      console.error("업로드 디렉토리 생성 실패:", err);
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('이미지와 문서만 허용됩니다!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, //10mb 제한
  fileFilter: fileFilter,
});

module.exports = upload;