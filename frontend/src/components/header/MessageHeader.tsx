import "./Header.scss";
import { useNavigate, Link } from "react-router-dom";
import {
  MessageHeaderLogo,
  UserIcon_dark,
  SettingIcon,
} from "../../assets/images/index";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { userState } from '../../recoil/atoms';
import { LogoutServices } from "../../services/login/LoginService";

const MessageHeader = () => {
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

  return (
    <div className="header">
      <div className="header-left">
        <Link to="/">
          <img src={MessageHeaderLogo} alt="MessageHeaderLogo" />
        </Link>
      </div>

      <div className="header-right">
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

export default MessageHeader;
