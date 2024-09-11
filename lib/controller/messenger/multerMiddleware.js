const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 업로드 디렉토리 설정
const uploadDir = path.join(__dirname, "../../../uploads/message_imgFile");

// 디렉토리가 존재하지 않으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // 파일명 설정
  }
});

const upload = multer({ storage });

module.exports = upload;