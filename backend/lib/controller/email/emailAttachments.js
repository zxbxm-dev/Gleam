const fs = require('fs');
const models = require('../../models');


//이메일 첨부파일 조회
async function getAttachmentsByEmailId(Id){
    try{
        const attachments = await models.EmailAttachment.findAll({
            where:{
                Id :Id 
            }
        });
        return attachments;
    }catch(error){
        console.error("해당 이메일의 첨부파일을 조회하는 중 오류가 발생했습니다.:",error);
    }
};

// 파일 URL 생성
function generateFileUrl(filePath) {
    return `https://gleam.im/uploads/${filePath}`;
}

//이메일 첨부파일 저장 
async function saveAttachments(attachments, emailId) {
    return Promise.all(attachments.map(async (file)=>{
        const fileUrl = generateFileUrl(file.path);
        const fileName = Buffer.from(file.filename, 'latin1').toString('utf8');
        return models.EmailAttachment.create({
            emailId: emailId,
            fileName: fileName,
            mimeType: file.contentType,
            type: 'file',
            fileSize: fs.statSync(file.path).size,
            fileData: fs.readFileSync(file.path),
            url : fileUrl
        });
        
    }));
};


module.exports = { 
    getAttachmentsByEmailId,
    saveAttachments };
