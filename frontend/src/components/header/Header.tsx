import "./Header.scss";
import { useNavigate, Link } from "react-router-dom";
import {
  Logo,
  UserIcon,
  UserIcon_dark,
  MenuArrow_down,
  SettingIcon,
} from "../../assets/images/index";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Portal,
} from '@chakra-ui/react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { userState } from '../../recoil/atoms';
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

  return (
    <div className="header">
      <div className="header-left">
          <Link to="/">
            <img src={Logo} alt="Logo" />
          </Link>
      </div>

      <div className="header-right">
        <div className="UserTab">
          <Popover>
          <PopoverTrigger>
              <div className="UserInfo">
                <img src={UserIcon} alt="UserIcon" />
                <div className="UserName">{user.username}</div>
              </div>
              </PopoverTrigger>
            <Portal>
              <PopoverContent border='1px solid #45C552' borderRadius='5px' marginRight='25px' padding='10px' boxShadow='rgba(100, 100, 111, 0.1) 0px 7px 29px 0px' style={{ width: 'fit-content' }}>
                <PopoverBody>
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <img src={SettingIcon} alt="SettingIcon" style={{ width: '20px', height: '20px', cursor: 'pointer', position: 'absolute', top: '8px', right: '8px' }} onClick={() => navigate('/editres')}/>
                    <img src={UserIcon_dark} alt="UserIcon_dark" style={{ width: '50px', height: '50px' }} />
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '10px 0', gap: '3px', width: 'fit-content'}}>
                    <span style={{ fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)' }}>{user.username} | {user.position}</span>
                    {
                      user.team ? (
                        <span style={{ fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)' }}>{user.team}</span>
                      ) : (
                        user.department ? (
                          <span style={{ fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)' }}>{user.department}</span>
                        ) : (
                          <></>
                        )
                      )
                    }
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <span style={{ fontSize: '14px', textDecoration: 'underLine', cursor: 'pointer', color: '#929292' }} onClick={handleLogout}>로그아웃</span>
                  </div>
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