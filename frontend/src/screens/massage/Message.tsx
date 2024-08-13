import React, { useState, useEffect, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { userState, selectedPersonState } from '../../recoil/atoms';
import { getChatRooms } from '../../services/message/MessageApi';
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
  const user = useRecoilValue(userState);
  const selectedPerson = useRecoilValue(selectedPersonState);

  const handleIncomingMessage = ({ name, id, msg, team, department, position }: Message) => {
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
    const fetchChatRooms = async () => {
      try {
        if (user) {
          const response = await getChatRooms(user.id);
          setRooms(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error("Error fetching chat rooms:", err);
        setRooms([]);
      }
    };
    fetchChatRooms();
  }, [user]);

  useEffect(() => {
    rooms.forEach((room) => {
      socket.emit("joinRoom", room.roomId);
    });
  }, [rooms]);

  const handleSendMessage = useCallback(() => {
    const inputElement = document.querySelector(".text-input") as HTMLDivElement;
    if (inputElement && inputElement.innerHTML.trim() !== "") {
      const message = inputElement.innerHTML.trim();
      const roomname = selectedPerson.team
        ? `${selectedPerson.team} ${selectedPerson.username}`
        : selectedPerson.department
          ? `${selectedPerson.department} ${selectedPerson.username}`
          : "defaultRoomId";

      const messageData = {
        roomname: null,
        TargetID: selectedPerson.userId,
        userID: user.id,
        message: message,
        chatAdmin: null,
        PrivateTitle: null,
        Targetinfo: null
      };

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
  }, [selectedPerson, user]);

  const emitMessage = (messageData: any) => {
    socket.emit("createPrivateRoom", messageData);
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
