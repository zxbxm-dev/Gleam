import React, { useState, useEffect, useRef } from "react";
import { Person } from "../MemberSidebar";
import {
  UserIcon_dark,
  MessageArrow_down,
  MessageArrow_right,
  MessageMe
} from "../../../assets/images/index";
import { selectedRoomIdState, userState, selectUserID } from "../../../recoil/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { ChatRoom } from "./ChatTab";
import io, { Socket } from 'socket.io-client';

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
  const [selectedUserIdstate, setSelectedUserIdstate] = useRecoilState(selectUserID);
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useRecoilState(selectedRoomIdState);
  const user = useRecoilValue(userState);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedUserId) {
      const matchingRoom = chatRooms.find(room => room.hostUserId === selectedUserId);

      if (matchingRoom) {
        console.log(`match ID : ${selectedUserId}`);
        console.log(`roomID값 : ${matchingRoom.roomId}`);
        setSelectedRoomId({
          roomId: Number(matchingRoom.roomId),
          isGroup: matchingRoom.isGroup
        });
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


  const RndDepartmentTeams: { [key: string]: string[] } = {
    "알고리즘 연구실": ["암호 연구팀", "AI 연구팀"],
    "동형분석 연구실": ["동형분석 연구팀"],
    "블록체인 연구실": ["크립토 블록체인 연구팀", "API 개발팀"],
  };

  const rndResearchLabs: { [key: string]: string[] } = {
    "알고리즘 연구실": ["암호 연구팀", "AI 연구팀"],
    "동형분석 연구실": ["동형분석 연구팀"],
    "블록체인 연구실": ["크립토 블록체인 연구팀", "API 개발팀"],
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
                setSelectedUserIdstate({ userID: person.userId });
                setSelectedRoomId({
                  roomId: -1,
                  isGroup: false
                });
              }}
            >
              <div className="No-Left">
                <div
                  className="Border"
                // style={{ border: "2px solid red" }}
                >
                  <img
                    src={person.attachment ? person.attachment : UserIcon_dark}
                    alt={`${person.username}`}
                  />
                </div>
                {person.username} &nbsp;|&nbsp; {person.position}
                {user.userID === person.userId &&
                  <img className="Message-Me" src={MessageMe} alt="Message Me" />
                }
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
                <img src={MessageArrow_down} alt="down" />
              ) : (
                <img src={MessageArrow_right} alt="right" />
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
                              setSelectedUserIdstate({ userID: person.userId });
                              setSelectedRoomId({
                                roomId: -1,
                                isGroup: false
                              });
                            }}
                          >
                            <div className="No-Left">
                              <div
                                className="Border"
                              // style={{ border: "2px solid red" }}
                              >
                                <img
                                  src={person.attachment ? person.attachment : UserIcon_dark}
                                  alt={`${person.username}`}
                                />
                              </div>
                              {person.username} &nbsp;|&nbsp; {person.position}
                              {user.userID === person.userId &&
                                <img className="Message-Me" src={MessageMe} alt="Message Me" />
                              }
                            </div>
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
                        <img src={MessageArrow_down} alt="down" />
                      ) : (
                        <img src={MessageArrow_right} alt="right" />
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
                                  setSelectedUserIdstate({ userID: person.userId });
                                  setSelectedRoomId({
                                    roomId: -1,
                                    isGroup: false
                                  });
                                }}
                              >
                                <div className="No-Left">
                                  <div
                                    className="Border"
                                  // style={{ border: "2px solid red" }}
                                  >
                                    <img
                                      src={person.attachment ? person.attachment : UserIcon_dark}
                                      alt={`${person.username}`}
                                    />
                                  </div>
                                  {person.username} &nbsp;|&nbsp; {person.position}
                                  {user.userID === person.userId &&
                                    <img className="Message-Me" src={MessageMe} alt="Message Me" />
                                  }
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

        <li className="DeptTeams" key="R&D">
          <button
            className="downBtn"
            onClick={() => toggleDepartmentExpansion("R&D")}
          >
            {expandedDepartments["R&D"] ? (
              <img src={MessageArrow_down} alt="down" />
            ) : (
              <img src={MessageArrow_right} alt="right" />
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
                      setSelectedUserIdstate({ userID: person.userId });
                      setSelectedRoomId({
                        roomId: -1,
                        isGroup: false
                      });
                    }}
                  >
                    <div className="No-Left">
                      <div className="Border">
                        <img
                          src={person.attachment ? person.attachment : UserIcon_dark}
                          alt={person.username}
                        />
                      </div>
                      {person.username} &nbsp;|&nbsp; {person.position}
                      {user.userID === person.userId && (
                        <img className="Message-Me" src={MessageMe} alt="Message Me" />
                      )}
                    </div>
                  </li>
                ))}

              {Object.keys(rndResearchLabs).map((department) => (
                <li className="DeptTeams" key={department}>
                  <button
                    className="downTeamBtn"
                    onClick={() => toggleTeamExpansion(department)}
                  >
                    {expandedTeams[department] ? (
                      <img src={MessageArrow_down} alt="down" />
                    ) : (
                      <img src={MessageArrow_right} alt="right" />
                    )}{" "}
                    {department}
                  </button>
                  {expandedTeams[department] && (
                    <ul className="DeptDown">
                      {rndResearchLabs[department] && (
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
                                    setSelectedUserIdstate({ userID: person.userId });
                                    setSelectedRoomId({
                                      roomId: -1,
                                      isGroup: false
                                    });
                                  }}
                                >
                                  <div className="No-Left">
                                    <div
                                      className="Border"
                                    // style={{ border: "2px solid red" }}
                                    >
                                      <img
                                        src={person.attachment ? person.attachment : UserIcon_dark}
                                        alt={`${person.username}`}
                                      />
                                    </div>
                                    {person.username} &nbsp;|&nbsp; {person.position}
                                    {user.userID === person.userId &&
                                      <img className="Message-Me" src={MessageMe} alt="Message Me" />
                                    }
                                  </div>
                                </li>
                              )
                          )}
                        </ul>
                      )}
                      {rndResearchLabs[department]?.map((team) => (
                        <li key={team}>
                          <button
                            className="downTeamBtn"
                            onClick={() => toggleTeamExpansion(team)}
                          >
                            {expandedTeams[team] ? (
                              <img src={MessageArrow_down} alt="down" />
                            ) : (
                              <img src={MessageArrow_right} alt="right" />
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
                                        setSelectedUserIdstate({ userID: person.userId });
                                        setSelectedRoomId({
                                          roomId: -1,
                                          isGroup: false
                                        });
                                      }}
                                    >
                                      <div className="No-Left">
                                        <div
                                          className="Border"
                                        // style={{ border: "2px solid red" }}
                                        >
                                          <img
                                            src={person.attachment ? person.attachment : UserIcon_dark}
                                            alt={`${person.username}`}
                                          />
                                        </div>
                                        {person.username} &nbsp;|&nbsp; {person.position}
                                        {user.userID === person.userId &&
                                          <img className="Message-Me" src={MessageMe} alt="Message Me" />
                                        }
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
          )}
        </li>
      </ul>

    </div>
  );
};

export default PersonDataTab;
