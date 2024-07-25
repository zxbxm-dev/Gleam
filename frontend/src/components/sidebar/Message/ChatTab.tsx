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
    userPosition: string | null;
    onPersonClick: (username: string, team: string, department:string, position:string) => void;
}

const ChatDataTab: React.FC<ChatDataTabProps> = ({
    dummyData,
    userAttachment,
    userTeam,
    userDepartment,
    userName,
    onPersonClick,
    userPosition
}) => {
    return (
        <div className="chat-data-tab">
          <li className="My-bar" onClick={() => onPersonClick(userName || '', userTeam || '', userDepartment || '', userPosition || '')}>
                <img className="My-attach" src={userAttachment} />
                <div>
                    {userTeam ? `${userTeam}` : `${userDepartment}`} {userName}
                </div>
                <img className="Message-Me" src={MessageMe} />
            </li>

            {dummyData
                .sort((a, b) => b.isUpdateat - a.isUpdateat)
                .map((dummy) => (
                    <div className="ChatLog" key={dummy.userId} onClick={() => onPersonClick(dummy.username, dummy.team,dummy.department,dummy.position)}>
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
