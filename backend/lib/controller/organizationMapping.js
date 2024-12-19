const models = require("../models");
const User = models.User;

const organizationMapping = {
    1: { department: "개발부",
         teams: [
            { id : 101 , name: "개발 1팀" },
            { id : 102 , name: "개발 2팀" },
         ] },
    2: { department: "관리부",
        teams: [
            { id : 201 , name: "관리팀" },
            { id : 202 , name: "지원팀" },
            { id : 203 , name: "시설팀" },
        ] },
    3: { department: "마케팅부",
        teams: [
            { id : 301 , name: "디자인팀"},
            { id : 302 , name: "기획팀" },
        ] },
    4: { department: "알고리즘 연구실",
        teams: [
            { id: 401 , name: "암호 연구팀" },
            { id: 402 , name: "AI 연구팀" },
            { id: 403, name: "API 개발팀"},
            { id: 404, name: "크립토 블록체인 연구팀" },
        ] },
    5: { department: "동형분석 연구실",
        teams: [
            { id: 501 , name: "동형분석 연구팀" },
        ] },
    6: { department: "블록체인 연구실",
        teams: [
            //{ id: 601 , name: "크립토 블록체인 연구팀" },
            // { id: 602 , name: "API 개발팀"}  *************** 알고리즘 연구실 하위팀으로 설정되어있습니다 ***************
        ] },
    };

    //사용자의 문서 결재 시 사용되는 명칭을 할당하는 함수
    async function assignMapping( { company,department, team, position, spot} ) {
        if( spot === "사원" ){
            return "작성자";
        }

        switch(position) {
            case "대표이사":
                return "대표이사";
            case "이사":
                return "이사";
            case "센터장":
                return "센터장";
            case "부서장":
                return company === "본사"? `${department}서장`: "부서장"; 
            case "연구실장":
                return company === "R&D"? `${department}장` : "연구실장"
            case "팀장":
                return team.includes("개발")? "개발팀장" : `${team}장`;
            default:
                return "작성자";
        }
  };

  //문서결재 시 명칭을 업데이트 하는 함수
  async function updateAssignInfo({ userID }){
     const userInfo = await User.findOne ({
        where : { userId: userID },
        attributes: [
            "company", "department","team","position","spot"
        ]
     });
     const updateAssignPosition = await assignMapping(userInfo);

     //문서결재 명칭 업데이트 
     const updateUserInfo = await User.update(
        {assignPosition : updateAssignPosition },
        { where: { userId: userID }},
     );

     //추후 삭제 예정 
     const updatedUser = await User.findOne({
        where: { userId: userID },
        attributes: ["assignPosition"],
      });
        
      return updatedUser.assignPosition;

  };



    
    module.exports ={
        organizationMapping,
        assignMapping,
        updateAssignInfo
    };