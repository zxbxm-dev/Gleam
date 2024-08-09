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
  FileIcon,
  GraySearchIcon,
  GoToBottomIcon,
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
// import { joinChatRoom, sendMsg } from "../../services/message/SocketClient";
import {
  createChatRoom,
  getChatRooms,
} from "../../services/message/MessageApi";
import { io } from "socket.io-client";

const socket = io("localhost:3002", {
  transports: ["websocket"],
});

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

  const DummyMessage1 = [
    {
      user: {
        id: "qw506799a",
        username: "박세준",
        userID: "qw506799",
        usermail: "qw506799@four-chains.com",
        phoneNumber: "01011111111",
        company: "",
        department: "",
        team: "",
        position: "대표이사",
        spot: "대표이사",
        question1: "1",
        question2: "1",
        entering: "2024-07-26",
        attachment: "http://localhost:3001/uploads/NextBtn.png",
        Sign: null,
      },
      message: "안녕하세요",
      date: new Date(),
    },
  ];

  const DummyPeoples = [
    {
      userId: "qw506799b",
      username: "박세준",
      usermail: "qw123456789@four-chains.com",
      phoneNumber: "01012345678",
      company: "",
      department: "",
      team: "",
      position: "대표이사",
      spot: "대표이사",
      question1: "1",
      question2: "1",
      attachment: "http://localhost:3001/uploads/제목 없음.png",
      Sign: "http://localhost:3001/uploads/images.jpg",
      status: "approved",
      entering: "2024-07-28T00:00:00.000Z",
      leavedate: null,
      createdAt: "2024-07-28T10:46:16.000Z",
      updatedAt: "2024-07-31T10:46:48.000Z",
      isAdmin: true,
    },
    {
      userId: "qwe1234c",
      username: "테스트1",
      usermail: "qwe1234@four-chains.com",
      phoneNumber: "0101234324",
      company: "본사",
      department: "개발부",
      team: "개발 1팀",
      position: "사원",
      spot: "사원",
      question1: "1",
      question2: "1",
      attachment: null,
      Sign: null,
      status: "approved",
      entering: "2024-07-29T00:00:00.000Z",
      leavedate: null,
      createdAt: "2024-07-29T11:29:54.000Z",
      updatedAt: "2024-07-29T11:29:54.000Z",
      isAdmin: false,
    },
    {
      userId: "qwe12345d",
      username: "테스트2",
      usermail: "qwewq4e2@four-chains.com",
      phoneNumber: "01012344444",
      company: "본사",
      department: "개발부",
      team: "개발 1팀",
      position: "사원",
      spot: "사원",
      question1: "1",
      question2: "1",
      attachment: null,
      Sign: null,
      status: "approved",
      entering: "2024-07-29T00:00:00.000Z",
      leavedate: null,
      createdAt: "2024-07-29T11:30:34.000Z",
      updatedAt: "2024-07-29T11:30:34.000Z",
      isAdmin: false,
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

  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [chatRoomPeopleManagement, setChatRoomPeopleManagement] =
    useState<boolean>(false);
  const user = useRecoilValue(userState);
  const selectedPerson = useRecoilValue(selectedPersonState);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const messageTypeContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const socketRef = useRef<any>(null);

  type Files = string | File | null;
  const [files, setFiles] = useState<Files>();

  const handleSendMessage = () => {
    const inputElement = document.querySelector(
      ".text-input"
    ) as HTMLDivElement;

    if (inputElement && inputElement.innerHTML.trim() !== "") {
      /*
      // 백엔드 완성 시 주석 해제
      const isChatRoomExist = rooms.some(room => {
        return room.users.length === 2 && 
               room.includes(user.id) && 
               room.includes(selectedPerson.userId);
      });
      
      if(isChatRoomExist) { 
        SocketClient.sendMsg(room, inputElement.innerHTML.trim());
        setMessageInput("");
        if (inputElement) {
          inputElement.innerHTML = "";
        }
        
      } else {
        createChatRoom(user.id, selectedPerson.userId);
        // 방 만들고 이후 동작 추가할 것
      }
        */

      setMessages([...messages, inputElement.innerHTML.trim()]);
      //sendMsg(room, inputElement.innerHTML.trim());
      socket.emit("sendMsg", inputElement.innerHTML.trim());
      setMessageInput("");
      if (inputElement) {
        inputElement.innerHTML = "";
      }
    }
  };

  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && event.shiftKey) {
      return;
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const inputElement = e.target as HTMLDivElement;
    setMessageInput(inputElement.innerText);

    if (
      inputElement.innerText.trim() === "" &&
      inputElement.childNodes.length === 1 &&
      inputElement.childNodes[0].nodeName === "BR"
    ) {
      inputElement.innerHTML = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(event.target.files[0]);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setFiles(event.dataTransfer.files[0]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleScroll = () => {
    if (messageContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } =
        messageContainerRef.current;
      const atBottom = scrollHeight - scrollTop === clientHeight;
      setIsAtBottom(atBottom);
    }
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  /*
  //백엔드 완료 시 주석 해제
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        if (user) {
          const rooms = await getChatRooms(user.id);
          setRooms(rooms);
        }
      } catch (err) {
        console.error("Error fetching person data:", err);
      }
    };

    fetchChatRooms();
  }, []);
  */

  useEffect(() => {
    const inputElement = document.querySelector(
      ".text-input"
    ) as HTMLDivElement;
    if (inputElement && inputElement.innerHTML.trim() === "") {
      inputElement.innerHTML = "";
    }
  }, []);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  /*
  //백엔드 완료 시 주석 해제할 것
  useEffect(() => {
    rooms.forEach(room => {
      joinChatRoom(room.roomId);
    });
  }, [rooms]);
  */

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
        <div className="UpperIconBar">
          <img
            src={GraySearchIcon}
            className="SearchIcon"
            alt="GraySearchIcon"
          />
          {selectedPerson && selectedPerson.username !== "통합 알림" && (
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
      </div>
      <div
        className="Message-container"
        ref={messageContainerRef}
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
      >
        {selectedPerson.username !== "통합 알림" &&
          messages.map((message, index) => (
            <div key={index} className="Message">
              <img src={UserIcon_dark} alt="User Icon" />
              <div className="RightBox">
                <div>
                  {user.team ? user.team : user.department} {user.username}
                </div>
                <div className="MsgTimeBox">
                  <div
                    className="MsgBox"
                    dangerouslySetInnerHTML={{ __html: message }}
                  />
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
        {selectedPerson.username !== "통합 알림" && (
          <div className="Message-Input">
            <img
              className={`GoToBottom ${isAtBottom ? "hidden" : ""}`}
              src={GoToBottomIcon}
              alt="GoToBottomIcon"
              onClick={scrollToBottom}
            />
            <div className="MessageTypeContainer" ref={messageTypeContainerRef}>
              <div className="Input-Outer">
                <div
                  className="text-input"
                  contentEditable="true"
                  suppressContentEditableWarning
                  onInput={handleInput}
                  onKeyDown={handleInputKeyPress}
                  data-placeholder="메시지를 입력하세요. (Enter로 전송 / Shift + Enter로 개행)"
                >
                  {" "}
                </div>
                <div className="send-btn" onClick={handleSendMessage}>
                  전송
                </div>
              </div>
            </div>
            <div className="underIcons">
              <label
                htmlFor="file-upload"
                style={{ cursor: "pointer", display: "flex" }}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <div className="fileIconBox">
                  <div className="textBubble">파일 첨부</div>
                  <img src={FileIcon} alt="fileIcon" className="fileIcon" />
                </div>
              </label>
            </div>
          </div>
        )}
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
          {DummyPeoples.map((onePerson, index) => (
            <Popover key={index} placement="left-start">
              <div className="OneMember">
                <div className="AttachWithName">
                  <img
                    src={UserIcon_dark}
                    alt="UserIcon_dark"
                    className="AttachIcon"
                  />
                  <span>
                    {onePerson.team} {onePerson.username}
                  </span>
                  {onePerson.isAdmin ? (
                    <div className="AdminIcon">admin</div>
                  ) : (
                    ""
                  )}
                </div>
                <PopoverTrigger>
                  <img
                    src={MessageMenu}
                    alt="MenuIcon"
                    className="OptionIcon"
                  />
                </PopoverTrigger>
                <Portal>
                  <PopoverContent
                    className="PersonSide_popover Management"
                    _focus={{ boxShadow: "none" }}
                  >
                    <div className={`Message-OnClick-Menu`}>
                      <div className="OutOfChat">내보내기</div>
                      <div className="ChangeAdmin">관리자 변경</div>
                    </div>
                  </PopoverContent>
                </Portal>
              </div>
            </Popover>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Message;
