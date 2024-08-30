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
import { useRecoilValue } from 'recoil';
import { selectedRoomIdState, userState, SearchClickMsg } from '../../recoil/atoms';
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
  handleSendMessage: () => void;
  handleInput: (e: React.FormEvent<HTMLDivElement>) => void;
  handleInputKeyPress: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  files: File | null;
  setFiles: React.Dispatch<React.SetStateAction<File | null>>;
}

interface Messenger {
  content: string;
  messageId: number;
  timestamp: string;
  userId: string;
  username: string;
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
  handleSendMessage,
  handleInput,
  handleInputKeyPress,
  files,
  setFiles,
}) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [serverMessages, setServerMessages] = useState<any[]>([]);
  const [messageMetadata, setMessageMetadata] = useState<{ createdAt: string[]; userInfo: string[]; usersAttachment: string[]; }>({
    createdAt: [],
    userInfo: [],
    usersAttachment: [],
  });
  const selectedRoomId = useRecoilValue(selectedRoomIdState);
  const [personData, setPersonData] = useState<Person[] | null>(null);
  const user = useRecoilValue(userState);
  const ClickMsgSearch = useRecoilValue(SearchClickMsg);

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

  useEffect(() => {
    const socket = io('http://localhost:3001', { transports: ["websocket"] });

    socket.emit('getChatHistory', selectedRoomId);

    socket.on('chatHistory', (messages: any[]) => {
      if (Array.isArray(messages)) {
        setServerMessages(messages);
      } else {
        console.error('Received data is not an array of messages:', messages);
      }
    });

    socket.on('message', (newMessage: any) => {
      setServerMessages(prevMessages => [...prevMessages, ...(Array.isArray(newMessage) ? newMessage : [newMessage])]);
    });

    socket.on('error', (error) => {
      console.error('Error fetching messages:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedRoomId]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [serverMessages]);

// console.log(typeof ClickMsgSearch.messenger);
// console.log(ClickMsgSearch.messenger.content);

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
                      {msg.content === ClickMsgSearch ?"asdfsfd":""}
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
