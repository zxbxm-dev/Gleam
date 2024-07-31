import React, { useState, useEffect } from "react";
import { PersonData } from "../../../services/person/PersonServices";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState, selectedPersonState } from "../../../recoil/atoms";
import {
  ChatTab,
  PersonTab,
  NewChatIcon,
  SearchIcon,
  CheckBox,
  CheckBox_Active,
  DepartmentTabIcon,
  UserIcon_dark,
  XIcon,
} from "../../../assets/images/index";
import PersonDataTab from "./PersonSide";
import ChatDataTab from "./ChatTab";
import CustomModal from "../../modal/CustomModal";

export interface Person {
  userId: string;
  username: string;
  position: string;
  department: string;
  team: string;
  phoneNumber?: string;
  usermail?: string;
  entering: Date;
  attachment: string;
}

interface User {
  userId: string;
  username: string;
  position: string;
  department: string;
  team: string;
  phoneNumber?: string;
  usermail?: string;
  entering: Date;
  attachment: string;
}

const MessageSidebar: React.FC = () => {
  const [personData, setPersonData] = useState<Person[] | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [expandedDepartments, setExpandedDepartments] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedTeams, setExpandedTeams] = useState<{
    [key: string]: boolean;
  }>({});
  const [activeTab, setActiveTab] = useState("personData");
  const [dummyData, setDummyData] = useState<any[]>([]);
  const [isWholeMemberChecked, setIsWholeMemeberChecked] =
    useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const user: User = useRecoilValue(userState) as User;
  const setSelectedPerson = useSetRecoilState(selectedPersonState);

  const [newChatChosenUsers, setNewChatChosenUsers] = useState<Person[] | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PersonData();
        const sortedData = response.data.sort(
          (a: Person, b: Person) =>
            new Date(a.entering).getTime() - new Date(b.entering).getTime()
        );
        setPersonData(sortedData);
        console.log("사람>>", sortedData);
      } catch (err) {
        console.error("Error fetching person data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("현재 인원>>", newChatChosenUsers);
  }, [newChatChosenUsers]);

  const toggleDepartmentExpansion = (departmentName: string) => {
    setExpandedDepartments((prevExpandedDepartments) => ({
      ...prevExpandedDepartments,
      [departmentName]: !prevExpandedDepartments[departmentName],
    }));
  };

  const toggleTeamExpansion = (teamName: string) => {
    setExpandedTeams((prevExpandedTeams) => ({
      ...prevExpandedTeams,
      [teamName]: !prevExpandedTeams[teamName],
    }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    if (tab === "ChatData") {
      setDummyData([
        {
          userId: "dummy1",
          username: "진유빈",
          department: "개발부",
          team: "",
          position: "팀장",
          entering: new Date(),
          attachment: "",
          isGroupChat: false,
        },
        {
          userId: "dummy2",
          username: "구민석",
          department: "개발부",
          team: "개발 1팀",
          position: "팀장",
          entering: new Date(),
          attachment: "",
          isGroupChat: false,
        },
        {
          userId: "dummy3",
          username: "글림",
          department: "",
          team: "",
          entering: new Date(),
          attachment: "",
          isGroupChat: true,
          participants: [
            {
              userId: "dummy4",
              username: "김효은",
              department: "관리부",
              team: "관리팀",
              position: "팀장",
              entering: new Date(),
              attachment: "",
            },
            {
              userId: "dummy5",
              username: "장현지",
              department: "개발부",
              team: "개발 1팀",
              position: "팀장",
              entering: new Date(),
              attachment: "",
            },
          ],
        },
        {
          userId: "dummy4",
          username: "전아름",
          department: "마케팅부",
          team: "기획팀",
          position: "팀장",
          entering: new Date(),
          attachment: "",
          isGroupChat: false,
        },
      ]);
    } else {
      setDummyData([]);
    }
  };

  const handlePersonClick = (
    username: string,
    team: string,
    department: string,
    position: string
  ) => {
    setSelectedPerson({ username, team, department, position });
  };

  const groupByDepartmentAndTeam = (data: Person[]) => {
    const grouped: { [department: string]: { [team: string]: Person[] } } = {};

    data.forEach((person) => {
      if (!grouped[person.department]) {
        grouped[person.department] = {};
      }
      if (!grouped[person.department][person.team]) {
        grouped[person.department][person.team] = [];
      }
      grouped[person.department][person.team].push(person);
    });

    return grouped;
  };

  const groupedData = personData ? groupByDepartmentAndTeam(personData) : {};

  const filterDataBySearchQuery = (data: {
    [department: string]: { [team: string]: Person[] };
  }) => {
    if (!searchQuery) return data;
    const filtered: { [department: string]: { [team: string]: Person[] } } = {};

    Object.keys(data).forEach((departmentName) => {
      Object.keys(data[departmentName]).forEach((teamName) => {
        const filteredPersons = data[departmentName][teamName].filter(
          (person) =>
            person.username.includes(searchQuery) ||
            person.department.includes(searchQuery) ||
            person.team.includes(searchQuery)
        );
        if (filteredPersons.length > 0) {
          if (!filtered[departmentName]) {
            filtered[departmentName] = {};
          }
          filtered[departmentName][teamName] = filteredPersons;
        }
      });
    });

    return filtered;
  };

  const filteredData = filterDataBySearchQuery(groupedData);
  console.log("filteredData", filteredData);

  return (
    <div className="message-sidebar">
      <div className="tab-container">
        <div
          className={`tab-button ${activeTab === "personData" ? "active" : ""}`}
          onClick={() => handleTabChange("personData")}
        >
          <img src={PersonTab} />
        </div>

        <div
          className={`tab-button ${activeTab === "ChatData" ? "active" : ""}`}
          onClick={() => handleTabChange("ChatData")}
        >
          <img src={ChatTab} />
        </div>
      </div>
      {activeTab === "personData" && personData ? (
        <PersonDataTab
          personData={personData}
          expandedDepartments={expandedDepartments}
          expandedTeams={expandedTeams}
          toggleDepartmentExpansion={toggleDepartmentExpansion}
          toggleTeamExpansion={toggleTeamExpansion}
          userAttachment={user.attachment}
          userTeam={user.team}
          userDepartment={user.department}
          userName={user.username}
          userPosition={user.position}
          onPersonClick={handlePersonClick}
        />
      ) : activeTab === "ChatData" ? (
        <ChatDataTab
          dummyData={dummyData}
          userAttachment={user.attachment}
          userTeam={user.team}
          userDepartment={user.department}
          userName={user.username}
          userPosition={user.position}
          onPersonClick={handlePersonClick}
        />
      ) : (
        <p>Loading...</p>
      )}
      <img
        src={NewChatIcon}
        className="new-chat-button"
        alt="new-chat-button"
        onClick={() => {
          setNewChatChosenUsers(null);
          setIsWholeMemeberChecked(false);
          setOpenModal(true);
        }}
      />

      <CustomModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        header={"새 대화방 생성"}
        headerTextColor="white"
        footer1={"확인"}
        footer1Class="back-green-btn"
        //onFooter1Click={handleSubmit}
        footer2={"취소"}
        footer2Class="gray-btn"
        onFooter2Click={() => setOpenModal(false)}
        width="400px"
        height="431px"
      >
        <div className="body-container New-Chat-Room-Body">
          <div className="New-Chat-Room">
            <input
              placeholder="(필수) 대화방 이름을 입력해주세요."
              className="TextInputCon"
              //onChange={handleTitleChange}
            />
          </div>
          <div className="New-Chat-Room">
            <div className="Right-Button-Con">
              <img src={SearchIcon} className="SearchIcon" alt="searchIcon" />
              <input
                placeholder="대화상대 검색"
                className="LeftTextInput"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="WholeMemberCheckBoxCon">
              <img
                className="CheckBox"
                src={isWholeMemberChecked ? CheckBox_Active : CheckBox}
                alt="checkBoxIcon"
                onClick={() => {
                  setIsWholeMemeberChecked(!isWholeMemberChecked);
                  newChatChosenUsers === personData
                    ? setNewChatChosenUsers(null)
                    : setNewChatChosenUsers(personData);
                }}
              />
              전체 멤버
            </div>
          </div>
          <div className="PeopleSearchCon">
            <div className="LeftEmployCon">
              {Object.keys(filteredData).map((departmentName) => (
                <div key={departmentName}>
                  {departmentName.trim() !== "" && (
                    <div className="Department-Tab">
                      <img src={DepartmentTabIcon} alt="DepartmentTabIcon" />
                      {departmentName}
                      <div className="VerticalLine"></div>
                    </div>
                  )}
                  {Object.keys(filteredData[departmentName]).map((teamName) => (
                    <div key={teamName}>
                      {teamName.trim() !== "" && (
                        <div className="Team-Tab">
                          <img
                            src={
                              filteredData[departmentName][teamName].every(
                                (person) => newChatChosenUsers?.includes(person)
                              )
                                ? CheckBox_Active
                                : CheckBox
                            }
                            className="TeamCheckBox"
                            alt="TeamCheckBox"
                            onClick={() => {
                              let allMembersSelected = filteredData[
                                departmentName
                              ][teamName].every((person) =>
                                newChatChosenUsers?.includes(person)
                              );
                              setNewChatChosenUsers((prevUsers) => {
                                if (prevUsers) {
                                  return allMembersSelected
                                    ? prevUsers.filter(
                                        (user) =>
                                          !filteredData[departmentName][
                                            teamName
                                          ].includes(user)
                                      )
                                    : [
                                        ...prevUsers,
                                        ...filteredData[departmentName][
                                          teamName
                                        ].filter(
                                          (person) =>
                                            !prevUsers.includes(person)
                                        ),
                                      ];
                                } else {
                                  return filteredData[departmentName][teamName];
                                }
                              });
                            }}
                          />
                          <div className="TeamName">{teamName}</div>
                        </div>
                      )}
                      {filteredData[departmentName][teamName].map((person) => (
                        <div className="PersonCon" key={person.userId}>
                          <img
                            src={
                              isWholeMemberChecked ||
                              newChatChosenUsers?.includes(person)
                                ? CheckBox_Active
                                : CheckBox
                            }
                            className="PersonCheckBox"
                            alt="PersonCheckBox"
                            onClick={() =>
                              setNewChatChosenUsers((prevUsers) =>
                                prevUsers
                                  ? prevUsers.includes(person)
                                    ? prevUsers.filter(
                                        (user) => user !== person
                                      )
                                    : [...prevUsers, person]
                                  : [person]
                              )
                            }
                          />
                          <img
                            src={
                              person.attachment
                                ? person.attachment
                                : UserIcon_dark
                            }
                            className="ProfileIcon"
                            alt="usericondark"
                          />
                          <div className="PersonName">
                            {person.team} {person.username}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="RightSelectedCon">
              <div className="RightTopText">
                선택인원{" "}
                <span>
                  ({newChatChosenUsers === null ? 0 : newChatChosenUsers.length}
                  명)
                </span>
              </div>

              <div className="ChosenPeople">
                {newChatChosenUsers?.map((person) => (
                  <div className="ChosenOne" key={person.userId}>
                    <img
                      src={XIcon}
                      onClick={() =>
                        setNewChatChosenUsers((prevUsers) =>
                          prevUsers !== null
                            ? prevUsers.filter((user) => user !== person)
                            : []
                        )
                      }
                    />

                    <div>
                      {person.team} {person.username}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default MessageSidebar;
