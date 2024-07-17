const models = require("../../models");
const project = models.Project;

//프로젝트 일정 추가 
const addProject = async (req, res) => {
    const{
        userID,
        projectindex,
        projectName,
        subprojectName,
        Leader,
        members,
        referrer,
        startDate,
        endDate,
        memo,
        state,
    } = req.body;

    console.log("요청 본문 받음:", req.body);

    try{
        const newProject = await project.create({
            userId: userID,
            projectIndex: projectindex,
            projectName,
            subprojectName,
            Leader,
            members,
            referrer,
            startDate,
            endDate,
            memo,
            state,
        })
        req.status(201).json(newProject);
    }catch(error) {
        console.log("프로젝트 일정 추가 중 오류가 발생했습니다.:", error);
        req.status(500).json({message: "프로젝트 일정 추가에 실패했습니다." });
    }
};

    //프로젝트 일정 조회
    const getAllProject = async (req, res) => {
        try{
            const projects  = await project.findAll();
            res.status(200).json(projects);
        }catch(error) {
            console.error("프로젝트 일정을 가져오는 중에 오류가 발생했습니다.:", error);
            res.status(500).json({message: "프로젝트 일정 불러오기에 실패했습니다." });
        }
    };

    //프로젝트 일정 수정하기 ( 작성자 , 팀리더만 가능 )
const editProject = async (req, res) => {
    const {
        userID,
        Leader,
        projectName,
        subprojectName,
        members,
        referrer,
        startDate,
        endDate,
        memo,
        state 
    } = req.body.data;
    const { projectindex: projectIndex } = req.params;

    console.log("요청 파라미터:", req.params);
    console.log("요청 본문:", req.body);

    if(!projectIndex) {
        return res
        .status(400)
        .json({ message: "프로젝트 식별번호가 제공되지 않았습니다. "});
    }
    try{
        const pj = await project.findOne({
            where: { projectIndex: projectIndex }, 
    });
    if(!pj) {
        return res
        .status(404)
        .json({ message: "프로젝트 정보를 찾을 수 없습니다." });
    }
    if(pj.Leader !== Leader && pj.userID !== userID) {
        return res
        .status(403)
        .json({ message: "해당 프로젝트 수정 권한이 없습니다." });
    }
    pj.projectName = projectName;
    pj.subprojectName = subprojectName;
    pj.members = members;
    pj.referrer = referrer;
    pj.startDate = startDate;
    pj.endDate = endDate;
    pj.memo = memo;
    pj.state = state;

    await pj.save();
    
    res.status(200).json(pj);   
    }catch(error){
     console.error("프로젝트 일정을 수정하는 중에 오류가 발생했습니다.:", error);
     res.status(500).json({ message: "프로젝트 일정 수정에 실패했습니다." });
    }
};

    //프로젝트 일정 삭제하기
    const deleteProject = async (req, res) =>{
        const projectIndex = req.params.projectindex;
        try{
            const deletedProject = await project.findByPk(projectIndex);

            if(!deletedProject) {
             return res.status(404).json({ error: "프로젝트 정보를 찾을 수 없습니다." });
            }
            if(deletedProject.Leader !== Leader && deletedProject.userID !== userID) {
                return res
                .status(403)
                .json({ message: "해당 프로젝트 삭제 권한이 없습니다." });
            }
        }catch(error){
        console.error("프로젝트 삭제 중 오류 발생:", error);
        res.status(500).json({ error: "프로젝트 삭제에 실패했습니다." });
        }
    };

    module.exports = {
        addProject,
        getAllProject,
        editProject,
        deleteProject,
    }