import "./Header.scss";
import { useNavigate, Link } from "react-router-dom";
import {
  SideMenu,
  Logo,
  UserIcon,
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
} from '@chakra-ui/react'
import { useRecoilState } from 'recoil';
import { isSidebarVisibleState, isHrSidebarVisibleState, userState } from '../../recoil/atoms';

const Header = () => {
  let navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useRecoilState(isSidebarVisibleState);
  const [isHrSidebarVisible, setIsHrSidebarVisible] = useRecoilState(isHrSidebarVisibleState);

  const [userInfo] = useRecoilState(userState);
  
  const handleSideMenuClick = () => {
    setIsSidebarVisible(!isSidebarVisible);
    if (isHrSidebarVisible === true) {
      setIsHrSidebarVisible(!isHrSidebarVisible)
    }
  };

  return (
    <div className="header">

      <div className="header-left">
        <div className="SideMenu" onClick={handleSideMenuClick}>
          <img src={SideMenu} alt="SideMenu" />
        </div>
        <div className="MainLogo">
          <Link to="/">
            <img src={Logo} alt="Logo" />
          </Link>
        </div>
      </div>

      <div className="header-right">  
        <div className="UserTab">
          <Popover >
            <PopoverTrigger>
              <div className="UserInfo">
                <img src={UserIcon} alt="UserIcon" />
                <div className="UserName">{userInfo.name}</div>
                <div className="ArrowIcon">
                  <img src={MenuArrow_down} alt="MenuArrow" />
                </div>
              </div>
            </PopoverTrigger>
            <Portal>
              <PopoverContent width='400px' height='200px' border='0' borderRadius='1px' marginTop='10px' marginRight='10px'>
                <PopoverHeader height='34px' color='white' bg='#746E58' border='0' fontFamily= 'var(--font-family-Noto-B)' fontSize='14px'>{userInfo.department}</PopoverHeader>
                <PopoverCloseButton color='white' />
                <PopoverBody display='flex' flexDirection='row' alignItems='center'>
                  <div style={{width: '140px', height: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' ,justifyContent: 'center'}}>
                    <img src={UserIcon} alt="UserIcon" style={{ width: '70px', height: '70px' }}/>
                    <div style={{fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)'}}>{userInfo.name}</div>
                    <div style={{fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)'}}>{userInfo.position}</div>
                  </div>
                  <div style={{width: '300px', height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <div style={{fontSize: '14px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)'}}>연락처</div>
                    <div style={{fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)'}}>010-0000-0000</div>
                    <div style={{fontSize: '14px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)', marginTop: '20px'}}>메일주소</div>
                    <div style={{fontSize: '16px', fontFamily: 'var(--font-family-Noto-M)'}}>OOOO123456@four-chains.com</div>
                  </div>
                  <div style={{position: 'absolute', top: '50px', right: '20px', cursor: 'pointer'}} onClick={() => navigate('/editres')}>
                    <img src={SettingIcon} alt="SettingIcon"/>
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