import { useState } from "react";
import "./Sidebar.scss";
import {
  MenuArrow_down,
  MenuArrow_right
} from "../../assets/images/index";
import { Link } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { isSidebarVisibleState } from '../../recoil/atoms';

const Sidebar = () => {
  const [isSidebarVisible] = useRecoilState(isSidebarVisibleState);
  const [isOrgCultureMenuOpen, setIsOrgCultureMenuOpen] = useState(false);
  const [isPerformanceMenuOpen, setIsPerformanceMenuOpen] = useState(false);
  const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  
  const handleMenuClick = (menu: any) => {
    setSelectedMenu(menu);

    if (menu !== 'orgculture' && 
        menu !== 'announcement' &&
        menu !== 'regulations' &&
        menu !== 'activitymanage') {
        menu !== 'orgchart' &&
      setIsOrgCultureMenuOpen(false);
    }
    if (menu !== 'performance' &&
        menu !== 'performance-report' &&
        menu !== 'member-evaluation' &&
        menu !== 'reader-evaluation' &&
        menu !== 'self-assessment' &&
        menu !== 'final-result'
    ) {
      setIsPerformanceMenuOpen(false);
    }
    if (menu !== 'attendance' &&
        menu !== 'annual-manage' &&
        menu !== 'attendance-regist'
    ) {
      setIsAttendanceMenuOpen(false);
    }
  };
  
  const toggleOrgCultureMenu = () => {
    setIsOrgCultureMenuOpen(!isOrgCultureMenuOpen);
    setIsPerformanceMenuOpen(false);
    setIsAttendanceMenuOpen(false);
  };
  const togglePerformanceMenu = () => {
    setIsPerformanceMenuOpen(!isPerformanceMenuOpen);
    setIsOrgCultureMenuOpen(false);
    setIsAttendanceMenuOpen(false);
  };
  const toggleAttendanceMenu = () => {
    setIsAttendanceMenuOpen(!isAttendanceMenuOpen);
    setIsOrgCultureMenuOpen(false);
    setIsPerformanceMenuOpen(false);
  };

  return (
    <>
      {isSidebarVisible && (
      <nav className="sidebar">
        <div className="sidebar-body">
          <div className="sidebar-menu">
            <ul className="menu-list">
              <li className='menu-item'>
                <Link to="/orgculture" className={`menu-link2 ${isOrgCultureMenuOpen ? 'active' : ''}`} onClick={() => {toggleOrgCultureMenu(); handleMenuClick('orgculture')}} >
                  {isOrgCultureMenuOpen ? (
                    <img src={MenuArrow_right} alt="MenuArrow" style={{paddingLeft: '5px'}}/>
                  ) : (
                    <img src={MenuArrow_down} alt="MenuArrow" />
                  )}
                  <span className="menu-link-text">조직문화</span>
                </Link>
                {isOrgCultureMenuOpen && (
                  <ul className="menu-list">
                    <li className={`sub-menu menu-item ${selectedMenu === 'announcement' ? 'active' : ''}`}>
                      <Link to="/announcement" className='menu-link' onClick={() => handleMenuClick('announcement')}>공지사항</Link>
                    </li>
                    <li className={`sub-menu menu-item ${selectedMenu === 'regulations' ? 'active' : ''}`}>
                      <Link to="/regulations" className='menu-link' onClick={() => handleMenuClick('regulations')}>사내 규정</Link>
                    </li>
                    <li className={`sub-menu menu-item ${selectedMenu === 'activitymanage' ? 'active' : ''}`}>
                      <Link to="/activitymanage" className='menu-link' onClick={() => handleMenuClick('activitymanage')}>활동 관리</Link>
                    </li>
                    <li className={`sub-menu menu-item ${selectedMenu === 'orgchart' ? 'active' : ''}`}>
                      <Link to="/orgchart" className='menu-link' onClick={() => handleMenuClick('orgchart')}>인사 조직도</Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className={`menu-item ${selectedMenu === 'vacation' ? 'active' : ''}`}>
                <Link to="/vacation" className="menu-link" onClick={() => handleMenuClick('vacation')}>
                  <span className="menu-link-text">휴가 관리</span>
                </Link>
              </li>
              <li className={`menu-item ${selectedMenu === 'report' ? 'active' : ''}`}>
                <Link to="/report" className="menu-link" onClick={() => handleMenuClick('report')}>
                  <span className="menu-link-text">보고서</span>
                </Link>
              </li>
              <li className={`menu-item ${selectedMenu === 'approval' ? 'active' : ''}`}>
                <Link to="/approval" className="menu-link" onClick={() => handleMenuClick('approval')}>
                  <span className="menu-link-text">보고서 결재</span>
                </Link>
              </li>
              <li className={`menu-item ${selectedMenu === 'employment' ? 'active' : ''}`}>
                <Link to="/employment" className="menu-link" onClick={() => handleMenuClick('employment')}>
                  <span className="menu-link-text">채용 및 인재관리</span>
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/performance" className="menu-link2" onClick={() => {togglePerformanceMenu(); handleMenuClick('performance')}}>
                  <img src={MenuArrow_down} alt="MenuArrow" />
                  <span className="menu-link-text">인사평가</span>
                </Link>
                {isPerformanceMenuOpen && (
                  <ul className="menu-list">
                    <li className={`sub-menu menu-item ${selectedMenu === 'performance-report' ? 'active' : ''}`}>
                      <Link to="/performance-report" className='menu-link' onClick={() => handleMenuClick('performance-report')}>성과보고서</Link>
                    </li>
                    <li className={`sub-menu menu-item ${selectedMenu === 'member-evaluation' ? 'active' : ''}`}>
                      <Link to="/member-evaluation" className='menu-link' onClick={() => handleMenuClick('member-evaluation')}>팀원 평가표(면담표)</Link>
                    </li>
                    <li className={`sub-menu menu-item ${selectedMenu === 'reader-evaluation' ? 'active' : ''}`}>
                      <Link to="/reader-evaluation" className='menu-link' onClick={() => handleMenuClick('reader-evaluation')}>팀리더 평가표</Link>
                    </li>
                    <li className={`sub-menu menu-item ${selectedMenu === 'self-assessment' ? 'active' : ''}`}>
                      <Link to="/self-assessment" className='menu-link' onClick={() => handleMenuClick('self-assessment')}>자기신고서</Link>
                    </li>
                    <li className={`sub-menu menu-item ${selectedMenu === 'final-result' ? 'active' : ''}`}>
                      <Link to="/final-result" className='menu-link' onClick={() => handleMenuClick('final-result')}>최종 결과 확인(관리팀장)</Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className={`menu-item ${selectedMenu === 'human-resources' ? 'active' : ''}`}>
                <Link to="/human-resources" className="menu-link" onClick={() => handleMenuClick('human-resources')}>
                  <span className="menu-link-text">인사 정보 관리</span>
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/attendance" className="menu-link2" onClick={() => {toggleAttendanceMenu(); handleMenuClick('attendance')}}>
                  <img src={MenuArrow_down} alt="MenuArrow" />
                  <span className="menu-link-text">근태 관리</span>
                </Link>
                {isAttendanceMenuOpen && (
                  <ul className="menu-list">
                    <li className={`sub-menu menu-item ${selectedMenu === 'annual-manage' ? 'active' : ''}`}>
                      <Link to="/annual-manage" className='menu-link' onClick={() => handleMenuClick('annual-manage')}>연차 관리</Link>
                    </li>
                    <li className={`sub-menu menu-item ${selectedMenu === 'attendance-regist' ? 'active' : ''}`}>
                      <Link to="/attendance-regist" className='menu-link' onClick={() => handleMenuClick('attendance-regist')}>출근부</Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      )}
    </>
  );
};

export default Sidebar;