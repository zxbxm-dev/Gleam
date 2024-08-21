import React, { useState, useEffect, useRef } from "react";
import {
  MessageMe,
  MessageMenu,
  NotiIcon,
  UserIcon_dark,
} from "../../../assets/images/index";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import SetProfile from "./SetProfile";
import { Person } from "./MessageSidebar";
import { selectedRoomIdState } from "../../../recoil/atoms";
import { useRecoilState } from "recoil";
import { useLocation } from "react-router-dom";
import io from 'socket.io-client';

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

interface ChatDataTabProps {
  userAttachment: string;
  personData: Person[] | null;
  userTeam: string | null;
  userDepartment: string | null;
  userName: string | null;
  userPosition: string | null;
  userId: string | null;
  onPersonClick: (
    username: string,
    team: string,
    department: string,
    position: string,
    userId: string
  ) => void;
  isNotibarActive: boolean | null;
  chatRooms: ChatRoom[];
  setIsNotibarActive: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const ChatDataTab: React.FC<ChatDataTabProps> = ({
  userAttachment,
  userTeam,
  userDepartment,
  userName,
  userId,
  onPersonClick,
  userPosition,
  isNotibarActive,
  setIsNotibarActive,
  chatRooms
}) => {
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useRecoilState(selectedRoomIdState);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [status, setStatus] = useState<string>("접속됨");
  const [borderColor, setBorderColor] = useState<string>("");

  const borderRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const socket = io('http://localhost:3001', { transports: ["websocket"] });

  const handleChatRoomClick = (chatRoom: ChatRoom) => {
    setSelectedRoomId({ roomId: chatRoom.roomId });
    onPersonClick(
      chatRoom.title,
      "",
      "",
      "",
      chatRoom.hostUserId
    );
    setIsNotibarActive(false);
  };

    useEffect(() => {
    const handleMouseMove = () => {
      if (timeoutId) clearTimeout(timeoutId);
      setStatus("접속됨");
      const newBorderColor = location.pathname === "/message" ? "2px solid #42E452" : "2px solid #848484";
      setBorderColor(newBorderColor);
      if (borderRef.current) {
        borderRef.current.style.border = newBorderColor;
      }
      const newTimeoutId = setTimeout(() => {
        setStatus("자리비움");
        const idleBorderColor = location.pathname === "/message" ? "2px solid #E0B727" : "2px solid #848484";
        setBorderColor(idleBorderColor);
        if (borderRef.current) {
          borderRef.current.style.border = idleBorderColor;
        }
        console.log("User status: 자리비움 (no mouse movement for 5 minutes)");
      }, 5000); // 5분
      setTimeoutId(newTimeoutId);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setStatus("접속안됨");
        console.log("User status: 접속안됨 (browser tab inactive)");
      } else {
        setStatus("접속됨");
        console.log("User status: 접속됨 (browser tab active)");
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timeoutId, location.pathname]);


  // 렉이 너무 많이 걸려서 주석처리합니다! -- socket 활동 상태
  // useEffect(() => {
  //   console.log("Emitting user status to server:", {
  //     status,
  //     borderColor
  //   });
  //   socket.emit('userStatus', { status, borderColor });
  // }, [status]);

  return (
    <div className="chat-data-tab">
      <li
        className={`Noti-bar ${isNotibarActive ? "active" : ""}`}
        onClick={() => {
          setSelectedChatRoom("통합 알림");
          setIsNotibarActive(true);
        }}
      >
        <img className="Noti-Icon" src={NotiIcon} alt="my-attach" />
        <div>통합 알림</div>
      </li>
      <li
        className="My-bar"
        onClick={() => {
          onPersonClick(
            userName || "",
            userTeam || "",
            userDepartment || "",
            userPosition || "",
            userId || ""
          );
          setSelectedRoomId({ roomId: '0' });
        }}
      >
        <div ref={borderRef} className="Border">
        <img className="My-attach" src={userAttachment?userAttachment:UserIcon_dark} alt="my-attach" />
        </div>
        <div>
          {userTeam ? `${userTeam}` : `${userDepartment}`} {userName}
        </div>
        <img className="Message-Me" src={MessageMe} alt="message-me" />
      </li>

      {chatRooms
        .sort((a, b) => new Date(b.upt).getTime() - new Date(a.upt).getTime())
        .map((chatRoom) => (
          <Popover key={chatRoom.roomId} placement="right">
            <div
              className={`ChatLog ${selectedChatRoom === chatRoom.roomId ? "selected" : ""}`}
              onClick={() => handleChatRoomClick(chatRoom)}
            >
              <div className="LogBox">
                <div className="Left">
                  <div className="Border">
                    <img
                      className="My-attach"
                      src={UserIcon_dark}
                      alt="User Icon"
                    />
                  </div>
                  <p>
                    {chatRoom.isGroup ? `Group: ${chatRoom.title}` : chatRoom.title}
                  </p>
                </div>
                <PopoverTrigger>
                  <img
                    className="Message-Menu"
                    src={MessageMenu}
                    alt="Message Menu"
                  />
                </PopoverTrigger>
              </div>

              <Portal>
                <PopoverContent
                  className="ChatRoomSide_popover"
                  _focus={{ boxShadow: "none" }}
                >
                  <div className={`Message-OnClick-Menu`}>
                    <div
                      className="ProfileChange"
                      onClick={() => setOpenProfile(true)}
                    >
                      대화방 프로필 설정
                    </div>
                    <div className="OutOfChat">대화 나가기</div>
                  </div>
                </PopoverContent>
              </Portal>
            </div>
          </Popover>
        ))}

      <SetProfile
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
      />
    </div>
  );
};

export default ChatDataTab;
