const models = require('../../models');
const Report = models.Report;

// 보고서 제출 함수
const submitReport = async (req, res) => {
    try {
        console.log('파일 업로드 성공:', req.file);

        const {
            userID,
            username,
            dept,
            selectForm,
            Payment,
            pdffile,
            // 클라이언트에서 전달한 데이터가 아닌 현재 날짜로 전달받음
            receiptDate,
            sendDate,
            opinionName,
            opinionContent,
            rejectName,
            rejectContent,
            approval,
            currentSigner,
            position,
            stopDate
        } = req.body;

        console.log('클라이언트로부터 받은 데이터:');
        console.log('userID:', userID);
        console.log('username:', username);
        console.log('dept:', dept);
        console.log('selectForm:', selectForm);
        console.log('Payment:', Payment);
        console.log('pdffile:', pdffile);
        console.log('sendDate:', sendDate);

        // attachment 업로드된 파일 경로
        const attachmentPath = req.file.path;
        console.log('업로드된 파일 경로:', attachmentPath);

        const reportData = {
            userId: userID,
            username: username,
            dept: dept,
            selectForm: selectForm,
            Payment: JSON.stringify(Payment),
            attachment: attachmentPath,
            pdffile: pdffile,
            receiptDate: new Date(),
            sendDate: sendDate,
            opinionName: opinionName,
            opinionContent: opinionContent,
            rejectName: rejectName,
            rejectContent: rejectContent,
            approval: approval,
            currentSigner: currentSigner,
            position: position,
            // 보고서 상태 저장 기본값 draft
            status: 'draft',
            currentSigner: currentSigner,
            stopDate:stopDate
        };

        console.log('데이터베이스에 저장할 데이터:', reportData);

        try {
            const newReport = await Report.create(reportData);
            console.log('새로운 보고서 생성:', newReport);

            res.status(201).json({
                message: '보고서가 성공적으로 제출되었습니다.',
                report: newReport
            });
        } catch (dbError) {
            console.error('데이터베이스 저장 중 에러:', dbError);
            res.status(500).json({
                message: '데이터베이스 오류로 인해 보고서 제출에 실패하였습니다.'
            });
        }
    } catch (error) {
        console.error('보고서 제출 중 에러:', error);
        res.status(500).json({
            message: '서버 오류로 인해 보고서 제출에 실패하였습니다.'
        });
    }
};

module.exports = {
    submitReport,
};
