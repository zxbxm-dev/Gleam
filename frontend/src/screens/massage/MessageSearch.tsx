import React, { useEffect, useState } from 'react';
import { XIcon } from "../../assets/images/index";
import { useRecoilValue, useRecoilState } from 'recoil';
import { selectedRoomIdState, userState, SearchClickMsg, selectUserID } from '../../recoil/atoms';
import io from 'socket.io-client';

interface SearchProps {
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
    setTargetMessageId : React.Dispatch<React.SetStateAction<string | null>>
}

const MessageSearch: React.FC<SearchProps> = ({ setShowSearch, setTargetMessageId }) => {
    const selectedRoomId = useRecoilValue(selectedRoomIdState);
    const [serverMessages, setServerMessages] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
    const user = useRecoilValue(userState);
    const personSideGetmsg = useRecoilValue(selectUserID);
    const [clickMessage, setClickMessage] = useRecoilState(SearchClickMsg);

    useEffect(() => {
        const socket = io('http://localhost:3001', { transports: ["websocket"] });

        const requesterId = user.userID;
        const roomId = selectedRoomId.roomId;

        const handleChatHistory = (data: any) => {
            if (Array.isArray(data.chatHistory)) {
                setServerMessages(data.chatHistory);
                console.log(data);

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

        // 새 메시지 수신
        socket.on('message', (newMessage) => {
            setServerMessages(prevMessages => [
                ...prevMessages,
                ...(Array.isArray(newMessage) ? newMessage : [newMessage])
            ]);
        });

        // 오류 처리
        socket.on('error', (error) => {
            console.error('메시지 가져오는 중 오류 발생:', error);
        });

        emitChatHistoryRequest();

        return () => {
            socket.disconnect();
        };
    }, [selectedRoomId]);


    useEffect(() => {
        const socket = io('http://localhost:3001', { transports: ["websocket"] });
        // console.log("소켓 연결됨");

        const selectedUserId = personSideGetmsg.userID;
        const requesterId = user.id;

        if (selectedUserId) {
            console.log("personCheckMsg 이벤트 전송:", { selectedUserId, requesterId });
            socket.emit("personCheckMsg", { selectedUserId, requesterId });
        }

        socket.on("chatHistory", (data: { chatHistory: any[], joinIds: string[], hostId: string; }) => {
            console.log("chatHistory 데이터 수신:", data);
            if (data) {
                setServerMessages(data.chatHistory);

            } else if (!data) {
                console.error("받아오는 데이터가 없습니다.");
                setServerMessages([]);
            }
        });

        socket.on("noChatRoomsForUser", (data) => {
            // console.log("사용자에게 채팅방 없음.", data);
        });

        socket.on("chatHistoryForUser", (data) => {
            console.log("chatHistoryForUser 데이터 수신:", data);
            if (data) {
                setServerMessages(data.chatHistory);

            } else if (!data) {
                console.error("받아오는 데이터가 없습니다.");
                setServerMessages([]);
            }
        });

        socket.on("chatHistoryForOthers", (data) => {
            console.log("chatHistoryForOthers 데이터 수신:", data);
            if (data) {
                setServerMessages(data.chatHistory);

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
        setTargetMessageId(message.messageId);
    };

    // console.log(filteredMessages);


    return (
        <div className="PeopleManagementCon">
            <div className="Management-header">
                <span>대화 검색</span>
                <img
                    src={XIcon}
                    alt="XIcon"
                    onClick={() => {setShowSearch(false); setTargetMessageId(null)}}
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
