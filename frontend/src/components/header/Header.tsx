import "./Header.scss";
import { Link } from "react-router-dom";
import {
  SideMenu,
  Logo,
  MenuArrow,
} from "../../assets/images/index";
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
        <div className="UserInfo">
          <div>
            <span>아이콘</span>
            <span>구민석</span>
          </div>
          <div className="ArrowIcon">
            <img src={MenuArrow} alt="MenuArrow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;