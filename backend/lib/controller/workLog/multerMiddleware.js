const multer = require('multer');
const path = require('path');

// 파일 저장 경로와 파일명 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 보고서 파일 저장 경로
    cb(null, './uploads/reportFile'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).single('pdffile');

module.exports = upload;