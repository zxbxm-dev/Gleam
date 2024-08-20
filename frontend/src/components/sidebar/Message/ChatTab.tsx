import React, { useState } from "react";
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

interface ChatDataTabProps {
  userAttachment: string;
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
  chatRooms:any[];
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

  return (
    <div className="chat-data-tab">
      <li
        className={`Noti-bar ${isNotibarActive ? "active" : ""}`}
        onClick={() => {
          onPersonClick("통합 알림", "", "", "", "");
          // setSelectedUserId(null);
          setSelectedChatRoom("통합 알림");
          setIsNotibarActive(true);
        }}
      >
        <img className="Noti-Icon" src={NotiIcon} alt="my-attach" />
        <div>통합 알림</div>
      </li>
      <li
        className="My-bar"
        onClick={() =>
          onPersonClick(
            userName || "",
            userTeam || "",
            userDepartment || "",
            userPosition || "",
            userId || ""
          )
        }
      >
        <img className="My-attach" src={userAttachment} alt="my-attach" />
        <div>
          {userTeam ? `${userTeam}` : `${userDepartment}`} {userName}
        </div>
        <img className="Message-Me" src={MessageMe} alt="message-me" />
      </li>

      {chatRooms
        .sort((a, b) => b.isUpdateat - a.isUpdateat)
        .map((chatRooms) => (
          <Popover key={chatRooms.title} placement="right">
            <div
              className={`ChatLog ${selectedChatRoom === chatRooms.username ? "selected" : ""
                }`}
              onClick={() => {
                onPersonClick(
                  chatRooms.username,
                  chatRooms.team,
                  chatRooms.department,
                  chatRooms.position,
                  chatRooms.userId
                );
                setSelectedChatRoom(chatRooms.username);
                localStorage.setItem("latestChat", JSON.stringify(chatRooms));
              }}
            >
              <div
                className="LogBox"
                onClick={() => {
                  setIsNotibarActive(false);
                }}
              >
                <div className="Left">
                  <img
                    className="My-attach"
                    src={UserIcon_dark}
                    alt="User Icon"
                  />
                  <p>
                    {chatRooms.isGroup ? chatRooms.name : chatRooms.title}
                    {/* {chatRooms.isGroupChat ? `단체채팅방: ${chatRooms.username}` : `${chatRooms.team ? chatRooms.team : chatRooms.department} ${chatRooms.username}`} */}
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
