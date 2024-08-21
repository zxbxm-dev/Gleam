const models = require("../../models");
const { fetchMailcowEmails } = require("../../services/emailService");
const email = models.Email;


//중복 확인



//모든 이메일 조회하기
const getAllEmail = async (req, res) => {

    const{
        userId,
        folder,
    } = req.query;

    if(userId){

    try{
        //email , password 고정값으로 되어있습니다. 추후 수정 예정입니다.
        await fetchMailcowEmails('onion@gleam.im', '123qwe', userId);        
        const emails = await email.findAll();
        res.status(200).json({message: "이메일 조회를 완료했습니다:", emails:emails});
    }catch(error){
        console.error("이메일 조회 중 오류가 발생했습니다.: ", error);
        res.status(500).json({ error: "이메일 조회에 실패했습니다." });
    }
}
};

//이메일 삭제하기
const deleteEmail = async(req, res) => {
    const emailId = req.params.mailId;
    try{
        const deleteEmail = await email.findByPk(emailId);
        
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