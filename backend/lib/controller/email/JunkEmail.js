const models = require("../../models");
const Email = models.Email;
const JunkEmail = models.Junk; 


//스팸 이메일 등록하기
const junkController = async (req, res) => {
    
    const {
        Id :emailId
    } = req.query;
    const {

    } = req.body;

    if(!emailId){
        return res.status(400).json({ message : "이메일 정보가 제공되지 않았습니다."});
    }

    try{
        const junkEmail = await Email.findOne({
            where : { Id : emailId},
        });

        if(junkEmail.folder !== "junk"){

            junkEmail.folder = "junk";
        console.log("스팸메일 등록이 완료되었습니다.")
        }else{
            junkEmail.folder = "inbox";
        console.log("스팸메일 해제가 완료되었습니다.")
        }
        await junkEmail.save();
        res.status(200).json({ message : "스팸 등록/해제 처리가 완료되었습니다."});
    }catch(error){
        console.error("스팸 등록/해제 처리 중 오류가 발생했습니다.", error);
        res.status(500).json({ message : "스팸 등록/해제 처리가 실패했습니다."});
   };

}
module.exports= {
    junkController,

}