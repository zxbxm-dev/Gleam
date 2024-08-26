const models = require("../../models");
const Email = models.Email;
const { sendEmail } = require("../../services/emailService");
const { deleteDraftEmail } = require("../../controller/email/draftEmail");

//이메일 전송하기
const sendMail = async (req, res ) => {
    const {
        Id,
        messageId,
        userId,
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

    if(!userId){
        res.status(500).json({error: "사용자 정보를 찾을 수 없습니다:"});
    
    };

    if(Id){
        await sendDraftEmail(req,res,Id);
        return;
    }

    console.log("요청 본문 받음 :", req.body);
    const to = receiver; 

    try{
        const sendResult = await sendEmail(to, subject, body, userId);
        console.log("전송한 이메일 : ", sendResult);

        const newSentEmail = await Email.create({
            userId: userId,
            messageId: messageId,
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
        res.status(200).json({message: "이메일 전송이 성공적으로 완료되었습니다. ",newSentEmail:newSentEmail});
    }catch(error){
        console.error("전송한 이메일을 저장하는 도중 오류 발생",error);
        res.status(500).json({message: "전송한 이메일 저장 중 오류가 발생했습니다."});
    };

};

//임시저장 이메일 전송하기
const sendDraftEmail = async ( req,res ) => {
    const {
        Id,
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
    const to = receiver;
    try{
        const draftSendResult = await sendEmail(receiver, subject, body, userId);
        console.log("전송한 이메일 :", draftSendResult);
        deleteDraftEmail(req, res, Id);
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
        res.status(200).json({message: "임시저장 이메일 전송이 성공적으로 완료되었습니다.",newDraftSentEmail: newDraftSentEmail});
       
    }catch(error){
        console.error("임시저장 이메일 전송 도중 오류 발생", error);
        res.status(500).json({message: "임시저장 이메일 전송 도중 오류가 발생했습니다."});
    }
};

//예약이메일 전송하기


module.exports = {
    sendMail,
    sendDraftEmail,

}
