import React, { useState, useEffect } from "react";
import { PersonData } from "../../../services/person/PersonServices";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState, selectedPersonState } from "../../../recoil/atoms";
import { ChatTab, PersonTab, NewChatIcon } from "../../../assets/images/index";
import PersonDataTab from "./PersonSide";
import ChatDataTab from "./ChatTab";

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
  const [expandedDepartments, setExpandedDepartments] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedTeams, setExpandedTeams] = useState<{
    [key: string]: boolean;
  }>({});
  const [activeTab, setActiveTab] = useState("personData");
  const [dummyData, setDummyData] = useState<any[]>([]);

  const user: User = useRecoilValue(userState) as User;
  const setSelectedPerson = useSetRecoilState(selectedPersonState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PersonData();
        const sortedData = response.data.sort(
          (a: Person, b: Person) =>
            new Date(a.entering).getTime() - new Date(b.entering).getTime()
        );
        setPersonData(sortedData);
      } catch (err) {
        console.error("Error fetching person data:", err);
      }
    };

    fetchData();
  }, []);

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
      <img src={NewChatIcon} className="new-chat-button" />
    </div>
  );
};

export default MessageSidebar;
