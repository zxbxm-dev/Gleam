const Imap = require("node-imap");
const { simpleParser } = require("mailparser");
const {saveEmail} = require('../controller/email/emailHandler');
require('dotenv').config();

// IMAP 연결 설정 및 이메일 가져오기 함수
async function fetchMailcowEmails(email, password) {
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
                    console.log('No unread emails found.');
                    imap.end();
                    return;
                }

                const f = imap.fetch(results, fetchOptions);

                f.on('message', (msg, seqno) => {
                    console.log('Processing email #%d', seqno);
                    msg.on('body', (stream) => {
                        simpleParser(stream, async (err, mail) => {
                            if (err) {
                                console.error('Error parsing email:', err);
                                return;
                            }

                            console.log('Subject:', mail.subject);
                            console.log('From:', mail.from.text);
                            console.log('Text:', mail.text);
                        
                            try {
                                const emailId = await saveEmail(mail);
                                console.log('Email saved with ID:', emailId);
                            } catch (saveErr) {
                                console.error('Error saving email to database:', saveErr);
                            }
                        
                        });
                    });
                });

                f.once('error', (err) => {
                    console.error('Fetch error:', err);
                });

                f.once('end', () => {
                    console.log('Done fetching all messages!');
                    imap.end();
                });
            });
        });
    });

    imap.once('error', (err) => {
        console.error('IMAP error:', err);
    });

    imap.once('end', () => {
        console.log('IMAP connection ended');
    });

    imap.connect();
}

module.exports = { fetchMailcowEmails };
