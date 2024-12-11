import "./Sidebar.scss";
import React, { useState } from "react";
import { MenuArrow_down, MenuArrow_Up } from "../../assets/images/index";

type Member = [string, string, string, string, string]; // 멤버 배열의 타입

interface Props {
  members: Member[]; // members prop의 타입
  onClickMember: (
    name: string,
    dept: string,
    team: string,
    position: string,
    assignPosition: string
  ) => void;
}

const HrSidebar: React.FC<Props> = ({ members, onClickMember }) => {
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]); // 확장된 팀의 배열

  // 부서별로 팀을 묶어주는 함수
  const renderDepartmentsWithTeams = () => {
    const departments: {
      [key: string]: {
        [key: string]: {
          name: string;
          position: string;
          assignPosition: string;
        }[];
      };
    } = {};

    // 부서별 팀을 분류
    members.forEach((member) => {
      const name = member[0]; // 이름
      const dept = member[1]; // 부서
      const team = member[2]; // 팀
      const position = member[3]; // 직위
      const assignPosition = member[4]; // 직책

      if (!departments[dept]) {
        departments[dept] = {}; // 새로운 부서인 경우 초기화
      }

      if (!departments[dept][team]) {
        departments[dept][team] = []; // 새로운 팀인 경우 초기화
      }

      departments[dept][team].push({ name, position, assignPosition }); // 이름과 직위 추가
    });

    // 각 부서별로 팀을 묶어서 출력
    return (
      <div className="hrsidebar">
        {Object.entries(departments).map(([dept, teams]) => (
          <div key={dept} className="department">
            <div className="department_name">{dept}</div>

            {Object.entries(teams).map(([team, members]) => (
              <div key={team}>
                {team ? ( // 팀 이름이 비어있지 않은 경우
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleTeam(team)}
                    className="team"
                  >
                    {team}
                    <img
                      src={
                        expandedTeams.includes(team)
                          ? MenuArrow_Up
                          : MenuArrow_down
                      }
                      alt="Arrow"
                    />
                  </div>
                ) : (
                  // 팀 이름이 비어있는 경우
                  <div className="placeholder">
                    <ul>
                      {members.map(
                        ({ name, position, assignPosition }, index) => (
                          <li
                            key={index}
                            className="name"
                            onClick={() =>
                              handleMemberClick(
                                name,
                                dept,
                                team,
                                position,
                                assignPosition
                              )
                            }
                          >
                            {dept === "포체인스 주식회사" ||
                            dept === "연구 총괄" ? (
                              <span className="name_text">{name}</span>
                            ) : (
                              <span className="name_text">{name}</span>
                            )}
                            <span className="position_text">{position}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {expandedTeams.includes(team) && (
                  <ul>
                    {members.map(
                      ({ name, position, assignPosition }, index) => (
                        <li
                          key={index}
                          className="name"
                          onClick={() =>
                            handleMemberClick(
                              name,
                              dept,
                              team,
                              position,
                              assignPosition
                            )
                          }
                        >
                          <span className="name_text">{name}</span>
                          <span className="position_text">{position}</span>
                        </li>
                      )
                    )}
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

  const handleMemberClick = (
    name: string,
    dept: string,
    team: string,
    position: string,
    assignPosition: string
  ) => {
    // 클릭된 멤버의 정보를 부모 컴포넌트로 전달
    onClickMember(name, dept, team, position, assignPosition);
  };

  return <div>{renderDepartmentsWithTeams()}</div>;
};

export default HrSidebar;
