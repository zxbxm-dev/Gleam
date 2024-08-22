import "./Header.scss";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Logo,
  UserIcon_dark,
  SettingIcon,
  MessageIcon,
} from "../../assets/images/index";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  Menu,
  MenuItem,
} from '@chakra-ui/react';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { userState, userStateMessage } from '../../recoil/atoms';
import { LogoutServices } from "../../services/login/LoginService";

const Header = () => {
  let navigate = useNavigate();
  const user = useRecoilValue(userState);
  const resetUserState = useResetRecoilState(userState);

  const handleLogout = async () => {
    try {
      await LogoutServices();
      localStorage.setItem('userState', '');
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.setItem('usertoken', '');
      resetUserState();
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  let messageWindow: Window | null = null;
  const CHECK_INTERVAL = 1000; // 1초마다 상태 확인
  
  const openMessageWindow = () => {
    if (messageWindow && !messageWindow.closed) {
      // 창이 열려있으므로 세션 스토리지에 true 저장
      sessionStorage.setItem('messageWindowOpen', 'true');
      messageWindow.focus();
    } else {
      // 새 창을 열고 세션 스토리지에 true 저장
      messageWindow = window.open('http://localhost:3000/message', '_blank') as Window;
      sessionStorage.setItem('messageWindowOpen', 'true');
    }
    
    // 창이 닫히는 것을 주기적으로 확인
    startCheckingWindowStatus();
  };
  
  const startCheckingWindowStatus = () => {
    setInterval(() => {
      if (messageWindow && messageWindow.closed) {
        // 창이 닫혔으므로 세션 스토리지에 false 저장
        sessionStorage.setItem('messageWindowOpen', 'false');
        messageWindow = null; // 변수 초기화
      } else if (messageWindow) {
        // 창이 여전히 열려있다면 세션 스토리지에 true 저장
        sessionStorage.setItem('messageWindowOpen', 'true');
      }
    }, CHECK_INTERVAL);
  };
  
  // 페이지 로드 시 창 상태를 초기화합니다.
  startCheckingWindowStatus();

  return (
    <div className="header">
      <div className="header-left">
        <Link to="/">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>

      <div className="header-right">
        <div className="MessageTab" onClick={openMessageWindow}>
          <img src={MessageIcon} alt="MessageIcon" />
        </div>
        <div className="UserTab">
          <Popover>
            <PopoverTrigger>
              <div className="UserInfo">
                <img src={user.attachment ? user.attachment : UserIcon_dark} alt="UserIcon" />
                <div className="UserName">{user.username}</div>
              </div>
            </PopoverTrigger>
            <Portal>
              <PopoverContent className="header_popover" _focus={{ boxShadow: "none" }}>
                <PopoverBody>
                  <span className="Img_content">
                    <img src={SettingIcon} alt="SettingIcon" className="setting_icon" onClick={() => navigate('/editres')} />
                    <img src={user.attachment ? user.attachment : UserIcon_dark} alt="UserIcon_dark" className="user_icon" />
                  </span>
                  <span className="user_information">
                    <span>{user.username} | {user.position}</span>
                    {user.team ? (
                      <span>{user.team}</span>
                    ) : user.department ? (
                      <span>{user.department}</span>
                    ) : (
                      <></>
                    )}
                  </span>
                  <div className="logout_wrap">
                    <span onClick={handleLogout}>로그아웃</span>
                  </div>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </div>

        <div className="HeaderMenu">
          <Popover>
            <PopoverTrigger>
              <button>Menu</button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent className="menu_popover" _focus={{ boxShadow: "none" }}>
                <PopoverBody>
                  <Menu>
                    <MenuItem onClick={() => navigate('/profile')}>공지사항</MenuItem>
                    <MenuItem onClick={() => navigate('/settings')}>사내규정</MenuItem>
                    <MenuItem onClick={() => navigate('/profile')}>인사조직도</MenuItem>
                    <MenuItem onClick={() => navigate('/profile')}>휴가관리</MenuItem>
                    <MenuItem onClick={() => navigate('/settings')}>보고서 결재</MenuItem>
                    <MenuItem onClick={() => navigate('/profile')}>채용공고</MenuItem>
                    {/* <MenuItem onClick={() => navigate('/settings')}>회원관리</MenuItem> */}
                  </Menu>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Header;
