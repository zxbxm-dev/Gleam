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
import CustomModal from "../../modal/CustomModal";

interface ChatDataTabProps {
  dummyData: any[];
  userAttachment: string;
  userTeam: string | null;
  userDepartment: string | null;
  userName: string | null;
  userPosition: string | null;
  onPersonClick: (
    username: string,
    team: string,
    department: string,
    position: string
  ) => void;
  isNotibarActive: boolean | null;
  setIsNotibarActive: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const ChatDataTab: React.FC<ChatDataTabProps> = ({
  dummyData,
  userAttachment,
  userTeam,
  userDepartment,
  userName,
  onPersonClick,
  userPosition,
  isNotibarActive,
  setIsNotibarActive,
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [paletteIndex, setPaletteIndex] = useState<number | null>(null);

  const latestChatString = localStorage.getItem("latestChat");
  const latestChat = latestChatString
    ? JSON.parse(latestChatString).username
    : null;
  const [selectedChatRoom, setSelectedChatRoom] = useState(latestChat);

  const ProfilePalette: string[] = [
    "#FF96EE",
    "#FF9191",
    "#F3C639",
    "#91C06B",
    "#45995C",
    "#6AC9FF",
    "#618DFF",
    "#916AFF",
    "#5C6174",
    "#6A5644",
  ];

  const ProfileBorderPalette: string[] = [
    "#EC64D6",
    "#E85D5D",
    "#E3B337",
    "#6FA742",
    "#3B814E",
    "#35A7E7",
    "#366AEF",
    "#7248E9",
    "#404558",
    "#59422D",
  ];

  const [profileName, setProfileName] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileName(e.target.value);
  };

  const handleSubmit = () => {
    if (!profileName) {
      alert("프로필 이름을 입력해주세요.");
      return;
    }

    const payload = {
      colorIndex: paletteIndex,
      title: profileName,
    };

    console.log("페이로드 >>", payload);

    setOpenModal(false);
  };

  return (
    <div className="chat-data-tab">
      <li
        className={`Noti-bar ${isNotibarActive ? "active" : ""}`}
        onClick={() => {
          onPersonClick("통합 알림", "", "", "");
          setSelectedUserId(null);
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
            userPosition || ""
          )
        }
      >
        <img className="My-attach" src={userAttachment} alt="my-attach" />
        <div>
          {userTeam ? `${userTeam}` : `${userDepartment}`} {userName}
        </div>
        <img className="Message-Me" src={MessageMe} alt="message-me" />
      </li>

      {dummyData
        .sort((a, b) => b.isUpdateat - a.isUpdateat)
        .map((dummy) => (
          <Popover placement="right">
            <div
              className={`ChatLog ${
                selectedChatRoom === dummy.username ? "selected" : ""
              }`}
              key={dummy.userId}
              onClick={() => {
                onPersonClick(
                  dummy.username,
                  dummy.team,
                  dummy.department,
                  dummy.position
                );
                setSelectedChatRoom(dummy.username);
                localStorage.setItem("latestChat", JSON.stringify(dummy));
              }}
            >
              {dummy.isGroupChat ? (
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
                    <p>단체채팅방: {dummy.username}</p>
                  </div>
                  <ul>
                    {/* {dummy.participants.map((participant:any) => (
                                        <li key={participant.userId}>
                                            {participant.team ? `${participant.team}` : `${participant.department}`} {participant.username}
                                        </li>
                                    ))} */}
                  </ul>
                  <PopoverTrigger>
                    <img
                      className="Message-Menu"
                      src={MessageMenu}
                      alt="Message Menu"
                    />
                  </PopoverTrigger>
                </div>
              ) : (
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
                    {dummy.team ? `${dummy.team}` : `${dummy.department}`}{" "}
                    {dummy.username}
                  </div>
                  <PopoverTrigger>
                    <img
                      className="Message-Menu"
                      src={MessageMenu}
                      alt="Message Menu"
                    />
                  </PopoverTrigger>
                </div>
              )}

              <Portal>
                <PopoverContent
                  className="ChatRoomSide_popover"
                  _focus={{ boxShadow: "none" }}
                >
                  <div className={`Message-OnClick-Menu`}>
                    <div
                      className="ProfileChange"
                      onClick={() => setOpenModal(true)}
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

      <CustomModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        header={"대화방 프로필 설정"}
        headerTextColor="white"
        footer1={"수정"}
        footer1Class="green-btn"
        onFooter1Click={handleSubmit}
        footer2={"취소"}
        footer2Class="gray-btn"
        onFooter2Click={() => setOpenModal(false)}
        width="240px"
        height="auto"
      >
        <div className="body-container ProfileSetting">
          <div className="ProfileSetting">
            <div className="ProfileAndPalette">
              <div
                className="Profile"
                style={{
                  backgroundColor: paletteIndex
                    ? ProfilePalette[paletteIndex]
                    : "",
                  border: paletteIndex
                    ? `1px solid ${ProfileBorderPalette[paletteIndex]}`
                    : "",
                }}
              >
                {profileName ? profileName.slice(0, 1) : ""}
              </div>
              <div className="Palette">
                {ProfilePalette.map((color, index) => (
                  <div
                    style={{
                      backgroundColor: color,
                      // border: `1px solid ${ProfileBorderPalette[index]}`,
                    }}
                    onClick={() => {
                      setPaletteIndex(index);
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className="ProfileSetting">
            <input
              placeholder="(필수) 대화방 이름을 입력해주세요."
              className="TextInputCon"
              onChange={handleNameChange}
            />
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default ChatDataTab;
