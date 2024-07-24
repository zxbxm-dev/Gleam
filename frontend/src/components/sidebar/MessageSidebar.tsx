import React, { useState, useEffect } from "react";
import { PersonData } from "../../services/person/PersonServices";
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';

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

    const departments = Array.from(new Set(personData?.map(person => person.department) || []));
    const teams = Array.from(new Set(personData?.map(person => person.team) || []));

    const departmentTeams: {
        [key: string]: string[];
    } = {
        "개발부": ["개발 1팀", "개발 2팀"],
        "마케팅부": ["디자인팀", "기획팀"],
        "관리부": ["관리팀", "지원팀", "시설팀"],
        "알고리즘 연구실": ["암호 연구팀", "AI 연구팀"],
        "동형분석 연구실": ["동형분석 연구팀"],
        "블록체인 연구실": ["크립토 블록체인 연구팀", "API 개발팀"],
    };
    

    return (
        <div className="message-sidebar">
            {personData ? (
                <ul>
                    <li>
                        {user.team ? `${user.team}` : `${user.department}`} {user.username} | {user.position}
                    </li>
                    {departments.map((department) => (
                        <li key={department}>
                            <button onClick={() => toggleDepartmentExpansion(department)}>
                                {expandedDepartments[department] ? '-' : '+'} {department}
                            </button>
                            {expandedDepartments[department] && (
                                <ul>
                                    {departmentTeams[department].map((team) => (
                                        <li key={team}>
                                            <button onClick={() => toggleTeamExpansion(team)}>
                                                {expandedTeams[team] ? '-' : '+'} {team}
                                            </button>
                                            {expandedTeams[team] && (
                                                <ul>
                                                    {personData.map((person) => (
                                                        person.department === department && person.team === team && (
                                                            <li key={person.userId}>
                                                                <div>
                                                                    <img src={person.attachment} alt={`${person.username}'s profile`} />
                                                                    {person.team} <strong>{person.username}</strong> | {person.position}
                                                                </div>
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
};

export default MessageSidebar;
