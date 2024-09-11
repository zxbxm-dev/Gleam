const models = require("../../models");
const { fetchMailcowEmails } = require("../../services/emailService");
const { deletedLog } = require("./emailAction");
const { getAttachmentsByEmailId } = require("./emailAttachments");
const { JunkFilter } = require("./JunkEmail");
const Email = models.Email;
const User = models.User
const JunkList = models.JunkList;
const EmailAction = models.EmailAction;

//모든 이메일 조회하기
const getAllEmail = async (req, res) => {

    const{
        userId,
    } = req.params;

    if(userId){

        const user = await User.findByPk(userId);
        if(!user) {
            return res.status(404).json({message: "사용자를 찾을 수 없습니다."});
        }

    try{
        await fetchMailcowEmails( userId );    
        await JunkFilter(req, res, userId);  //스팸필터링
        await deletedFilter(req, res, userId); //삭제 된 이메일 필터링
        const emails = await Email.findAll({
            where: {userId: userId},
    });

        for(const email of emails){
            const attachments = await getAttachmentsByEmailId(email.Id);
            email.dataValues.attachments = attachments;
        }
        
        res.status(200).json({message: "이메일 조회를 완료했습니다:", emails:emails});
        
    }catch(error){
        console.error("이메일 조회 중 오류가 발생했습니다.: ", error);
        res.status(500).json({ error: "이메일 조회에 실패했습니다." });
    }
}

};

//이메일 삭제하기
const deleteEmail = async(req, res) => {
    const{
        Id,
    } = req.params;

    const emailId = Id;
 
    try{
        const deleteEmail = await Email.findByPk(emailId);
        const userId = deleteEmail.userId;
        const messageId = deleteEmail.messageId;

        if(!deleteEmail){
            return res.status(404).json({ error: "이메일 정보를 찾을 수 없습니다."});
        }

        deletedLog(req, res, Id, userId, messageId);
        await deleteEmail.destroy();
        console.log("이메일이 성공적으로 삭제되었습니다.")
    }catch(error) {
        console.error("이메일 삭제 중 오류 발생:", error);
         return res.status(500).json({ error : "이메일 삭제에 실패했습니다."})
    }
}

// 삭제된 이메일 필터링
const deletedFilter = async (req, res, userId) => {
    try {
        // 삭제된 이메일 액션을 조회
        const deletedEmailActions = await EmailAction.findAll({
            where: { userId: userId }
        });

        // 삭제된 이메일의 messageId 목록 추출
        const deletedMessageIds = deletedEmailActions.map(action => action.messageId);

        if (deletedMessageIds.length > 0) {
            // 삭제된 이메일과 일치하는 이메일 조회
            const emailsToDelete = await Email.findAll({
                where: {
                    userId: userId,
                    messageId: deletedMessageIds
                }
            });

            // 해당 이메일들을 삭제
            for (const email of emailsToDelete) {
                await Email.destroy({
                    where: { messageId: email.messageId },
                    force: true
                });
                //console.log(`이메일 삭제 완료: ${email.messageId}`);
            }
        }
        console.log("삭제된 이메일 필터링 완료");
    } catch (error) {
        console.error("삭제된 이메일 필터링 중 오류가 발생했습니다:", error);
    }
};



module.exports = {
    getAllEmail,
    deleteEmail,
    deletedFilter,
   
}