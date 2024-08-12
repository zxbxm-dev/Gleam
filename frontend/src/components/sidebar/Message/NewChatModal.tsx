import React, { useState, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState, selectedPersonState } from "../../../recoil/atoms";
import {
  SearchIcon,
  CheckBox,
  CheckBox_Active,
  DepartmentTabIcon,
  UserIcon_dark,
  XIcon,
} from "../../../assets/images/index";
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
  company: string;
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

interface NewChatModalProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  filteredData: {
    [company: string]: {
      [department: string]: {
        [team: string]: Person[];
      };
    };
  };
}

const NewChatModal: React.FC<NewChatModalProps> = ({
  openModal,
  setOpenModal,
  filteredData,
}) => {
  const [isWholeMemberChecked, setIsWholeMemeberChecked] =
    useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newChatChosenUsers, setNewChatChosenUsers] = useState<Person[] | null>(
    null
  );
  const [chatTitle, setChatTitle] = useState<string>("");

  const user: User = useRecoilValue(userState) as User;
  const setSelectedPerson = useSetRecoilState(selectedPersonState);

  useEffect(() => {
    if (openModal) {
      setNewChatChosenUsers(null);
      setChatTitle("");
      setSearchQuery("");
      setIsWholeMemeberChecked(false);
    }
  }, [openModal]);

  const filterDataBySearchQuery = (data: {
    [company: string]: { [department: string]: { [team: string]: Person[] } };
  }) => {
    if (!searchQuery) return data;
    const filtered: {
      [company: string]: { [department: string]: { [team: string]: Person[] } };
    } = {};

    Object.keys(data).forEach((companyName) => {
      Object.keys(data[companyName]).forEach((departmentName) => {
        Object.keys(data[companyName][departmentName]).forEach((teamName) => {
          const filteredPersons = data[companyName][departmentName][
            teamName
          ].filter(
            (person) =>
              person.username.includes(searchQuery) ||
              person.department.includes(searchQuery) ||
              person.team.includes(searchQuery)
          );
          if (filteredPersons.length > 0) {
            if (!filtered[companyName]) {
              filtered[companyName] = {};
            }
            if (!filtered[companyName][departmentName]) {
              filtered[companyName][departmentName] = {};
            }
            filtered[companyName][departmentName][teamName] = filteredPersons;
          }
        });
      });
    });

    return filtered;
  };

  const filteredPersonsData = filterDataBySearchQuery(filteredData);

  const handleSubmit = () => {
    if (!chatTitle) {
      alert("채팅방 이름을 입력해주세요.");
      return;
    }

    if (!newChatChosenUsers || newChatChosenUsers?.length === 0) {
      alert("채팅방 인원을 선택해주세요.");
      return;
    }

    const payload = {
      //랜덤 색상 index 0~9 추가할 것
      title: chatTitle,
      users: newChatChosenUsers,
    };

    console.log("페이로드 >> ", payload);

    setOpenModal(false);
  };

  return (
    <CustomModal
      isOpen={openModal}
      onClose={() => setOpenModal(false)}
      header={"새 대화방 생성"}
      headerTextColor="white"
      footer1={"확인"}
      footer1Class="back-green-btn"
      onFooter1Click={handleSubmit}
      footer2={"취소"}
      footer2Class="gray-btn"
      onFooter2Click={() => setOpenModal(false)}
      width="400px"
      height="460px"
    >
      <div className="body-container New-Chat-Room-Body">
        <div className="New-Chat-Room">
          <input
            placeholder="(필수) 대화방 이름을 입력해주세요."
            className="TextInputCon"
            value={chatTitle}
            onChange={(e) => setChatTitle(e.target.value)}
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
                setNewChatChosenUsers(
                  isWholeMemberChecked
                    ? null
                    : Object.values(filteredData).flatMap((company) =>
                        Object.values(company).flatMap((department) =>
                          Object.values(department).flat()
                        )
                      )
                );
              }}
            />
            <span>전체 멤버</span>
          </div>
        </div>
        <div className="PeopleSearchCon">
          <div className="LeftEmployCon">
            {Object.keys(filteredPersonsData).map((companyName) => (
              <div key={companyName}>
                {companyName === "R&D" && (
                  <div className="Department-Tab">{companyName}</div>
                )}
                {Object.keys(filteredPersonsData[companyName])
                  .filter((departmentName) => departmentName === "")
                  .map((departmentName) =>
                    Object.keys(
                      filteredPersonsData[companyName][departmentName]
                    )
                      .filter((teamName) => teamName === "")
                      .map((teamName) => (
                        <div key={teamName}>
                          {filteredPersonsData[companyName][departmentName][
                            teamName
                          ].map((person) => (
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
                                {person.username} | {person.position}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                  )}
                {Object.keys(filteredPersonsData[companyName])
                  .filter((departmentName) => departmentName !== "")
                  .map((departmentName) => (
                    <div key={departmentName}>
                      {departmentName.trim() !== "" && (
                        <div className="Department-Tab">
                          <img
                            src={DepartmentTabIcon}
                            alt="DepartmentTabIcon"
                          />
                          {departmentName}
                          <div className="VerticalLine"></div>
                        </div>
                      )}
                      {Object.keys(
                        filteredPersonsData[companyName][departmentName]
                      )
                        .filter((teamName) => teamName === "")
                        .map((teamName) => (
                          <div key={teamName}>
                            {filteredPersonsData[companyName][departmentName][
                              teamName
                            ].map((person) => (
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
                                  {person.username} | {person.position}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      {Object.keys(
                        filteredPersonsData[companyName][departmentName]
                      )
                        .filter((teamName) => teamName !== "")
                        .map((teamName) => (
                          <div key={teamName}>
                            {teamName.trim() !== "" && (
                              <div className="Team-Tab">
                                <img
                                  src={
                                    filteredPersonsData[companyName][
                                      departmentName
                                    ][teamName].every((person) =>
                                      newChatChosenUsers?.includes(person)
                                    )
                                      ? CheckBox_Active
                                      : CheckBox
                                  }
                                  className="TeamCheckBox"
                                  alt="TeamCheckBox"
                                  onClick={() => {
                                    let allMembersSelected =
                                      filteredPersonsData[companyName][
                                        departmentName
                                      ][teamName].every((person) =>
                                        newChatChosenUsers?.includes(person)
                                      );
                                    setNewChatChosenUsers((prevUsers) => {
                                      if (prevUsers) {
                                        return allMembersSelected
                                          ? prevUsers.filter(
                                              (user) =>
                                                !filteredPersonsData[
                                                  companyName
                                                ][departmentName][
                                                  teamName
                                                ].includes(user)
                                            )
                                          : [
                                              ...prevUsers,
                                              ...filteredPersonsData[
                                                companyName
                                              ][departmentName][
                                                teamName
                                              ].filter(
                                                (person) =>
                                                  !prevUsers.includes(person)
                                              ),
                                            ];
                                      } else {
                                        return filteredPersonsData[companyName][
                                          departmentName
                                        ][teamName];
                                      }
                                    });
                                  }}
                                />
                                <div className="TeamName">{teamName}</div>
                                <div className="VerticalLine"></div>
                              </div>
                            )}
                            {filteredPersonsData[companyName][departmentName][
                              teamName
                            ].map((person) => (
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
  );
};

export default NewChatModal;
