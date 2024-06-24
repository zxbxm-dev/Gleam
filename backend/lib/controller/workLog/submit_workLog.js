const models = require('../../models');
const Report = models.Report;
const upload = require('./multerMiddleware');
const multer = require('multer');

// 보고서 제출 처리 함수
const submitReport = async (req, res) => {
    upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            // Multer 에러 처리
            console.error('Multer 에러 발생:', err);
            return res.status(500).json({ error: '파일 업로드 실패' });
        } else if (err) {
            // 기타 에러 처리
            console.error('파일 업로드 중 오류 발생:', err);
            return res.status(500).json({ error: '파일 업로드 실패' });
        }

        // 파일 업로드 성공 시 req.body 및 req.file 정보를 사용하여 보고서 데이터 생성
        try {
            const {
                userID,
                username,
                dept,
                selectForm,
                Payment,
                receiptDate,
                sendDate,
                opinionName,
                opinionContent,
                rejectName,
                rejectContent,
                approval
            } = req.body;

            // 업로드된 파일 정보 (업로드된 파일 이름 저장)
            const pdffile = req.file.filename;

            // 데이터베이스에 새 보고서 엔트리 생성
            const newReport = await Report.create({
                userId: userID,
                username,
                dept,
                selectForm,
                // JSON 형식 문자열로 변환하여 저장
                Payment: JSON.stringify(Payment),
                pdffile,
                receiptDate,
                sendDate,
                opinionName,
                opinionContent,
                rejectName,
                rejectContent,
                approval,
                 // 기본값으로 '작성중' 설정
                status: 'draft',
                 // 초기에 결재자는 null로 설정
                currentSigner: null
            });

            // 성공 메시지 또는 새 보고서 데이터 응답
            res.status(201).json({ message: '보고서가 성공적으로 제출되었습니다', report: newReport });
        } catch (error) {
            console.error('보고서 제출 중 오류 발생:', error);
            res.status(500).json({ error: '보고서 제출 실패' });
        }
    });
};

module.exports = {
    submitReport,
};