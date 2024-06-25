import "./Sidebar.scss";
import React, { useState } from "react";
import { SideUp } from "../../assets/images/index";
import { userState } from '../../recoil/atoms';
import { useRecoilState } from 'recoil';
import { useLocation } from 'react-router-dom';

type Member = [string, string, string, string, string, string, string[]];

interface Props {
  onClickMember: (name: string, dept: string, team: string, position: string) => void;
}

const MemberSidebar: React.FC<Props> = ({ onClickMember }) => {
  const [user, setUser] = useRecoilState(userState);
  const location = useLocation();

  const members: Member[] = [
    ['id1', 'pw1', '이정훈', '포체인스 주식회사', '', '대표', ['']],
    ['id2', 'pw2', '안후상', '포체인스 주식회사', '', '이사', ['']],
    ['id3', 'pw3', '진유빈', '개발부', '', '부서장', ['']],
    ['id4', 'pw4', '장현지', '개발부', '개발1팀', '사원', ['']],
    ['id5', 'pw5', '구민석', '개발부', '개발1팀', '사원', ['']],
  ];

  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState<'Main' | 'Devpart' | 'Dev1' | 'Dev2'>('Main');

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClickMain = () => {
    setCurrentPage('Main');
  };

  const handleClickDept = () => {
    setCurrentPage('Devpart');
  };

  const handleClickDev1 = () => {
    setCurrentPage('Dev1');
  };

  const handleClickDev2 = () => {
    setCurrentPage('Dev2');
  };

  return (
    <div className={`memberSidebar ${isExpanded ? 'expanded' : ''}`}>
      <img src={SideUp} alt="Expand Sidebar" onClick={toggleSidebar} />
      <div className="memberDetails">
        <div className="Fourchains" onClick={handleClickMain}>포체인스 주식회사</div>
        {currentPage === 'Main' ?
          <div className="MemberTab">
            {members.slice(0, 2).map((member, index) => {
              if (member[5] === '대표' || member[5] === '이사') {
                return (
                  <div key={index} className="member">
                    <div>{member[2]} | {member[5]}</div>
                  </div>
                );
              } else {
                return null;
              }
            })}
            <div className="DeptMain">
              <div onClick={handleClickDept}>개발부</div>
              <div onClick={handleClickDept}>블록체인사업부</div>
              <div onClick={handleClickDept}>마케팅부</div>
              <div onClick={handleClickDept}>관리부</div>
              <div onClick={handleClickDept}>R&D센터</div>
            </div>
          </div>
          : (currentPage === 'Devpart' ?
            <div>
              {members
                .filter(member => member[3] === '개발부' && member[4] === '')
                .map((member, index) => (
                  <div key={index} className="member">
                    <div>{member[2]} | {member[5]}</div>
                  </div>
                ))}
              <div onClick={handleClickDev1}>개발 1팀</div>
              <div>개발 2팀</div>
            </div>
            : (currentPage === 'Dev1' ?
              <div>
                {members
                  .filter(member => member[3] === '개발부' && member[4] === '개발1팀')
                  .map((member, index) => (
                    <div key={index} className="member">
                      <div>{member[2]} | {member[5]}</div>
                    </div>
                  ))}
              </div>
              : (currentPage === 'Dev2' ?
                <div>
                  {members
                    .filter(member => member[3] === '개발부' && member[4] === '개발2팀')
                    .map((member, index) => (
                      <div key={index} className="member">
                        <div>{member[2]} | {member[5]}</div>
                      </div>
                    ))}
                </div>
                : null
              )
            )
          )
        }
      </div>
    </div>
  );
};

export default MemberSidebar;
