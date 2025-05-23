import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Sidebar.scss";
import { MenuArrow_down, MenuArrow_right } from "../../assets/images/index";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isSidebarVisibleState,
  isHrSidebarVisibleState,
  isSelectMemberState,
  userState,
} from "../../recoil/atoms";
import MemberSidebar from "./MemberSidebar";
interface SubMenu {
  menu: string;
  label: string;
  link: string;
}

interface MenuItem {
  menu: string;
  label: string;
  link?: string;
  menuType?: boolean;
  toggleMenuType?: string;
  subMenu?: SubMenu[];
  requiresHrSideClick?: boolean;
}

const Sidebar = () => {
  const location = useLocation();
  const [isSelectMember, setIsSelectMember] =
    useRecoilState(isSelectMemberState);
  const [isSidebarVisible] = useRecoilState(isSidebarVisibleState);
  const [isHrSidebarVisible, setIsHrSidebarVisible] = useRecoilState(
    isHrSidebarVisibleState
  );
  const [isOrgCultureMenuOpen, setIsOrgCultureMenuOpen] = useState(false);
  const [isScheduleMenuOpen, setIsScheduleMenuOpen] = useState(false);
  const [isPerformanceMenuOpen, setIsPerformanceMenuOpen] = useState(false);
  const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");
  const user = useRecoilValue(userState);

  const handleMemberClick = (
    userID: string,
    name: string,
    dept: string,
    team: string,
    position: string
  ) => {
    // 선택된 멤버 정보를 새로운 Member 배열로 생성
    const newMember = [userID, name, dept, team, position];
    setIsSelectMember(newMember);
  };

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);

    if (menu === "orgculture") {
      setIsOrgCultureMenuOpen(!isOrgCultureMenuOpen);
    }

    if (menu === "schedule") {
      setIsScheduleMenuOpen(!isScheduleMenuOpen);
    }

    if (menu !== "performance") {
      setIsSelectMember(["", "", "", ""]);
    }

    if (
      menu !== "orgculture" &&
      menu !== "announcement" &&
      menu !== "regulations" &&
      menu !== "orgchart"
    ) {
      setIsOrgCultureMenuOpen(false);
    }
    if (
      menu !== "schedule" &&
      menu !== "calender" &&
      menu !== "meetingroom" &&
      menu !== "project"
    ) {
      setIsScheduleMenuOpen(false);
    }
    if (
      menu !== "performance" &&
      menu !== "submit-perform" &&
      menu !== "manage-perform"
    ) {
      setIsPerformanceMenuOpen(false);
    }
    if (
      menu !== "attendance" &&
      menu !== "annual-manage" &&
      menu !== "attendance-regist"
    ) {
      setIsAttendanceMenuOpen(false);
    }

    setIsHrSidebarVisible(false);
  };

  const toggleMenu = (menuType: string) => {
    setIsOrgCultureMenuOpen(menuType === "orgCulture" && !isOrgCultureMenuOpen);
    setIsScheduleMenuOpen(menuType === "schedule" && !isScheduleMenuOpen);
    setIsPerformanceMenuOpen(
      menuType === "performance" && !isPerformanceMenuOpen
    );
    setIsAttendanceMenuOpen(menuType === "attendance" && !isAttendanceMenuOpen);
  };

  const handleHrSideClick = () => {
    setIsHrSidebarVisible(true);
  };

  const renderSubMenu = (
    menuType: boolean | undefined,
    menuItems: SubMenu[] | undefined
  ) => (
    <ul className={`menu-list sub-menu ${menuType ? "open" : ""}`}>
      {menuItems?.map(({ menu, label, link }) => (
        <li
          key={menu}
          className={`sub-menu-item ${
            selectedMenu === menu || activeTab === menu ? "active" : ""
          }`}
        >
          <Link
            to={link}
            className="menu-link"
            onClick={() => {
              handleMenuClick(menu);
              if (menu === "manage-perform") {
                handleHrSideClick();
              }
            }}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );

  const menuList: MenuItem[] = [
    {
      menu: "mail",
      label: "메일",
      link: "/mail",
    },
    {
      menu: "orgculture",
      label: "조직문화",
      menuType: isOrgCultureMenuOpen,
      toggleMenuType: "orgCulture",
      subMenu: [
        { menu: "announcement", label: "공지사항", link: "/" },
        { menu: "regulations", label: "사내 규정", link: "/regulations" },
        { menu: "orgchart", label: "인사 조직도", link: "/orgchart" },
      ],
    },
    {
      menu: "schedule",
      label: "일정관리",
      menuType: isScheduleMenuOpen,
      toggleMenuType: "schedule",
      subMenu: [
        { menu: "calender", label: "휴가관리", link: "/calendar" },
        { menu: "meetingroom", label: "회의실 관리", link: "/meetingroom" },
        { menu: "project", label: "프로젝트", link: "/project" },
      ],
    },
    // {
    //   menu: 'meetingroom',
    //   label: '회의실 관리',
    //   link: '/meetingroom',
    // },
    {
      menu: "report",
      label: "보고서",
      link: "/report",
    },
    {
      menu: "approval",
      label: "보고서 결재",
      link: "/approval",
    },
    {
      menu: "employment",
      label: "채용공고",
      link: "/employment",
    },
    {
      menu: "performance",
      label: "인사평가",
      menuType: isPerformanceMenuOpen,
      toggleMenuType: "performance",
      subMenu: [
        {
          menu: "submit-perform",
          label: "인사평가 제출",
          link: "/submit-perform",
        },
        ((user.team === "관리팀" && user.position === "팀장") ||
          user.position === "대표이사" ||
          user.position === "센터장") && {
          menu: "manage-perform",
          label: "인사평가 관리",
          link: "/manage-perform",
        },
      ].filter(Boolean) as SubMenu[],
    },
    (user.team === "관리팀" ||
      user.position === "대표이사" ||
      user.position === "센터장" ||
      (user.position === "부서장" && user.department === "관리부")) && {
      menu: "human-resources",
      label: "인사 정보 관리",
      link: "/human-resources",
      requiresHrSideClick: true,
    },
    (user.team === "관리팀" ||
      user.position === "대표이사" ||
      user.position === "센터장" ||
      user.position === "연구실장" ||
      (user.position === "부서장" && user.department === "관리부")) && {
      menu: "attendance",
      label: "근태 관리",
      menuType: isAttendanceMenuOpen,
      toggleMenuType: "attendance",
      subMenu: [
        {
          menu: "annual-manage",
          label: "연차 관리",
          link: "/annual-manage",
        },
        {
          menu: "attendance-regist",
          label: "출근부",
          link: "/attendance-regist",
        },
      ],
    },
    (user.team === "지원팀" || user.position === "대표이사") && {
      menu: "operating-manage",
      label: "운영비 관리",
      link: "/operating-manage",
    },
    (user.team === "관리팀" ||
      user.position === "대표이사" ||
      (user.position === "부서장" && user.department === "관리부")) && {
      menu: "user-management",
      label: "회원관리",
      link: "/user-management",
    },
  ].filter(Boolean) as MenuItem[];

  useEffect(() => {
    const currentPath = location.pathname;

    menuList.forEach(({ menu, link, subMenu }) => {
      if (link === currentPath) {
        setSelectedMenu(menu);
      }

      // if (subMenu) {
      //   subMenu.forEach((subItem) => {
      //     if (subItem.link === currentPath) {
      //       setSelectedMenu(menu);
      //     }
      //   });
      // }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      {isSidebarVisible && (
        <nav className="sidebar">
          <div className="sidebar-body">
            <div className="sidebar-menu">
              <ul className="menu-list">
                <div>
                  {menuList.map(
                    ({
                      menu,
                      label,
                      link,
                      menuType,
                      toggleMenuType,
                      subMenu,
                      requiresHrSideClick,
                    }) => (
                      <li
                        key={menu}
                        className={`menu-item ${
                          selectedMenu === menu ? "active" : ""
                        }`}
                      >
                        {link ? (
                          <Link
                            to={link}
                            className={`menu-link ${
                              selectedMenu === menu ? "active" : ""
                            }`}
                            onClick={() => {
                              handleMenuClick(menu);
                              if (requiresHrSideClick) handleHrSideClick();
                            }}
                          >
                            <span className="menu-link-text">{label}</span>
                          </Link>
                        ) : (
                          <>
                            <Link
                              to="#"
                              className={`menu-link2 ${
                                menuType ? "active" : ""
                              }`}
                              onClick={() => {
                                toggleMenu(toggleMenuType || "");
                                handleMenuClick(menu);
                                setActiveTab(menu);
                              }}
                            >
                              <img
                                src={
                                  menuType ? MenuArrow_down : MenuArrow_right
                                }
                                alt="MenuArrow"
                                style={{ paddingLeft: "5px" }}
                              />
                              <span className="menu-link-text">{label}</span>
                            </Link>
                            {renderSubMenu(menuType, subMenu)}
                          </>
                        )}
                      </li>
                    )
                  )}
                </div>
              </ul>
            </div>
            <div>
              {isHrSidebarVisible && (
                <MemberSidebar
                  onClickMember={(userID, name, dept, team, position) =>
                    handleMemberClick(userID, name, dept, team, position)
                  }
                />
              )}
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Sidebar;
