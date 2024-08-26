const models = require("../../models");
const Email = models.Email;

//이메일 임시저장하기
const draftEmails = async (req, res) => {
    const{
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
    
    try{
        const newDraftEmail = await Email.create({
            userId,
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
            folder: 'drafts'
        })
        res.status(200).json({message:"이메일 임시저장이 성공적으로 완료되었습니다.",newDraftEmail:newDraftEmail});
        console.log(`이메일 임시저장 완료`);
    }catch(error){
        console.error("이메일을 임시저장 하는 도중 에러 발생",error);
        res.status(500).json({message: "이메일을 임시저장 하는 도중 오류가 발생했습니다."});
    };
};


//임시저장 이메일 전송 시 기존에 있던 레코드 삭제하기
const deleteDraftEmail = async (req, res, Id) => {
    try{
    const draftedEmail = await Email.findOne({
        where: { Id : Id}
    });

    if(draftedEmail){
    draftedEmail.destroy()
    console.log(`${Id}번 임시저장 이메일이 성공적으로 삭제되었습니다.`);
    }else{
    console.log(`임시저장 이메일 정보를 찾을 수 없습니다.`);
    };
  }catch(error){
    console.error("임시저장 이메일 삭제 도중 오류 발생", error);
    res.status(500).json({message:"임시저장 이메일 삭제 도중 오류가 발생했습니다."});
  }
};

module.exports = {
    draftEmails,
    deleteDraftEmail,
}