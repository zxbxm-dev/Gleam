import "./Header.scss";
import { Link } from "react-router-dom";
import {
  SideMenu,
  Logo,
  UserIcon,
  MenuArrow_down,
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
import { isSidebarVisibleState } from '../../recoil/atoms';

const Header = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useRecoilState(isSidebarVisibleState);

  const handleSideMenuClick = () => {
    setIsSidebarVisible(!isSidebarVisible);
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
          <div className="UserInfo">
            <img src={UserIcon} alt="UserIcon" />
            <div className="UserName">구민석</div>
          </div>
          <Popover >
            <PopoverTrigger>
              <div className="ArrowIcon">
                <img src={MenuArrow_down} alt="MenuArrow" />
              </div>
            </PopoverTrigger>
            <Portal>
              <PopoverContent width='400px' height='200px' border='0' borderRadius='1px' marginTop='10px' marginRight='10px'>
                <PopoverHeader color='white' bg='#746E58' border='0' fontWeight='bold'>개발부 - 개발 1팀</PopoverHeader>
                <PopoverCloseButton color='white' />
                <PopoverBody display='flex' flexDirection='row' alignItems='center'>
                  <div style={{width: '140px', height: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' ,justifyContent: 'center'}}>
                    <img src={UserIcon} alt="UserIcon" style={{ width: '70px', height: '70px' }}/>
                    <div style={{fontSize: '16px', fontWeight: 'bold'}}>구민석</div>
                    <div style={{fontSize: '16px', fontWeight: 'bold'}}>사원</div>
                  </div>
                  <div style={{width: '300px', height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <div style={{fontSize: '14px', color: '#909090', fontWeight: 'bold'}}>연락처</div>
                    <div style={{fontSize: '16px', fontWeight: 'bold'}}>010-0000-0000</div>
                    <div style={{fontSize: '14px', color: '#909090', fontWeight: 'bold', marginTop: '20px'}}>이메일</div>
                    <div style={{fontSize: '16px', fontWeight: 'bold'}}>OOOO123456@four-chains.com</div>
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