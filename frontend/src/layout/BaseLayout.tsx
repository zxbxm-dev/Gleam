import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "../components";
import { useRecoilState } from 'recoil';
import { isSidebarVisibleState } from '../recoil/atoms';

const BaseLayout = () => {
  const [isSidebarVisible] = useRecoilState(isSidebarVisibleState);

  return (
    <main className="page-wrapper">
      <Header />

      <div className="content-wrapper" style={{ marginLeft: isSidebarVisible ? '250px' : '0' }}>
        {isSidebarVisible && <Sidebar />}
        <Outlet />
      </div>
    </main>
  );
};

export default BaseLayout;