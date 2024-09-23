const Imap = require("node-imap");
const nodemailer = require("nodemailer")
const { simpleParser } = require("mailparser");
const models = require("../models");
const Email = models.Email;
const EmailAttachment = models.EmailAttachment;
require('dotenv').config();
const fs = require("fs-extra");
const path = require("path");
const schedule = require("node-schedule");
const {deleteQueueEmail} = require("../controller/email/emailQueue");
const { getAttachmentsByEmailId } = require("../controller/email/emailAttachments");
const shortid = require('shortid');
const { error } = require("console");


//IMAP 연결 설정 
async function connectIMAP(userId, password){
    return new Imap({
        user: userId + "@gleam.im",
        password: password,
        host: 'mail.gleam.im',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
    });
}


// 이메일 가져오기
async function fetchMailcowEmails(userId) {
    const password = 'math123!!'
    const imap = await connectIMAP(userId, password); //IMAP 연결

    imap.once('ready', async () => {

        imap.openBox('INBOX', true, async (err, box) => {
            if(err) throw err;

            // 모든 이메일 검색
            imap.search(['ALL'],  async (err, results) => {
                if (err) throw err;
                if (results.length === 0) {
                    console.log('읽지 않은 메일이 없습니다.');
                    imap.end();
                    return;
                }

                fetchEmails(imap, userId, 'inbox', () => {
                            console.log('모든 이메일 불러오기 완료.');
                            imap.end();
                        });
            });
        });
    });

    imap.once('error', (err) => {
        console.error('IMAP 연결 에러:', err);
    });

    
    imap.once('end', () => {
        console.log('IMAP 연결이 종료되었습니다');
    });

    imap.connect();

    // 특정 메일함에서 이메일을 가져오는 함수
    function fetchEmails(imap, userId, folderName, callback) {
        const searchCriteria = ['ALL'];
        const fetchOptions = { bodies: '', struct: true };

        imap.search(searchCriteria, (err, results) => {
            if (err) throw err;
            // if (!results || results.length === 0) {
            //     console.log('조회되는 이메일이 존재하지 않습니다.');
            //     callback();
            //     return;
            // }
            const f = imap.fetch(results, fetchOptions);

          // 이메일 파싱
            f.on('message', (msg, seqno) => {
                //console.log('불러온 이메일 #%d', seqno);

                msg.on('body', (stream) => {
                    simpleParser(stream, async (err, mail) => {
                        if (err) {
                            console.error('이메일 파싱 도중 에러가 발생했습니다.:', err);
                            return;
                        }
                        try {
                            const checksavedEmail = await saveEmail(mail, userId, folderName);
                            if(checksavedEmail){

                            // 첨부파일이 있는 경우 저장
                            if (mail.attachments && mail.attachments.length > 0) {
                                await saveAttachments(mail.attachments, checksavedEmail.Id);
                            }

                            } 
                      } catch (saveErr) {
                            console.error('이메일을 저장하는 도중 에러가 발생했습니다.',error);
                            return;
                        }
                    });
                });
            });
            f.once('error', (err) => {
                console.error('이메일 불러오기 오류:', err);
            });
            f.once('end', () => {
                callback();
            });
        });
    }
}

    // 이메일 수신 시 첨부파일 저장 함수
    async function saveAttachments(attachments,emailId) {
         try {

            let hasAttachments = false;

            for (const attachment of attachments) {
                // 첨부파일 저장 경로
                const uploadDir = path.join(__dirname, 'uploads', 'emailFile');
                await fs.promises.mkdir(uploadDir, { recursive: true });
    
                const attachmentPath = path.join(uploadDir, attachment.filename);
                await fs.promises.writeFile(attachmentPath, attachment.content);
    
                // 이메일 첨부파일 데이터베이스에 저장
                await EmailAttachment.create({
                    emailId: emailId,
                    fileName: attachment.filename,
                    mimetype: attachment.contentType,
                    type: 'file', 
                    fileSize: attachment.size,
                    fileData: attachment.content, 
                });
                hasAttachments = true;

                if (hasAttachments) {
                    await Email.update(
                        { hasAttachments: true },
                        { where: { Id: emailId } }
                    );
                }
            }
        } catch (err) {
            console.error('첨부파일 저장 실패:', err);
        }
    };

