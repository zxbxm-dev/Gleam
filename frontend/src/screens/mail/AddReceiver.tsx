import React, { useState, useEffect, useRef } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { userState, NewChatModalstate } from "../../recoil/atoms";
import {
  SearchIcon,
  CheckBox,
  CheckBox_Active,
  DepartmentTabIcon,
  CheckBox_Not,
  UserIcon_dark,
  XIcon,
  MinusIcon
} from "../../assets/images/index";
import CustomModal from "../../components/modal/CustomModal";

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
  company: string;
}

interface NewChatModalProps {
  filteredData: {
    [company: string]: {
      [department: string]: {
        [team: string]: Person[];
      };
    };
  };
  onConfirm: (selectedUsers: Person[]) => void;
}

const AddReceiver: React.FC<NewChatModalProps> = ({
  filteredData, onConfirm 
}) => {
  const [isWholeMemberChecked, setIsWholeMemberChecked] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [openchatModal, setOpenchatModal] = useRecoilState(NewChatModalstate);

  const user = useRecoilValue(userState);
  const [ChatModalOpenState] = useRecoilState(NewChatModalstate);

  useEffect(() => {
    if (ChatModalOpenState) {
      setSelectedUsers(new Set()); // 빈 Set으로 초기화
      setSearchQuery("");
      setIsWholeMemberChecked(false);
    }
  }, [ChatModalOpenState, filteredData, user.username]);

  const filterDataBySearchQuery = (data: typeof filteredData) => {
    if (!searchQuery) return data;

    const filtered: typeof filteredData = {};

    Object.keys(data).forEach(companyName => {
      Object.keys(data[companyName]).forEach(departmentName => {
        Object.keys(data[companyName][departmentName]).forEach(teamName => {
          const filteredPersons = data[companyName][departmentName][teamName].filter(
            person =>
              person.username.includes(searchQuery) ||
              person.department.includes(searchQuery) ||
              person.team.includes(searchQuery)
          );

          if (filteredPersons.length > 0) {
            if (!filtered[companyName]) filtered[companyName] = {};
            if (!filtered[companyName][departmentName]) filtered[companyName][departmentName] = {};
            filtered[companyName][departmentName][teamName] = filteredPersons;
          }
        });
      });
    });

    return filtered;
  };

  const closeModal = () => {
    setOpenchatModal((prevState) => ({
      ...prevState,
      openState: false,
    }));
  };

  const filteredPersonsData = filterDataBySearchQuery(filteredData);

  const handleSubmit = async () => {
    const selectedPersons = Object.values(filteredData).flatMap(company =>
      Object.values(company).flatMap(department =>
        Object.values(department).flat()
      )
    ).filter(person => selectedUsers.has(person.userId));

    onConfirm(selectedPersons);
    closeModal();
  };

  const handlePersonClick = (person: Person) => {
    if (person.username === user.username) return;
    
    setSelectedUsers(prevSelected => {
      const newSelection = new Set(prevSelected);
      if (newSelection.has(person.userId)) {
        newSelection.delete(person.userId);
      } else {
        newSelection.add(person.userId);
      }
      return newSelection;
    });
  };
  
  const handleTeamClick = (teamName: string, companyName: string, departmentName: string) => {
    const teamMembers = filteredPersonsData[companyName][departmentName][teamName];
    const allMembersSelected = teamMembers.every(member => selectedUsers.has(member.userId));
    
    setSelectedUsers(prevSelected => {
      const newSelection = new Set(prevSelected);
      if (allMembersSelected) {
        teamMembers.forEach(member => newSelection.delete(member.userId));
      } else {
        teamMembers.forEach(member => newSelection.add(member.userId));
      }
      return newSelection;
    });
  };
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  return (
    <CustomModal
      isOpen={ChatModalOpenState.openState}
      onClose={() => closeModal()}
      header="주소록"
      headerTextColor="white"
      footer1="확인"
      footer1Class="back-green-btn"
      onFooter1Click={handleSubmit}
      footer2="취소"
      footer2Class="gray-btn"
      onFooter2Click={() => closeModal()}
      width="400px"
      height="460px"
    >
      <div className="body-container New-Chat-Room-Body">
        <div className="New-Chat-Room">
          <div className="Right-Button-Con">
            <img src={SearchIcon} className="SearchIcon" alt="searchIcon" />
            <input
              placeholder="검색"
              className="LeftTextInput"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="WholeMemberCheckBoxCon">
            <img
              className="CheckBox"
              src={isWholeMemberChecked ? CheckBox_Active : CheckBox}
              alt="checkBoxIcon"
              onClick={() => {
                setIsWholeMemberChecked(!isWholeMemberChecked);
                setSelectedUsers(
                  isWholeMemberChecked
                    ? new Set()
                    : new Set(Object.values(filteredData).flatMap(company =>
                      Object.values(company).flatMap(department =>
                        Object.values(department).flat()
                      )
                    ).map(person => person.userId))
                );
              }}
            />
            <span>전체 선택</span>
          </div>
        </div>
        <div className="PeopleSearchCon">
          <div className="LeftEmployCon mail_resize" ref={scrollContainerRef}>
            {Object.keys(filteredPersonsData).map(companyName => (
              <div key={companyName}>
                {companyName === "R&D" && (
                  <div className="Department-Tab">{companyName}</div>
                )}
                {Object.keys(filteredPersonsData[companyName])
                  .filter(departmentName => departmentName === "")
                  .map(departmentName => (
                    Object.keys(filteredPersonsData[companyName][departmentName])
                      .filter(teamName => teamName === "")
                      .map(teamName => (
                        <div key={teamName}>
                          {filteredPersonsData[companyName][departmentName][teamName]
                            .map(person => (
                              <div className="PersonCon" key={person.userId}>
                                <img
                                  src={
                                    person.username === user.username
                                      ? CheckBox_Not
                                      : (isWholeMemberChecked || selectedUsers.has(person.userId))
                                        ? CheckBox_Active
                                        : CheckBox
                                  }
                                  className="PersonCheckBox"
                                  alt="PersonCheckBox"
                                  onClick={() => handlePersonClick(person)}
                                />
                                <img
                                  src={person.attachment ? person.attachment : UserIcon_dark}
                                  className="ProfileIcon"
                                  alt="usericondark"
                                />
                                <div className="PersonName">
                                  {person.username} | {person.position}
                                </div>
                              </div>
                            ))}
                        </div>
                      ))
                  ))}
                {Object.keys(filteredPersonsData[companyName])
                  .filter(departmentName => departmentName !== "")
                  .map(departmentName => (
                    <div key={departmentName}>
                      {departmentName.trim() !== "" && (
                        <div className="Department-Tab">
                          <img src={DepartmentTabIcon} alt="DepartmentTabIcon" />
                          {departmentName}
                          <div className="VerticalLine"></div>
                        </div>
                      )}
                      {Object.keys(filteredPersonsData[companyName][departmentName])
                        .filter(teamName => teamName === "")
                        .map(teamName => (
                          <div key={teamName}>
                            {filteredPersonsData[companyName][departmentName][teamName]
                              .map(person => (
                                <div className="PersonCon" key={person.userId}>
                                  <img
                                    src={
                                      person.username === user.username
                                        ? CheckBox_Not
                                        : (isWholeMemberChecked || selectedUsers.has(person.userId))
                                          ? CheckBox_Active
                                          : CheckBox
                                    }
                                    className="PersonCheckBox"
                                    alt="PersonCheckBox"
                                    onClick={() => handlePersonClick(person)}
                                  />
                                  <img
                                    src={person.attachment ? person.attachment : UserIcon_dark}
                                    className="ProfileIcon"
                                    alt="usericondark"
                                  />
                                  <div className="PersonName">
                                    {person.username} | {person.position}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ))}
                      {Object.keys(filteredPersonsData[companyName][departmentName])
                        .filter(teamName => teamName !== "")
                        .map(teamName => (
                          <div key={teamName}>
                            {teamName.trim() !== "" && (
                              <div className="Team-Tab">
                                <img
                                  src={
                                    filteredPersonsData[companyName][departmentName][teamName]
                                      .every(person => selectedUsers.has(person.userId))
                                      ? CheckBox_Active
                                      : CheckBox
                                  }
                                  className="TeamCheckBox"
                                  alt="TeamCheckBox"
                                  onClick={() => handleTeamClick(teamName, companyName, departmentName)}
                                />
                                <div className="TeamName">{teamName}</div>
                                <div className="VerticalLine"></div>
                              </div>
                            )}
                            {filteredPersonsData[companyName][departmentName][teamName]
                              .map(person => (
                                <div className="PersonCon" key={person.userId}>
                                  <img
                                    src={
                                      person.username === user.username
                                        ? CheckBox_Not
                                        : isWholeMemberChecked || selectedUsers.has(person.userId)
                                          ? CheckBox_Active
                                          : CheckBox
                                    }
                                    className="PersonCheckBox"
                                    alt="PersonCheckBox"
                                    onClick={() => handlePersonClick(person)}
                                  />
                                  <img
                                    src={person.attachment ? person.attachment : UserIcon_dark}
                                    className="ProfileIcon"
                                    alt="usericondark"
                                  />
                                  <div className="PersonName">
                                    {person.username} | {person.position}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <div className="RightSelectedCon mail_resize">
            <div className="RightTopText">
              선택인원 <span>({selectedUsers.size} 명)</span>
            </div>
            <div className="ChosenPeople">
              {Array.from(selectedUsers).map(userId => {
                const person = Object.values(filteredData).flatMap(company =>
                  Object.values(company).flatMap(department =>
                    Object.values(department).flat()
                  )
                ).find(person => person.userId === userId);
                
                return person && (
                  <div className="ChosenOne" key={userId}>
                    {person.username === user.username ? (
                      <img src={MinusIcon} alt="MinusIcon" />
                    ) : (
                      <img
                        src={XIcon}
                        alt="XIcon"
                        onClick={() => handlePersonClick(person)}
                      />
                    )}
                    <div className={person.username === user.username ? "createMe" : "createBy"}>
                      {person.team ? person.team : person.department} {person.username}
                      {person.username === user.username && " (본인)"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default AddReceiver;
