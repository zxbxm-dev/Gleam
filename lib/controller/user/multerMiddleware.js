const multer = require('multer');

// 증명사진 파일과 서명 파일을 저장할 multer 스토리지 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8'));
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
