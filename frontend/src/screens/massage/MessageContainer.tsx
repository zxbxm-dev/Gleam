import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  UserIcon_dark,
  GoToBottomIcon,
  FileIcon,
  MailIcon,
  WorkReportIcon,
  ScheduleIcon
} from "../../assets/images/index";
import io from 'socket.io-client';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
  selectedRoomIdState,
  userState,
  SearchClickMsg,
  selectUserID,
  selectedPersonState,
  NewChatModalstate
} from '../../recoil/atoms';
import { PersonData } from "../../services/person/PersonServices";
import { Person } from "../../components/sidebar/MemberSidebar";
import { Message } from './Message';

interface MessageContainerProps {
  messages: Message[];
  selectedPerson: any;
  isAtBottom: boolean;
  scrollToBottom: () => void;
  handleFileDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleInput: (e: React.FormEvent<HTMLDivElement>) => void;
  files: File | null;
  setFiles: React.Dispatch<React.SetStateAction<File | null>>;
}

const NoticeIcons: { [key: string]: string } = {
  Mail: MailIcon,
  WorkReport: WorkReportIcon,
  Schedule: ScheduleIcon,
};

const NoticeNameList: { [key: string]: string } = {
  Mail: "Mail - Notification",
  WorkReport: "Work Report - Notification",
  Schedule: "Schedule - Notification",
};

const DummyNotice = [
  {
    classify: "Mail",
    title: "‘Gleam’에서 새로운 메일이 도착했습니다.",
    description: "안녕하세요 관리팀 염승희 사원입니다. 이번부터 시행되는 사내시스템 ‘Gleam’에 관련하여",
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
    description: "날짜 : 2024/07/26 오전11:57 장소 : 미팅룸 주최자 : 김현지 참가자 : 서주희",
    date: new Date(),
  },
];

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const isPM = hours >= 12;
  const formattedHours = isPM ? hours - 12 : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const period = isPM ? '오후' : '오전';
  return `${period} ${formattedHours === 0 ? 12 : formattedHours}:${formattedMinutes}`;
};

const MessageContainer: React.FC<MessageContainerProps> = ({
  isAtBottom,
  scrollToBottom,
  handleFileDrop,
  handleDragOver,
  handleInput,
  files,
  setFiles,
}) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [serverMessages, setServerMessages] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [messageMetadata, setMessageMetadata] = useState<{ createdAt: string[]; userInfo: string[]; usersAttachment: string[]; }>({
    createdAt: [],
    userInfo: [],
    usersAttachment: [],
  });
  const selectedRoomId = useRecoilValue(selectedRoomIdState);
  const [personData, setPersonData] = useState<Person[] | null>(null);
  const user = useRecoilValue(userState);
  const personSideGetmsg = useRecoilValue(selectUserID);
  const ClickMsgSearch = useRecoilValue(SearchClickMsg);
  const selectedPerson = useRecoilValue(selectedPersonState);
  const [ModelPlusJoinId, setModelPlusJoinId] = useRecoilState(NewChatModalstate);
  const [joinUserData, setJoinUserdata] = useState<string[]>([]);
