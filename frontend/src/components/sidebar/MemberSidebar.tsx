import "./Sidebar.scss";
import React, { useState } from "react";
import {
  MenuArrow_down,
  UserIcon_dark,
} from "../../assets/images/index";
import { userState } from '../../recoil/atoms';
import { useRecoilState } from 'recoil';

type Member = [string, string, string, string, string, string, string[]]; // 멤버 배열의 타입

interface Props {
  onClickMember: (name: string, dept: string, team: string, position: string) => void;
}

const MemberSidebar: React.FC<Props> = ({onClickMember}) => {
  const user = useRecoilState(userState);
  const [clickedMember, setClickedMember] = useState<Member | null>(null); // 클릭된 멤버 상태 추가
  const members: Member[] = [
    ['id1', 'pw1', '이정훈', '포체인스 주식회사', '', '대표', ['본사', 'R&D']],
    ['id2', 'pw2', '안후상', '포체인스 주식회사', '', '이사', ['본사', 'R&D']],
    ['id3', 'pw3', '이정열', '관리부', '', '부서장', ['본사']],
    ['id4', 'pw4', '김효은', '관리부', '관리팀', '팀장', ['본사']],
    ['id5', 'pw5', '우현지', '관리부', '관리팀', '사원', ['본사']],
    ['id6', 'pw6', '염승희', '관리부', '관리팀', '사원', ['본사']],
    ['id7', 'pw7', '김태희', '관리부', '지원팀', '팀장', ['본사']],
    ['id7', 'pw7', '이주범', '관리부', '지원팀', '사원', ['본사']],
    ['id8', 'pw8', '진유빈', '개발부', '', '부서장', ['본사']],
    ['id9', 'pw9', '장현지', '개발부', '개발 1팀', '사원', ['본사']],
    ['id10', 'pw10', '권채림', '개발부', '개발 1팀', '사원', ['본사']],
    ['id11', 'pw11', '구민석', '개발부', '개발 1팀', '사원', ['본사']],
    ['id12', 'pw12', '변도일', '개발부', '개발 2팀', '팀장', ['본사']],
    ['id13', 'pw13', '이로운', '개발부', '개발 2팀', '사원', ['본사']],
    ['id14', 'pw14', '권상원', '블록체인 사업부', '', '부서장', ['본사']],
    ['id15', 'pw15', '권준우', '블록체인 사업부', '블록체인 1팀', '사원', ['본사']],
    ['id16', 'pw16', '김도환', '블록체인 사업부', '블록체인 1팀', '사원', ['본사']],
    ['id17', 'pw17', '김현지', '마케팅부', '', '부서장', ['본사']],
    ['id18', 'pw18', '전아름', '마케팅부', '기획팀', '팀장', ['본사']],
    ['id19', 'pw19', '함다슬', '마케팅부', '기획팀', '사원', ['본사']],
    ['id19', 'pw19', '전규미', '마케팅부', '기획팀', '사원', ['본사']],
    ['id20', 'pw20', '서주희', '마케팅부', '디자인팀', '사원', ['본사']],
    ['id21', 'pw21', '이유정', '연구 총괄', '', '센터장', ['R&D']],
    ['id22', 'pw22', '심민지', '알고리즘 연구실', '', '연구실장', ['R&D']],
    ['id23', 'pw23', '윤민지', '동형분석 연구실', '', '연구실장', ['R&D']],
  ];

  const [expandedTeams, setExpandedTeams] = useState<string[]>([]); // 확장된 팀의 배열

  const getFilteredMembers = () => {
    if (user[0].position === '대표' || user[0].position === '이사') {
      return members;
    } else {
      if (user[0].company === '본사') {
        return members.filter(member => member[6].includes('본사'));
      } else if (user[0].company === 'R&D') {
        return members.filter(member =>member[6].includes('R&D'));
      } else {
        return members;
      }
    } 
  };
  // 부서별로 팀을 묶어주는 함수
  const renderDepartmentsWithTeams = () => {
    const filteredMembers = getFilteredMembers();
    const departments: { [key: string]: { [key: string]: { name: string, position: string }[] } } = {};
  
    // 부서별 팀을 분류
    filteredMembers.forEach((member) => {
      const name = member[2]; // 이름
      const dept = member[3]; // 부서
      const team = member[4]; // 팀
      const position = member[5]; // 직위
  
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
                        <li 
                          key={index}
                          className={`name ${clickedMember && clickedMember[0] === name ? 'clicked' : ''}`}
                          onClick={() => handleMemberClick(name, dept, team, position)}
                        >
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
                      <li 
                        key={index} 
                        className={`name ${clickedMember && clickedMember[0] === name ? 'clicked' : ''}`}
                        onClick={() => handleMemberClick(name, dept, team, position)}
                      >
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
    setClickedMember([name, dept, team, position, '', '', []]);

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
