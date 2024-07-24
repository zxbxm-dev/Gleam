import React from 'react';
import {
    MessageMe,
    MessageMenu,
    UserIcon_dark,
} from "../../../assets/images/index";

interface ChatDataTabProps {
    dummyData: any[];
    userAttachment: string;
    userTeam: string | null;
    userDepartment: string | null;
    userName: string | null;
}

const ChatDataTab: React.FC<ChatDataTabProps> = ({
    dummyData,
    userAttachment,
    userTeam,
    userDepartment,
    userName
}) => {
    return (
        <div className="chat-data-tab">
            <li className="My-bar">
                <img className="My-attach" src={userAttachment} />
                <div>
                    {userTeam ? `${userTeam}` : `${userDepartment}`} {userName}
                </div>
                <img className="Message-Me" src={MessageMe} />
            </li>

            {dummyData
                .sort((a, b) => b.isUpdateat - a.isUpdateat)
                .map((dummy) => (
                    <div className="ChatLog" key={dummy.userId}>
                        {dummy.isGroupChat ? (
                            <div className="LogBox">
                                <div className="Left">
                                    <img className="My-attach" src={UserIcon_dark} alt="User Icon" />
                                    <p>단체채팅방: {dummy.username}</p>
                                </div>
                                <ul>
                                    {/* {dummy.participants.map((participant:any) => (
                <li key={participant.userId}>
                    {participant.team ? `${participant.team}` : `${participant.department}`} {participant.username}
                </li>
            ))} */}
                                </ul>
                                <img className="Message-Menu" src={MessageMenu} alt="Message Menu" />
                            </div>
                        ) : (
                            <div className="LogBox">
                                <div className="Left">
                                    <img className="My-attach" src={UserIcon_dark} alt="User Icon" />
                                    {dummy.team ? `${dummy.team}` : `${dummy.department}`} {dummy.username}
                                </div>
                                <img className="Message-Menu" src={MessageMenu} alt="Message Menu" />
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );
}

export default ChatDataTab;
