import React, { useState, useEffect, useRef } from "react";
import {
  MessageMe,
  MessageMenu,
  NotiIcon,
  UserIcon_dark,
} from "../../../assets/images/index";
import SetProfile from "./SetProfile";
import { Person } from "./MessageSidebar";
import { selectedRoomIdState, selectUserID } from "../../../recoil/atoms";
import { useRecoilState } from "recoil";

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
  borderColor
}) => {
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useRecoilState(selectedRoomIdState);
  const [visiblePopoverIndex, setVisiblePopoverIndex] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const popoverRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [selectedUserIdstate, setSelectedUserIdstate] = useRecoilState(selectUserID);

  const handleChatRoomClick = (chatRoom: ChatRoom) => {
    const title = chatRoom.othertitle ?? "";
    const lastWord = title.trim().split(" ").pop();

    const person = personData?.find((person) => person.username === lastWord);
    const position = person ? person.position : "";

    const roomId = chatRoom.dataValues?.roomId ?? -1;

    setSelectedRoomId(roomId);

    onPersonClick(
      "",
      chatRoom.othertitle ?? "",
      "",
      position,
      chatRoom.hostUserId
    );

    setIsNotibarActive(false);
    setActiveItem(roomId);
    setSelectedUserIdstate({ userID: "" });
  };

  const handleMessageMenuClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setVisiblePopoverIndex(prevIndex => prevIndex === index ? null : index);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!Object.values(popoverRefs.current).some(ref => ref?.contains(event.target as Node))) {
      setVisiblePopoverIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLeaveRoom = (roomId: number) => {
    console.log(`Leaving room with id ${roomId}`);
    setVisiblePopoverIndex(null);
  };

  return (
    <div className="chat-data-tab">
      <li
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
      </li>
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
          setSelectedRoomId(0);
          setActiveItem(0);
        }}
      >
        <div
          className="Border"
          style={{ border: borderColor }}
        >
          <img className="My-attach" src={userAttachment ? userAttachment : UserIcon_dark} alt="User Attachment" />
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

          return (
            <div key={roomId}>
              <div
                className={`ChatLog ${isActive ? "active" : ""}`}
                onClick={() => {
                  handleChatRoomClick(chatRoom);
                }}
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
                    {chatRoom.dataValues ? (
                      <p className="FontName">
                        {chatRoom.dataValues.isGroup ? `${chatRoom.othertitle}` : chatRoom.othertitle}
                      </p>
                    ) : (
                      <p className="FontName">{chatRoom.isGroup ? `Group: ${chatRoom.othertitle}` : chatRoom.othertitle}</p>
                    )}
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
                      ref={el => popoverRefs.current[index] = el}
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
      <SetProfile
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
      />
    </div>
  );
};

export default ChatDataTab;
