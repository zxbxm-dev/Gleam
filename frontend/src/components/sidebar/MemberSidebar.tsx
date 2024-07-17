import "./Sidebar.scss";
import React, { useState, useEffect } from "react";
import { SideUp, SideDown, UserIcon_dark } from "../../assets/images/index";
import { PersonData } from "../../services/person/PersonServices";

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

interface Props {
  onClickMember: (userID: string, name: string, dept: string, team: string, position: string) => void;
}

type CurrentPageType =
  | '포체인스주식회사' | '개발부' | '개발1팀' | '개발2팀' | '블록체인사업부' | '블록체인1팀'
  | '마케팅부' | '기획팀' | '디자인팀' | '관리부' | '관리팀' | '지원팀'
  | '시설팀' | 'R&D센터' | '알고리즘연구실' | '동형분석연구실' | '블록체인연구실';

const MemberSidebar: React.FC<Props> = ({ onClickMember }) => {
  const [personData, setPersonData] = useState<Person[] | null>(null);
  const [sidebarState, setSidebarState] = useState<{ isExpanded: boolean; currentPage: CurrentPageType }>({
    isExpanded: true,
    currentPage: '포체인스주식회사',
  });
  const [history, setHistory] = useState<CurrentPageType[]>([]);

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

  const toggleSidebar = () => {
    setSidebarState((prevState) => ({
      ...prevState,
      isExpanded: !prevState.isExpanded,
    }));
  };

  const handleClick = (page: CurrentPageType) => {
    setHistory((prevHistory) => [...prevHistory, sidebarState.currentPage]);
    setSidebarState({ ...sidebarState, currentPage: page });
  };

  const handleBackClick = () => {
    setHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      const previousPage = newHistory.pop();
      if (previousPage) {
        setSidebarState((prevState) => ({
          ...prevState,
          currentPage: previousPage,
        }));
      }
      return newHistory;
    });
  };

  const handleMemberClick = (person: Person) => {
    onClickMember(person.userId, person.username, person.department, person.team, person.position);
  };

  const renderMembers = () => {
    if (!personData) return null;

    return (
      <div className="MemberTab">
        <div className="Fourchains">
          <span onClick={handleBackClick}>&lt; &nbsp;</span>
          <div>{sidebarState.currentPage}</div>
        </div>

        {personData
          .filter((person) => {
            switch (sidebarState.currentPage) {
              case '포체인스주식회사':
                return person.department === '' && (person.position === '대표이사' || person.position === '이사');
              case '개발부':
                return person.department === '개발부' && person.team === '';
              case '개발1팀':
                return person.department === '개발부' && person.team === '개발 1팀';
              case '개발2팀':
                return person.department === '개발부' && person.team === '개발 2팀';
              case '블록체인사업부':
                return person.department === '블록체인사업부' && person.team === '';
              case '블록체인1팀':
                return person.department === '블록체인사업부' && person.team === '블록체인 1팀';
              case '마케팅부':
                return person.department === '마케팅부' && person.team === '';
              case '기획팀':
                return person.department === '마케팅부' && person.team === '기획팀';
              case '디자인팀':
                return person.department === '마케팅부' && person.team === '디자인팀';
              case '관리부':
                return person.department === '관리부' && person.team === '';
              case '관리팀':
                return person.department === '관리부' && person.team === '관리팀';
              case '지원팀':
                return person.department === '관리부' && person.team === '지원팀';
              case '시설팀':
                return person.department === '관리부' && person.team === '시설팀';
              case 'R&D센터':
                return person.department === '알고리즘 연구실' && person.position === '연구실장';
              case '알고리즘연구실':
                return person.department === '알고리즘 연구실' && (person.team === '' || person.team.includes('연구팀'));
              case '동형분석연구실':
                return person.department === '동형분석 연구실' && (person.team === '' || person.team === '동형분석 연구팀');
              case '블록체인연구실':
                return person.department === '블록체인 연구실' && (person.team === '' || person.team === 'AI 개발팀' || person.team === '크립토 블록체인 연구팀');
              default:
                return false;
            }
          })
          .map((person, index) => (
            <div key={index} className="member" onClick={() => handleMemberClick(person)}>
              <div className="MemberFlex">
                <img src={person.attachment ? person.attachment : UserIcon_dark} alt={`${person.username}'s avatar`} />
                <div className="Font">{person.username} | {person.position}</div>
              </div>
            </div>
          ))}
      </div>
    );
  };

  const renderDept = () => {
    return (
      <div className="DeptMain">
        {sidebarState.currentPage === '포체인스주식회사' && (
          <>
            <div onClick={() => handleClick('개발부')}>개발부</div>
            <div onClick={() => handleClick('블록체인사업부')}>블록체인사업부</div>
            <div onClick={() => handleClick('마케팅부')}>마케팅부</div>
            <div onClick={() => handleClick('관리부')}>관리부</div>
            <div onClick={() => handleClick('R&D센터')}>R&D</div>
          </>
        )}
        {sidebarState.currentPage === '개발부' && (
          <>
            <div onClick={() => handleClick('개발1팀')}>개발 1팀</div>
            <div onClick={() => handleClick('개발2팀')}>개발 2팀</div>
          </>
        )}
        {sidebarState.currentPage === '블록체인사업부' && (
          <>
            <div onClick={() => handleClick('블록체인1팀')}>블록체인 1팀</div>
          </>
        )}
        {sidebarState.currentPage === '마케팅부' && (
          <>
            <div onClick={() => handleClick('기획팀')}>기획팀</div>
            <div onClick={() => handleClick('디자인팀')}>디자인팀</div>
          </>
        )}
        {sidebarState.currentPage === '관리부' && (
          <>
            <div onClick={() => handleClick('관리팀')}>관리팀</div>
            <div onClick={() => handleClick('지원팀')}>지원팀</div>
            <div onClick={() => handleClick('시설팀')}>시설팀</div>
          </>
        )}
        {sidebarState.currentPage === 'R&D센터' && (
          <>
            <div onClick={() => handleClick('알고리즘연구실')}>알고리즘 연구실</div>
            <div onClick={() => handleClick('동형분석연구실')}>동형분석 연구실</div>
            <div onClick={() => handleClick('블록체인연구실')}>블록체인 연구실</div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`memberSidebar ${sidebarState.isExpanded ? 'expanded' : ''}`}>
      <img src={sidebarState.isExpanded ? SideDown : SideUp} alt="Expand Sidebar" onClick={toggleSidebar} />
      <div className="memberDetails">
        {renderMembers()}
        {renderDept()}
      </div>
    </div>
  );
};

export default MemberSidebar;