// 불러온 이메일 데이터베이스에 저장
const saveEmail = async (mail, userId, folderName, attachments =[]) => {
    if (!mail || !mail.subject) {
        console.error('Error: mail 객체가 존재하지 않거나 제목이 존재하지 않습니다.');
        return;
    }
   
    // 이메일 중복체크 - messageId 사용
    try {
        const existingEmails = await Email.findOne({
            where: {
                userId: userId,
                messageId: mail.messageId,
            }
        });

        if (existingEmails) {
            console.log(`중복된 이메일이 이미 저장되어 있습니다. Message-ID: ${mail.messageId}`);
            return null;
        }

        // 중복확인 후 이메일 저장
        const emailData = {
            subject: mail.subject || '(제목없음)',
            userId: userId,
            messageId: mail.messageId,
            sender: mail.from.text,
            receiver: JSON.stringify(mail.to ? mail.to.value.map(to => to.address) : []),
            referrer: JSON.stringify(mail.cc ? mail.cc.value.map(cc => cc.address) : []),
            body: mail.html || mail.text || '',
            sendAt: mail.date || new Date(),
            receiveAt: new Date(),
            signature: mail.signature || '',
            attachments: JSON.stringify(attachments),
            hasAttachment : false,
            folder: folderName
        };

        const savedEmail = await Email.create(emailData);
        return savedEmail;
    } catch (error) {
        //console.error('이메일 저장실패');
    }
};

//messageId 생성 함수
function generateMessageId(domain = "gleam.im"){
    const uniqueID = shortid.generate();
    return `<${uniqueID}@${domain}`;
};

// SMTP를 통한 이메일 전송 함수 추가
async function sendEmail(to, subject, body,userId, attachments = [], messageId, cc) {

    // 도메인을 four-chains.com으로 변경하게 되면 email = email 로 사용하면 됩니다.
    const email = userId + "@gleam.im";
    const password = 'math123!!'
    const transporter = nodemailer.createTransport({
        host: 'mail.gleam.im',
        port: 587,
        secure: false,
        auth: {
           user: email,
           pass : password
        },
        // 추후 TLS/SSL 인증서 등 신뢰 가능한 인증서로 설정해야 합니다.
        tls: {rejectUnauthorized: false}
    });

    const attachmentsInfo = attachments ? attachments.map(file => ({
        filename : Buffer.from(file.filename, 'latin1').toString('utf8'),
        path : file.url,
        mimetype : file.mimetype,
        url : file.destination,
        size: file.size,
        encoding: 'utf-8'
    })) : [];


    const mailOptions = {
        userId: userId,
        from: email,
        to: to,
        cc: cc,
        subject: subject,
        text: body,
        html: body,
        messageId : messageId,
        attachments: attachmentsInfo
    };


    try {
        const info = await transporter.sendMail(mailOptions);
        const imap = await connectIMAP(userId, password);

       imap.once('error', function(err) {
           console.error('IMAP 연결 에러:', err);
       });

       imap.connect();
        console.log('이메일이 성공적으로 전송되었습니다: ', info.response);
        return info;
    } catch (error) {
        console.error('이메일 전송 중 오류가 발생했습니다: ', error);
        throw error;
    }
}
 // SMTP를 통한 저장된 이메일 전송 함수 추가
 async function sendSavedEmail(to, subject, body,userId, attachments = [], messageId, cc) {
    
    // 도메인을 four-chains.com으로 변경하게 되면 email = email 로 사용하면 됩니다.
    const email = userId + "@gleam.im";
    const password = 'math123!!'
    const transporter = nodemailer.createTransport({
        host: 'mail.gleam.im',
        port: 587,
        secure: false,
        auth: {
           user: email,
           pass : password
        },
        // 추후 TLS/SSL 인증서 등 신뢰 가능한 인증서로 설정해야 합니다.
        tls: {rejectUnauthorized: false}
    });

     // Attachments 데이터 확인
     const attachmentsInfo = attachments.map(file => {
        if (!file.fileData || !file.fileName) {
            console.error('유효하지 않은 첨부파일:', file);
            throw new Error('첨부파일이 유효하지 않습니다.');
        }
        
        return {
            filename: file.fileName,
            path: file.url,
            content: file.fileData,  
            contentType: file.mimetype,
        };
    });

    const mailOptions = {
        userId: userId,
        from: email,
        to: to,
        cc: cc,
        subject: subject,
        text: body,
        html: body,
        messageId : messageId,
        attachments: attachmentsInfo
    };


    try {
        const info = await transporter.sendMail(mailOptions);
        const imap = await connectIMAP(userId, password);

       imap.once('error', function(err) {
           console.error('IMAP 연결 에러:', err);
       });

       imap.connect();
        console.log('이메일이 성공적으로 전송되었습니다: ', info.response);
        return info;
    } catch (error) {
        console.error('이메일 전송 중 오류가 발생했습니다: ', error);
        throw error;
    }
}

