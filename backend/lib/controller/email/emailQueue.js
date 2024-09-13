const models = require("../../models");
const Email = models.Email;
const schedule = require("node-schedule");
const moment = require("moment");
const { sendEmail } = require("../../services/emailService");
const { saveAttachments } = require("../../controller/email/emailAttachments");
const shortid = require('shortid');


//messageId 생성 함수
function generateMessageId(domain = "gleam.im"){
    const uniqueID = shortid.generate();
    return `<${uniqueID}@${domain}`;
};

//이메일 예약설정하기
const QueueEmail = async (req , res) => {
    const {
        userId,
        sender,
        receiver,
        referrer,
        subject,
        body,
        queueDate,
        receiveAt,
        signature,
    } = req.body;

    const attachments = req.files || getAttachmentsByEmailId(Id);;
    console.log("요청 본문 받음", req.body);

   const formattedDate = moment.tz(queueDate, 'YYYY-MM-DD HH:mm:ss', 'Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
   const date = new Date(queueDate);

   // Date 객체 유효성 확인
   if (isNaN(date.getTime())) {
       console.error("이메일 예약 설정에 유효하지않은 날짜:", date);
       return res.status(400).json({ message: "이메일 예약 설정에 유효하지 않은 날짜입니다." });
   }

   const messageId = generateMessageId();
    
    try {
        //첨부파일 설정
        const attachmentsInfo = attachments ? attachments.map(file => ({
            filename : file.originalname,
            path : file.path,
            mimetype : file.mimetype,
            url : file.destination,
            size: file.size,
        })) : [];
    
        const hasAttachments = attachmentsInfo.length > 0;

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
            attachments,
            hasAttachments: hasAttachments,
            folder: 'queue', 
            read : "read",
        });

        // 첨부파일이 있는 경우 저장
        if (hasAttachments) {
            await saveAttachments(attachmentsInfo, newQueueEmail.Id);
        }

        console.log(">>>>>>>>예약 이메일 정보: ", newQueueEmail);
        res.status(200).json({ message: "이메일 전송예약이 완료되었습니다."});

        // 예약한 시간에 이메일 전송
    schedule.scheduleJob(queueDate, async () => {
        try {
            const sendQueueEmail =  await sendEmail(receiver, subject, body, userId, attachments);
            console.log("예약 이메일 전송 완료 :", sendQueueEmail);

            // 전송 후 예약 이메일 삭제
            await deleteQueueEmail(req, res, messageId);

            // 전송된 이메일을 저장
            const sentEmail = await Email.create({
                userId,
                messageId,
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
                read: "read",
            });

            // 첨부파일이 있는 경우 처리
            if (attachments && attachments.length > 0) {
                await saveAttachments(attachments, sentEmail.id);
            }
        } catch (error) {
            console.error("예약된 이메일 전송 중 오류 발생:", error);
        }
    });

    } catch (error) {
        console.error("이메일 발송을 예약하는 도중 에러 발생", error);
        res.status(500).json({ message: "이메일을 발송 예약하는 도중 오류가 발생했습니다." });
    }
};

//발송예약한 이메일 전송 시 기존에 있던 레코드 삭제하기 
const deleteQueueEmail = async (req, res, messageId) => {
    try{
        const emailOnQueue = await Email.findOne({
            where:{ messageId : messageId }  
        });

        if(emailOnQueue){
            emailOnQueue.destroy()
            console.log(`${messageId} 예약 이메일이 전송되어 삭제처리되었습니다.`);
        }else{
            console.log("해당 이메일의 발송예약 정보를 찾을 수 없습니다.")
        };
    }catch(error){
        console.error("발송 예약 이메일 처리 중 오류 발생", error);
        res.status(500).json({message : "발송예약 이메일 처리 도중 오류가 발생했습니다."});
    }
};


module.exports ={
    QueueEmail,
    deleteQueueEmail,
}