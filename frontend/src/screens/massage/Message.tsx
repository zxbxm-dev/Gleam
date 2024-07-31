import React, { useEffect, useState, useRef } from "react";
import {
  HrLine,
  UserIcon_dark,
  MailIcon,
  WorkReportIcon,
  ScheduleIcon,
  UserManagementIcon,
  XIcon,
  GearIcon,
  MessageMenu,
  AdminIcon,
} from "../../assets/images/index";
import {
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { userState, selectedPersonState } from "../../recoil/atoms";

const Message = () => {
  const DummyNotice: {
    classify: string;
    title: string;
    description: string;
    date: Date;
  }[] = [
    {
      classify: "Mail",
      title: "‘Gleam’에서 새로운 메일이 도착했습니다.",
      description:
        "안녕하세요 관리팀 염승희 사원입니다. 이번부터 시행되는 사내시스템  ‘Gleam’에  관련하여",
      date: new Date(),
    },

    {
      classify: "WorkReport",
      title: "‘Gleam’에서 새로운 결재 문서가 도착했습니다.",
      description: "서주희 사원 휴가신청서 결재 요청 알림입니다.",
      date: new Date(),
    },

    {
      classify: "Schedule",
      title: "‘Gleam’에서 새로운 회의가 등록되었습니다.",
      description:
        "날짜 : 2024/07/26  오전11:57 장소 : 미팅룸 주최자 : 김현지 참가자 : 서주희 ",
      date: new Date(),
    },
  ];

  const NoticeNameList: { [key: string]: string } = {
    Mail: "Mail - Notification",
    WorkReport: "Work Report - Notification",
    Schedule: "Schedule - Notification",
  };

  const NoticeIcons: { [key: string]: string } = {
    Mail: MailIcon,
    WorkReport: WorkReportIcon,
    Schedule: ScheduleIcon,
  };

  const [messageInput, setMessageInput] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [chatRoomPeopleManagement, setChatRoomPeopleManagement] =
    useState<boolean>(false);
  const user = useRecoilValue(userState);
  const selectedPerson = useRecoilValue(selectedPersonState);

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      setMessages([...messages, messageInput.trim()]);
      setMessageInput("");
    }
  };

  const handleInputKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="Message-contents">
      <div className="Message-header">
        <div>
          <span>
            {selectedPerson.team
              ? selectedPerson.team
              : selectedPerson.department}{" "}
            {selectedPerson.username}
          </span>
          {selectedPerson.position && (
            <img src={HrLine} alt="Horizontal Line" />
          )}
          <span>{selectedPerson.position}</span>
        </div>
        {selectedPerson && (
          <img
            src={UserManagementIcon}
            className="UserManagementIcon"
            alt="UserManagementIcon"
            onClick={() =>
              setChatRoomPeopleManagement(!chatRoomPeopleManagement)
            }
          />
        )}
      </div>
      <div className="Message-container">
        {selectedPerson.username !== "통합 알림" &&
          messages.map((message, index) => (
            <div key={index} className="Message">
              <img src={UserIcon_dark} alt="User Icon" />
              <div className="RightBox">
                <div>
                  {user.team ? user.team : user.department} {user.username}
                </div>
                <div className="MsgTimeBox">
                  <div className="MsgBox">{message}</div>
                  <div className="MsgTime">
                    <div className="ViewCount">1</div>
                    오후 4:30
                  </div>
                </div>
              </div>
            </div>
          ))}

        {selectedPerson.username === "통합 알림" &&
          DummyNotice.map((notice, index) => (
            <div key={index} className="Message">
              <img src={NoticeIcons[notice.classify]} alt="User Icon" />
              <div className="RightBox">
                <div className="NoticeName">
                  {NoticeNameList[notice.classify]}
                </div>
                <div className="MsgTimeBox">
                  <div className={`NoticeBox ${notice.classify}`}>
                    <div className="NoticeTitle">{notice.title}</div>
                    <div className="NoticeDescription">
                      {notice.description}
                    </div>
                  </div>

                  <div className="MsgTime">오후 4:30</div>
                </div>
              </div>
            </div>
          ))}

        <div className="Message-Input">
          <div className="Input-Outer">
            <input
              type="text"
              placeholder="메시지를 입력하세요."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleInputKeyPress}
            />
            <div className="send-btn" onClick={handleSendMessage}>
              전송
            </div>
          </div>
        </div>
      </div>

      {/* 인원관리 */}
      <div
        className={`PeopleManagementCon ${
          chatRoomPeopleManagement ? "" : "Hidden"
        }`}
      >
        <div className="Management-header">
          <span>인원 관리</span>{" "}
          <img
            src={XIcon}
            alt="XIcon"
            onClick={() => setChatRoomPeopleManagement(false)}
          />
        </div>
        <div className="AddPerson-tab">+ 인원 추가하기</div>
        <div className="ChatRoom-Members">
          <Popover placement="left-start">
            <div className="OneMember">
              <div className="AttachWithName">
                <img
                  src={UserIcon_dark}
                  alt="UserIcon_dark"
                  className="AttachIcon"
                />
                <span>개발 1팀 장현지</span>
                <img src={AdminIcon} alt="Admin_Icon" className="AdminIcon" />
              </div>
              <PopoverTrigger>
                <img src={MessageMenu} alt="MenuIcon" className="OptionIcon" />
              </PopoverTrigger>
              <Portal>
                <PopoverContent
                  className="PersonSide_popover PopPerson"
                  _focus={{ boxShadow: "none" }}
                >
                  <div className="PopPerson">내보내기</div>
                </PopoverContent>
              </Portal>
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Message;
