const fs = require('fs');
const models = require('../../models');




async function saveAttachments(attachments, emailId) {
    return Promise.all(attachments.map(async (file)=>{
        return models.EmailAttachment.create({
            emailId: emailId,
            fileName: file.filename,
            mimeType: 'application/octet-stream', // 필요시 실제 MIME 타입으로 수정
            type: 'file', // 파일 유형
            fileSize: fs.statSync(file.path).size,
            fileData: fs.readFileSync(file.path), // 파일 데이터를 BLOB로 저장
        });
    }));
}


module.exports = { saveAttachments };
