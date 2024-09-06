import React, { useState, useEffect, useRef } from "react";
import {
  MessageMe,
  MessageMenu,
  NotiIcon,
  UserIcon_dark,
} from "../../../assets/images/index";
import SetProfile from "./SetProfile";
import { Person } from "../MemberSidebar";
import { selectedRoomIdState, selectUserID, userState } from "../../../recoil/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import io from 'socket.io-client';

export interface ChatRoom {
  roomId: number;
  isGroup: boolean;
  hostUserId: string;
  invitedUserIds: string[];
  title: string;
  othertitle: string;
  userTitle?: {
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
  };
  subContent: string;
  profileColor: string;
  profileImage: string | null;
  crt: string;
  upt: string;
  dataValues?: {
    roomId: number;
    isGroup: boolean;
    hostUserId: string;
    invitedUserIds: string[];
    title: string;
    userTitle?: { [userId: string]: string };
    subContent: string;
    profileColor: string;
    profileImage: string | null;
    crt: string;
    upt: string;
  };
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
  borderColor: string;
}

const ChatDataTab: React.FC<ChatDataTabProps> = ({
  userAttachment,
  userTeam,
  userDepartment,
  userName,
  personData,
  userId,
  onPersonClick,
  userPosition,
  isNotibarActive,
  setIsNotibarActive,
  chatRooms,
  borderColor,
}) => {
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useRecoilState(selectedRoomIdState);
  const [visiblePopoverIndex, setVisiblePopoverIndex] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const popoverRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [selectedUserIdstate, setSelectedUserIdstate] = useRecoilState(selectUserID);
  const user = useRecoilValue(userState);

  const handleChatRoomClick = (chatRoom: ChatRoom) => {
    const title = chatRoom.othertitle ?? "";
    const lastWord = title.trim().split(" ").pop();

    const person = personData?.find((person) => person.username === lastWord);
    const position = person ? person.position : "";
    const roomId = chatRoom.dataValues?.roomId ?? -1;

    setSelectedRoomId(roomId);
    onPersonClick("", chatRoom.othertitle ?? "", "", position, chatRoom.hostUserId);
    setIsNotibarActive(false);
    setActiveItem(roomId);
    setSelectedUserIdstate({ userID: "" });
  };

  const handleMessageMenuClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setVisiblePopoverIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!Object.values(popoverRefs.current).some((ref) => ref?.contains(event.target as Node))) {
      setVisiblePopoverIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  //채팅방 나가기
  const handleLeaveRoom = (roomId: number) => {
    const socket = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    const userId = user.userID;

    console.log(`Leaving room with id ${roomId}`);
    socket.emit("exitRoom", roomId, userId);
    setVisiblePopoverIndex(null);
  };

  const PersonMatchData = (chatRoom: ChatRoom) => {
    const title = chatRoom.othertitle ?? "";
    const lastWord = title.trim().split(" ").pop();
    const person = personData?.find((person) => person.username === lastWord);
    return person ? person.attachment : "";
  };

  return (
    <div className="chat-data-tab">
      {/* <li
        className={`Noti-bar ${activeItem === -2 ? "active" : ""}`}
        onClick={() => {
          setSelectedChatRoom(-2);
          setIsNotibarActive(true);
          setSelectedRoomId(-2);
          setActiveItem(-2);
        }}
      >
        <img className="Noti-Icon" src={NotiIcon} alt="Notification Icon" />
        <div>통합 알림</div>
      </li> */}
      <li
        className={`My-bar ${activeItem === 0 ? "active" : ""}`}
        onClick={() => {
          onPersonClick(
            userName || "",
            userTeam || "",
            userDepartment || "",
            userPosition || "",
            userId || ""
          );
          setSelectedUserIdstate({ userID: user.userID });
          setActiveItem(0);
          setSelectedRoomId(0);
        }}
      >
        <div className="Border" style={{ border: borderColor }}>
          <img
            className="My-attach"
            src={userAttachment || UserIcon_dark}
            alt="User Attachment"
          />
        </div>
        <div className="FontName">
          {userTeam ? `${userTeam}` : `${userDepartment}`} {userName}
        </div>
        <img className="Message-Me" src={MessageMe} alt="Message Me" />
      </li>
      {chatRooms
        .sort((a, b) => new Date(b.upt).getTime() - new Date(a.upt).getTime())
        .map((chatRoom, index) => {
          const roomId = chatRoom.dataValues?.roomId ?? -1;
          const isPopoverVisible = visiblePopoverIndex === index;
          const isActive = activeItem === roomId;
          const attachment = PersonMatchData(chatRoom) || UserIcon_dark;

          return (
            <div key={`${roomId}-${index}`}>
              <div
                className={`ChatLog ${isActive ? "active" : ""}`}
                onClick={() => handleChatRoomClick(chatRoom)}
              >
                <div className="LogBox">
                  <div className="Left">
                    <div className="Border" style={{ border: "2px solid red" }}>
                      <img className="My-attach" src={attachment} alt="User Icon" />
                    </div>
                    {/* <p className="FontName">
                      {chatRoom.dataValues?.isGroup
                        ? `${chatRoom.othertitle}`
                        : chatRoom.othertitle}
                    </p> */}
                    <p className="FontName">
                      {chatRoom.dataValues?.isGroup && chatRoom.othertitle
                        ? Array.from(new Set(chatRoom.othertitle.split(' '))).join(' ')
                        : chatRoom.othertitle ? Array.from(new Set(chatRoom.othertitle.split(' '))).join(' ') : "No Title"}
                    </p>
                  </div>
                  <img
                    className="Message-Menu"
                    src={MessageMenu}
                    alt="Message Menu"
                    onClick={(e) => handleMessageMenuClick(index, e)}
                  />
                  {isPopoverVisible && (
                    <div
                      className="ChatRoomSide_popover"
                      ref={(el) => (popoverRefs.current[index] = el)}
                      onClick={() => handleLeaveRoom(roomId)}
                    >
                      대화 나가기
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      <SetProfile openProfile={openProfile} setOpenProfile={setOpenProfile} />
    </div>
  );
};

export default ChatDataTab;
