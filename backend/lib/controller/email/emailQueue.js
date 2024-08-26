const models = require("../../models");
const Email = models.Email;
const schedule = require("node-schedule");
const moment = require("moment");
const { sendMail } = require("../email/sendEmail");

//이메일 예약설정하기
const QueueEmail = async (req , res) => {
    const{
        Id,
        userId,
        messageId,
        sender,
        receiver,
        referrer,
        subject,
        body,
        queueDate,
        attachment,
        receiveAt,
        signature,
        folder,
    } = req.body;

    console.log("요청 본문 받음", req.body);

    const formattedDate = moment(queueDate).format('YYYY-MM-DD HH:mm:ss');
    const date = new Date(queueDate[0], queueDate[1] - 1, queueDate[2], queueDate[3], queueDate[4]);
    
    const j = schedule.scheduleJob( date , function(){
        console.log(`${formattedDate} 에 이메일이 발송 예약되었습니다.`)
        sendMail(req.body,res);
      });


    try{
        const newQueueEmail = await Email.create({
            userId, 
            messageId,
            sender,
            receiver,
            referrer,
            subject,
            body,
            queueDate: formattedDate,
            receiveAt,
            signature,
            attachment,
            folder:'queue',
        })
        res.status(200).json ({message: "이메일 예약이 성공적으로 완료되었습니다.", newQueueEmail});
    }catch(error){
        console.error("이메일 발송을 예약하는 도중 에러 발생", error)
        res.status(500).json({message: "이메일을 발송 예약하는 도중 오류가 발생했습니다." });
    };
};

//발송예약한 이메일 전송 시 기존에 있던 레코드 삭제하기 
const deleteQueueEmail = async (req, res, Id) => {
    try{
        const emailOnQueue = await Email.findOne({
            where:{ Id : Id }  
        });

        if(emailOnQueue){
            emailOnQueue.destroy()
            console.log(`${Id}번 이메일의 발송예약이 성공적으로 처리되었습니다.`);
        }else{
            console.log("해당 이메일의 발송예약 정보를 찾을 수 없습니다.")
        };
    }catch(error){
        console.error("발송 예약 이메일 처리 중 오류 발생", error);
        res.status(500).json({message : "발송예약 이메일 처리 도중 오류가 발생했습니다."});
    }
};

//예약메일 취소하기 


module.exports ={
    QueueEmail,
    deleteQueueEmail,
    
}