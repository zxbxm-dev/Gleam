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

    module.exports ={
        organizationMapping,
    }