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
import { selectedRoomIdState } from '../../recoil/atoms';
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
  const [messageMetadata, setMessageMetadata] = useState<{ createdAt: string[]; userInfo: string[] }>({
    createdAt: [],
    userInfo: [],
  });
  const selectedRoomId = useRecoilValue(selectedRoomIdState);
  const [personData, setPersonData] = useState<Person[] | null>(null);
  const socket = io('http://localhost:3001', { transports: ["websocket"] });

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
      const userToInfoMap = personData.reduce((map, person) => {
        map.set(person.userId, `${person.team ? person.team : person.department} ${person.username}`);
        return map;
      }, new Map<string, string>());

      const newUserInfos = serverMessages.map(msg => userToInfoMap.get(msg.userId) || 'Unknown User');
      const createdAt = serverMessages.map(msg => formatTime(msg.timestamp));
      setMessageMetadata({ userInfo: newUserInfos, createdAt });
    }
  }, [personData, serverMessages]);

  useEffect(() => {
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
            <img src={UserIcon_dark} alt="User Icon" />
            <div className="RightBox">
              <div>{messageMetadata.userInfo[index]}</div>
              <div className="MsgTimeBox">
                <div className="MsgBox">{msg.content || ""}</div>
                <div className="MsgTime">
                  <div className="ViewCount">1</div>
                  {messageMetadata.createdAt[index]}
                </div>
              </div>
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
              <div className="send-btn" onClick={handleSendMessage}>전송</div>
            </div>
          </div>
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
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