const [RoomhostId, setRoomHostId] = useState("");

  //메신저 보내기 Socket
  const handleSendMessage = useCallback(() => {
    const inputElement = document.querySelector(".text-input") as HTMLDivElement;
    if (inputElement && inputElement.innerHTML.trim() !== "") {
      const message = inputElement.innerHTML.trim();

      let messageData;
      if (selectedRoomId === -1) {
        messageData = {
          invitedUserIds: [selectedPerson.userId],
          userId: user.id,
          content: message,
          hostUserId: null,
          name: null
        };
      } else if (selectedPerson.userId === user.userID) {
        messageData = {
          roomId: null,
          userId: user.id,
          content: message,
        };
      } else if (selectedRoomId === 0) {
        messageData = {
          roomId: null,
          userId: user.id,
          content: message,
        };
      } else {
        messageData = {
          roomId: selectedRoomId,
          senderId: user.id,
          content: message,
        };
      }
      console.log(messageData);

      emitMessage(messageData);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          name: user.username,
          id: user.id,
          msg: message,
          team: user.team || "",
          department: user.department || "",
          position: user.position || "",
        }
      ]);

      setFiles(null);
      inputElement.innerHTML = "";

      setTimeout(() => {
        ChatTabGetMessage();
        PersonSideGetMessage();
      }, 200);
    }
  }, [selectedRoomId, selectedPerson, user]);


  const emitMessage = (messageData: any) => {
    const socket = io('http://localhost:3001', { transports: ["websocket"] });
    if (selectedRoomId === -1) {
      socket.emit("createPrivateRoom", messageData);
    } else {
      socket.emit("sendMessage", messageData);
      console.log(messageData);

    }
  };

  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };


  const fetchPersonData = useCallback(async () => {
    try {
      const response = await PersonData();
      const approvedUsers = response.data.filter((item: any) => item.status === 'approved');
      const sortedData = approvedUsers.sort((a: Person, b: Person) => new Date(a.entering).getTime() - new Date(b.entering).getTime());
      setPersonData(sortedData);
    } catch (err) {
      console.error("Error fetching person data:", err);
    }
  }, []);

  useEffect(() => {
    fetchPersonData();
  }, [fetchPersonData]);

  useEffect(() => {
    if (personData && serverMessages.length > 0) {
      // userId를 사용자 정보(팀/부서 + 사용자 이름)로 매핑
      const userToInfoMap = personData.reduce((map, person) => {
        map.set(person.userId, `${person.team ? person.team : person.department} ${person.username}`);
        return map;
      }, new Map<string, string>());

      // userId를 attachment로 매핑 (없으면 UserIcon_dark)
      const userToAttachMap = personData.reduce((map, person) => {
        map.set(person.userId, person.attachment || UserIcon_dark);
        return map;
      }, new Map<string, string>());

      const newUserInfos = serverMessages.map(msg => userToInfoMap.get(msg.userId) || '알 수 없는 사용자');
      const createdAt = serverMessages.map(msg => formatTime(msg.timestamp));
      const usersAttachment = serverMessages.map(msg => userToAttachMap.get(msg.userId) || UserIcon_dark);

      setMessageMetadata({ userInfo: newUserInfos, createdAt, usersAttachment });
    }
  }, [personData, serverMessages]);


  const setJoinUser = () => {
    setModelPlusJoinId((prevState) => ({
      ...prevState,
      joinUser: joinUserData,
      hostId:RoomhostId
    }));
  }

  //chatTab에서 사람 눌렀을 때 대화방 메시지 조회
  const ChatTabGetMessage = useCallback(() => {
    const socket = io('http://localhost:3001', { transports: ["websocket"] });


    // 채팅 기록 요청
    socket.emit('getChatHistory', selectedRoomId);

    // chatHistory와 joinIds를 처리
    socket.on('chatHistory', (data: { chatHistory: any[], joinIds: string[], hostId:string; }) => {
      if (Array.isArray(data.chatHistory)) {
        setServerMessages(data.chatHistory);
        setJoinUserdata(data.joinIds);
        setRoomHostId(data.hostId);
        setJoinUser();

      } else {
        console.error('Received data is not an array of messages:', data);
      }
    });

    // 새 메시지 수신
    socket.on('message', (newMessage: any) => {
      setServerMessages(prevMessages => [...prevMessages, ...(Array.isArray(newMessage) ? newMessage : [newMessage])]);
    });

    // 오류 처리
    socket.on('error', (error) => {
      console.error('Error fetching messages:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedRoomId]);

  // 메시지 컨테이너 스크롤
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [serverMessages]);

  // personSide에서 사람 이름 클릭 시 대화방 메시지 조회
  const PersonSideGetMessage = useCallback(() => {
    const socket = io('http://localhost:3001', { transports: ["websocket"] });
    // console.log("소켓 연결됨");

    const selectedUserId = personSideGetmsg.userID;
    const requesterId = user.id;

    if (selectedUserId) {
      // console.log("personCheckMsg 이벤트 전송:", { selectedUserId, userId });
      socket.emit("personCheckMsg", { selectedUserId, requesterId });
    }

    socket.on("chatHistory", (data: { chatHistory: any[], joinIds: string[], hostId:string; }) => {
      console.log("chatHistory 데이터 수신:", data);
      if (Array.isArray(data)) {
        setServerMessages(data);

        console.log(data);

      } else if (data) {
        console.log("배열 아닌 데이터", data);
      } else if (!data) {
        console.error("받아오는 데이터가 없습니다.");
        setServerMessages([]);
      }
    });

    socket.on("noChatRoomsForUser", (data) => {
      // console.log("사용자에게 채팅방 없음.", data);
    });

    socket.on("chatHistoryForUser", (data) => {
      // console.log("chatHistoryForUser 데이터 수신:", data);
      if (Array.isArray(data)) {
        setServerMessages(data);
        console.log(data);

      } else if (data) {
        console.log("배열 아닌 데이터", data);
      } else if (!data) {
        console.error("받아오는 데이터가 없습니다.");
        setServerMessages([]);
      }
    });

    socket.on("chatHistoryForOthers", (data) => {
      // console.log("chatHistoryForOthers 데이터 수신:", data);
      if (Array.isArray(data)) {
        setServerMessages(data);
        console.log(data);

      } else if (data) {
        console.log("배열 아닌 데이터", data);
      } else if (!data) {
        console.error("받아오는 데이터가 없습니다.");
        setServerMessages([]);
      }
    });

    socket.on("error", (error) => {
      console.error("소켓 오류:", error.message);
    });

    return () => {
      socket.off("chatHistory");
      socket.off("noChatRoomsForUser");
      socket.off("chatHistoryForUser");
      socket.off("chatHistoryForOthers");
      socket.off("error");
    };
  }, [personSideGetmsg.userID, user.id]);


  useEffect(() => {
    const timer = setTimeout(() => {
      ChatTabGetMessage();
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedRoomId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      PersonSideGetMessage();
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedPerson]);

  // console.log(typeof ClickMsgSearch.messenger);
  // console.log(ClickMsgSearch.messenger.content);

    // 메시지가 읽혔을 때 호출되는 함수
    const handleReadMessage = useCallback((messageId: string) => {
      
      const socket = io('http://localhost:3001', { transports: ["websocket"] });

      console.log(`읽은 메시지 ID: ${messageId}`); // 읽은 메시지 ID를 콘솔에 출력
      socket.emit('messageRead', { messageId, userId: user.id });
    }, [user.id]);
  
    // 메시지가 화면에 나타나면 읽은 것으로 간주
    useEffect(() => {
      if (serverMessages.length > 0) {
        serverMessages.forEach((msg) => {
          if (msg.userId !== user.id) {
            handleReadMessage(msg.messageId); // 상대방의 메시지를 읽었을 때만 처리
          }
        });
      }
    }, [serverMessages, handleReadMessage, user.id]);

  return (
    <div
      className="Message-container"
      ref={messageContainerRef}
      onDrop={handleFileDrop}
      onDragOver={handleDragOver}
    >
      {selectedRoomId !== -2 ? (
        serverMessages.map((msg, index) => (
          <div key={index} className="Message">
            <img src={messageMetadata.usersAttachment[index]} className='userCircleIcon' alt="User Icon" />
            <div className='CountBox'>
              <div className="RightBox">
                <div>{messageMetadata.userInfo[index]}</div>
                <div className="MsgTimeBox">
                  {messageMetadata.userInfo[index] &&
                    <div className={messageMetadata.userInfo[index].split(" ").pop() !== user.username ? "userMsgBox" : "MsgBox"}>
                      {msg.content || ""}
                      {msg.content === ClickMsgSearch ? "asdfsfd" : ""}
                    </div>
                  }
                  <div className="MsgTime">
                    {messageMetadata.createdAt[index]}
                  </div>
                </div>
              </div>
              <div className="ViewCount">1</div>
            </div>
          </div>
        ))
      ) : (
        DummyNotice.map((notice, index) => (
          <div key={index} className="Message">
            <img src={NoticeIcons[notice.classify]} alt="Notice Icon" />
            <div className="RightBox">
              <div className="NoticeName">{NoticeNameList[notice.classify]}</div>
              <div className="MsgTimeBox">
                <div className={`NoticeBox ${notice.classify}`}>
                  <div className="NoticeTitle">{notice.title}</div>
                  <div className="NoticeDescription">{notice.description}</div>
                </div>
                <div className="MsgTime">오후 4:30</div>
              </div>
            </div>
          </div>
        ))
      )}
      {selectedRoomId !== -2 && (
        <div className="Message-Input">
          <img
            className={`GoToBottom ${isAtBottom ? "hidden" : ""}`}
            src={GoToBottomIcon}
            alt="GoToBottomIcon"
            onClick={scrollToBottom}
          />
          <div className="MessageTypeContainer">
            <div className="Input-Outer">
              <div
                className="text-input"
                contentEditable="true"
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={handleInputKeyPress}
                data-placeholder="메시지를 입력하세요. (Enter로 전송 / Shift + Enter로 개행)"
              />
              <div className='InputRight'>
                <div className="underIcons">
                  <label htmlFor="file-upload" style={{ cursor: "pointer", display: "flex" }}>
                    <input
                      id="file-upload"
                      type="file"
                      accept="*"
                      onChange={(event) => setFiles(event.target.files ? event.target.files[0] : null)}
                      style={{ display: "none" }}
                    />
                    <div className="fileIconBox">
                      <div className="textBubble">파일 첨부</div>
                      <img src={FileIcon} alt="fileIcon" className="fileIcon" />
                    </div>
                  </label>
                </div>
                <div className="send-btn" onClick={handleSendMessage}>전송</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
