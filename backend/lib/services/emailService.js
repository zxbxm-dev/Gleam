const Imap = require("node-imap");
const nodemailer = require("nodemailer")
const { simpleParser } = require("mailparser");
const models = require("../models");
const Email = models.Email;
require('dotenv').config();

// IMAP 연결 설정 및 이메일 가져오기
async function fetchMailcowEmails(userId) {

    // 도메인을 four-chains.com으로 변경하게 되면 email = email 로 사용하면 됩니다.
    const email = userId + "@gleam.im";
    const password = 'math123!!'
    
    console.log("이메일 서버에 접속한 사용자 :", userId);

    const imap = new Imap({
        user: email,
        password: password,
        host: 'mail.gleam.im',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    });

    imap.once('ready', () => {
        // imap.getBoxes((err, boxes) => {
        //     if (err) throw err;
        //     console.log('>>>>>>>사용 가능한 폴더 목록:', boxes);
        // });

        imap.openBox('INBOX', true, (err, box) => {
            // 읽지 않은 메일만 검색
            imap.search(['UNSEEN'], (err, results) => {
                if (err) throw err;

                if (results.length === 0) {
                    console.log('읽지 않은 메일이 없습니다.');
                    imap.end();
                    return;
                }

                fetchEmails(imap, userId, 'inbox', () => {
                    imap.openBox('Sent', true, (err, box) => {
                        if (err) throw err;
                        fetchEmails(imap, userId, 'sent', () => {
                            console.log('모든 이메일 불러오기 완료.');
                            imap.end();
                        });
                    });
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
        const fetchOptions = { bodies: '' };

        imap.search(searchCriteria, (err, results) => {
            if (err) throw err;

            if (!results || results.length === 0) {
                console.log('조회되는 이메일이 존재하지 않습니다.');
                callback(); 
                return;
            }

            const f = imap.fetch(results, fetchOptions);

            // 이메일 파싱 
            f.on('message', (msg, seqno) => {
                console.log('불러온 이메일 #%d', seqno);
                msg.on('body', (stream) => {
                    simpleParser(stream, async (err, mail) => {
                        if (err) {
                            console.error('이메일 파싱 도중 에러가 발생했습니다.:', err);
                            return;
                        }
                        try {
                            const checksavedEmail = await saveEmail(mail, userId, folderName);
                            console.log('저장된 이메일 Id:', checksavedEmail.Id);
                        } catch (saveErr) {
                            console.error('이메일을 저장하는 도중 에러가 발생했습니다.:', saveErr);
                            console.log('>>>>>>저장 실패한 이메일 제목: ', mail.subject);
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

// 불러온 이메일 데이터베이스에 저장
const saveEmail = async (mail, userId, folderName) => {
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
            folder: folderName 
        };

        const savedEmail = await Email.create(emailData);
        return savedEmail;

    } catch (error) {
        console.error('이메일 저장실패:', error);
    }
};

// SMTP를 통한 이메일 전송 함수 추가
async function sendEmail(to, subject, body,userId) {

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

    const mailOptions = {
        userId: userId,
        from: email, 
        to: to, 
        subject: subject, 
        text: body, 
        html: body
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('이메일이 성공적으로 전송되었습니다: ', info.response);
        return info;
    } catch (error) {
        console.error('이메일 전송 중 오류가 발생했습니다: ', error);
        throw error;
    }
}

module.exports = { 
    fetchMailcowEmails,
    saveEmail,
    sendEmail,
};
