const models = require("../../models");
const Email = models.Email;
const { sendEmail } = require("../../services/emailService");
const { deleteDraftEmail } = require("../../controller/email/draftEmail");
const { saveAttachments } = require("../../controller/email/emailAttachments");
const { QueueEmail, deleteQueueEmail} = require("../../controller/email/emailQueue");
const shortid = require('shortid');




//이메일 전송하기
const sendMail = async (req, res ) => {
    const {
        Id,
        userId,
        sender,
        receiver,
        referrer,
        subject,
        body,
        sendAt,
        attachment,
        receiveAt,
        queueDate,
        signature,
        folder,
       
    } = req.body;


    if(folder === 'drafts'){
        await sendDraftEmail(req,res,Id);
        return;
    }


    // if(queueDate){
    //     await QueueEmail(req,res);
    //     return;
    // }


    console.log("요청 본문 받음 :", req.body);
    const to = receiver;


    try{


        //첨부파일 설정
        const attachments = attachment ? attachment.map(file => ({
            filename : file.filename,
            path: file.path,
            contentType: file.mimetype,
        })) : [];
       
        const hasAttachments = attachments.length < 0;


        const sendResult = await sendEmail(to, subject, body, userId, attachments);
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
            attachment,
            hasAttachments: hasAttachments,
            folder: 'sent'
        })


         // 첨부파일이 있는 경우 저장
         if (hasAttachments) {
            await saveAttachments(attachments, newSentEmail.Id);
        }


        return res.status(200).json({message: "이메일 전송이 성공적으로 완료되었습니다. ",newSentEmail:newSentEmail});
    }catch(error){
        console.error("전송한 이메일을 저장하는 도중 오류 발생",error);
        return res.status(500).json({message: "전송한 이메일 저장 중 오류가 발생했습니다."});
    };


};


//임시저장 이메일 전송하기
const sendDraftEmail = async ( req,res,Id) => {
    const {
        userId,
        messageId,
        sender,
        receiver,
        referrer,
        subject,
        body,
        sendAt,
        attachment,
        receiveAt,
        signature,
    } = req.body;


    console.log("요청 본문 받음 :", req.body);
    const to = receiver;  //확인
    try{
        const draftSendResult = await sendEmail(receiver, subject, body, userId);
        console.log("전송한 이메일 :", draftSendResult);
        await  deleteDraftEmail(req, res, Id);
       
        const newDraftSentEmail = await Email.create({
            userId: userId,
            messageId,
            sender,
            receiver,
            referrer,
            subject,
            body,
            sendAt,
            receiveAt,
            signature,
            attachment,
            folder: 'sent'
        })
       return res.status(200).json({message: "임시저장 이메일 전송이 성공적으로 완료되었습니다.",newDraftSentEmail: newDraftSentEmail});
       
    }catch(error){
        console.error("임시저장 이메일 전송 도중 오류 발생", error);
        return res.status(500).json({message: "임시저장 이메일 전송 도중 오류가 발생했습니다."});
    }
};


//예약이메일 전송하기
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
    sendDraftEmail,
}


