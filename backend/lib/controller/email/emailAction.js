const models = require("../../models");
const Email = models.Email;
const EmailAction = models.EmailAction;

//이메일 중요메일로 등록하기
const starringEmail = async (req, res) => {
    const {
        Id, 
    } = req.body;

    if(!Id){
        return res.status(500).json({error:"이메일 정보를 찾을 수 없습니다."});
    }
    console.log("요청 본문 받음 :", req.body);

    try{
        const controlStarring = await Email.findOne({
            where : { Id : Id }
        });

        if(controlStarring.star !== "starred" ){
            controlStarring.star = "starred"
            console.log("중요메일 등록이 완료되었습니다.")
        }else{
            controlStarring.star = null
            console.log("중요메일 해제가 완료되었습니다.")
        };

        
        await controlStarring.save();
        res.status(200).json({ message: "중요메일 등록/해제 처리가 완료되었습니다."});
    }catch(error){
        console.error("중요메일 등록/해제 처리 중 오류가 발생했습니다.");
    };
};

//이메일 읽음 
const readEmail = async( req, res) => {
    const { Id } = req.body;

    if(!Id){
        return res.status(500).json({error: "이메일 정보를 찾을 수 없습니다."});
    }

    try{
        const unreadEmail = await Email.findOne({
            where: { Id : Id }
        });
        if(unreadEmail.read = "unread"){
            unreadEmail.read = "read"
            console.log("읽음 처리 완료")
        }else{
            unreadEmail.read = null
            console.log("이미 읽은 이메일 입니다. ")
        };
        await unreadEmail.save();
        res.status(200).json({ message: "읽음 처리가 완료되었습니다"});
    }catch(error){
        console.error("읽음 처리 중 오류가 발생했습니다.")

    };
};


//이메일 삭제 로그
const deletedLog = async(req, res, emailId, userId, messageId) => {
    const actionTimeStamp = new Date();
    const newDeletedLog = await EmailAction.create({
        emailId,
        messageId,
        userId,
        action: 'deleted',
        actionTimeStamp,
    });

    return res.status(200).json({ message: '이메일 삭제 로그가 성공적으로 작성되었습니다.', newDeleteLog: newDeletedLog});
};


module.exports = {
    starringEmail,
    deletedLog,
    readEmail,
}