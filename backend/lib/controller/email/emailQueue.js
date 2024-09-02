const models = require("../../models");
const Email = models.Email;
const schedule = require("node-schedule");
const moment = require("moment");
const { sendMail } = require("../email/sendEmail");
const { saveAttachments } = require("../../controller/email/emailAttachments");

//이메일 예약설정하기
const QueueEmail = async (req , res) => {
    const {
        userId,
        messageId,
        sender,
        receiver,
        referrer,
        subject,
        body,
        queueDate,
        receiveAt,
        signature,
    } = req.body;

    const attachments = req.files;
    console.log("요청 본문 받음", req.body);

    const formattedDate = moment(queueDate).format('YYYY-MM-DD HH:mm:ss');
    const date = new Date(queueDate);

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>Original queueDate:", queueDate);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>Formatted date:", formattedDate);

    // 예약한 시간에 이메일 전송 
    schedule.scheduleJob(date, async () => {
        console.log(`예약된 시간에 이메일 전송: ${messageId}`);
        try {
            const sendQueueEmail = await sendMail(receiver, subject, body, userId, attachments);
            console.log("예약 이메일 전송 완료 :", sendQueueEmail);

            // 전송 후 예약 이메일 삭제
            await deleteQueueEmail(req, res, messageId);

            // 전송된 이메일을 Sent 폴더에 저장
            const sentEmail = await Email.create({
                userId,
                messageId: shortid.generate(),
                sender,
                receiver,
                referrer,
                subject,
                body,
                sendAt: new Date(),
                receiveAt,
                queueDate,
                signature,
                hasAttachments: attachments && attachments.length > 0,
                folder: 'sent',
            });

            // 첨부파일이 있는 경우 처리
            if (attachments && attachments.length > 0) {
                await saveAttachments(attachments, sentEmail.id);
            }
        } catch (error) {
            console.error("예약된 이메일 전송 중 오류 발생:", error);
        }
    });

    try {
        // 예약된 이메일을 데이터베이스에 저장
        const newQueueEmail = await Email.create({
            userId,
            messageId,
            sender,
            receiver,
            referrer,
            subject,
            body,
            queueDate: formattedDate,
            receiveAt,
            signature,
            attachments: JSON.stringify(attachments),
            folder: 'queue', 
        });
     
        res.status(200).json({ message: "이메일 전송예약이 완료되었습니다."});

    } catch (error) {
        console.error("이메일 발송을 예약하는 도중 에러 발생", error);
        res.status(500).json({ message: "이메일을 발송 예약하는 도중 오류가 발생했습니다." });
    }
};

//발송예약한 이메일 전송 시 기존에 있던 레코드 삭제하기 
const deleteQueueEmail = async (req, res, Id) => {
    try{
        const emailOnQueue = await Email.findOne({
            where:{ Id : Id }  
        });

        if(emailOnQueue){
            emailOnQueue.destroy()
            console.log(`${Id}번 이메일의 발송예약이 성공적으로 처리되었습니다.`);
        }else{
            console.log("해당 이메일의 발송예약 정보를 찾을 수 없습니다.")
        };
    }catch(error){
        console.error("발송 예약 이메일 처리 중 오류 발생", error);
        res.status(500).json({message : "발송예약 이메일 처리 도중 오류가 발생했습니다."});
    }
};

//예약메일 취소하기 

const cancleQueueEmail = async(req, res, Id) => {
    try{
        const emailOnQueue = await Email.findOne({
            where: { Id : Id},
        });

        if(emailOnQueue){
            emailOnQueue.destroy()
            console.log(`예약 되어있던 ${Id}번 이메일의 예약이 취소되었습니다.`)
            res.status(200).json({message: "예약 이메일이 성공적으로 취소되었습니다."})
        }else{
            console.log("해당 이메일의 발송예약 정보를 찾을 수 없습니다.");
        };

    }catch(error){
        console.error("발송 예약 이메일 취소 중 오류 발생", error);
        res.status(500).json({message: "발송 예약 이메일 취소 도중 오류가 발생했습니다."});
    }
}


module.exports ={
    QueueEmail,
    deleteQueueEmail,
    cancleQueueEmail,
}