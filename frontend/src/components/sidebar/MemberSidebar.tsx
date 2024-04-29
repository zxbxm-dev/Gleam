import "./Sidebar.scss";
import React, { useState } from "react";
import {
  MenuArrow_down,
  UserIcon_dark,
} from "../../assets/images/index";

type Member = [string, string, string, string]; // 멤버 배열의 타입

interface Props {
  onClickMember: (name: string, dept: string, team: string, position: string) => void;
}

const MemberSidebar: React.FC<Props> = ({onClickMember}) => {
  const members: Member[] = [
    ['이정훈', '포체인스 주식회사', '', '대표'],
    ['안후상', '포체인스 주식회사', '', '이사'],
    ['이정열', '관리부', '', '부서장'],
    ['김효은', '관리부', '관리팀', '팀장'],
    ['우현지', '관리부', '관리팀', '사원'],
    ['염승희', '관리부', '관리팀', '사원'],
    ['김태희', '관리부', '지원팀', '팀장'],
    ['진유빈', '개발부', '', '부서장'],
    ['장현지', '개발부', '개발 1팀', '사원'],
    ['권채림', '개발부', '개발 1팀', '사원'],
    ['구민석', '개발부', '개발 1팀', '사원'],
    ['변도일', '개발부', '개발 2팀', '팀장'],
    ['이로운', '개발부', '개발 2팀', '사원'],
    ['권상원', '블록체인 사업부', '', '부서장'],
    ['권준우', '블록체인 사업부', '블록체인 1팀', '사원'],
    ['김도환', '블록체인 사업부', '블록체인 1팀', '사원'],
    ['김현지', '마케팅부', '', '부서장'],
    ['전아름', '마케팅부', '기획팀', '팀장'],
    ['홍다슬', '마케팅부', '기획팀', '사원'],
    ['서주희', '마케팅부', '디자인팀', '사원'],
  ];

  const [expandedTeams, setExpandedTeams] = useState<string[]>([]); // 확장된 팀의 배열

  // 부서별로 팀을 묶어주는 함수
  const renderDepartmentsWithTeams = () => {
    const departments: { [key: string]: { [key: string]: { name: string, position: string }[] } } = {};
  
    // 부서별 팀을 분류
    members.forEach((member) => {
      const name = member[0]; // 이름
      const dept = member[1]; // 부서
      const team = member[2]; // 팀
      const position = member[3]; // 직위
  
      if (!departments[dept]) {
        departments[dept] = {}; // 새로운 부서인 경우 초기화
      }
  
      if (!departments[dept][team]) {
        departments[dept][team] = []; // 새로운 팀인 경우 초기화
      }
  
      departments[dept][team].push({name, position}); // 이름과 직위 추가
    });
  
    // 각 부서별로 팀을 묶어서 출력
    return (
      <div className="memberSidebar">
        {Object.entries(departments).map(([dept, teams]) => (
          <div key={dept} className="department">
            <span className="department_name">{dept}</span>
            
            {Object.entries(teams).map(([team, members]) => (
              <div key={team}>
                {team ? ( // 팀 이름이 비어있지 않은 경우
                  <div style={{ cursor: "pointer" }} onClick={() => toggleTeam(team)} className="team">
                    <img src={MenuArrow_down} alt="MenuArrow" />
                    {team}
                  </div>
                ) : ( // 팀 이름이 비어있는 경우
                  <div className="team-placeholder">
                    <ul>
                      {members.map(({ name, position }, index) => (
                        <li key={index} className="name" onClick={() => handleMemberClick(name, dept, team, position)}>
                          <img src={UserIcon_dark} alt="UserIcon_dark" className="name_img"/>
                          <span className="name_text">{name}</span>
                          <div className="name_border"></div>
                          <span className="name_text">{position}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {expandedTeams.includes(team) && (
                  <ul>
                    {members.map(({ name, position }, index) => (
                      <li key={index} className="name" onClick={() => handleMemberClick(name, dept, team, position)}>
                        <img src={UserIcon_dark} alt="UserIcon_dark" className="name_img"/>
                        <span className="name_text">{name}</span>
                        <div className="name_border"></div>
                        <span className="name_text">{position}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  

  // 팀의 확장 여부를 토글하는 함수
  const toggleTeam = (team: string) => {
    if (expandedTeams.includes(team)) {
      // 이미 확장된 경우, 확장 배열에서 제거하여 접기
      setExpandedTeams(expandedTeams.filter((t) => t !== team));
    } else {
      // 아직 확장되지 않은 경우, 확장 배열에 추가하여 확장
      setExpandedTeams([...expandedTeams, team]);
    }
  };

  const handleMemberClick = (name: string, dept: string, team: string, position: string) => {
    // 클릭된 멤버의 정보를 부모 컴포넌트로 전달
    onClickMember(name, dept, team, position);
  };
  

  return (
    <div>
      {renderDepartmentsWithTeams()}
    </div>
  );
};

export default MemberSidebar;
