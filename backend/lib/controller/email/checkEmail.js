const models = require("../../models");
const { fetchMailcowEmails } = require("../../services/emailService");
const { getAttachmentsByEmailId } = require("./emailAttachments");
const Email = models.Email;
const User = models.User

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

        const usermail = user.usermail;
        const password = user.password;

    try{
        await fetchMailcowEmails( userId );        
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

    const emailId = req.params.Id

    try{
        const deleteEmail = await Email.findByPk(emailId);
        
        if(!deleteEmail){
            return res.status(404).json({ error: "이메일 정보를 찾을 수 없습니다."});
        }

        await deleteEmail.destroy();
        res.status(200).json({message: "이메일이 성공적으로 삭제되었습니다."});
    }catch(error) {
        console.error("이메일 삭제 중 오류 발생:", error);
        res.status(500).json({ error : "이메일 삭제에 실패했습니다."})
    }
}

module.exports = {
    getAllEmail,
    deleteEmail,
}