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
import {
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";

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
  };

  const RndDepartments = [
    "알고리즘 연구실",
    "동형분석 연구실",
    "블록체인 연구실",
  ];

  const RndDepartmentTeams: { [key: string]: string[] } = {
    "알고리즘 연구실": ["암호 연구팀", "AI 연구팀"],
    "동형분석 연구실": ["동형분석 연구팀"],
    "블록체인 연구실": ["크립토 블록체인 연구팀", "API 개발팀"],
  };

  return (
    <ul className="Sidebar-Ms">
      {/*
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
        */}

      {personData
        .filter((person) => !person.department && person.company !== "R&D")
        .map((person) => (
          <Popover placement="right" key={person.userId}>
            <li
              className={`No-dept ${
                selectedUserId === person.userId ? "selected" : ""
              }`}
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
              <PopoverTrigger>
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
              </PopoverTrigger>
              <Portal>
                <PopoverContent
                  className="PersonSide_popover"
                  _focus={{ boxShadow: "none" }}
                >
                  <div
                    ref={menuRef}
                    className={`Message-OnClick-Menu ${
                      activeMenuUserId === person.userId ? "active" : ""
                    }`}
                  >
                    대화 나가기
                  </div>
                </PopoverContent>
              </Portal>
            </li>
          </Popover>
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
              <img src={MenuArrow_right} alt="right" />
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
                            <Popover placement="right" key={person.userId}>
                              <li
                                className={`No-dept ${
                                  selectedUserId === person.userId
                                    ? "selected"
                                    : ""
                                }`}
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
                                  {person.username}
                                </div>
                                <PopoverTrigger>
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
                                </PopoverTrigger>
                                <Portal>
                                  <PopoverContent
                                    className="PersonSide_popover"
                                    _focus={{ boxShadow: "none" }}
                                  >
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
                                  </PopoverContent>
                                </Portal>
                              </li>
                            </Popover>
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

      <li className="DeptTeams" key="R&D">
        <button
          className="downBtn"
          onClick={() => toggleDepartmentExpansion("R&D")}
        >
          {expandedDepartments["R&D"] ? (
            <img src={MenuArrow_down} alt="down" />
          ) : (
            <img src={MenuArrow_right} alt="right" />
          )}{" "}
          R&D 센터
        </button>
        {expandedDepartments["R&D"] && (
          <ul className="DeptDown">
            {personData
              .filter(
                (person) => !person.department && person.company === "R&D"
              )
              .map((person) => (
                <Popover placement="right" key={person.userId}>
                  <li
                    className={`No-dept ${
                      selectedUserId === person.userId ? "selected" : ""
                    }`}
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
                          person.attachment ? person.attachment : UserIcon_dark
                        }
                        alt={`${person.username}`}
                      />
                      {person.username}
                    </div>
                    <PopoverTrigger>
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
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent
                        className="PersonSide_popover"
                        _focus={{ boxShadow: "none" }}
                      >
                        <div
                          ref={menuRef}
                          className={`Message-OnClick-Menu ${
                            activeMenuUserId === person.userId ? "active" : ""
                          }`}
                        >
                          대화 나가기
                        </div>
                      </PopoverContent>
                    </Portal>
                  </li>
                </Popover>
              ))}

            {RndDepartments.map((department) => (
              <li className="DeptTeams" key={department}>
                <button
                  className="downBtn"
                  onClick={() => toggleDepartmentExpansion(department)}
                >
                  {expandedDepartments[department] ? (
                    <img src={MenuArrow_down} alt="down" />
                  ) : (
                    <img src={MenuArrow_right} alt="right" />
                  )}{" "}
                  {department}
                </button>
                {expandedDepartments[department] && (
                  <ul className="DeptDown">
                    {RndDepartmentTeams[department].map((team) => (
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
                            {personData
                              .filter(
                                (person) =>
                                  person.department === department &&
                                  person.team === team
                              )
                              .map((person) => (
                                <Popover placement="right" key={person.userId}>
                                  <li
                                    className={`No-dept ${
                                      selectedUserId === person.userId
                                        ? "selected"
                                        : ""
                                    }`}
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
                                      {person.username}
                                    </div>
                                    <PopoverTrigger>
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
                                    </PopoverTrigger>
                                    <Portal>
                                      <PopoverContent
                                        className="PersonSide_popover"
                                        _focus={{ boxShadow: "none" }}
                                      >
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
                                      </PopoverContent>
                                    </Portal>
                                  </li>
                                </Popover>
                              ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    </ul>
  );
};

export default PersonDataTab;