const scheduledEmail = new Set();

//node-schedule 설정 
const startScheduler = () => 

    schedule.scheduleJob("*/10 * * * * *", async ()=> {
        console.log("⏰ :: 스케줄링 작업 실행...");
        try{
        //DB에서 예약 이메일이 있는지 확인 
        const queue = await Email.findAll({
            where: {
                folder: "queue",
            }
        });

        for(const email of queue){
            if(scheduledEmail.has(email.Id)){
            console.log(`이메일 ${email.Id}는 이미 스케줄링 된 이메일입니다.`);
            continue;
        }
        console.log("예약 이메일 : ", email.Id);
        }
            queue.forEach(email => { 
                const queueDate = new Date(email.queueDate);

                 // Date 객체 유효성 확인
                if (!isNaN(queueDate.getTime())) {

                    scheduledEmail.add(email.Id); //스케줄링 한 이메일을 ScheduledEmail 리스트에 추가하여 중복 방지
                    schedule.scheduleJob(queueDate, async () => {
                        try {   
                            const messageId = generateMessageId();
                            const attachments = await getAttachmentsByEmailId(email.Id);
                            const sendQueueEmail =  await sendSavedEmail(email.receiver, email.subject, email.body, email.userId, attachments );
                            console.log("예약 이메일 전송 완료 :", sendQueueEmail);
                
                            // 전송된 이메일을 저장
                            const sentEmail = await Email.create({
                                userId : email.userId,
                                messageId : messageId,
                                sender : email.sender,
                                receiver : email.receiver,
                                referrer : email.referrer,
                                subject : email.subject,
                                body : email.body,
                                sendAt: new Date(),
                                receiveAt : email.receiveAt,
                                queueDate : email.queueDate,
                                signature : email.signature,
                                hasAttachments: attachments && attachments.length > 0,
                                folder: 'sent',
                                read: "read",
                            });

                             // 전송 후 예약 이메일 삭제
                             await deleteQueueEmail(email.messageId);

                            // 첨부파일이 있는 경우 처리
                            if (attachments && attachments.length > 0) {
                                await saveAttachments(attachments, sentEmail.Id);
                                }

                                scheduledEmail.add(email.Id);

                            console.log("예약된 이메일 재스케줄링 완료");
                        } catch (error) {
                            console.error("예약된 이메일 전송 중 오류 발생:", error);
                        }
                    })
                }else{
                    console.error("이메일 예약 설정에 유효하지않은 날짜:", queueDate);
                    return res.status(400).json({ message: "이메일 예약 설정에 유효하지 않은 날짜입니다." });
                }     

            });

    }catch(error){
        console.log("스케줄러를 재실행 중 오류가 발생했습니다.", error);
    }
    });

module.exports = {
    connectIMAP,
    fetchMailcowEmails,
    sendEmail,
    saveEmail,
    sendSavedEmail,
    startScheduler,
};