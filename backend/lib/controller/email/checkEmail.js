const models = require("../../models");
const email = models.Email;

//이메일 조회하기
const getAllEmail = async (req, res) => {

    const{
        userId,
    } = req.body;

    if(userId){
    try{
        const emails = await email.findAll({
            where: {
                userId: userId,
            }
        });
        res.status(200).json({message: "이메일 조회를 완료했습니다:", emails:emails});
    }catch(error){
        console.error("이메일 조회 중 오류가 발생했습니다.: ", error);
        res.status(500).json({ error: "이메일 조회에 실패했습니다." });
    }
}
};
module.exports = {
    getAllEmail,
}