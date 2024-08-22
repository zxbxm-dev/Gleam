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
  borderColor: string;
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
  chatRooms,
  borderColor
}) => {
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useRecoilState(selectedRoomIdState);

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
        <div
          className="Border"
          style={{ border: borderColor }}
        >
          <img className="My-attach" src={userAttachment ? userAttachment : UserIcon_dark} alt="my-attach" />
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
