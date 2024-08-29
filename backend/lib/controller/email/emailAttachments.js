const fs = require('fs');
const models = require('../../models');




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


module.exports = { saveAttachments };
