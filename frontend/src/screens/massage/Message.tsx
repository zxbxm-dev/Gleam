import React, { useState, useEffect, useCallback } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userState, selectedPersonState, selectedRoomIdState } from '../../recoil/atoms';
import {
  MessageIcon
} from "../../assets/images/index";
import Header from './MessageHeader';
import MessageContainer from './MessageContainer';
import PeopleManagement from './PeopleManagement';
import MessageSearch from './MessageSearch';
import io, { Socket } from 'socket.io-client';
export interface Message {
  name: string;
  id: string;
  msg: string;
  team?: string;
  department?: string;
  position?: string;
}

const Message: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRoomPeopleManagement, setChatRoomPeopleManagement] = useState<boolean>(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const [selectedRoomId, setSelectedRoomId] = useRecoilState(selectedRoomIdState);
  const user = useRecoilValue(userState);
  const selectedPerson = useRecoilValue(selectedPersonState);
  const [showSearch, setShowSearch] = useState(false);

  const [targetMessageId, setTargetMessageId] = useState<string | null>(null);
  useEffect(() => {
    const socket = io('http://localhost:3001', {
      transports: ['websocket'],
    });
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  //메신저 창이 열렸을 경우 Title 및 favicon 변경
  useEffect(() => {
    document.title = "Gleam Messenger";

    const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (favicon) {
      favicon.href = MessageIcon;
    }
  }, []);

  useEffect(() => {
    const storedRoomId = localStorage.getItem('latestChatRoomId');
    if (storedRoomId) {
      const roomId = Number(storedRoomId); // Convert to number
      // console.log("클라이언트 저장된 방 ID:", roomId);
      setSelectedRoomId({
        roomId: roomId,
        isGroup: false,
        OtherTitle: ""
      });
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
    if (socket) {

      socket.on("recMsg", handleIncomingMessage);
      return () => {
        socket.off("recMsg", handleIncomingMessage);
      };
    }
  }, []);

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

  const toggleSection = (section: 'search' | 'peopleManagement') => {
    if (section === 'search') {
      if (showSearch) {
        setShowSearch(false);
        setTargetMessageId(null);
      } else {
        setShowSearch(true);
      }
      setChatRoomPeopleManagement(false);
    } else if (section === 'peopleManagement') {
      setShowSearch(false);
      setChatRoomPeopleManagement(true);
    } else {
      setShowSearch(false);
      setChatRoomPeopleManagement(false);
    }
  };
  

  return (
    <div className="Message-contents">
      <Header
        selectedPerson={selectedPerson}
        toggleSection={toggleSection}
      />
      <MessageContainer
        socket={socket}
        messages={messages}
        selectedPerson={selectedPerson}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        handleDragOver={handleDragOver}
        targetMessageId={targetMessageId}
      />
      <PeopleManagement
        chatRoomPeopleManagement={chatRoomPeopleManagement}
        setChatRoomPeopleManagement={setChatRoomPeopleManagement}
        socket={socket}
      />

      {showSearch && <MessageSearch
        setShowSearch={setShowSearch}
        setTargetMessageId={setTargetMessageId}
      />}
    </div>
  );
};

export default Message;
