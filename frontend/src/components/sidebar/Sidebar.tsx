import { useState } from "react";
import "./Sidebar.scss";
import {
  MenuArrow,
} from "../../assets/images/index";
import { Link } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { isSidebarVisibleState } from '../../recoil/atoms';

const Sidebar = () => {
  const [isSidebarVisible] = useRecoilState(isSidebarVisibleState);
  const [isOrgCultureMenuOpen, setIsOrgCultureMenuOpen] = useState(false);

  const toggleOrgCultureMenu = () => {
    setIsOrgCultureMenuOpen(!isOrgCultureMenuOpen);
  };

  return (
    <>

      {isSidebarVisible && (
      <nav className="sidebar">
        <div className="sidebar-body">
          <div className="sidebar-menu">
            <ul className="menu-list">
              <li className="menu-item">
                <Link to="/" className="menu-link" onClick={toggleOrgCultureMenu}>
                  <img src={MenuArrow} alt="MenuArrow" />
                  <span className="menu-link-text">조직문화</span>
                </Link>
                {isOrgCultureMenuOpen && (
                  <ul className="menu-list">
                    <li>
                      <Link to="/orgchart" className="menu-link">인사 조직도</Link>
                    </li>
                    <li>
                      <Link to="/announcement" className="menu-link">공지사항</Link>
                    </li>
                    <li>
                      <Link to="/regulations" className="menu-link">사내 규정</Link>
                    </li>
                    <li>
                      <Link to="/activitymanage" className="menu-link">활동 관리</Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="menu-item">
                <Link to="/" className="menu-link">
                  <img src={MenuArrow} alt="MenuArrow" />
                  <span className="menu-link-text">휴가 관리</span>
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/" className="menu-link">
                  <img src={MenuArrow} alt="MenuArrow" />
                  <span className="menu-link-text">보고서</span>
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/" className="menu-link">
                  <img src={MenuArrow} alt="MenuArrow" />
                  <span className="menu-link-text">보고서 결재</span>
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/" className="menu-link">
                  <img src={MenuArrow} alt="MenuArrow" />
                  <span className="menu-link-text">채용 및 인재관리</span>
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/" className="menu-link">
                  <img src={MenuArrow} alt="MenuArrow" />
                  <span className="menu-link-text">인사평가</span>
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/" className="menu-link">
                  <img src={MenuArrow} alt="MenuArrow" />
                  <span className="menu-link-text">인사 정보 관리</span>
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/" className="menu-link">
                  <img src={MenuArrow} alt="MenuArrow" />
                  <span className="menu-link-text">근태 관리</span>
                </Link>
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