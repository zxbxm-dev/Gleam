import React, { useState, useEffect } from "react";
import { PersonData } from "../../../services/person/PersonServices";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import {
  userState,
  selectedPersonState,
  userStateMessage,
  selectedRoomIdState,
  SideChatModalstate,
  PeopleModalState,
  MsgOptionState,
  MsgNewUpdateState
} from "../../../recoil/atoms";

import {
  ChatTab,
  PersonTab,
  NewChatIcon,
  ActiveChatTab,
  ActivePersonTab
} from "../../../assets/images/index";
import PersonDataTab from "./PersonSide";
import ChatDataTab from "./ChatTab";
import SideChatModal from "./SideChatModal";
import io, { Socket } from 'socket.io-client';
import { useLocation } from "react-router-dom";
import { ChatRoom } from "./ChatTab";
import { Person } from "../MemberSidebar";
import NewChatModal from "./NewChatModal";

const MessageSidebar: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null); // Socket 타입 사용
  const [personData, setPersonData] = useState<Person[] | null>(null);
  const [openchatModal, setOpenchatModal] = useRecoilState(SideChatModalstate);
  const [peopleState, setPeopleState] = useRecoilState(PeopleModalState);
  const [selectedRoomId, setSelectedRoomId] = useRecoilState(selectedRoomIdState);
  const [expandedDepartments, setExpandedDepartments] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedTeams, setExpandedTeams] = useState<{
    [key: string]: boolean;
  }>({});
  const [activeTab, setActiveTab] = useState("ChatData");
  const [isWholeMemberChecked, setIsWholeMemeberChecked] =
    useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isNotibarActive, setIsNotibarActive] = useState<boolean | null>(false);

  const user = useRecoilValue(userState);
  const setSelectedPerson = useSetRecoilState(selectedPersonState);
  const MsguserState = useRecoilValue(userStateMessage);
  const setMsgNewUpdate = useSetRecoilState(MsgNewUpdateState);
  const [newChatChosenUsers, setNewChatChosenUsers] = useState<Person[] | null>(
    null
  );
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [borderColor, setBorderColor] = useState<string>("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const setUserStatetoServer = useSetRecoilState(userStateMessage);
  const msgOptionState = useRecoilValue(MsgOptionState);
  const isNewMessage = useRecoilValue(MsgNewUpdateState);
  const location = useLocation();
  const [visiblePopoverIndex, setVisiblePopoverIndex] = useState<number | null>(null);
  const [ModelPlusJoinId, setModelPlusJoinId] = useRecoilState(SideChatModalstate);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedRoomId({ roomId: -2, isGroup: false });
    }, 300);

    return () => clearTimeout(timer);
  }, [setSelectedRoomId]);

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

  //personSide - 부서, 팀
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

  //채팅방 나가기
  const handleLeaveRoom = (roomId: number) => {
    const socket = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    const userId = user.userID;

    setChatRooms(prevRooms => prevRooms.filter(room => room.dataValues?.roomId !== roomId));

    console.log(`Leaving room with id ${roomId}`);
    socket.emit("exitRoom", roomId, userId);
    
    setVisiblePopoverIndex(null);
  };
  
  //chatTab - socket 채팅방 목록 조회
  useEffect(() => {
    const socket = io('http://localhost:3001', {
      transports: ['websocket'],
    });
    setSocket(socket);

    const userId = user.userID;
    // console.log("유저아이디 가져오기", userId);

    // 서버에 사용자 등록 요청
    socket.emit('registerUser', userId);

    // 서버에 연결되었을 때
    socket.on('connection', () => {
      console.log(`[Client] Socket 서버에 연결됨: ${socket.id}`);
    });

    // 채팅 방 데이터 수신
    socket.on('chatRooms', (data: ChatRoom[]) => {
      const updatedRooms = data
        .map((room: ChatRoom, index: number) => {
          const title = room.userTitle?.[userId]?.username || room.title;
          return {
            ...room,
            title,
            key: index
          };
        })
        .sort((a, b) => {
          // updatedAt이 존재하는 경우에만 비교, 없으면 0 (정렬 영향 없음)
          const dateA = a.dataValues?.updatedAt ? new Date(a.dataValues?.updatedAt).getTime() : 0;
          const dateB = b.dataValues?.updatedAt ? new Date(b.dataValues?.updatedAt).getTime() : 0;
    
          return dateB - dateA; // b가 더 크면 위로 오게
        });
      setChatRooms(updatedRooms);
      setMsgNewUpdate(false);
    });
    

    socket.on('disconnect', () => {
      console.log('[Client] Socket 서버와의 연결 끊김');
    });

    socket.on('connect_error', (error) => {
      console.error('연결 오류:', error);
    });

    // 채팅 방 요청
    socket.emit('getChatRooms', userId);

    return () => {
      socket.off('chatRooms');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.close();
    };
  }, [user.userID, activeTab, msgOptionState, isNewMessage]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handlePersonClick = (
    username: string,
    team: string,
    department: string,
    position: string,
    userId: string,
  ) => {
    setSelectedPerson({ username, team, department, position, userId });
  };

  const groupByDepartmentAndTeam = (data: Person[]) => {
    const grouped: {
      [company: string]: { [department: string]: { [team: string]: Person[] } };
    } = {};

    data.forEach((person) => {
      if (!grouped[person.company]) {
        grouped[person.company] = {};
      }
      if (!grouped[person.company][person.department]) {
        grouped[person.company][person.department] = {};
      }
      if (!grouped[person.company][person.department][person.team]) {
        grouped[person.company][person.department][person.team] = [];
      }
      grouped[person.company][person.department][person.team].push(person);
    });

    return grouped;
  };

  const groupedData = personData ? groupByDepartmentAndTeam(personData) : {};

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

  const filteredData = filterDataBySearchQuery(groupedData);


  //상태 설정 - 자리비움 등
  useEffect(() => {
    sessionStorage.setItem('messageWindowOpen', 'true');
    const checkWindowStatus = () => {
      const messageWindowOpen = sessionStorage.getItem('messageWindowOpen');
      if (messageWindowOpen === 'true') {
        // setStatus("접속됨");
        setUserStatetoServer({ state: "접속됨" });
        const idleBorderColor = "2px solid #42E452";
        setBorderColor(idleBorderColor);
      } else {
        // setStatus("접속안됨");
        setUserStatetoServer({ state: "접속안됨" });
        const idleBorderColor = "2px solid #848484";
        setBorderColor(idleBorderColor);
      }
    };

    // 처음 실행 시 상태 확인
    checkWindowStatus();

    // 1초마다 상태 확인
    const intervalId = setInterval(checkWindowStatus, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      const newTimeoutId = setTimeout(() => {
        setUserStatetoServer({ state: "자리비움" });
        const idleBorderColor = "2px solid #E0B727";
        setBorderColor(idleBorderColor);
        // console.log("User status: 자리비움 (no mouse movement for 5 minutes)");
      }, 300000); // 5분
      setTimeoutId(newTimeoutId);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [timeoutId, location.pathname]);


  // socket 활동 상태
  useEffect(() => {
    const socket = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    // console.log("Emitting user status to server:", {
    //   status: MsguserState.state,
    //   borderColor
    // });
    const userId = user.userID;

    socket.emit('userStatus', { status: MsguserState.state, borderColor, userId });

    return () => {
      socket.disconnect();
    };
  }, [MsguserState.state, borderColor]);

  const openModal = () => {
    setOpenchatModal(true);
  };

  return (
    <div className="message-sidebar">
      <div className="tab-container">
        <div
          className={`tab-button ${activeTab === "personData" ? "active" : ""}`}
          onClick={() => handleTabChange("personData")}
        >
          <img src={activeTab === "personData" ? ActivePersonTab : PersonTab} />
        </div>

        <div
          className={`tab-button ${activeTab === "ChatData" ? "active" : ""}`}
          onClick={() => handleTabChange("ChatData")}
        >
          <img src={activeTab === "ChatData" ? ActiveChatTab : ChatTab} />
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
          borderColor={borderColor}
          chatRooms={chatRooms}
        />
      ) : activeTab === "ChatData" ? (
        <ChatDataTab
          personData={personData}
          userAttachment={user.attachment}
          userTeam={user.team}
          userDepartment={user.department}
          userName={user.username}
          userPosition={user.position}
          userId={user.userId}
          onPersonClick={handlePersonClick}
          isNotibarActive={isNotibarActive}
          setIsNotibarActive={setIsNotibarActive}
          chatRooms={chatRooms}
          borderColor={borderColor}
          handleLeaveRoom={handleLeaveRoom}
          visiblePopoverIndex={visiblePopoverIndex}
          setVisiblePopoverIndex={setVisiblePopoverIndex}
        />
      ) : (
        // const [isNotibarActive, setIsNotibarActive] = useState<boolean | null>(false);

        <p>Loading...</p>
      )}
      <img
        src={NewChatIcon}
        className="new-chat-button"
        alt="new-chat-button"
        onClick={() => {
          setNewChatChosenUsers(null);
          setIsWholeMemeberChecked(false);
          openModal();
          setSelectedUsers(new Set());
          setPeopleState({ ...peopleState, state: false });
        }}
      />

      <SideChatModal
        filteredData={filteredData}
        setSelectedUsers={setSelectedUsers}
        selectedUsers={selectedUsers}
      />
      <NewChatModal
        filteredData={filteredData}
        setSelectedUsers={setSelectedUsers}
        selectedUsers={selectedUsers}
      />
    </div>
  );
};

export default MessageSidebar;
