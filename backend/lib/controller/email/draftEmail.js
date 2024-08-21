const models = require("../../models");
const draftEmail = models.draftEmail;

//이메일 임시저장하기
const draftEmails = async (req, res) => {
    const{
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

    console.log("요청 본문 받음 :", req.body);
    
    try{
        const newDraftEmail = await draftEmail.create({
            userId,
            sender,
            receiver,
            referrer,
            subject,
            body,
            sendAt,
            receiveAt,
            signature,
            attachment,
            folder: 'drafts'
        })
        res.status(200).json({message:"이메일 임시저장이 성공적으로 완료되었습니다.",newDraftEmail:newDraftEmail});
    }catch(error){
        console.error("이메일을 임시저장 하는 도중 에러 발생",error);
        res.status(500).json({message: "이메일을 임시저장 하는 도중 오류가 발생했습니다."});
    };
};