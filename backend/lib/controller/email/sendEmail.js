const models = require("../../models");
const Email = models.Email;
const { sendEmail } = require("../../services/emailService");
const { deleteDraftEmail } = require("../../controller/email/draftEmail");
const { saveAttachments } = require("../../controller/email/emailAttachments");
const { QueueEmail, deleteQueueEmail} = require("../../controller/email/emailQueue");
const shortid = require('shortid');

//이메일 전송하기
const sendMail = async (req, res) => {
    const {
        Id,
        userId,
        sender,
        receiver,
        referrer,
        subject,
        body,
        sendAt,
        receiveAt,
        queueDate,
        signature,
        folder,
    } = req.body;

    const attachments = req.files;

    //임시저장 이메일 전송하기 
    if(folder === 'drafts'){
        console.log(`임시저장 된 이메일 :  ${Id}번 `);
        const sendResult = await sendEmail(receiver, subject, body, userId, attachments);
        console.log('임시저장 이메일 전송 완료:', sendResult);

        // 전송 후 임시저장 이메일 삭제
        await deleteDraftEmail(req, res, Id);
        console.log(`${Id}번 임시저장 이메일이 삭제되었습니다.`);

        // 전송된 이메일을 Sent 폴더에 저장
        const newSentEmail = await Email.create({
            userId,
            messageId: shortid.generate(),
            sender,
            receiver,
            referrer,
            subject,
            body,
            sendAt,
            receiveAt,
            queueDate,
            signature,
            hasAttachments: attachments && attachments.length > 0,
            folder: 'sent',
        });

        // 첨부파일이 있는 경우 처리
        if (attachments && attachments.length > 0) {
            await saveAttachments(attachments, newSentEmail.id);
        }

        return res.status(200).json({ message: "임시저장된 이메일이 성공적으로 전송되었습니다.", newSentEmail });
    }
  
    // if(queueDate){
    //     await QueueEmail(req,res);
    //     return;
    // }


    console.log("요청 본문 받음 :", req.body);
    const to = receiver;
   
   

    try{


        //첨부파일 설정
        const attachmentsInfo= attachments ? attachments.map(file =>({
            filename : file.originalname,
            path: file.path,
            contentType: file.mimetype,
        })) : [];
       
        const hasAttachments = attachmentsInfo.length > 0;
        const sendResult = await sendEmail(to, subject, body, userId, attachmentsInfo);
        
        console.log("전송한 이메일 : ", sendResult);
        // await deleteQueueEmail(req, res, Id);


        const newSentEmail = await Email.create({
            userId: userId,
            messageId: shortid.generate(),
            sender,
            receiver,
            referrer,
            subject,
            body,
            sendAt,
            receiveAt,
            queueDate,
            signature,
            hasAttachments: hasAttachments,
            folder: 'sent'
        })


         // 첨부파일이 있는 경우 저장
         if (hasAttachments) {
            await saveAttachments(attachmentsInfo, newSentEmail.Id);
        }


        return res.status(200).json({message: "이메일 전송이 성공적으로 완료되었습니다. ",newSentEmail:newSentEmail});
    }catch(error){
        console.error("전송한 이메일을 저장하는 도중 오류 발생",error);
        return res.status(500).json({message: "전송한 이메일 저장 중 오류가 발생했습니다."});
    };
};



// //예약이메일 전송하기
// const sendQueueEmail = async(req, res) =>{
//     const{
//         Id,
//         userId,
//         messageId,
//         sender,
//         receiver,
//         referrer,
//         subject,
//         body,
//         sendAt,
//         attachment,
//         receiveAt,
//         queueDate,
//         signature,
//     } = req.body;


//     console.log("요청 본문 받음:",req.body);
//     const to = receiver;


//     try{
//         const queueSendResult = await sendEmail(to, subject, body, userId);
//         console.log("전송한 예약 이메일:", queueSendResult);
//         deleteQueueEmail(req, res, Id);
//         const newQueueSentEmail = await Email.create({
//             userId: userId,
//             messageId,
//             sender,
//             receiver,
//             referrer,
//             subject,
//             body,
//             sendAt,
//             receiveAt,
//             signature,
//             attachment,
//             folder: 'sent'
//         })
//         res.status(200).json({message:"예약한 이메일 전송이 성공적으로 완료되었습니다", newQueueSentEmail: newQueueSentEmail });
//     }catch(error){
//         console.error("예약 이메일 전송 도중 오류 발생", error);
//         res.status(500).json({message: "예약한 이메일 전송 도중 오류가 발생했습니다."});
//     }
// }




module.exports = {
    sendMail,
}


