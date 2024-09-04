const models = require("../../models");
const Email = models.Email;
const JunkList = models.JunkList; 

//스팸 이메일 등록하기
const junkController = async (req, res) => {
    
    const {
        Id :emailId
    } = req.query;

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

   //스팸 주소록 추가
   const registerJunkList = async (req, res) => {
    const{
        createdBy,
        junkId,
    } = req.body;
    console.log("요청 본문 받음:", req.body);

    try{
    const overlappedJunkList = await JunkList.findAll({

        where :{
            createdBy,
            junkId
        }
    });

    if(overlappedJunkList > 0){
        return res.status(409).json({message: "이미 스팸 등록된 주소입니다."});
    }
    }catch(error){
        console.error("스팸 주소 등록 중 오류 발생:", error);
        res.status(500).json({ message: "스팸 주소 등록 중 오류가 발생했습니다."});
    };

    try{
      const newJunkList = await JunkList.create({
        createdBy,
        junkId,
        registerAt,
      });
      res.status(201).json({ message: "스팸 주소 등록이 완료되었습니다.", newJunkList});
    }catch(error){
        console.error("스팸 주소 등록 중 오류가 발생했습니다.", error);
        res.status(500).json({ message: "스팸 주소 등록에 실패했습니다."});
    };



   }
    
}
module.exports= {
    junkController,

}