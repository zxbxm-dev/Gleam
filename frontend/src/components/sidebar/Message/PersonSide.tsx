import React, { useState, useEffect, useRef } from "react";
import { Person } from "./MessageSidebar";
import {
  MessageMenu,
  UserIcon_dark,
  MenuArrow_down,
  MenuArrow_right,
} from "../../../assets/images/index";
import { selectedRoomIdState, userState } from "../../../recoil/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { ChatRoom } from "./ChatTab";

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
    userId: string,
    username: string,
    team: string,
    department: string,
    position: string
  ) => void;
  borderColor: string;
  chatRooms: ChatRoom[];
}

const PersonDataTab: React.FC<PersonDataTabProps> = ({
  personData,
  expandedDepartments,
  expandedTeams,
  toggleDepartmentExpansion,
  toggleTeamExpansion,
  onPersonClick,
  borderColor,
  chatRooms
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ top: number, left: number } | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useRecoilState(selectedRoomIdState);
  const user = useRecoilValue(userState);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedUserId) {
      const matchingRoom = chatRooms.find(room => room.hostUserId === selectedUserId);

      if (matchingRoom) {
        console.log(`match ID : ${selectedUserId}`);
        console.log(`roomID값 : ${matchingRoom.roomId}`);
        setSelectedRoomId(Number(matchingRoom.roomId));
      }
    }
  }, [selectedUserId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setActiveMenuUserId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenuRef]);

  if (!personData) {
    return <p>Loading...</p>;
  }

  const departmentTeams: { [key: string]: string[] } = {
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

  const handleMenuClick = (event: React.MouseEvent, userId: string, listItem: HTMLLIElement) => {
    event.stopPropagation();
    const { offsetTop, offsetLeft, offsetHeight } = listItem;
    setActiveMenuUserId(userId);
    setContextMenuPosition({ top: offsetTop + offsetHeight, left: offsetLeft });
  };

  const handleLeaveChat = (userId: string) => {
    console.log(`Leave Chat for userId: ${userId}`);
    // Implement the functionality to leave the chat
    setActiveMenuUserId(null);
  };

  return (
    <div>
      <ul className="Sidebar-Ms">
        {personData
          .filter((person) => !person.department && person.company !== "R&D")
          .map((person) => (
            <li
              key={person.userId}
              className={`No-dept ${selectedUserId === person.userId ? "selected" : ""}`}
              onClick={() => {
                onPersonClick(
                  person.username,
                  person.team,
                  person.department,
                  person.position,
                  person.userId
                );
                setSelectedUserId(person.userId);
                setSelectedRoomId(-1);
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
                onClick={(e) => handleMenuClick(e, person.userId, e.currentTarget.closest('li')!)}
              />

{activeMenuUserId && contextMenuPosition && (
        <div
          className="context-menu"
          style={{ top: contextMenuPosition.top, left: contextMenuPosition.left }}
          ref={contextMenuRef}
        >
          <button onClick={() => handleLeaveChat(activeMenuUserId)}>Leave Chat {activeMenuUserId}</button>
        </div>
      )}
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
                <img src={MenuArrow_right} alt="right" />
              )}{" "}
              {department}
            </button>
            {expandedDepartments[department] && (
              <ul className="DeptDown">
                {expandedDepartments[department] && (
                  <ul>
                    {personData.map(
                      (person) =>
                        person.department === department &&
                        !(person.team) && (
                          <li
                            key={person.userId}
                            className={`No-dept ${selectedUserId === person.userId ? "selected" : ""}`}
                            onClick={() => {
                              onPersonClick(
                                person.username,
                                person.team,
                                person.department,
                                person.position,
                                person.userId
                              );
                              setSelectedUserId(person.userId);
                              setSelectedRoomId(-1);
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
                              onClick={(e) => handleMenuClick(e, person.userId, e.currentTarget.closest('li')!)}
                            />
                            {activeMenuUserId && contextMenuPosition && (
        <div
          className="context-menu"
          style={{ top: contextMenuPosition.top, left: contextMenuPosition.left }}
          ref={contextMenuRef}
        >
          <button onClick={() => handleLeaveChat(activeMenuUserId)}>Leave Chat {activeMenuUserId}</button>
        </div>
      )}
                          </li>
                        )
                    )}
                  </ul>
                )}
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
                                key={person.userId}
                                className={`No-dept ${selectedUserId === person.userId ? "selected" : ""}`}
                                onClick={() => {
                                  onPersonClick(
                                    person.username,
                                    person.team,
                                    person.department,
                                    person.position,
                                    person.userId
                                  );
                                  setSelectedUserId(person.userId);
                                  setSelectedRoomId(-1);
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
                                  onClick={(e) => handleMenuClick(e, person.userId, e.currentTarget.closest('li')!)}
                                />
                                {activeMenuUserId && contextMenuPosition && (
        <div
          className="context-menu"
          style={{ top: contextMenuPosition.top, left: contextMenuPosition.left }}
          ref={contextMenuRef}
        >
          <button onClick={() => handleLeaveChat(activeMenuUserId)}>Leave Chat {activeMenuUserId}</button>
        </div>
      )}
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
            R&D
          </button>
          {expandedDepartments["R&D"] && (
            <ul className="DeptDown">
              {personData
                .filter(
                  (person) => !person.department && person.company === "R&D"
                )
                .map((person) => (
                  <li
                    key={person.userId}
                    className={`No-dept ${selectedUserId === person.userId ? "selected" : ""}`}
                    onClick={() => {
                      onPersonClick(
                        person.username,
                        person.team,
                        person.department,
                        person.position,
                        person.userId
                      );
                      setSelectedUserId(person.userId);
                      setSelectedRoomId(-1);
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
                      onClick={(e) => handleMenuClick(e, person.userId, e.currentTarget.closest('li')!)}
                    />
                    {activeMenuUserId && contextMenuPosition && (
        <div
          className="context-menu"
          style={{ top: contextMenuPosition.top, left: contextMenuPosition.left }}
          ref={contextMenuRef}
        >
          <button onClick={() => handleLeaveChat(activeMenuUserId)}>Leave Chat {activeMenuUserId}</button>
        </div>
      )}
                  </li>
                ))}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default PersonDataTab;
