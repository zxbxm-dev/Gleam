const fs = require('fs');
const models = require('../../models');


//이메일 첨부파일 조회
async function getAttachmentsByEmailId(emailId){
    try{
        const attachments = await models.EmailAttachment.findAll({
            where:{
                emailId: emailId 
            }
        });
        return attachments;
    }catch(error){
        console.error("해당 이메일의 첨부파일을 조회하는 중 오류가 발생했습니다.:",error);
    }
}


//이메일 첨부파일 저장 
async function saveAttachments(attachments, emailId) {
    return Promise.all(attachments.map(async (file)=>{
        return models.EmailAttachment.create({
            emailId: emailId,
            fileName: file.filename,
            mimeType: file.contentType,
            type: 'file',
            fileSize: fs.statSync(file.path).size,
            fileData: fs.readFileSync(file.path), 
        });
    }));
}


module.exports = { 
    getAttachmentsByEmailId,
    saveAttachments };
