import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  UserIcon_dark,
  GoToBottomIcon,
  FileIcon,
  MailIcon,
  WorkReportIcon,
  ScheduleIcon,
  mail_attachment_hwp,
  mail_attachment_word,
  mail_attachment_xlsx,
  mail_attachment_pdf,
  mail_attachment_ppt,
  mail_attachment_txt,
  mail_attachment_jpg,
  mail_attachment_png,
  mail_attachment_gif,
  mail_attachment_svg,
  mail_attachment_zip,
  mail_attachment_mp3,
  mail_attachment_mp4,
  mail_attachment_avi,
  FileUserDown,
  FileMyDown,
  MessageIcon,
  MessageHeaderLogo,
} from "../../assets/images/index";
import { Socket } from 'socket.io-client';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import {
  selectedRoomIdState,
  userState,
  SearchClickMsg,
  selectUserID,
  selectedPersonState,
  NewChatModalstate,
  MsgOptionState,
  MsgNewUpdateState
} from '../../recoil/atoms';
import { PersonData } from "../../services/person/PersonServices";
import { Person } from "../../components/sidebar/MemberSidebar";
import { Message } from './Message';
import { messageFile, getFile } from '../../services/message/MessageApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MessageContainerProps {
  selectedPerson: any;
  isAtBottom: boolean;
  scrollToBottom: () => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  targetMessageId: string | null;
  socket: Socket<any> | null;
}

const NoticeIcons: { [key: string]: string } = {
  Mail: MailIcon,
  WorkReport: WorkReportIcon,
  Schedule: ScheduleIcon,
};

