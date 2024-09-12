import React, { useEffect, useState } from 'react';
import { XIcon } from "../../assets/images/index";
import { useRecoilValue, useRecoilState } from 'recoil';
import { selectedRoomIdState, userState, SearchClickMsg } from '../../recoil/atoms';
import io from 'socket.io-client';

interface SearchProps {
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const MessageSearch: React.FC<SearchProps> = ({ setShowSearch }) => {
    const selectedRoomId = useRecoilValue(selectedRoomIdState);
    const [serverMessages, setServerMessages] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
    const user = useRecoilValue(userState);
    const [clickMessage, setClickMessage] = useRecoilState(SearchClickMsg);

    useEffect(() => {
        const socket = io('http://localhost:3001', { transports: ["websocket"] });

        const requesterId = user.userID;
        
        socket.emit('getChatHistory', selectedRoomId, requesterId);

        socket.on('chatHistory', (messages: any[]) => {
            if (Array.isArray(messages)) {
                setServerMessages(messages);
                setFilteredMessages(messages);
            } else {
                console.error('Received data is not an array of messages:', messages);
            }
        });

        socket.on('message', (newMessage: any) => {
            setServerMessages(prevMessages => [...prevMessages, ...(Array.isArray(newMessage) ? newMessage : [newMessage])]);
            setFilteredMessages(prevMessages => [...prevMessages, ...(Array.isArray(newMessage) ? newMessage : [newMessage])]);
        });

        socket.on('error', (error) => {
            console.error('Error fetching messages:', error);
        });

        return () => {
            socket.disconnect();
        };
    }, [selectedRoomId]);

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = serverMessages.filter(message => {
            return message && typeof message.content === 'string' &&
                message.content.toLowerCase().includes(lowercasedQuery);
        });
        setFilteredMessages(filtered);
    }, [searchQuery, serverMessages]);

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = String(date.getUTCFullYear()).slice(2);
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    const handleMessageClick = (message: any) => {
        // setClickMessage({ content: message });
    };

    // console.log(filteredMessages);
    

    return (
        <div className="PeopleManagementCon">
            <div className="Management-header">
                <span>대화 검색</span>
                <img
                    src={XIcon}
                    alt="XIcon"
                    onClick={() => setShowSearch(false)}
                />
            </div>
            <input
                className='searchInput'
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어를 입력해 주세요."
            />
            <div className="SearchItems">
                {searchQuery ? (
                    filteredMessages.length > 0 ? (
                        filteredMessages.map((message, index) => (
                            <div
                                key={index}
                                className="message-item"
                                onClick={() => handleMessageClick(message)}
                            >
                                <div className='Namestamp'>
                                    <div className='Name'>{message.username}</div>
                                    <div className='Timestamp'>{formatTimestamp(message.timestamp)}</div>
                                </div>
                                <div className={message.userId === user.userID ? "SendSearch" : "receiveSearch"}>
                                    {message.content}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='NoMsg'>검색된 메신저가 없습니다.</p>
                    )
                ) : (
                    <p className='NoMsg'>검색어를 입력해 주세요.</p>
                )}
            </div>
        </div>
    );
}

export default MessageSearch;
