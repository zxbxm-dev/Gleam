const models = require("../../models");
const Email = models.Email;
const JunkList = models.JunkList; 

//스팸 이메일 등록하기
const junkController = async (req, res) => {
    const {
        Id :emailId
    } = req.params;

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
};

   //스팸 주소록 추가
   const addJunkList = async (req, res) => {
    const{
        createdBy,
        junkId,
        registerAt,
    } = req.body;
    console.log("요청 본문 받음:", req.body);

    try{
    const overlappedJunkList = await JunkList.findOne({
       where :{
            createdBy : createdBy,
            junkId : junkId
        }
    });
    if(overlappedJunkList){
        return res.status(409).json({message: "이미 스팸 등록된 주소입니다."});
    }
    }catch(error){
        console.error("스팸 주소 등록 중 오류 발생:", error);
         return res.status(500).json({ message: "스팸 주소 등록 중 오류가 발생했습니다."});
    };

    try{
      const newJunkList = await JunkList.create({
        createdBy,
        junkId,
        registerAt,
      });
       return res.status(201).json({ message: "스팸 주소 등록이 완료되었습니다.", newJunkList});
    }catch(error){
        console.error("스팸 주소 등록 중 오류가 발생했습니다.", error);
       return res.status(500).json({ message: "스팸 주소 등록에 실패했습니다."});
    };
   };

   // 스팸 주소록 조회
   const getAllJunkList = async( req, res ) => {
    const{ userId } = req.query;

    try{
        const getAllJunkList = await JunkList.findAll({
            where: {
                createdBy : userId,
            }
        })
        res.status(200).json({message: "스팸주소록 조회가 완료되었습니다."});
    }catch(error){
        console.log(error)
        res.status(500).json({error : "스팸 주소록 조회에 실패했습니다."});
    }
   };

   //스팸 주소록 해제
   const removeFromJunkList = async( req, res ) => {
     const { junkId } = req.params;
     const { userId } = req.body;
     console.log("요청 본문 받음 : ",req.body);
    
     try{
        const removeJunkList = await JunkList.findOne({
            where:{
                junkId : junkId,
                createdBy : userId,
            }
    });
        if(!removeJunkList){
            return res.status(404).json({ error: "스팸 주소 정보를 찾을 수 없습니다."});
        }
        await removeJunkList.destroy();
        res.status(200).json({message: "해당 주소의 스팸설정이 성공적으로 해제되었습니다."});
    }catch(error){
        console.log(error)
        res.status(500).json({error:"스팸 주소 해제에 실패했습니다."});
    }
   };
    
module.exports= {
    junkController,
    addJunkList,
    getAllJunkList,
    removeFromJunkList
}