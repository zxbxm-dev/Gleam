const models = require("../../models");
const User = models.User;
const docNumManagement = models.docNumManagement;
const { organizationMapping } = require("../organizationMapping");
const {Op}= require("sequelize");

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
        const userDpt = userInfo[0].dataValues.department;
        const userTeam = userInfo[0].dataValues.team;

        if(userDpt && !userTeam){
        //부서장 문서 조회 시 
        
            const checkingUserDpt = await checkUserDpt(userDpt);
            const checketDpt = checkingUserDpt.department;
            const checkedTeam = checkingUserDpt.teams.map((team)=> team.name);

            const documentsForManager = await docNumManagement.findAll({
                where: {
                    team:{
                    [Op.in] : checkedTeam,
                    }
                }
            });

            if(documentsForManager){
                return res.status(404).json({ error : " 해당 사용자가 조회 가능한 하위 문서가 없습니다." });
            }
            res.status(200).json({ message: " 해당 사용자의 하위 팀문서/공용문서 조회 결과 : ", documentsForManager });
        }else{
        //대표이사님, 이사님의 문서번호관리 권한은 별도로 설정되어있지 않습니다.
        //팀원 문서 조회 시
        const documents = await docNumManagement.findAll({
            where : {
                team: userTeam,
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
                        username: {},
                        userposition: {},
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
            username: {},
            userposition: {},
        });

        res.status(200).json({
            message: "신규 공용 문서가 추가되었습니다.",
            notice: newPublicDoc,
        });
        }

    }catch(error){
        console.error(" 문서 추가 중 오류 발생 : ", error );
        res.status(500).json({ message: "문서 추가 중 오류가 발생했습니다." });
    }
};

//문서번호 수정
const editDocNumber = async( req, res ) => {
    const { documentId } = req.query;
    const { docTitle, docNumber, userName, userposition } = req.body;
    try{
    if(!documentId){
        return res.status(404).json({ message : "해당 문서번호와 일치하는 문서 정보를 찾을 수 없습니다." });
    };
    const editNumber = await docNumManagement.update (
        {
        docNumber : docNumber,
        username : userName,
        userposition : userposition,
        },
        {
            where : {
                documentId :documentId,
            }
        },
    );

    res.status(200).json({ message: `${documentId}번 문서의 문서번호가 성공적으로 수정되었습니다.`, user: username });
}catch(error){
    console.error("문서번호 수정 중 오류 발생", error );
    res.status(500).json({ error: `${documentId}번 문서 번호 수정 중 오류 발생가 발생했습니다. ` });
}

};

//문서정보 편집 - 관리팀 권한
//문서 삭제 
const deleteDoc = async (req, res) => {
    const { documentId } = req.body;
    try{
    if(!documentId){
        return res.status(404).json({ message : "해당 문서번호와 일치하는 문서 정보를 찾을 수 없습니다." });
    };
    const deleteDocument = await docNumManagement.findByPk(documentId);
    await deleteDocument.destroy();
    res.status(200).json({ message: "문서를 성공적으로 삭제했습니다." });
}catch(error){
    console.error("문서 삭제 중 오류 발생", error);
    res.status(500).json({ error: " 문서 삭제에 실패했습니다." });
}
}
//문서 편집



//사용자 부서 확인
async function checkUserDpt(userDpt) {
    const departmentData = Object.values(organizationMapping).find(
         (deptNum) => deptNum.department === userDpt
    );
    return departmentData;
  };

module.exports = {
    addDocument,
    getAllDocument,
    editDocNumber,
};