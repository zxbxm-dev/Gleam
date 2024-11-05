import React, { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { selectedRoomIdState, userState, SearchClickMsg, selectUserID } from '../../recoil/atoms';
import {Socket} from 'socket.io-client';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    XIcon,
    GrayArrowDown,
    GrayArrowUp,
    GraySearchIcon,
    GrayCalendar,
  } from "../../assets/images/index";

interface SearchProps {
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
    setTargetMessageId : React.Dispatch<React.SetStateAction<string | null>>
    socket: Socket<any> | null;
}

const MessageSearch: React.FC<SearchProps> = ({ setShowSearch, setTargetMessageId, socket }) => {
    const selectedRoomId = useRecoilValue(selectedRoomIdState);
    const [serverMessages, setServerMessages] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
    const [periodfilterdMessages, setPeriodFilteredMessages] = useState<any[]>([]);
    const user = useRecoilValue(userState);
    const personSideGetmsg = useRecoilValue(selectUserID);

    const [searchDueDate, setSearchDueDate] = useState('1년');
    const [DueDateVisivle, setDueDateVisivle] = useState(false);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
        if (socket) {
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
            socket.on('message', (newMessage: any) => {
                setServerMessages(prevMessages => [
                    ...prevMessages,
                    ...(Array.isArray(newMessage) ? newMessage : [newMessage])
                ]);
            });

            // 오류 처리
            socket.on('error', (error: any) => {
                console.error('메시지 가져오는 중 오류 발생:', error);
            });

            emitChatHistoryRequest();

            return () => {
                socket.off('groupChatHistory');
                socket.off('chatHistory');
                socket.off('message');
                socket.off('error');
            };
        }
    }, [selectedRoomId]);


    useEffect(() => {
        if (socket) {
            const selectedUserId = personSideGetmsg.userID;
            const requesterId = user.id;

            if (selectedUserId) {
                console.log("personCheckMsg 이벤트 전송:", { selectedUserId, requesterId });
                socket.emit("personCheckMsg", { selectedUserId, requesterId });
            }

            socket.on("chatHistory", (data: { chatHistory: any[], joinIds: string[], hostId: string; }) => {
                if (data) {
                    setServerMessages(data.chatHistory);

                } else if (!data) {
                    console.error("받아오는 데이터가 없습니다.");
                    setServerMessages([]);
                }
            });

            socket.on("noChatRoomsForUser", (data: any) => {
                // console.log("사용자에게 채팅방 없음.", data);
            });

            socket.on("chatHistoryForUser", (data: any) => {
                if (data) {
                    setServerMessages(data.chatHistory);

                } else if (!data) {
                    console.error("받아오는 데이터가 없습니다.");
                    setServerMessages([]);
                }
            });

            socket.on("chatHistoryForOthers", (data: any) => {
                console.log("chatHistoryForOthers 데이터 수신:", data);
                if (data) {
                    setServerMessages(data.chatHistory);

                } else if (!data) {
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
        // console.log("소켓 연결됨");
    }, [selectedRoomId]);

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = serverMessages.filter(message => {
            return message && typeof message.content === 'string' &&
                message.content.toLowerCase().includes(lowercasedQuery);
        });
        setFilteredMessages(filtered);
        setPeriodFilteredMessages(filtered)
    }, [searchQuery, serverMessages]);

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    const handleMessageClick = (message: any) => {
        setTargetMessageId(message.messageId);
    };

    console.log(periodfilterdMessages);

    const filterMessagesByDate = (period: string) => {
        const now = new Date();
        let pastDate: Date;
    
        if (period === '1년') {
            pastDate = new Date();
            pastDate.setFullYear(now.getFullYear() - 1);
        } else if (period === '1개월') {
            pastDate = new Date();
            pastDate.setMonth(now.getMonth() - 1);
        }
    
        // 날짜 필터링은 serverMessages에서 직접 필터링
        const dateFilteredMessages = filteredMessages.filter((message: any) => {
            const messageDate = new Date(message.timestamp);
            return messageDate >= pastDate && messageDate <= now;
        });

        // 검색어에 맞는 메시지들 중에서 날짜에 맞는 것만 필터링
        const finalFilteredMessages = dateFilteredMessages.filter((message: any) => {
            return filteredMessages.some(filteredMessage => filteredMessage.messageId === message.messageId);
        });
    
        setPeriodFilteredMessages(finalFilteredMessages);
    };
    
    const filterMessagesByCustomDate = () => {
        if (startDate && endDate) {
            const customFilteredMessages = filteredMessages.filter((message: any) => {
                const messageDate = new Date(message.timestamp);
                return messageDate >= startDate && messageDate <= endDate;
            });

            // 검색어 필터링된 메시지와 사용자 기간 필터링을 결합
            const finalFilteredMessages = customFilteredMessages.filter((message: any) => {
                return filteredMessages.some(filteredMessage => filteredMessage.messageId === message.messageId);
            });

            setPeriodFilteredMessages(finalFilteredMessages);
        }
    };

    useEffect(() => {
        console.log('검색 기간 바뀜');
        if (searchDueDate === '1년') {
            filterMessagesByDate('1년');
        } else if (searchDueDate === '1개월') {
            filterMessagesByDate('1개월');
        } else {
            filterMessagesByCustomDate();
        }
    }, [searchDueDate, startDate, endDate, serverMessages]);

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
            <div className='searchInput_container'>
                <input
                    className='searchInput'
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="검색어를 입력해 주세요."
                />
                <img src={GraySearchIcon} alt="down" />
            </div>
            {DueDateVisivle ? (
                <div className='searchDate_Noborder' onClick={() => {setDueDateVisivle(false); setSearchDueDate('1년');}}>
                    <div>
                        1년
                    </div>
                    {DueDateVisivle ? (
                        <img src={GrayArrowUp} alt="down" onClick={() => setDueDateVisivle(false)}/>
                    ) : (
                        <img src={GrayArrowDown} alt="down" onClick={() => setDueDateVisivle(true)}/>
                    )}
                </div>
            ) : (
                <div className='searchDate'>
                    <div>
                        {searchDueDate}
                    </div>
                    {DueDateVisivle ? (
                        <img src={GrayArrowUp} alt="down" onClick={() => setDueDateVisivle(false)}/>
                    ) : (
                        <img src={GrayArrowDown} alt="down" onClick={() => setDueDateVisivle(true)}/>
                    )}
                </div>
            )}
            {DueDateVisivle && (
                <div className='dueDate_container'>
                    <div className='dueDate_select_content' onClick={() => {setDueDateVisivle(false); setSearchDueDate('1개월');}}>
                        1개월
                     </div>   
                    <div className='dueDate_wirte_content'>
                        <div>직접입력</div>
                        <div className='dueDate_datepicker'>
                            <img src={GrayCalendar} alt="GrayCalendar" />
                            <div className='dueDate_datepicker_box'>
                                <DatePicker
                                    selected={startDate}
                                    onChange={date => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    placeholderText={new Date().toLocaleDateString('ko-KR')}
                                    dateFormat="yyyy-MM-dd"
                                    className="datepicker"
                                />
                            </div>
                            <div>~</div>
                            <div className='dueDate_datepicker_box'>
                                <DatePicker
                                    selected={endDate}
                                    onChange={date => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    placeholderText={new Date().toLocaleDateString('ko-KR')}
                                    dateFormat="yyyy-MM-dd"
                                    className="datepicker"
                                />
                            </div>
                        </div>
                     </div>   
                </div>
            )}
            <div className="SearchItems">
                {searchQuery ? (
                    periodfilterdMessages.length > 0 ? (
                        periodfilterdMessages.map((message, index) => (
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
