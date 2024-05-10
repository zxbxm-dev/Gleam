import { useState } from "react";
import "./Sidebar.scss";
import {
  MenuArrow_down,
  MenuArrow_right
} from "../../assets/images/index";
import { Link } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { isSidebarVisibleState, isHrSidebarVisibleState } from '../../recoil/atoms';
import { userState } from '../../recoil/atoms';
const Sidebar = () => {
  const [isSidebarVisible] = useRecoilState(isSidebarVisibleState);
  const [isHrSidebarVisible, setIsHrSidebarVisible] = useRecoilState(isHrSidebarVisibleState);
  const [userInfo] = useRecoilState(userState);
  const [isOrgCultureMenuOpen, setIsOrgCultureMenuOpen] = useState(false);
  const [isPerformanceMenuOpen, setIsPerformanceMenuOpen] = useState(false);
  const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [activeTab, setActiveTab] = useState("");

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
      menu !== 'submit-perform' &&
      menu !== 'manage-perform' 
    ) {
      setIsPerformanceMenuOpen(false);
    }
    if (menu !== 'attendance' &&
      menu !== 'annual-manage' &&
      menu !== 'attendance-regist'
    ) {
      setIsAttendanceMenuOpen(false);
    }

    setIsHrSidebarVisible(false);
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

  const handleHrSideClick = () => {
    setIsHrSidebarVisible(!isHrSidebarVisible);
  };

  return (
    <>
      {isSidebarVisible && (
        <nav className="sidebar">
          <div className="sidebar-body">
            <div className="sidebar-menu">
              <ul className="menu-list">
                <li className='menu-item'>
                  <Link to="/" className={`menu-link2 ${isOrgCultureMenuOpen ? 'active' : ''}`}
                    onClick={() => {
                        toggleOrgCultureMenu();
                        handleMenuClick('orgculture');
                        setActiveTab('FirstActiveTab');
                      ;
                    }}
                  >
                    {isOrgCultureMenuOpen ? (
                      <img src={MenuArrow_right} alt="MenuArrow" style={{ paddingLeft: '5px' }} />
                    ) : (
                      <img src={MenuArrow_down} alt="MenuArrow" />
                    )}
                    <span className="menu-link-text">조직문화</span>
                  </Link>
                  {isOrgCultureMenuOpen && (
                    <ul className="menu-list">
                      <li className={`sub-menu menu-item ${selectedMenu === 'announcement' || activeTab === "FirstActiveTab" ? 'active' : ''}`}>
                        <Link to="/" className='menu-link' onClick={() => handleMenuClick('announcement')}>공지사항</Link>
                      </li>
                      <li className={`sub-menu menu-item ${selectedMenu === 'regulations' ? 'active' : ''}`}>
                        <Link to="/regulations" className='menu-link'
                          onClick={() => {
                            handleMenuClick('regulations');
                            setActiveTab("");
                          }}
                        >사내 규정</Link>
                      </li>
                      <li className={`sub-menu menu-item ${selectedMenu === 'activitymanage' ? 'active' : ''}`}>
                        <Link to="/activitymanage" className='menu-link'
                          onClick={() => {
                            handleMenuClick('activitymanage');
                            setActiveTab("");
                          }}
                        >활동 관리</Link>
                      </li>
                      <li className={`sub-menu menu-item ${selectedMenu === 'orgchart' ? 'active' : ''}`}>
                        <Link to="/orgchart" className='menu-link'
                          onClick={() => {
                            handleMenuClick('orgchart');
                            setActiveTab("");
                          }}
                        >인사 조직도</Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li className={`menu-item ${selectedMenu === 'calendar' ? 'active' : ''}`}>
                  <Link to="/calendar" className="menu-link" onClick={() => handleMenuClick('calendar')}>
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
                    <span className="menu-link-text">채용공고</span>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/submit-perform" className="menu-link2"
                    onClick={() => {
                      togglePerformanceMenu(); handleMenuClick('performance'); setActiveTab('SecActiveTab');
                    }}
                  >
                    {isPerformanceMenuOpen ? (
                      <img src={MenuArrow_right} alt="MenuArrow" style={{ paddingLeft: '5px' }} />
                    ) : (
                      <img src={MenuArrow_down} alt="MenuArrow" />
                    )}
                    <span className="menu-link-text">인사평가</span>
                  </Link>
                  {isPerformanceMenuOpen && (
                    <ul className="menu-list">
                      <li className={`sub-menu menu-item ${selectedMenu === 'submit-perform' || activeTab === "SecActiveTab" ? 'active' : ''}`}>
                        <Link to="/submit-perform" className='menu-link' onClick={() => handleMenuClick('submit-perform')}>인사평가 제출</Link>
                      </li>
                      <li className={`sub-menu menu-item ${selectedMenu === 'manage-perform' ? 'active' : ''}`}>
                        <Link to="/manage-perform" className='menu-link' onClick={() => { handleMenuClick('manage-perform'); setActiveTab(""); handleHrSideClick(); }}>인사평가 관리</Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li className={`menu-item ${selectedMenu === 'human-resources' ? 'active' : ''}`}>
                  <Link to="/human-resources" className="menu-link" onClick={() => { handleMenuClick('human-resources'); handleHrSideClick();}}>
                    <span className="menu-link-text">인사 정보 관리</span>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/annual-manage" className="menu-link2"
                    onClick={() => {
                      toggleAttendanceMenu(); handleMenuClick('attendance'); setActiveTab('ThirdActiveTab');
                    }}
                  >
                    {isAttendanceMenuOpen ? (
                      <img src={MenuArrow_right} alt="MenuArrow" style={{ paddingLeft: '5px' }} />
                    ) : (
                      <img src={MenuArrow_down} alt="MenuArrow" />
                    )}
                    <span className="menu-link-text">근태 관리</span>
                  </Link>
                  {isAttendanceMenuOpen && (
                    <ul className="menu-list">
                      <li className={`sub-menu menu-item ${selectedMenu === 'annual-manage' || activeTab === "ThirdActiveTab" ? 'active' : ''}`}>
                        <Link to="/annual-manage" className='menu-link' onClick={() => handleMenuClick('annual-manage')}>연차 관리</Link>
                      </li>
                      <li className={`sub-menu menu-item ${selectedMenu === 'attendance-regist' ? 'active' : ''}`}>
                        <Link to="/attendance-regist" className='menu-link'
                          onClick={() => {
                            handleMenuClick('attendance-regist');
                            setActiveTab('');
                          }}
                        >출근부</Link>
                      </li>
                    </ul>
                  )}
                </li>
                {/* {userInfo.team === '지원팀' ? */}
                <li className={`menu-item ${selectedMenu === 'operating-manage' ? 'active' : ''}`}>
                  <Link to="/operating-manage" className="menu-link" onClick={() => handleMenuClick('operating-manage')}>
                    <span className="menu-link-text">운영비 관리</span>
                  </Link>
                </li>
                {/* :<li></li>} */}
              </ul>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Sidebar;