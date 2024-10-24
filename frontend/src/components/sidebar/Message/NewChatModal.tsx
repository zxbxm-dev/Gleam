import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { userState, NewChatModalstate, PeopleModalState, MsgNewUpdateState, selectedRoomIdState } from "../../../recoil/atoms";
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
import { PersonData } from "../../../services/person/PersonServices";
import { Person } from "../MemberSidebar";
import { Socket } from 'socket.io-client';

interface NewChatModalProps {
  filteredData: {
    [company: string]: {
      [department: string]: {
        [team: string]: Person[];
      };
    };
  };
  setSelectedUsers: Dispatch<SetStateAction<Set<string>>>;
  selectedUsers: Set<string>;
  socket: Socket<any> | null;
}

const NewChatModal: React.FC<NewChatModalProps> = ({
  filteredData,
  setSelectedUsers,
  selectedUsers,
  socket
}) => {
  const [isWholeMemberChecked, setIsWholeMemberChecked] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [chatTitle, setChatTitle] = useState<string>("");
  const [openchatModal, setOpenchatModal] = useRecoilState(NewChatModalstate);
  const [personData, setPersonData] = useState<Person[] | null>(null);
  const user = useRecoilValue(userState);
  const [ChatModalOpenState] = useRecoilState(NewChatModalstate);
  const UsePeopleState = useRecoilValue(PeopleModalState);
  const UseModalUserState = useRecoilValue(PeopleModalState);
  const selectedRoomId = useRecoilValue(selectedRoomIdState);
  const [additionalSelectedUsers, setAdditionalSelectedUsers] = useState<Set<string>>(new Set());
  const setMsgNewUpdate = useSetRecoilState(MsgNewUpdateState);

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
    if (ChatModalOpenState && UsePeopleState) {
      const allPersons = Object.values(filteredData).flatMap(company =>
        Object.values(company).flatMap(department =>
          Object.values(department).flat()
        )
      );

      const initialSelectedUsers = allPersons.filter(person =>
        person.username === user.username ||
        ChatModalOpenState.joinUser.includes(person.userId)
      );

      setSelectedUsers(prevSelected => {
        const newSelection = new Set(prevSelected);
        initialSelectedUsers.forEach(user => newSelection.add(user.userId));
        return newSelection.size !== prevSelected.size ? newSelection : prevSelected;
      });

      setSearchQuery("");
      setIsWholeMemberChecked(false);
    } else {
      const allPersons = Object.values(filteredData).flatMap(company =>
        Object.values(company).flatMap(department =>
          Object.values(department).flat()
        )
      );

      const initialSelectedUsers = allPersons.filter(person =>
        person.username === user.username
      );

      setSelectedUsers(prevSelected => {
        const newSelection = new Set(prevSelected);
        initialSelectedUsers.forEach(user => newSelection.add(user.userId));
        return newSelection.size !== prevSelected.size ? newSelection : prevSelected;
      });

      setSearchQuery("");
      setIsWholeMemberChecked(false);
    }
  }, [ChatModalOpenState, filteredData, user.username, ChatModalOpenState.joinUser]);

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

  const generateRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33', '#8CFF33', '#33FF8C', '#8C33FF', '#FF3333', '#33FF33'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSubmit = async () => {
    if (selectedUsers.size === 0) {
      alert("채팅방 인원을 선택해주세요.");
      return;
    }

    const targetIds = Array.from(selectedUsers);

    // userTitle의 타입 정의
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

    // selectedUsers에서 각 userId를 personData에서 찾아 매칭하여 JSON 구조로 변환
    const userTitle: UserTitleType = targetIds.reduce((acc: UserTitleType, userId: string) => {
      const person = personData?.find(person => person.userId === userId);
      if (person) {
        acc[userId] = {
          userId: person.userId,
          username: person.username,
          company: person.company,
          department: person.department,
          team: person.team,
          position: person.position,
          spot: person.spot,
          attachment: person.attachment,
        };
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

    interface RoomJoinedData {
      roomId: number;
    }

    try {
      if (selectedRoomId.isGroup === true) {
        if (socket) {
          // 방 ID 설정 (여기서 실제 방 ID로 대체)
          const roomId = selectedRoomId.roomId;
          const userIds = Array.from(additionalSelectedUsers);
          console.log('NewChatModal.tsx 에서2 ',roomId)
          // 채팅방 참여 요청
          socket.emit("joinRoom", roomId, userIds);
          console.log('NewChatModal.tsx 에서 ',roomId, userIds);
          setMsgNewUpdate(true);
          // 방 참여 결과 처리
          socket.on("roomJoined", (data: RoomJoinedData) => {
            console.log(`방에 참여했습니다: ${data.roomId}`);
          });

          // 에러 처리
          socket.on("error", (error: { message: string }) => {
            console.error("오류:", error.message);
          });
        }
      } else {
        await createRoom(payload);
        setMsgNewUpdate(true);
      }

    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };
  useEffect(() => {
    // console.log("추가로 선택된 사람:", Array.from(additionalSelectedUsers));
  }, [additionalSelectedUsers]);


  const handlePersonClick = (person: Person) => {
    if (person.username === user.username) return;

    setSelectedUsers(prevSelected => {
      const newSelection = new Set(prevSelected);
      const newAdditionalSelected = new Set(additionalSelectedUsers);
      if (newSelection.has(person.userId)) {
        newSelection.delete(person.userId);
        newAdditionalSelected.delete(person.userId);
      } else {
        newSelection.add(person.userId);
        newAdditionalSelected.add(person.userId);
      }

      // 추가로 선택된 사용자 상태 업데이트
      setAdditionalSelectedUsers(newAdditionalSelected);

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
      onClose={() => {
        closeModal();
        setSelectedUsers(new Set());
      }}
      header="새 대화방 생성"
      headerTextColor="white"
      footer1="확인"
      footer1Class="back-green-btn"
      onFooter1Click={() => {
        closeModal();
        handleSubmit();
        setSelectedUsers(new Set());
      }}
      footer2="취소"
      footer2Class="gray-btn"
      onFooter2Click={() => {
        closeModal();
        setSelectedUsers(new Set());
      }}
      width="400px"
      height="460px"
    >
      <div className="body-container New-Chat-Room-Body">
        <div className="New-Chat-Room">
          <input
            placeholder={
              selectedRoomId.isGroup === true
                ? selectedRoomId.OtherTitle
                : selectedUsers.size === 2
                  ? "1:1 대화방"
                  : selectedRoomId.OtherTitle
            }
            className="TextInputCon"
            value={chatTitle}
            onChange={e => setChatTitle(e.target.value)}
            disabled={selectedUsers.size === 2 || UseModalUserState.joinNumber > 2}
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
          <div className="LeftEmployCon" ref={scrollContainerRef}>
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
          <div className="RightSelectedCon">
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

export default NewChatModal;
