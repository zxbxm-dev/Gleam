import React, { useState, useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { userState, SideChatModalstate, MsgOptionState } from "../../../recoil/atoms";
import {
  SearchIcon,
  CheckBox,
  CheckBox_Active,
  DepartmentTabIcon,
  CheckBox_Not,
  UserIcon_dark,
  XIcon,
  MinusIcon
} from "../../../assets/images/index";
import CustomModal from "../../modal/CustomModal";
import { createRoom } from "../../../services/message/MessageApi";
import { Person } from "../MemberSidebar";
import { Socket } from 'socket.io-client';
import { PersonData } from "../../../services/person/PersonServices";

interface NewChatModalProps {
  filteredData: {
    [company: string]: {
      [department: string]: {
        [team: string]: Person[];
      };
    };
  };
  socket: Socket<any> | null;
}

const SideChatModal: React.FC<NewChatModalProps> = ({
  filteredData,
  socket
}) => {
  const [isWholeMemberChecked, setIsWholeMemberChecked] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<Person[]>([]);
  const [personData, setPersonData] = useState<Person[] | null>(null);
  const [chatTitle, setChatTitle] = useState<string>("");
  const [ChatModalOpenState] = useRecoilState(SideChatModalstate);
  const [openchatModal, setOpenchatModal] = useRecoilState(SideChatModalstate);
  const user = useRecoilValue(userState);
  const [MsgOptionsState, setMsgOptionsState] = useRecoilState(MsgOptionState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PersonData();
        const approveduser = response.data.filter((item: any) => item.status === 'approved');
        const sortedData = approveduser.sort((a: Person, b: Person) => new Date(a.entering).getTime() - new Date(b.entering).getTime());
        setPersonData(sortedData);
      } catch (err) {
        console.error("Error fetching person data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (ChatModalOpenState) {
      const allPersons = Object.values(filteredData).flatMap(company =>
        Object.values(company).flatMap(department =>
          Object.values(department).flat()
        )
      );

      const initialSelectedUsers = allPersons.filter(person => person.username === user.username);

      setSelectedUsers(prevSelected => {
        const newSelection = new Set(prevSelected.map(user => user.userId));

        initialSelectedUsers.forEach(user => newSelection.add(user.userId));

        const updatedSelectedUsers = Array.from(newSelection)
          .map(userId => allPersons.find(user => user.userId === userId))
          .filter((user): user is Person => user !== undefined);

        return updatedSelectedUsers;
      });

      setIsWholeMemberChecked(false);
    }
  }, [ChatModalOpenState, filteredData, user.username]);

  // 모달이 닫힐 때 selectedUsers 초기화
  useEffect(() => {
    if (!openchatModal) {
      setSelectedUsers([]); // 모달이 닫히면 selectedUsers 초기화
      setChatTitle(""); // 채팅 제목도 초기화
      setSearchQuery(""); // 검색어도 초기화
      setIsWholeMemberChecked(false); // 전체 멤버 체크박스도 초기화
    }
  }, [openchatModal]);

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

  const filteredPersonsData = filterDataBySearchQuery(filteredData);

  const generateRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33', '#8CFF33', '#33FF8C', '#8C33FF', '#FF3333', '#33FF33'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      alert("채팅방 인원을 선택해주세요.");
      return;
    }

    if (selectedUsers.length > 2 && !chatTitle) {
      alert("채팅방 이름을 입력해주세요.");
      return;
    }

    // userTitle의 타입 정의interface UserTitleType {
    interface UserTitleType {
      [userId: string]: {
        userId: string;
        username: string;
        company: string | null;
        department: string | null;
        team: string | null;
        position: string | null;
        spot: string | null;
        attachment: string | null;
      };
    }

    const targetIds: string[] = selectedUsers.map((user: Person) => user.userId);

    const userTitle: UserTitleType = targetIds.reduce<UserTitleType>((acc, userId) => {
      // personData가 null이 아닐 때만 처리
      if (personData) {
        // personData의 각 항목이 Person 타입인지 확인
        const person = personData.find((person: Person) => person.userId === userId);
        if (person) {
          acc[userId] = {
            userId: person.userId,
            username: person.username,
            company: person.company || null,
            department: person.department || null,
            team: person.team || null,
            position: person.position || null,
            spot: person.spot || null,
            attachment: person.attachment || null,
          };
        }
      }
      return acc;
    }, {} as UserTitleType);

    const payload = {
      roomId: null,
      userTitle: JSON.stringify(userTitle),
      hostUserId: user.userID,
      hostName: user.username,
      hostDepartment: user.department,
      hostTeam: user.team,
      hostPosition: user.position,
      profileColor: generateRandomColor(),
      title: chatTitle || null,
    };
    try {
      if (selectedUsers.length > 2) {
        console.log("aaa");

        await createRoom(payload);
        console.log(payload);

        setMsgOptionsState(true);

        setTimeout(() => {
          setMsgOptionsState(false);
        }, 500);
      } else {
        if (socket) {
          const targetId = Array.from(selectedUsers).map(user => user.userId);

          const data = {
            userId: user.userID,
            content: "",
            invitedUserIds: targetId,
            hostUserId: null,
            name: null
          };

          socket.emit("createPrivateRoom", data);

          socket.on("roomCreated", (data: any) => {
            console.log("Room Created:", data);
          });
        }
      }

      setMsgOptionsState(true);
      setSelectedUsers([]);
      setChatTitle("");
      setIsWholeMemberChecked(false);
      setSearchQuery("");
      closeModal();

      setTimeout(() => {
        setMsgOptionsState(false);
      }, 500);

    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  const closeModal = () => {
    setOpenchatModal(false);
  };

  const handlePersonClick = (person: Person) => {
    // 본인 클릭 시 무시
    if (person.username === user.username) return;

    // 클릭한 사람의 ID 로그 출력
    console.log("클릭한 사람의 ID:", person.userId);

    // 클릭한 사람의 ID로 상태 업데이트
    setSelectedUsers((prevSelected) => {
      if (prevSelected.some(selected => selected.userId === person.userId)) {
        // 이미 선택된 경우, 해당 사용자 제거
        return prevSelected.filter(selected => selected.userId == person.userId);
      } else {
        // 선택되지 않은 경우 추가
        return [...prevSelected, person];
      }
    });
  };

  const handleTeamClick = (teamName: string, companyName: string, departmentName: string) => {
    const teamMembers = filteredPersonsData[companyName][departmentName][teamName];
    const allMembersSelected = teamMembers.every(member => selectedUsers.includes(member));

    setSelectedUsers(prevUsers => {
      if (allMembersSelected) {
        return prevUsers.filter(user => !teamMembers.includes(user));
      } else {
        return [...prevUsers, ...teamMembers.filter(member => !prevUsers.includes(member))];
      }
    });
  };

  // const scrollContainerRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   if (scrollContainerRef.current) {
  //     scrollContainerRef.current.scrollTop = -2000;
  //   }
  // }, [filteredPersonsData]);

  return (
    <CustomModal
      isOpen={openchatModal}
      onClose={() => setOpenchatModal(false)}
      header="새 대화방 생성"
      headerTextColor="white"
      footer1="확인"
      footer1Class="back-green-btn"
      onFooter1Click={handleSubmit}
      footer2="취소"
      footer2Class="gray-btn"
      onFooter2Click={() => setOpenchatModal(false)}
      width="400px"
      height="460px"
    >
      <div className="body-container New-Chat-Room-Body">
        <div className="New-Chat-Room">
          <input
            placeholder={
              selectedUsers.length === 2
                ? "1:1 대화방"
                : "(필수) 대화방 이름을 입력해주세요."
            }
            className="TextInputCon"
            value={chatTitle}
            onChange={e => setChatTitle(e.target.value)}
            disabled={selectedUsers.length === 2}
          />
        </div>
        <div className="New-Chat-Room">
          <div className="Right-Button-Con">
            <img src={SearchIcon} className="SearchIcon" alt="searchIcon" />
            <input
              placeholder="대화상대 검색"
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
                    ? []
                    : Object.values(filteredData).flatMap(company =>
                      Object.values(company).flatMap(department =>
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
                                      : (isWholeMemberChecked || selectedUsers.includes(person))
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
                                        : (isWholeMemberChecked || selectedUsers.includes(person))
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
                                      .every(person => selectedUsers.includes(person))
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
                                        : isWholeMemberChecked || selectedUsers.includes(person)
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
          <div className="RightSelectedCon">
            <div className="RightTopText">
              선택인원 <span>({selectedUsers.length} 명)</span>
            </div>
            <div className="ChosenPeople">
              {selectedUsers.map(person => (
                <div className="ChosenOne" key={person.userId}>
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default SideChatModal;