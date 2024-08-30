import React, { useState, useEffect, useCallback } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userState, selectedPersonState, selectedRoomIdState } from '../../recoil/atoms';
import { io } from 'socket.io-client';
import Header from './MessageHeader';
import MessageContainer from './MessageContainer';
import PeopleManagement from './PeopleManagement';

const socket = io("http://localhost:3001", { transports: ["websocket"] });

export interface Message {
  name: string;
  id: string;
  msg: string;
  team?: string;
  department?: string;
  position?: string;
}

const Message: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRoomPeopleManagement, setChatRoomPeopleManagement] = useState<boolean>(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [files, setFiles] = useState<File | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useRecoilState(selectedRoomIdState);
  const user = useRecoilValue(userState);
  const selectedPerson = useRecoilValue(selectedPersonState);

  useEffect(() => {
    const storedRoomId = localStorage.getItem('latestChatRoomId');
    if (storedRoomId) {
      const roomId = Number(storedRoomId); // Convert to number
      console.log("클라이언트 저장된 방 ID:", roomId);
      setSelectedRoomId(roomId);
    }
  }, [setSelectedRoomId]);

  const handleIncomingMessage = ({ name, id, msg, team, department, position }: Message) => {
    console.log("클라이언트 유저 정보 수신:", { name, id, msg, team, department, position });
    setMessages(prevMessages => [
      ...prevMessages,
      { name, id, msg, team, department, position }
    ]);
  };

  useEffect(() => {
    socket.on("recMsg", handleIncomingMessage);
    return () => {
      socket.off("recMsg", handleIncomingMessage);
    };
  }, []);

  useEffect(() => {
    rooms.forEach((room) => {
      console.log("클라이언트에서 보낸 방에 방 번호:", room.roomId);
      socket.emit("joinRoom", room.roomId);
    });
  }, [rooms]);

  useEffect(() => {
    if (selectedRoomId) {
      console.log("선택한 방에 참여 중:", selectedRoomId);
      socket.emit("joinRoom", selectedRoomId);
    }
  }, [selectedRoomId]);

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
      } else {
        messageData = {
          roomId: selectedRoomId,
          userId: user.id,
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
    }
  }, [selectedRoomId, selectedPerson, user]);

  const emitMessage = (messageData: any) => {
    if (selectedRoomId === -1) {
      socket.emit("createPrivateRoom", messageData);
    } else {
      socket.emit("sendMessageToRoom", messageData);
    }
  };

  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
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

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const scrollToBottom = () => {
    const container = document.querySelector('.Message-container') as HTMLDivElement;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.Message-container') as HTMLDivElement;
      if (container) {
        const { scrollHeight, scrollTop, clientHeight } = container;
        setIsAtBottom(scrollHeight - scrollTop === clientHeight);
      }
    };

    const container = document.querySelector('.Message-container') as HTMLDivElement;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className="Message-contents">
      <Header
        selectedPerson={selectedPerson}
        setChatRoomPeopleManagement={setChatRoomPeopleManagement}
      />
      <MessageContainer
        messages={messages}
        selectedPerson={selectedPerson}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        handleFileDrop={handleFileDrop}
        handleDragOver={handleDragOver}
        handleSendMessage={handleSendMessage}
        handleInput={handleInput}
        handleInputKeyPress={handleInputKeyPress}
        files={files}
        setFiles={setFiles}
      />
      <PeopleManagement
        chatRoomPeopleManagement={chatRoomPeopleManagement}
        setChatRoomPeopleManagement={setChatRoomPeopleManagement}
      />
    </div>
  );
};

export default Message;
