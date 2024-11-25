const models = require("../../models");
const User = models.User;
const docNumManagement = models.docNumManagement;
const { organizationMapping } = require("../organizationMapping");

//문서 조회
const getAllDocument = async( req, res ) => {
    const { userID } = req.params;
    try{
        const userInfo = await User.findAll({
            where : { 
                userID: userID,
            },
            attributes:[ 'department','team'],
        });
        const userDpt = userInfo?.department;
        const userTeam = userInfo?.team;

        if(userDpt && !userTeam){

        }else{

        const documents = await docNumManagement.findAll({
            where : {
                userID: userID,
                userTeam: userTeam,
            }
        });

        if(!documents){
            return res.status(404).json({ error : "해당 사용자가 조회 가능한 문서가 없습니다."});
        };

        res.status(200).json({ message : "해당 사용자의 팀문서/공용문서 조회 결과 : ", documents});
    }

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
        
        //팀 문서일 때 
        if( docType == "Team"){
            const departments = Object.entries(organizationMapping);
            for( const [key, value] of departments) {
                for(const team of value.teams){
                    const newTeamDoc = await docNumManagement.create({
                        docType: docType,
                        team : team.name,
                        docTitle: docTitle,
                        docNumber: docNumber,
                        username: userInfo.dataValues.username,
                    });
                }
            }
            res.status(200).json({
                message: "신규 팀 문서가 추가되었습니다.",
            })
        }else{
        //공용 문서일 때 
        const newPublicDoc = await docNumManagement.create({
            docType: docType,
            docTitle: docTitle,
            docNumber: docNumber,
            username: userInfo.dataValues.username,
        });

        res.status(201).json({
            message: "신규 공용 문서가 추가되었습니다.",
            notice: newPublicDoc,
        });
        }

        
        
    }catch(error){
        console.error(" 문서 추가 중 오류 발생 : ", error );
        res.status(500).json({ message: "문서 추가 중 오류가 발생했습니다." });
    }
};



//문서 번호 편집
//patch

module.exports = {
    addDocument,
    getAllDocument,
};