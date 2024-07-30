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
        console.log("사람>>", sortedData);
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
      <img
        src={NewChatIcon}
        className="new-chat-button"
        alt="new-chat-button"
        onClick={() => {
          setOpenModal(true);
        }}
      />

      <CustomModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        header={"새 대화방 생성"}
        footer1={"확인"}
        footer1Class="back-green-btn"
        //onFooter1Click={handleSubmit}
        footer2={"취소"}
        footer2Class="gray-btn"
        onFooter2Click={() => setOpenModal(false)}
        width="400px"
        height="465px"
      >
        <div className="body-container">
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
                //\ onChange={handleUrlChange}
              />
            </div>
            <div className="WholeMemberCheckBoxCon">
              <img
                className="CheckBox"
                src={isWholeMemberChecked ? CheckBox_Active : CheckBox}
                alt="checkBoxIcon"
                onClick={() => setIsWholeMemeberChecked(!isWholeMemberChecked)}
              />
              전체 멤버
            </div>
          </div>
          <div className="PeopleSearchCon">
            <div className="LeftEmployCon">
              <div className="Department-Tab">
                <img src={DepartmentTabIcon} alt="DepartmentTabIcon" />
                마케팅부
                <div className="VerticalLine"></div>
              </div>

              <div className="PersonCon">
                <img
                  src={CheckBox}
                  className="PersonCheckBox"
                  alt="PersonCheckBox"
                />
                <img
                  src={UserIcon_dark}
                  className="ProfileIcon"
                  alt="usericondark"
                />
                <div className="PersonName">개발 1팀 테스트</div>
              </div>

              <div className="Team-Tab">
                <img
                  src={CheckBox}
                  className="TeamCheckBox"
                  alt="TeamCheckBox"
                />
                <div className="TeamName">기획팀</div>
              </div>
            </div>
            <div className="RightSelectedCon">사이트명</div>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default MessageSidebar;
