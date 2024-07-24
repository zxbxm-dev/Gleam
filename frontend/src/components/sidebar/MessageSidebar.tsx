import React, { useState, useEffect } from "react";
import { PersonData } from "../../services/person/PersonServices";
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';
import {
    MessageMe,
    MessageMenu,
    UserIcon_dark,
    MenuArrow_down,
    MenuArrow_right
} from "../../assets/images/index";

interface Person {
    userId: string;
    username: string;
    position: string;
    department: string;
    team: string;
    phoneNumber?: string;
    usermail?: string;
    entering: Date;
    attachment: string;
}

const MessageSidebar: React.FC = () => {
    const [personData, setPersonData] = useState<Person[] | null>(null);
    const [expandedDepartments, setExpandedDepartments] = useState<{ [key: string]: boolean }>({});
    const [expandedTeams, setExpandedTeams] = useState<{ [key: string]: boolean }>({});
    const user = useRecoilValue(userState);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await PersonData();
                const sortedData = response.data.sort((a: Person, b: Person) => new Date(a.entering).getTime() - new Date(b.entering).getTime());
                setPersonData(sortedData);
            } catch (err) {
                console.error("Error fetching person data:", err);
            }
        };

        fetchData();
    }, []);

    const toggleDepartmentExpansion = (departmentName: string) => {
        setExpandedDepartments((prevExpandedDepartments) => ({
            ...prevExpandedDepartments,
            [departmentName]: !prevExpandedDepartments[departmentName]
        }));
    };

    const toggleTeamExpansion = (teamName: string) => {
        setExpandedTeams((prevExpandedTeams) => ({
            ...prevExpandedTeams,
            [teamName]: !prevExpandedTeams[teamName]
        }));
    };

    const departmentTeams: {
        [key: string]: string[];
    } = {
        "개발부": ["개발 1팀", "개발 2팀"],
        "마케팅부": ["디자인팀", "기획팀"],
        "관리부": ["관리팀", "지원팀", "시설팀"],
        "알고리즘 연구실": ["암호 연구팀", "AI 연구팀"],
        "동형분석 연구실": ["동형분석 연구팀"],
        "블록체인 연구실": ["크립토 블록체인 연구팀", "API 개발팀"]
    };

    return (
        <div className="message-sidebar">
            {personData ? (
                <ul className="Sidebar-Ms">
                    <li className="My-bar">
                        <img className="My-attach" src={user.attachment} />
                        <div>
                            {user.team ? `${user.team}` : `${user.department}`} {user.username}
                        </div>
                        <img className="Message-Me" src={MessageMe} />
                    </li>
                    {personData.filter(person => !person.department).map((person) => (
                        <li className="No-dept" key={person.userId}>
                            <div className="No-Left">
                                <img src={person.attachment ? person.attachment : UserIcon_dark} alt={`${person.username}`} />
                                {person.username}
                            </div>
                            <img className="Message-Menu" src={MessageMenu} />
                        </li>
                    ))}
                    {Object.keys(departmentTeams).map((department) => (
                        <li className="DeptTeams" key={department}>
                            <button className="downBtn" onClick={() => toggleDepartmentExpansion(department)}>
                                {expandedDepartments[department] ? <img src={MenuArrow_down} /> : <img src={MenuArrow_right} />} {department}
                            </button>
                            {expandedDepartments[department] && (
                                <ul className="DeptDown">
                                    {personData.map((person) => (
                                        person.department === department && person.team === "" && (
                                            <li className="No-dept" key={person.userId}>
                                                <div className="No-Left">
                                                    <img src={person.attachment ? person.attachment : UserIcon_dark} alt={`${person.username}`} />
                                                    {person.team ? `${person.team}` : `${person.department}`} {person.username}
                                                </div>

                                                <img className="Message-Menu" src={MessageMenu} />
                                            </li>
                                        )
                                    ))}
                                    {departmentTeams[department].map((team) => (
                                        <li key={team}>
                                            <button className="downTeamBtn" onClick={() => toggleTeamExpansion(team)}>
                                                {expandedTeams[team] ? <img src={MenuArrow_down} /> : <img src={MenuArrow_right} />} {team}
                                            </button>
                                            {expandedTeams[team] && (
                                                <ul>
                                                    {personData.map((person) => (
                                                        person.department === department && person.team === team && (
                                                            <li className="No-dept" key={person.userId}>
                                                                <div className="No-Left">
                                                                    <img src={person.attachment ? person.attachment : UserIcon_dark} alt={`${person.username}`} />
                                                                    {person.team ? `${person.team}` : `${person.department}`} {person.username}
                                                                </div>
                                                                <img className="Message-Menu" src={MessageMenu} />
                                                            </li>
                                                        )
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default MessageSidebar;
