import React, { useRef, useState, useEffect } from 'react';
import { Message } from './Message';
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

const MessageContainer: React.FC<MessageContainerProps> = ({
  messages,
  selectedPerson,
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
  const [servermsg, setMessages] = useState<any[]>([]);
  const [servermsgCreateAt, setMessageCreateAt] = useState<string[]>([]);
  const selectedRoomId = useRecoilValue(selectedRoomIdState);
  const socket = io('http://localhost:3001', { transports: ["websocket"] });

  // useEffect(() => {
  //   console.log('Server messages:', servermsg);
  
  //   if (servermsg.length > 0) {
  //     const userPart = servermsg[0]?.User;
      
  //     if (userPart && typeof userPart === 'object') {
  //       const username = userPart.username;
  //       console.log('Username:', username);
  //     } else {
  //       console.log('User part is not an object or is undefined');
  //     }
  //   }
  // }, [servermsg]);

useEffect(() => {
  const { roomId } = selectedRoomId;
console.log(roomId);

  // 메시지 요청 보내기
  socket.emit('getChatHistory', { roomId });

  // 메시지 응답 처리
  socket.on('messages', (response: { roomId: string, messages: any[] }) => {
    if (Array.isArray(response.messages)) {
      setMessages(response.messages);
      const createAt = response.messages.map(msg => formatTime(msg.createdAt));
      setMessageCreateAt(createAt);
    } else {
      console.error('메시지 배열이 아닌 데이터가 반환되었습니다:', response);
    }
  });

  // 새로운 메시지 처리
  socket.on('message', (newMessage: any) => {
    if (Array.isArray(newMessage)) {
      setMessages(prevMessages => [...prevMessages, ...newMessage]);
    } else {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  });

  // 에러 처리
  socket.on('error', (error) => {
    console.error('메시지 가져오기 에러:', error);
  });

  // 컴포넌트 언마운트 시 소켓 연결 해제
  return () => {
    if (socket) {
      socket.disconnect();
    }
  };
}, [selectedRoomId.roomId]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

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

  return (
    <div
      className="Message-container"
      ref={messageContainerRef}
      onDrop={handleFileDrop}
      onDragOver={handleDragOver}
    >
      {selectedPerson.username !== "통합 알림" ? (
        servermsg.map((msg, index) => (
          <div key={index} className="Message">
            <img src={UserIcon_dark} alt="User Icon" />
            <div className="RightBox">
              <div>{/* 팀, 이름 */}</div>
              <div className="MsgTimeBox">
                <div className="MsgBox">
                  {msg.content ? msg.content : ""}
                </div>
                <div className="MsgTime">
                  <div className="ViewCount">1</div>
                  {servermsgCreateAt[index]}
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
      {selectedPerson.username !== "통합 알림" && (
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
              >
                {" "}
              </div>
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
