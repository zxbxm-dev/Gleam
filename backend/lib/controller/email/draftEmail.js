const models = require("../../models");
const Email = models.Email;
const { saveAttachments } = require("../../controller/email/emailAttachments");
const { getAttachmentsByEmailId } = require("./emailAttachments");

//이메일 임시저장하기
const draftEmails = async (req, res) => {
    const{
        Id = null,
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
    } = req.body;
    
    const attachments = req.files ||  getAttachmentsByEmailId(Id);
    console.log("요청 본문 받음 :", req.body);
    if(Id !== undefined && Id > 0 && Id !== null){
        await editDraftEmail(req, res,Id);
        return;
    }

    try{
        
        const attachmentsInfo = attachments ? attachments.map(file => ({
            filename : file.originalname,
            path : file.path,
            mimetype : file.mimetype,
            url : file.destination,
            size: file.size,
        })) : [];
     

        const hasAttachments = attachmentsInfo.length > 0;
        const newDraftEmail = await Email.create({
            
            userId,
            messageId,
            sender,
            receiver: receiver? receiver : " " ,
            referrer,
            subject,
            body,
            sendAt,
            receiveAt,
            signature,
            hasAttachments: hasAttachments,
            folder: 'drafts',
            read: "read",
        })

        // 첨부파일이 있는 경우 저장
        if (hasAttachments) {
            await saveAttachments(attachmentsInfo, newDraftEmail.Id);
        }

        console.log(`이메일 임시저장 완료`);
        return res.status(200).json({message:"이메일 임시저장이 성공적으로 완료되었습니다.",newDraftEmail:newDraftEmail.Id});
  
    }catch(error){
        console.error("이메일을 임시저장 하는 도중 에러 발생",error);
        return res.status(500).json({message: "이메일을 임시저장 하는 도중 오류가 발생했습니다."});
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
    }else{
    console.log(`임시저장 이메일 정보를 찾을 수 없습니다.`);
    };
  }catch(error){
    console.error("임시저장 이메일 삭제 도중 오류 발생", error);
    return res.status(500).json({message:"임시저장 이메일 삭제 도중 오류가 발생했습니다."});
  }
};

//임시저장 이메일을 다시 임시저장 
const editDraftEmail = async ( req, res, Id ) => {
    try{
    const {
        receiver,
        referrer,
        subject,
        body,
        signature,
    } = req.body;

    const attachments = req.files || getAttachmentsByEmailId(Id);
    const DraftedEmail = await Email.findOne({
        where : { Id : Id }
    });
 
    if(!DraftedEmail){
        return res.status(400).json({ message: "임시저장 된 이메일을 찾을 수 없습니다. "})
    };

    //첨부파일 설정 
    const attachmentsInfo = attachments ? attachments.map(file => ({
        filename : file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        url: file.url,
        size: file.size,
    })) : [];

    const hasAttachments = attachmentsInfo.length > 0;

    //임시저장 이메일 변경사항 적용
     DraftedEmail.set({
        receiver: receiver? receiver : " " ,
        referrer,
        subject,
        body,
        signature,
        attachments,
        hasAttachments
    });

    // 변경된 데이터를 저장
    await DraftedEmail.save();

    // 첨부파일이 있는 경우 저장
    if (hasAttachments) {
    await saveAttachments(attachmentsInfo, DraftedEmail.Id);
    }

    console.log(`이메일 임시저장 완료:re`);
    res.status(200).json({ message: "이메일 임시저장이 완료되었습니다.", DraftedEmail:DraftedEmail});
    
    }catch(error){
        console.error (" error : ", error)
        res.status(500).json({ error : "이메일 임시저장 중 오류가 발생했습니다." });
    };

}

module.exports = {
    draftEmails,
    deleteDraftEmail,
}