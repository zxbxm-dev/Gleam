const models = require("../../models");
const project = models.mainProject;
const subproject = models.subProject;

//프로젝트 일정 추가 (main,sub)
const addProject = async (req, res) => {
    const {mainprojectIndex } = req.params;
    const{
        userID,
        projectName,
        Leader,
        members,
        referrer,
        startDate,
        endDate,
        memo,
    } = req.body;
    
    console.log("요청 본문 받음:", req.body);
    console.log("요청 파라미터:", req.params);

    const currentDate = new Date();
    const today = currentDate.toISOString().split('T')[0];

    //서브 프로젝트 생성 
    try{
        if(mainprojectIndex){
            //서브 프로젝트 인덱스 생성 
            const subprojectCount = await subproject.count({ 
                where: { mainprojectIndex } 
            });
            const newSubprojectIndex = `${mainprojectIndex}-${subprojectCount + 1}`;
            
            //메인프로젝트 마감일 초과 여부 확인
            const mainProject = await project.findOne({where: {mainprojectIndex}});
            const mainEndDate = mainProject.endDate.toISOString().split('T')[0];
            const mainStartDate = mainProject.startDate.toISOString().split('T')[0];
           
            const subEndDate = new Date(endDate).toISOString().split('T')[0];
            const subStartDate = new Date(startDate).toISOString().split('T')[0];

            if(startDate<=today){
                status = "inprogress";
            }else{
                status = "notstarted";
            };
        
            if(subEndDate> mainEndDate) { return res.status(419).json({message:"메인프로젝트 마감일정을 초과하여 등록 할 수 없습니다." });}
            if(subStartDate<mainStartDate) { return res.status(418).json({message:"메인프로젝트 시작일정보다 빠른 일정은 등록 할 수 없습니다." });}        
                
            const newSubProject = await subproject.create({
                userId: userID,
                mainprojectIndex,
                subprojectIndex : newSubprojectIndex,
                projectName,
                Leader,
                members,
                referrer,
                endDate,
                startDate,
                memo,
                status,
            })
            return res.status(201).json({message: `${mainprojectIndex}번 메인프로젝트의 서브프로젝트 일정 추가를 완료했습니다.`,newSubProject});
        };
       
        //메인프로젝트 생성
        if(!mainprojectIndex){
                if(startDate<=today){
                    status = "inprogress";
                }else{
                    status = "notstarted";
                }

            const newProject = await project.create({
                userId: userID,
                projectName,
                Leader,
                members,
                referrer,
                startDate,
                endDate,
                memo,
                status,
                pinned: false,  
            })
            return res.status(201).json({message: "메인프로젝트 일정 추가를 완료했습니다.", newProject});
           };

       }catch(error) {
        console.error("프로젝트 일정을 가져오는 중에 오류가 발생했습니다.:", error);
        res.status(500).json({message: "프로젝트 일정 불러오기에 실패했습니다." });
    }
};

    //프로젝트 일정 조회
    const getAllProject = async (req, res) => {
        try{
            const mainprojects  = await project.findAll();
            const subprojects = await subproject.findAll();
            res.status(200).json({mainprojects,subprojects});
        }catch(error) {
            console.error("프로젝트 일정을 가져오는 중에 오류가 발생했습니다.:", error);
            res.status(500).json({message: "프로젝트 일정 불러오기에 실패했습니다." });
        }
    };

    //프로젝트 일정 수정하기 ( 작성자 , 팀리더만 가능 )
    const editProject = async (req, res) => {
        const {
            userId: userID,
            Leader,
            projectName,
            members,
            referrer,
            startDate,
            endDate,
            memo,
            status,
            pinned
        } = req.body.data;
        const { 
            mainprojectIndex,
            subprojectIndex 
        } = req.params;

        console.log("요청 파라미터:", req.params);
        console.log("요청 본문:", req.body);
 
        if(!mainprojectIndex) {
            return res.status(400).json({ message: "메인프로젝트 식별번호가 제공되지 않았습니다. "});
        }

        //서브프로젝트 수정
        if(subprojectIndex){
        try{
            const subPj = await subproject.findOne({
                where: { mainprojectIndex, subprojectIndex }, 
        });
        if(!subPj) {
            return res.status(400).json({ message: "서브프로젝트 정보를 찾을 수 없습니다." });
        }

        subPj.projectName = projectName;
        subPj.Leader = Leader;
        subPj.members = members;                   
        subPj.referrer = referrer;
        subPj.startDate = startDate;
        subPj.endDate = endDate;
        subPj.memo = memo;
        subPj.status = status;

        await subPj.save();
        
        res.status(200).json({message:"서브프로젝트 일정 수정을 완료했습니다.", subPj});   
        }catch(error){
        console.error("서브프로젝트 일정을 수정하는 중에 오류가 발생했습니다.:", error);
        res.status(500).json({ message: "서브프로젝트 일정 수정에 실패했습니다." });
        }
      }

      //메인프로젝트 수정
      if(!subprojectIndex){
        try{
            const mainPj = await project.findOne({
                where: { mainprojectIndex }, 
        });
        if(!mainPj) {
            return res.status(404).json({ message: "메인프로젝트 정보를 찾을 수 없습니다." });
        }
        if (projectName !== undefined) mainPj.projectName = projectName;
        if (Leader !== undefined) mainPj.Leader = Leader;
        if (members !== undefined) mainPj.members = members;                   
        if (referrer !== undefined) mainPj.referrer = referrer;
        if (startDate !== undefined) mainPj.startDate = startDate;
        if (endDate !== undefined) mainPj.endDate = endDate;
        if (memo !== undefined) mainPj.memo = memo;
        if (status !== undefined) mainPj.status = status;
        mainPj.pinned = pinned;
        await mainPj.save();
        
        res.status(200).json({message:"메인프로젝트 일정 수정을 완료했습니다.", mainPj});   
        }catch(error){
        console.error("메인프로젝트 일정을 수정하는 중에 오류가 발생했습니다.:", error);
        res.status(500).json({ message: "메인프로젝트 일정 수정에 실패했습니다." });
        }
      }
    };

        //프로젝트 일정 삭제하기
        const deleteProject = async (req, res) =>{
            const { mainprojectIndex, subprojectIndex}  = req.params

            console.log("요청 파라미터(main):", req.params.mainprojectIndex);
            console.log("요청 파라미터(sub):", req.params.mainprojectIndex);

            //메인프로젝트 삭제 
            if(!subprojectIndex){
            try{
                const deletedMainProject = await project.findByPk(mainprojectIndex);

                if(!deletedMainProject) {
                return res.status(404).json({ error: "메인 프로젝트 정보를 찾을 수 없습니다." });
                }
                await deletedMainProject.destroy();
                res.status(200).json({ message: "메인 프로젝트 일정이 성공적으로 삭제되었습니다." });
            }catch(error){
            console.error("메인 프로젝트 삭제 중 오류 발생:", error);
            res.status(500).json({ error: "메인 프로젝트 삭제에 실패했습니다." });
            }
          }

          //서브프로젝트 삭제 
          if(subprojectIndex){
            try{
                const deletedSubProject = await subproject.findByPk(subprojectIndex);

                if(!deletedSubProject) {
                return res.status(404).json({ error: "서브 프로젝트 정보를 찾을 수 없습니다." });
                }
                await deletedSubProject.destroy();
                res.status(200).json({ message: "서브 프로젝트 일정이 성공적으로 삭제되었습니다." });
            }catch(error){
            console.error("서브 프로젝트 삭제 중 오류 발생:", error);
            res.status(500).json({ error: "서브 프로젝트 삭제에 실패했습니다." });
            }
          }
        };

        module.exports = {
            addProject,
            getAllProject,
            editProject,
            deleteProject,
        }
