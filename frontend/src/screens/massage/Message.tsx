import React, { useState } from "react";
import { HrLine, UserIcon_dark } from "../../assets/images/index";
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';

const Message = () => {
    const [messageInput, setMessageInput] = useState<string>("");
    const [messages, setMessages] = useState<string[]>([]);
    const user = useRecoilValue(userState);

    const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (messageInput.trim() !== '') {
                setMessages([...messages, messageInput.trim()]);
                setMessageInput('');
            }
        }
    };

    return (
        <div className="Message-contents">
            <div className="Message-header">
                <span>기획팀 전아름</span>
                <img src={HrLine} alt="Horizontal Line" />
                <span>팀장</span>
            </div>
            <div className="Message-container">
                {messages.map((message, index) => (
                    <div key={index} className="Message">
                        <img src={UserIcon_dark} />
                        <div className="RightBox">
                            <div>
                                {user.team ? user.team : user.department} {user.username}
                            </div>
                            <div className="MsgTimeBox">
                                <div className="MsgBox">
                                    {message}
                                </div>
                                <div className="MsgTime">
                                    오후 4:30
                                </div>
                            </div>

                        </div>

                    </div>
                ))}
                <div className="Message-Input">
                    <input
                        type="text"
                        placeholder="메시지를 입력하세요."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={handleInputKeyPress}
                    />
                </div>
            </div>
        </div>
    );
};

export default Message;