const NoticeNameList: { [key: string]: string } = {
  // Mail: "Mail - Notification",
  // WorkReport: "Work Report - Notification",
  // Schedule: "Schedule - Notification",
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

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const day = daysOfWeek[date.getDay()];  // 요일 가져오기
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${day}요일`;
}

const showCustomNotification = (username: string, userteam: string ,message: string) => {
  const messageWithLineBreaks = message.replace(/<br\s*\/?>/gi, '<br />');
  
  toast(
    <div style={{ position: 'relative' }}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '3px'}}>
          <span style={{color: "#454545", fontFamily: "var(--font-family-Noto-B)", fontSize: '12px'}}>{username} </span>
          {userteam &&
            <span style={{color: "#ADADAD", fontFamily: "var(--font-family-Noto-R)", fontSize: '15px'}}>| </span> 
          }
          <span style={{color: "#ADADAD", fontFamily: "var(--font-family-Noto-M)", fontSize: '11px'}}>{userteam}</span>
        </div>
        <div style={{position: 'absolute', right: '-10px', top: '-3px', display: 'flex', alignItems: 'center', gap: '3px'}}>
          <img style={{width: '15px', height: '15px'}} src={MessageIcon} alt="MessageIcon" />
          <img style={{width: '80px', height: '18px'}} src={MessageHeaderLogo} alt="MessageHeaderLogo" />
        </div>

      </div>
      <div style={{color: '#454545', fontSize: '12px', fontFamily: "var(--font-family-Noto-M)", marginLeft: '20px', marginTop: '10px'}} dangerouslySetInnerHTML={{ __html: messageWithLineBreaks }} />
    </div>,
    {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: { backgroundColor: '#FFFFFF', border: '1px solid #45C552'}
    }
  );
};


const MessageContainer: React.FC<MessageContainerProps> = ({
  isAtBottom,
  scrollToBottom,
  handleDragOver,
  targetMessageId,
  socket
}) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [serverMessages, setServerMessages] = useState<any[]>([]);
  const [serverisGroup, setServerIsGroup] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [messageMetadata, setMessageMetadata] = useState<{
    usersAttachment: string[];
    userInfo: string[];
    createdAt: string[]
  }>({
    usersAttachment: [],
    userInfo: [],
    createdAt: []
  });
  const selectedRoomId = useRecoilValue(selectedRoomIdState);
  const setSelectedRoomId = useSetRecoilState(selectedRoomIdState);
  const [personData, setPersonData] = useState<Person[] | null>(null);
  const user = useRecoilValue(userState);
  const personSideGetmsg = useRecoilValue(selectUserID);
  const ClickMsgSearch = useRecoilValue(SearchClickMsg);
  const selectedPerson = useRecoilValue(selectedPersonState);
  const [MsgOptionsState, setMsgOptionsState] = useRecoilState(MsgOptionState);
  const [ModelPlusJoinId, setModelPlusJoinId] = useRecoilState(NewChatModalstate);
  const [files, setFiles] = useState<File | null>(null);
  const [readMsg, setReadMsg] = useState("");
  const setMsgNewUpdate = useSetRecoilState(MsgNewUpdateState);
  const isNewMessage = useRecoilValue(MsgNewUpdateState);

  const MessageGetFile = (messageId: number, msg: any) => {
    getFile(messageId)
      .then(response => {
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${messageId}${msg.content}`);

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error("Error downloading file:", error);
      });
  };

  const MessagePostFile = () => {
    if (!files) {
      console.error("No file selected.");
      return;
    }

    const userId = user.id;
    const roomId = selectedRoomId.roomId;
    const content = files.name;
    let receiverId;

    if (selectedPerson.userId === undefined) {
      receiverId = user.id;
    } else {
      receiverId = selectedPerson.userId;
    }

    // 파일과 함께 메시지를 전송합니다.
    messageFile(content, userId, roomId, files, receiverId)

      .then(response => {
        console.log("File uploaded:", response.data);
        setServerMessages(response.data.content);
      })
      .catch(error => {
        console.error("Error uploading file:", error);
      });
  };

  //메신저 보내기 Socket
  const handleSendMessage = useCallback(() => {
    const inputElement = document.querySelector(".text-input") as HTMLDivElement;
    let messageContent: string;

    // 메시지 내용 설정
    if (files) {
      messageContent = files.name; // 파일이 있는 경우 파일 이름을 메시지로 설정
    } else if (inputElement && inputElement.innerHTML.trim() !== "") {
      messageContent = cleanMessage(inputElement.innerHTML.trim()); // 텍스트 입력이 있을 경우 그 값을 메시지로 설정
    } else {
      return; // 아무 내용이 없으면 전송하지 않음
    }

    let messageData;

    // 채팅방 ID에 따라 메시지 데이터 구성
    if (selectedRoomId.roomId === -1) {
      messageData = {
        invitedUserIds: [selectedPerson.userId],
        userId: user.id,
        content: messageContent,
        receiverId: selectedPerson.userId,
        hostUserId: null,
        name: null,
      };

    } else if (selectedRoomId.roomId === 0) {
      messageData = {
        roomId: null,
        userId: user.id,
        content: messageContent,
        receiverId: selectedPerson.userId,
      };
    } else {
      messageData = {
        roomId: selectedRoomId.roomId,
        senderId: user.id,
        content: messageContent,
        receiverId: selectedPerson.userId,
      };

      if (selectedPerson.userId === undefined) {
        messageData = {
          roomId: selectedRoomId.roomId,
          senderId: user.id,
          content: messageContent,
          receiverId: user.id,
        };
      }
    }


    // 파일이 있는 경우 POST 요청으로 파일 전송
    if (files) {
      MessagePostFile();

    } else {
      // 파일이 없는 경우 소켓을 통해 메시지 전송
      emitMessage(messageData);
    }

    // 클라이언트 쪽 메시지 추가
    setMessages(prevMessages => [
      ...prevMessages,
      {
        name: user.username,
        id: user.id,
        msg: messageContent,
        team: user.team || "",
        department: user.department || "",
        position: user.position || "",
      }
    ]);

    // 입력 필드 및 파일 초기화
    setFiles(null);
    inputElement.innerHTML = "";

    // 일정 시간 후 메시지 목록 갱신
    // setTimeout(() => {
    //   ChatTabGetMessage();
    //   PersonSideGetMessage();
    // }, 200);
  }, [selectedRoomId, selectedPerson, user, files]);

  function cleanMessage(message: string): string { // 복사한 메세지 HTML 제거 함수
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = message;
    return tempDiv.textContent || tempDiv.innerText || "";
  }

  const emitMessage = (messageData: any) => {
    if (socket) {

      if (messageData.file) {
        const formData = new FormData();
        formData.append('file', messageData.file);
        formData.append('fileName', messageData.fileName);
        formData.append('userId', messageData.userId);
        formData.append('roomId', messageData.roomId);

        socket.emit('uploadFile', formData);
      }

      if (selectedRoomId.roomId === -1) {
        socket.emit("createPrivateRoom", messageData);
        socket.on("chatRoomCreated", (data: any) => {
          setSelectedRoomId({
            roomId: data.roomId,
            isGroup: false,
            OtherTitle: "",
          });
          
          let newChatRoom;
          newChatRoom = {
            roomId: data.roomId,
            senderId: messageData.userId,
            content: messageData.content,
            receiverId: messageData.receiverId,
          };
          socket.emit("getNewMsg", newChatRoom);
        })
        setMsgNewUpdate(true);
      } else {
        socket.emit("sendMessage", messageData);
        console.log('보낸 메세지', messageData)
        socket.emit("getNewMsg", messageData);
        setMsgNewUpdate(true);
        ChatTabGetMessage();
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const inputElement = e.target as HTMLDivElement;
    if (inputElement.innerText.trim() === "" && inputElement.childNodes.length === 1 && inputElement.childNodes[0].nodeName === "BR") {
      inputElement.innerHTML = "";
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setFiles(event.dataTransfer.files[0]);
  };

  const fileIcons: { [key: string]: string } = {
    hwp: mail_attachment_hwp,
    doc: mail_attachment_word,
    docx: mail_attachment_word,
    xls: mail_attachment_xlsx,
    xlsx: mail_attachment_xlsx,
    pdf: mail_attachment_pdf,
    ppt: mail_attachment_ppt,
    pptx: mail_attachment_ppt,
    txt: mail_attachment_txt,
    jpg: mail_attachment_jpg,
    jpeg: mail_attachment_jpg,
    png: mail_attachment_png,
    gif: mail_attachment_gif,
    svg: mail_attachment_svg,
    zip: mail_attachment_zip,
    mp3: mail_attachment_mp3,
    mp4: mail_attachment_mp4,
    avi: mail_attachment_avi,
  };

  const getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return fileIcons[extension || ''] || mail_attachment_txt;
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
    if (Array.isArray(personData) && personData.length > 0 && Array.isArray(serverMessages) && serverMessages.length > 0) {
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
  // console.log(socket);

  //chatTab에서 사람 눌렀을 때 대화방 메시지 조회
  const ChatTabGetMessage = useCallback(() => {
    if (socket) {
      const requesterId = user.userID;
      const roomId = selectedRoomId.roomId;

      // console.log('requesterId',requesterId)
      // console.log('roomId',roomId)
  
      const handleChatHistory = (data: any) => {
        if (Array.isArray(data.chatHistory)) {
          setServerMessages(data.chatHistory);
          // console.log('서버에서 대화목록 조회 완료-----', data);
  
          setModelPlusJoinId(prevState => ({
            ...prevState,
            joinUser: data.joinIds,
            hostId: data.hostId,

          }));
        } else {
          console.error('수신된 데이터가 메시지 배열이 아닙니다:', data);
        }
      };
      
      // 채팅 이력 요청
      const emitChatHistoryRequest = () => {
        const event = selectedRoomId.isGroup ? 'getGroupChatHistory' : 'getChatHistory';
        socket.emit(event, roomId, requesterId);
      };
      
      // 채팅 이력 수신 처리
      socket.on('groupChatHistory', handleChatHistory);
      socket.on('chatHistory', handleChatHistory);
      
      // 오류 처리
      socket.on('error', (error: any) => {
        console.error('메시지 가져오는 중 오류 발생:', error);
      });
  
      emitChatHistoryRequest();
  
      // 클린업: 컴포넌트가 언마운트되거나 업데이트될 때 기존 리스너 제거
      return () => {
        socket.off('groupChatHistory', handleChatHistory);
        socket.off('chatHistory', handleChatHistory);
        socket.off('error');
      };
    }
  }, [selectedRoomId, user.userID]);
  
  useEffect(() => {
    ChatTabGetMessage();
  }, [ChatTabGetMessage]); // 필요한 의존성만 넣음
  
  // 메시지 컨테이너 스크롤
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [serverMessages]);

  // personSide에서 사람 이름 클릭 시 대화방 메시지 조회
  const PersonSideGetMessage = useCallback(() => {
    if (socket) {

    const selectedUserId = personSideGetmsg.userID;
    const requesterId = user.id;
    if (selectedUserId) {
      socket.emit("personCheckMsg", { selectedUserId, requesterId });
    }

    socket.on("chatHistory", (data: { chatHistory: any[], joinIds: string[], hostId: string; }) => {
      if (data) {
        setServerMessages(data.chatHistory);
        setModelPlusJoinId(prevState => ({
          ...prevState,
          joinUser: data.joinIds,
          hostId: data.hostId
        }));
      } else if (!data) {
        console.error("받아오는 데이터가 없습니다.");
        setServerMessages([]);
      }
    });

    socket.on("noChatRoomsForUser", (data: any) => {
      console.log("사용자에게 채팅방 없음.", data);
      setServerMessages([]);
    });

    socket.on("chatHistoryForUser", (data: any) => {
      if (data) {
        const transformedChatHistory = data.chatHistory.map((message: any) => ({
          ...message,
          isReadOther: message.isRead === 1 ? true : 0,
        }));
      
      setServerMessages(transformedChatHistory);

        setModelPlusJoinId(prevState => ({
          ...prevState,
          joinUser: data.joinIds,
          hostId: data.hostId
        }));
      } else {
        console.error("받아오는 데이터가 없습니다.");
        setServerMessages([]);
      }
    });

    socket.on("chatHistoryForOthers", (data: any) => {
      console.log("chatHistoryForOthers 데이터 수신:", data);
      if (data) {
        setServerMessages(data.chatHistory);

        setModelPlusJoinId(prevState => ({
          ...prevState,
          joinUser: data.joinIds,
          hostId: data.hostId
        }));
      } else {
        console.error("받아오는 데이터가 없습니다.");
        setServerMessages([]);
      }
    });

    socket.on("error", (error: any) => {
      console.error("소켓 오류:", error.message);
    });

    return () => {
      socket.off("chatHistory");
      socket.off("noChatRoomsForUser");
      socket.off("chatHistoryForUser");
      socket.off("chatHistoryForOthers");
      socket.off("error");
    };
    }
  }, [personSideGetmsg.userID, user.id, readMsg, handleSendMessage]);

  useEffect(() => {
    // if(selectedRoomId.roomId<0){
    PersonSideGetMessage();
  // }
  }, [personSideGetmsg.userID]);

  useEffect(() => {
    if(selectedRoomId.roomId>0){
      ChatTabGetMessage();
    }
  }, []);

  // 메시지가 읽혔을 때 호출되는 함수
  const handleReadMessage = useCallback((messageId: string) => {
    if (socket) {
      const userId = user.userID;
      socket.emit('markMessageAsRead', { messageId, userId });
      setMsgOptionsState(true);
      setReadMsg(messageId);

      setTimeout(() => {
        setMsgOptionsState(false);
      }, 500);
    }
  }, [socket, user.userID]);

  // 메시지가 화면에 나타나면 읽은 것으로 간주
  useEffect(() => {
    if (Array.isArray(serverMessages) && serverMessages.length > 0) {
      serverMessages.forEach((msg) => {
        if (msg.userId !== user.id && msg.isReadOther === 0) {
          handleReadMessage(msg.messageId); // 상대방의 메시지를 읽었을 때만 처리
        }
      });
    }
  }, [selectedRoomId.roomId, serverMessages, handleReadMessage, user.id]);

  const ensureArray = (arr: any) => Array.isArray(arr) ? arr : [];

  useEffect(() => {
    if (targetMessageId && messageRefs.current[targetMessageId]) {
      messageRefs.current[targetMessageId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [targetMessageId]);

  useEffect(() => {
    socket?.on("newMsgNoti", () => console.log('새로운 메시지 알림'))

  });

  // 새로운 메시지 수신
  useEffect(() => {
    if (socket) {
      socket.on('newMsgData', (messageData: any) => {
        
        const formattedMessage = {
          content: messageData.content,
          fileValue: messageData.fileValue,
          isReadOther: messageData.isReadOther,
          messageId: messageData.messageId,
          timestamp: messageData.timestamp,
          userId: messageData.senderId,
          contentType: 'text',
        };

        // 같은 방에서 메시지가 오는 경우 메시지 업데이트
        if (messageData.roomId === selectedRoomId.roomId) {
          setServerMessages(prevMessages => [...prevMessages, formattedMessage]);
        }
      });
      
      socket.on('googleNoti', (messageData: any) => {
        const formattedMessage = {
          content: messageData.content,
          fileValue: messageData.fileValue,
          isReadOther: true,
          messageId: messageData.messageId,
          timestamp: messageData.timestamp,
          userId: messageData.senderId,
        };

        // 본인 메시지가 아닌 경우에만 알림 표시
        if (messageData.senderId !== user.id) {
          // Notification API 권한 요청 및 알림 표시
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              // 알림을 표시할 때 사용자 정보와 메시지를 포함
              const notification = new Notification(
                `${messageData.senderUsername} ${messageData.senderPosition}`, 
                {
                  body: formattedMessage.content,
                }
              );

              // 3초 후에 알림 자동 닫힘
              setTimeout(() => {
                notification.close();
              }, 10000);
            }
          });
        }
      });

      socket.on('messageRead', (messageData: any) => {
        console.log('읽은 메세지 아이디', messageData.messageId, '읽은 사람', messageData.userId);
  
        setServerMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.messageId === messageData.messageId && msg.isReadOther === 0
              ? { ...msg, isReadOther: true }
              : msg
          )
        );
      });

      socket.on('userKicked', (messageData: any) => {
        const formattedMessage = {
          content: messageData.content,
          timestamp: messageData.timestamp,
        };

        setServerMessages(prevMessages => [...prevMessages, formattedMessage]);
        ChatTabGetMessage();
      });

      socket.on('roomUpdated', (messageData: any) => {
        const formattedMessage = {
          content: messageData.content,
          timestamp: messageData.timestamp,
        };

        setServerMessages(prevMessages => [...prevMessages, formattedMessage]);
        ChatTabGetMessage();
      });
    }

    return () => {
      socket?.off('newMsgData');
      socket?.off('googleNoti');
      socket?.off('messageRead');
      socket?.off('userKicked');
      socket?.off('roomUpdated');
    };
  }, [socket, selectedRoomId]);

  useEffect(() => {
    if (socket) {
      socket.on('readStatus', (messageData: any) => {
        console.log('readStatus 실행 될때의 서버메세지', serverMessages)
        setServerMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.messageId === messageData.messageId && msg.isReadOther === 0
              ? { ...msg, isReadOther: true }
              : msg
          )
        );
      });
    }

    return () => {
      socket?.off('readStatus');
    };
  }, [serverMessages])

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log("Notification permission granted.");
      } else {
        console.log("Notification permission denied.");
      }
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, [])
  // console.log('messageContainer 호출', selectedRoomId)
  // console.log('내 연결 상태',socket?.connected);
  // console.log('회원 아이디',user.id)
  console.log('서버메세지', serverMessages)
  // console.log('메세지', messages)
  // console.log('서버메세지 메타데이터', messageMetadata)
  // console.log('Recoil 에 저장된 selectedRoomId',selectedRoomId)
  // console.log('받아온 targetMessageId',targetMessageId)
  return (
    <div
      className="Message-container"
      ref={messageContainerRef}
      onDrop={handleFileDrop}
      onDragOver={handleDragOver}
    >
      {selectedRoomId.roomId !== -2 ? (
        Array.isArray(serverMessages) && serverMessages.length > 0 ? (
          serverMessages.map((msg: any, index) => {
            const previousMsg = serverMessages[index - 1];
            const currentDate = formatDate(msg.timestamp);
            const previousDate = previousMsg ? formatDate(previousMsg.timestamp) : null;
            const shouldShowDate = index === 0 || currentDate !== previousDate;
          
            return (
              <div key={index}>
                {shouldShowDate && (
                  <div className="date-divider">
                    {currentDate}
                  </div>
                )}
          
                {/* 기존 메시지 UI */}
                {
                  msg.contentType === 'text' ? 
                  (
                    <div className={msg.messageId === targetMessageId ? 'Message highlighted-message' : 'Message'}>
                      <img
                        src={(ensureArray(messageMetadata.usersAttachment)[index]) || UserIcon_dark}
                        className='userCircleIcon'
                        alt="User Icon"
                      />
                      <div className='CountBox'>
                        <div className="RightBox">
                          <div>{(ensureArray(messageMetadata.userInfo)[index]) || "Unknown User"}</div>
                          <div className="MsgTimeBox">
                            {ensureArray(messageMetadata.userInfo)[index] &&
                              <div className={ensureArray(messageMetadata.userInfo)[index].split(" ").pop() !== user.username ? "userMsgBox" : "MsgBox"}>
                                {msg.fileValue === 1 && (
                                  <div className='WhiteBox'>
                                    <img src={getFileIcon(msg.content)} alt="File Icon" />
                                  </div>
                                )}
                                {msg.content ? (
                                  <div
                                    key={msg.messageId}
                                    ref={(el) => (messageRefs.current[msg.messageId] = el)}
                                    dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />').replace(/ {2,}/g, '&nbsp;&nbsp;') }}
                                  />
                                ) : ""}
              
                                {msg.content === ClickMsgSearch ? "asdfsfd" : ""}
                                {msg.fileValue === 1 && (
                                  <div className='FileDown' onClick={() => MessageGetFile(msg.messageId, msg)}>
                                    <img src={ensureArray(messageMetadata.userInfo)[index].split(" ").pop() !== user.username ? FileUserDown : FileMyDown} />
                                  </div>
                                )}
                              </div>
                            }
                            <div className="MsgTime">
                              {formatTime(msg.timestamp) || "시간 미정"}
                            </div>
                          </div>
                        </div>
                        <div className="ViewCount">
                          {
                            selectedRoomId.isGroup
                              ? (msg.unreadCount === 0 ? "" : msg.unreadCount)
                              : (msg.isReadOther === 0
                                ? "1"
                                : (msg.isReadOther === true
                                  ? ""
                                  : "1"
                                )
                              )
                          }
                        </div>
                      </div>
                    </div>
                  )
                  :
                  (
                    <div className='Message leave_message'>{formatTime(msg.timestamp)} {msg.content}</div>
                  )
                }
              </div>
            );
          })
        )
        : (
          <div></div>
        )
      ) : (
        DummyNotice.map((notice, index) => (
          <div key={index} className="Message">
            {/* <img src={NoticeIcons[notice.classify]} alt="Notice Icon" />
            <div className="RightBox">
              <div className="NoticeName">{NoticeNameList[notice.classify]}</div>
              <div className="MsgTimeBox">
                <div className={`NoticeBox ${notice.classify}`}>
                  <div className="NoticeTitle">{notice.title}</div>
                  <div className="NoticeDescription">{notice.description}</div>
                </div>
                <div className="MsgTime">오후 4:30</div>
              </div>
            </div> */}
          </div>
        )
        )
      )}
      {selectedRoomId.roomId !== -2 && (
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
                {files ? files.name : ""}
              </div>

              <div className='InputRight'>
                <div className="underIcons">
                  <label htmlFor="file-upload" style={{ cursor: "pointer", display: "flex" }}>
                    <input
                      id="file-upload"
                      type="file"
                      accept="*"
                      onChange={(event) => {
                        const file = event.target.files ? event.target.files[0] : null;
                        if (file) {
                          setFiles(file);
                        }
                      }}
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
      <ToastContainer />
    </div>
  );
};

export default MessageContainer;