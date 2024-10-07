const models = require("../../models");
const project = models.mainProject;
const subproject = models.subProject;
const { Op } = require('sequelize');

//프로젝트 status 관리
 const statusController = async (req, res) => {
    const today = new Date();

    //mainpj 마감기한이 오늘보다 과거일 때 진행완료로 변경
    try{      
        const mainProjects = await project.findAll({
            where : { endDate: { [Op.lte]: today }}
          });
        for(let project of mainProjects){
        project.status = "done"
        await project.save();
    }
    }catch(error){
        console.error("프로젝트 상태 업데이트 중 오류 발생:", error);
    };
}



//서브 프로젝트 status 관리 - mainPj가 완료일 때 subPj도 완료로 상태변경
const subStatusController = async (req, res) => {
    try{
        const completeMainPj = await project.findAll({
            where: { status : 'done'}
        });

        for(let mainpj of completeMainPj){
            const mainprojectIndex = mainpj.mainprojectIndex;

            const subProjects = await subproject.findAll({
                where: { mainprojectIndex: mainprojectIndex }
            });

            for(let subpj of subProjects){
                subpj.status = "done"
                await subpj.save();
            }
        }

    }catch(error){
        console.error("서브 프로젝트 상태 업데이트 중 오류 발생:", error);
    };
}
 module.exports = {
    statusController,
    subStatusController,
 }
