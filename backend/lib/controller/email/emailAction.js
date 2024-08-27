const models = require("../../models");
const Email = models.Email;
const EmailAction = models.EmailAction;


//이메일 로그 기록 




//이메일 로그 삭제





//이메일 중요메일로 등록하기
const starringEmail = async (req, res) => {
    const {
        Id, 
        star,
    } = req.body;

    if(!Id){
        res.status(500).json({error:"이메일 정보를 찾을 수 없습니다."});
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


module.exports = {
    starringEmail,
}