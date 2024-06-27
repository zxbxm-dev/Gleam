const moment = require('moment');
const models = require('../../models');
const Report = models.Report;

const submitReport = async (req, res) => {
    try {
        // 클라이언트로부터 받은 데이터
        const {
            userID,
            username,
            dept,
            position,
            selectForm,
            Payment,
            pdffile,
            receiptDate,
            sendDate,
            stopDate,
            opinionName,
            opinionContent,
            rejectName,
            rejectContent,
            approval,
            currentSigner
        } = req.body;

        // 날짜 데이터를 올바른 형식으로 변환
        const formattedReceiptDate = moment(receiptDate).isValid() ? moment(receiptDate).format('YYYY-MM-DD HH:mm:ss') : null;
        const formattedSendDate = moment(sendDate).isValid() ? moment(sendDate).format('YYYY-MM-DD HH:mm:ss') : null;
        const formattedStopDate = moment(stopDate).isValid() ? moment(stopDate).format('YYYY-MM-DD HH:mm:ss') : null;

        // 데이터베이스에 저장할 데이터
        const reportData = {
            userId: userID,
            username: username,
            dept: dept,
            position: position,
            selectForm: selectForm,
            Payment: JSON.stringify(Payment),
            attachment: req.file.path,
            pdffile: pdffile,
            receiptDate: formattedReceiptDate,
            sendDate: formattedSendDate,
            stopDate: formattedStopDate,
            opinionName: opinionName,
            opinionContent: opinionContent,
            rejectName: rejectName,
            rejectContent: rejectContent,
            approval: approval,
            currentSigner: currentSigner,
            status: 'draft'
        };

        // 보고서 생성 및 저장
        const newReport = await Report.create(reportData);

        res.status(201).json({
            message: '보고서가 성공적으로 제출되었습니다.',
            report: newReport
        });
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
