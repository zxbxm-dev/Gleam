const Imap = require("node-imap");
const { simpleParser } = require("mailparser");
const models = require("../models")
const emails = models.Email;
require('dotenv').config();

//현재 접속한 유저의 인증정보 
   


// IMAP 연결 설정 및 이메일 가져오기 함수
async function fetchMailcowEmails(email, password) {

   //임의로 작성한 이메일계정입니다.
   email = 'onion@gleam.im';
   password = '123qwe';

    const imap = new Imap({
        user: email,
        password: password, 
        host: 'mail.gleam.im',
        port: 993, // IMAP 기본 포트
        tls: true, // TLS를 통한 보안 연결
        tlsOptions: { rejectUnauthorized: false } 
    });

    imap.once('ready', () => {
        imap.openBox('INBOX', true, (err, box) => {
            if (err) throw err;

            const searchCriteria = ['ALL'];
            const fetchOptions = { bodies: '' };

            imap.search(searchCriteria, (err, results) => {
                if (err) throw err;

                if (!results || results.length === 0) {
                    console.log('조회되는 이메일이 존재하지 않습니다.');
                    imap.end();
                    return;
                }

                const f = imap.fetch(results, fetchOptions);

                f.on('message', (msg, seqno) => {
                    console.log('불러온 이메일 #%d', seqno);
                    msg.on('body', (stream) => {
                        simpleParser(stream, async (err, mail) => {
                            if (err) {
                                console.error('이메일을 파싱하는 도중 에러가 발생했습니다.:', err);
                                return;
                            }

                            console.log('Subject:', mail.subject);
                            console.log('From:', mail.from.text);
                            console.log('Text:', mail.text);
                        
                            try {
                                const checksavedEmail = await saveEmail(mail);
                                console.log('저장된 이메일 Id:', checksavedEmail.Id);
                            } catch (saveErr) {
                                console.error('이메일을 저장하는 도중 에러가 발생했습니다.:', saveErr);
                            }
                        
                        });
                    });
                });

                f.once('error', (err) => {
                    console.error('이메일 불러오기 오류:', err);
                });

                f.once('end', () => {
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
}

//불러온 이메일 데이터베이스에 저장
const saveEmail = async (mail) => {
    if (!mail || !mail.subject) {
        console.error('Error: mail 객체가 존재하지않거나 제목이 존재하지않습니다.');
        return;
    }

    try {
        const emailData = {
            subject: mail.subject||'(제목없음)',
            sender: mail.from.text ,
            receiver: JSON.stringify(mail.to ? mail.to.value.map(to => to.address) : []),
            referrer: JSON.stringify(mail.cc ? mail.cc.value.map(cc => cc.address) : []),
            body: mail.text || mail.html || '',
            sendAt: mail.date || new Date(),
            receiveAt: new Date(),
            signature: mail.signature || '',
            folder: 'inbox'
        };

        const savedEmail = await emails.create(emailData);
        return savedEmail;

    } catch (error) {
        console.error('이메일 저장실패:', error);
    }
};

// SMTP를 통한 이메일 전송 함수 추가
async function sendEmail(to, subject, body) {

   //임의로 작성한 이메일계정입니다.
   const email = 'onion@gleam.im';
   const password = '123qwe';

    const transporter = nodemailer.createTransport({
        host: 'mail.gleam.im', 
        port: 587, 
        secure: false, 
        auth: {
           user: email, 
           pass : password
        }
    });

    const mailOptions = {
        from: email, 
        to: to, 
        subject: subject, 
        text: body 
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
