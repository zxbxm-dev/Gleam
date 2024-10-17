import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
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
  isSelfChat: boolean;
  unreadCount: number;
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
    updatedAt: string;
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
  handleLeaveRoom: (roomId: number) => void;
  visiblePopoverIndex: number | null;
  setVisiblePopoverIndex: Dispatch<SetStateAction<number | null>>;
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
  handleLeaveRoom,
  visiblePopoverIndex,
  setVisiblePopoverIndex
}) => {
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useRecoilState(selectedRoomIdState);
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
    const isGroup = chatRoom.dataValues?.isGroup ?? false;

    setSelectedRoomId({
      roomId: roomId,
      isGroup: isGroup
    });

    if (chatRoom.isSelfChat) {
      onPersonClick(user.username ?? "", user.team, user.department, user.position, user.userID);
    } else {
      onPersonClick("", chatRoom.othertitle ?? "", "", position, chatRoom.hostUserId);
    }

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

  const PersonMatchData = (chatRoom: ChatRoom) => {
    const title = chatRoom.othertitle ?? "";
    const lastWord = title.trim().split(" ").pop();
    const person = personData?.find((person) => person.username === lastWord);
    return person ? person.attachment : "";
  };

  const handleChatRoomProfileClick = (chatRoom: ChatRoom) => {
    setSelectedChatRoom(chatRoom);  // 선택된 대화방 정보 저장
    setOpenProfile(true);  // 프로필 설정 열기
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
      {/* <li
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
        }}
      >
        <div
          className="Border"
        // style={{ border: borderColor }}
        >
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
      </li> */}
      {chatRooms
        .sort((a, b) => {
          if (a.isSelfChat && !b.isSelfChat) return -1;
          if (!a.isSelfChat && b.isSelfChat) return 1;

          return new Date(b.upt).getTime() - new Date(a.upt).getTime();
        })
        .map((chatRoom, index) => {
          const roomId = chatRoom.dataValues?.roomId ?? -1;
          const isPopoverVisible = visiblePopoverIndex === index;
          const isActive = activeItem === roomId;
          const attachment = PersonMatchData(chatRoom) || UserIcon_dark;
          const firstLetter = chatRoom.othertitle ? chatRoom.othertitle.charAt(0) : "";

          return (
            <div key={`${roomId}-${index}`}>
              <div
                className={`ChatLog ${isActive ? "active" : ""} ${chatRoom.isSelfChat ? "MyLog" : ""}`}
                onClick={() => handleChatRoomClick(chatRoom)}
              >
                <div className="LogBox">
                  <div className="Left">
                    {chatRoom.dataValues?.isGroup ? (
                      <div
                        className="Group-attach"
                        style={{
                          backgroundColor: chatRoom.dataValues?.profileColor || "gray"
                        }}
                      >
                        {firstLetter}
                      </div>
                    ) : (
                      <div className="Border">
                        <img className="My-attach" src={attachment} alt="User Icon" />
                      </div>
                    )}
                    <div className="FontName">
                      {chatRoom.isSelfChat ? (
                        <div className="NameFlex">
                          {user.team ? user.team : user.department} {user.username}{' '}
                          <img className="Message-Me" src={MessageMe} alt="Message Me" />
                        </div>
                      ) : chatRoom.dataValues?.isGroup && chatRoom.othertitle ? (
                        Array.from(new Set(chatRoom.othertitle.split(' '))).join(' ')
                      ) : chatRoom.othertitle ? (
                        Array.from(new Set(chatRoom.othertitle.split(' '))).join(' ')
                      ) : (
                        "No Title"
                      )}
                    </div>
                  </div>
                  <div className="Right">
                    {chatRoom.unreadCount === 0 ? "" :
                      <div className="UnRead">
                        {chatRoom.unreadCount}
                      </div>
                    }
                    <img
                      className="Message-Menu"
                      src={MessageMenu}
                      alt="Message Menu"
                      onClick={(e) => handleMessageMenuClick(index, e)}
                    />
                  </div>
                  {isPopoverVisible && (
                    <>
                      <div
                        className="ChatRoomSide_popover"
                        ref={(el) => (popoverRefs.current[index] = el)}
                      >
                        <span onClick={() => handleLeaveRoom(roomId)}>대화 나가기</span>
                        {chatRoom.dataValues?.isGroup && (
                          <span onClick={() => handleChatRoomProfileClick(chatRoom)}>
                            대화방 프로필 설정
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      <SetProfile 
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        selectedChatRoom={selectedChatRoom}
      />
    </div>
  );
};

export default ChatDataTab;
