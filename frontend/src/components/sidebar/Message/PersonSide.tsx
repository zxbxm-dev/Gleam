import React from "react";
import { Person } from "./MessageSidebar";
import {
  MessageMe,
  MessageMenu,
  UserIcon_dark,
  MenuArrow_down,
  MenuArrow_right,
  NotiIcon,
} from "../../../assets/images/index";

interface PersonDataTabProps {
  personData: Person[] | null;
  expandedDepartments: { [key: string]: boolean };
  expandedTeams: { [key: string]: boolean };
  toggleDepartmentExpansion: (departmentName: string) => void;
  toggleTeamExpansion: (teamName: string) => void;
  userAttachment: string;
  userTeam: string | null;
  userDepartment: string | null;
  userName: string | null;
  userPosition: string | null;
  onPersonClick: (
    username: string,
    team: string,
    department: string,
    position: string
  ) => void;
}

const PersonDataTab: React.FC<PersonDataTabProps> = ({
  personData,
  expandedDepartments,
  expandedTeams,
  toggleDepartmentExpansion,
  toggleTeamExpansion,
  userAttachment,
  userTeam,
  userDepartment,
  userName,
  onPersonClick,
  userPosition,
}) => {
  if (!personData) {
    return <p>Loading...</p>;
  }

  const departmentTeams: {
    [key: string]: string[];
  } = {
    개발부: ["개발 1팀", "개발 2팀"],
    마케팅부: ["디자인팀", "기획팀"],
    관리부: ["관리팀", "지원팀", "시설팀"],
    "알고리즘 연구실": ["암호 연구팀", "AI 연구팀"],
    "동형분석 연구실": ["동형분석 연구팀"],
    "블록체인 연구실": ["크립토 블록체인 연구팀", "API 개발팀"],
  };

  return (
    <ul className="Sidebar-Ms">
      <li
        className="Noti-bar"
        // onClick={() =>
        //   onPersonClick(
        //     userName || "",
        //     userTeam || "",
        //     userDepartment || "",
        //     userPosition || ""
        //   )
        // }
      >
        <img className="My-attach" src={NotiIcon} />
        <div>Notification</div>
      </li>
      <li
        className="My-bar"
        onClick={() =>
          onPersonClick(
            userName || "",
            userTeam || "",
            userDepartment || "",
            userPosition || ""
          )
        }
      >
        <img className="My-attach" src={userAttachment} />
        <div>
          {userTeam ? `${userTeam}` : `${userDepartment}`} {userName}
        </div>
        <img className="Message-Me" src={MessageMe} />
      </li>
      {personData
        .filter((person) => !person.department)
        .map((person) => (
          <li
            className="No-dept"
            key={person.userId}
            onClick={() =>
              onPersonClick(
                person.username,
                person.team,
                person.department,
                person.position
              )
            }
          >
            <div className="No-Left">
              <img
                src={person.attachment ? person.attachment : UserIcon_dark}
                alt={`${person.username}`}
              />
              {person.username}
            </div>
            <img className="Message-Menu" src={MessageMenu} />
          </li>
        ))}
      {Object.keys(departmentTeams).map((department) => (
        <li className="DeptTeams" key={department}>
          <button
            className="downBtn"
            onClick={() => toggleDepartmentExpansion(department)}
          >
            {expandedDepartments[department] ? (
              <img src={MenuArrow_down} />
            ) : (
              <img src={MenuArrow_right} />
            )}{" "}
            {department}
          </button>
          {expandedDepartments[department] && (
            <ul className="DeptDown">
              {personData.map(
                (person) =>
                  person.department === department &&
                  person.team === "" && (
                    <li
                      className="No-dept"
                      key={person.userId}
                      onClick={() =>
                        onPersonClick(
                          person.username,
                          person.team,
                          person.department,
                          person.position
                        )
                      }
                    >
                      <div className="No-Left">
                        <img
                          src={
                            person.attachment
                              ? person.attachment
                              : UserIcon_dark
                          }
                          alt={`${person.username}`}
                        />
                        {person.team
                          ? `${person.team}`
                          : `${person.department}`}{" "}
                        {person.username}
                      </div>
                      <img className="Message-Menu" src={MessageMenu} />
                    </li>
                  )
              )}
              {departmentTeams[department].map((team) => (
                <li key={team}>
                  <button
                    className="downTeamBtn"
                    onClick={() => toggleTeamExpansion(team)}
                  >
                    {expandedTeams[team] ? (
                      <img src={MenuArrow_down} />
                    ) : (
                      <img src={MenuArrow_right} />
                    )}{" "}
                    {team}
                  </button>
                  {expandedTeams[team] && (
                    <ul>
                      {personData.map(
                        (person) =>
                          person.department === department &&
                          person.team === team && (
                            <li
                              className="No-dept"
                              key={person.userId}
                              onClick={() =>
                                onPersonClick(
                                  person.username,
                                  person.team,
                                  person.department,
                                  person.position
                                )
                              }
                            >
                              <div className="No-Left">
                                <img
                                  src={
                                    person.attachment
                                      ? person.attachment
                                      : UserIcon_dark
                                  }
                                  alt={`${person.username}`}
                                />
                                {person.team
                                  ? `${person.team}`
                                  : `${person.department}`}{" "}
                                {person.username}
                              </div>
                              <img className="Message-Menu" src={MessageMenu} />
                            </li>
                          )
                      )}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default PersonDataTab;
