import React, { useState, useEffect } from "react";
import { PersonData } from "../../../services/person/PersonServices";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState, selectedPersonState } from "../../../recoil/atoms";
import {
  ChatTab,
  PersonTab,
  NewChatIcon,
} from "../../../assets/images/index";
import PersonDataTab from "./PersonSide";
import ChatDataTab from "./ChatTab";
import NewChatModal from "./NewChatModal";
import io from 'socket.io-client';

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

interface ChatRoom {
  roomId: string;
  isGroup: boolean;
  hostUserId: string;
  invitedUserIds: string[];
  title: string;
  subContent: string;
  profileColor: string;
  profileImage: string | null;
  crt: string;
  upt: string;
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
  const [isWholeMemberChecked, setIsWholeMemeberChecked] =
    useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isNotibarActive, setIsNotibarActive] = useState<boolean | null>(false);

  const user = useRecoilValue(userState);
  const setSelectedPerson = useSetRecoilState(selectedPersonState);

  const [newChatChosenUsers, setNewChatChosenUsers] = useState<Person[] | null>(
    null
  );
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const socket = io('http://localhost:3001', { transports: ["websocket"] });

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

  useEffect(() => {
    const userId = user.userID;

    // console.log(`[Client] Connecting to socket server at http://localhost:3001`);

    // 서버와의 소켓 연결이 성공했는지 확인
    socket.on('connect', () => {
      // console.log(`[Client] Connected to socket server with id: ${socket.id}`);
    });

    // 서버에 채팅방 목록 요청
    // console.log(`[Client] Requesting chat rooms for userId: ${userId}`);
    socket.emit('getChatRooms', userId);

    // 서버로부터 채팅방 목록을 받아옴
    socket.on('chatRooms', (data: any) => {
      // console.log('[Client] Received chat rooms:', data);
      setChatRooms(data);
      setChatRooms(data);
    });

    // 서버와의 연결이 끊겼을 때
    socket.on('disconnect', () => {
      // console.log('[Client] Disconnected from socket server');
    });

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      socket.off('chatRooms');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [user.userID]);

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
          setOpenModal(true);
        }}
      />

      <NewChatModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        filteredData={filteredData}
      />
    </div>
  );
};

export default MessageSidebar;
