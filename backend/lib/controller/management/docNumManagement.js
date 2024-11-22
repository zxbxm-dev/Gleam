const models = require("../../models");
const docNumManagement = require("../../models/management/docNumManagement");
const User = models.User;
const docNumManagement = models.docNumManagement;

//문서 조회
const getAllDocument = async( req, res ) => {
    try{
        const documetnts = await docNumManagement.findAll({
            where : {
                te
            }
        })
         
    }catch(error){
      console.error("문서 목록 조회 중 오류가 발생했습니다.:", error);
      res.status(500).json({ error: " 문서 목록 조회 중 오류 발생 "});
    }
};

//문서 추가
const addDocument = async( req, res ) => {
    const { userID } = req.params;
    const { docType, docTitle, docNumber } = req.body;

    try{
        if(!userID){
            return res.status(404).json({ error : "문서 등록 중 사용자 정보를 찾을 수 없습니다."});
        };

        const userInfo = await User.findOne({
            where:{
                userID: userID,
            },
        })

        //새로운 문서 DB에 저장 
        const newDocument = await docNumManagement.create({
            docType: docType,
            docTitle: docTitle,
            docNumber: docNumber,
            username: userInfo.dataValues.username,
        });

        res.status(201).json({
            message: "신규 문서가 추가되었습니다.",
            notice: newDocument,
        });
        
    }catch(error){
        console.error(" 문서 추가 중 오류 발생 : ", error );
        res.status(500).json({ message: "문서 추가 중 오류가 발생했습니다." });
    }
};



//문서 번호 편집

module.exports = {
    addDocument,
};