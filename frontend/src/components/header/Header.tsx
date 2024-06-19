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

  const formatPhoneNumber = (phoneNumber: any) => {
    if (phoneNumber.length === 11) {
      return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return phoneNumber;
  };

  const handleLogout = async () => {
    try {
      await LogoutServices();
      localStorage.setItem('userState', '');
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.setItem('usertoken', '');
      resetUserState();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="header">
      <div className="header-left">
        <div className="MainLogo">
          <Link to="/">
            <img src={Logo} alt="Logo" />
          </Link>
        </div>
      </div>

      <div className="header-right">
        <div className="UserTab">
          <Popover>
            <PopoverTrigger>
              <div className="UserInfo">
                <img src={UserIcon} alt="UserIcon" />
                <div className="UserName">{user.username}</div>
                <div className="ArrowIcon">
                  <img src={MenuArrow_down} alt="MenuArrow" />
                </div>
              </div>
            </PopoverTrigger>
            <Portal>
              {/* 1차 개발 */}
              <PopoverContent width='400px' height='200px' border='0' borderRadius='5px' marginTop='7px' boxShadow='rgba(100, 100, 111, 0.1) 0px 7px 29px 0px'>
                <PopoverHeader height='34px' color='white' bg='#746E58' border='0' fontFamily='var(--font-family-Noto-B)' fontSize='14px' borderTopRightRadius='5px' borderTopLeftRadius='5px'>{user.department}</PopoverHeader>
                <PopoverCloseButton color='white' />
                <PopoverBody display='flex' flexDirection='row' alignItems='center'>
                  <div style={{ width: '140px', height: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={UserIcon} alt="UserIcon" style={{ width: '70px', height: '70px' }} />
                    <div style={{ fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)' }}>{user.username}</div>
                    <div style={{ fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)' }}>{user.position}</div>
                  </div>
                  <div style={{ width: '300px', height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '14px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)' }}>연락처</div>
                    <div style={{ fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)' }}>{formatPhoneNumber(user.phoneNumber)}</div>
                    <div style={{ fontSize: '14px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)', marginTop: '20px' }}>메일주소</div>
                    <div style={{ fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)' }}>{user.usermail}</div>
                  </div>
                  <div style={{ position: 'absolute', top: '50px', right: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <img src={SettingIcon} alt="SettingIcon" onClick={() => navigate('/editres')}/>
                    <div style={{ fontSize: '12px', marginTop: '6px', textDecoration: 'underLine', color: '#929292' }} onClick={handleLogout}>로그아웃</div>
                  </div>
                </PopoverBody>
              </PopoverContent>

              {/* 2차 개발 */}
              {/* <PopoverContent border='1px solid #45C552' borderRadius='5px' marginTop='10px' padding='10px' boxShadow='rgba(100, 100, 111, 0.1) 0px 7px 29px 0px' style={{ width: 'fit-content' }}>
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
              </PopoverContent> */}

            </Portal>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Header;