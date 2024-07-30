import React, { useState, useEffect, useRef } from "react";
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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);
  const [isNotibarActive, setIsNotibarActive] = useState<boolean | null>(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuUserId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  if (!personData) {
    return <p>Loading...</p>;
  }

  const departmentTeams: {
    [key: string]: string[];
  } = {
    개발부: ["개발 1팀", "개발 2팀"],
    마케팅부: ["디자인팀", "기획팀"],
    관리부: ["관리팀", "지원팀", "시설팀"],
    "R&D 센터": ["암호 연구팀", "동형분석 연구팀", "크립토 블록체인 연구팀"],
  };

  return (
    <ul className="Sidebar-Ms">
      <li
        className={`Noti-bar ${isNotibarActive ? "active" : ""}`}
        onClick={() => {
          onPersonClick("통합 알림", "", "", "");
          setSelectedUserId(null);
          setIsNotibarActive(true);
        }}
      >
        <img className="Noti-Icon" src={NotiIcon} alt="my-attach" />
        <div>통합 알림</div>
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
        <img className="My-attach" src={userAttachment} alt="my-attach" />
        <div>
          {userTeam ? `${userTeam}` : `${userDepartment}`} {userName}
        </div>
        <img className="Message-Me" src={MessageMe} alt="message-me" />
      </li>
      {personData
        .filter((person) => !person.department)
        .map((person) => (
          <li
            className={`No-dept ${
              selectedUserId === person.userId ? "selected" : ""
            }`}
            key={person.userId}
            onClick={() => {
              onPersonClick(
                person.username,
                person.team,
                person.department,
                person.position
              );
              setSelectedUserId(person.userId);
              setIsNotibarActive(false);
            }}
          >
            <div className="No-Left">
              <img
                src={person.attachment ? person.attachment : UserIcon_dark}
                alt={`${person.username}`}
              />
              {person.username}
            </div>
            <img
              className="Message-Menu"
              src={MessageMenu}
              alt="message-menu"
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenuUserId((prev) =>
                  prev === person.userId ? null : person.userId
                );
              }}
            />
            <div
              ref={menuRef}
              className={`Message-OnClick-Menu ${
                activeMenuUserId === person.userId ? "active" : ""
              }`}
            >
              대화 나가기
            </div>
          </li>
        ))}
      {Object.keys(departmentTeams).map((department) => (
        <li className="DeptTeams" key={department}>
          <button
            className="downBtn"
            onClick={() => toggleDepartmentExpansion(department)}
          >
            {expandedDepartments[department] ? (
              <img src={MenuArrow_down} alt="down" />
            ) : (
              <img src={MenuArrow_right} alt="up" />
            )}{" "}
            {department}
          </button>
          {expandedDepartments[department] && (
            <ul className="DeptDown">
              {departmentTeams[department].map((team) => (
                <li key={team}>
                  <button
                    className="downTeamBtn"
                    onClick={() => toggleTeamExpansion(team)}
                  >
                    {expandedTeams[team] ? (
                      <img src={MenuArrow_down} alt="down" />
                    ) : (
                      <img src={MenuArrow_right} alt="right" />
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
                              className={`No-dept ${
                                selectedUserId === person.userId
                                  ? "selected"
                                  : ""
                              }`}
                              key={person.userId}
                              onClick={() => {
                                onPersonClick(
                                  person.username,
                                  person.team,
                                  person.department,
                                  person.position
                                );
                                setSelectedUserId(person.userId);
                                setIsNotibarActive(false);
                              }}
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
                              <img
                                className="Message-Menu"
                                src={MessageMenu}
                                alt="message-menu"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuUserId((prev) =>
                                    prev === person.userId
                                      ? null
                                      : person.userId
                                  );
                                }}
                              />
                              <div
                                ref={menuRef}
                                className={`Message-OnClick-Menu ${
                                  activeMenuUserId === person.userId
                                    ? "active"
                                    : ""
                                }`}
                              >
                                대화 나가기
                              </div>
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
