import "./Sidebar.scss";
import React, { useState } from "react";
import { userState } from '../../recoil/atoms';
import { useRecoilState } from 'recoil';
import { useLocation } from 'react-router-dom';
import { SideUp, SideDown } from "../../assets/images/index";

type Member = [string, string, string, string, string, string, string[]];

interface Props {
  onClickMember: (name: string, dept: string, team: string, position: string) => void;
}

const membersData: Member[] = [
  ['id1', 'pw1', '이정훈', '포체인스 주식회사', '', '대표', ['']],
  ['id2', 'pw2', '안후상', '포체인스 주식회사', '', '이사', ['']],
  ['id3', 'pw3', '진유빈', '개발부', '', '부서장', ['']],
  ['id4', 'pw4', '장현지', '개발부', '개발1팀', '사원', ['']],
  ['id5', 'pw5', '구민석', '개발부', '개발1팀', '사원', ['']],
  ['id6', 'pw6', '장현지', '알고리즘 연구실', '암호 연구팀', '사원', ['']],
  ['id7', 'pw7', '구민석', '알고리즘 연구실', '암호 연구팀', '사원', ['']],
  ['id8', 'pw8', '진유빈', '알고리즘 연구실', 'AI 연구팀', '사원', ['']],
  ['id9', 'pw9', '권준우', '알고리즘 연구실', 'AI 연구팀', '사원', ['']],
  ['id10', 'pw10', '심민지', '알고리즘 연구실', '', '연구실장', ['']],
];

type CurrentPageType =
  '포체인스주식회사' | '개발부' | '개발1팀' | '개발2팀' | '블록체인사업부' | '블록체인1팀' |
  '마케팅부' | '기획팀' | '디자인팀' | '관리부' | '관리팀' | '지원팀' |
  '시설팀' | 'R&D센터' | '알고리즘연구실' | '동형분석연구실' | '블록체인연구실';

const MemberSidebar: React.FC<Props> = ({ onClickMember }) => {
  const [user, setUser] = useRecoilState(userState);
  const location = useLocation();
  const [sidebarState, setSidebarState] = useState<{ isExpanded: boolean; currentPage: CurrentPageType }>({
    isExpanded: true,
    currentPage: '포체인스주식회사',
  });

  const toggleSidebar = () => {
    setSidebarState({ ...sidebarState, isExpanded: !sidebarState.isExpanded });
  };

  const handleClick = (page: CurrentPageType) => {
    setSidebarState({ ...sidebarState, currentPage: page });
  };

  const { isExpanded, currentPage } = sidebarState;

  const renderMembers = () => {
    return (
      <div className="MemberTab">
        <div className="Fourchains">
          <span onClick={() => handleClick('포체인스주식회사')}>&lt; &nbsp;</span>
          <div>{currentPage}</div>
        </div>

        {membersData
          .filter((member) => {
            switch (currentPage) {
              case '포체인스주식회사':
                return member[3] === '포체인스 주식회사' && (member[5] === '대표' || member[5] === '이사');
              case '개발부':
                return member[3] === '개발부' && member[4] === '';
              case '개발1팀':
                return member[3] === '개발부' && member[4] === '개발1팀';
              case '개발2팀':
                return member[3] === '개발부' && member[4] === '개발2팀';
              case '블록체인사업부':
                return member[3] === '블록체인사업부' && member[4] === '';
              case '블록체인1팀':
                return member[3] === '블록체인사업부' && member[4] === '블록체인 1팀';
              case '마케팅부':
                return member[3] === '마케팅부' && member[4] === '';
              case '기획팀':
                return member[3] === '마케팅부' && member[4] === '기획팀';
              case '디자인팀':
                return member[3] === '마케팅부' && member[4] === '디자인팀';
              case '관리부':
                return member[3] === '관리부' && member[4] === '';
              case '관리팀':
                return member[3] === '관리부' && member[4] === '관리팀';
              case '지원팀':
                return member[3] === '관리부' && member[4] === '지원팀';
              case '시설팀':
                return member[3] === '관리부' && member[4] === '시설팀';
              case 'R&D센터':
                return member[3] === '알고리즘 연구실' && member[5] === '연구실장';
              case '알고리즘연구실':
                return member[3] === '알고리즘 연구실' && (member[4] === '' || member[4].includes('연구팀'));
              case '동형분석연구실':
                return member[3] === '동형분석 연구실' && (member[4] === '' || member[4] === '동형분석 연구팀');
              case '블록체인연구실':
                return member[3] === '블록체인 연구실' && (member[4] === '' || member[4] === 'AI 개발팀' || member[4] === '크립토 블록체인 연구팀');
              default:
                return false;
            }
          })
          .map((member, index) => (
            <div key={index} className="member">
              <div>{member[2]} | {member[5]}</div>
            </div>
          ))}
      </div>
    );
  };

  const renderDept = () => {
    return (
      <div className="DeptMain">
        {currentPage === '포체인스주식회사' && (
          <>
            <div onClick={() => handleClick('개발부')}>개발부</div>
            <div onClick={() => handleClick('블록체인사업부')}>블록체인사업부</div>
            <div onClick={() => handleClick('마케팅부')}>마케팅부</div>
            <div onClick={() => handleClick('관리부')}>관리부</div>
            <div onClick={() => handleClick('R&D센터')}>R&D</div>
          </>
        )}
        {currentPage === '개발부' && (
          <>
            <div onClick={() => handleClick('개발1팀')}>개발 1팀</div>
            <div onClick={() => handleClick('개발2팀')}>개발 2팀</div>
          </>
        )}
        {currentPage === '블록체인사업부' && (
          <>
            <div onClick={() => handleClick('블록체인1팀')}>블록체인 1팀</div>
          </>
        )}
        {currentPage === '마케팅부' && (
          <>
            <div onClick={() => handleClick('기획팀')}>기획팀</div>
            <div onClick={() => handleClick('디자인팀')}>디자인팀</div>
          </>
        )}
        {currentPage === '관리부' && (
          <>
            <div onClick={() => handleClick('관리팀')}>관리팀</div>
            <div onClick={() => handleClick('지원팀')}>지원팀</div>
            <div onClick={() => handleClick('시설팀')}>시설팀</div>
          </>
        )}
        {currentPage === 'R&D센터' && (
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
    <div className={`memberSidebar ${isExpanded ? 'expanded' : ''}`}>
      <img src={isExpanded ? SideDown : SideUp} alt="Expand Sidebar" onClick={toggleSidebar} />
      <div className="memberDetails">
        {renderMembers()}
        {renderDept()}
      </div>
    </div>
  );
};

export default MemberSidebar;
