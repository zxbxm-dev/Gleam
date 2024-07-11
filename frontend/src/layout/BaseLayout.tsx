import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "../components";
import { useRecoilState } from 'recoil';
import { isSidebarVisibleState, isHrSidebarVisibleState, isSelectMemberState } from '../recoil/atoms';

const BaseLayout = () => {
  const [isSidebarVisible] = useRecoilState(isSidebarVisibleState);
  const [isHrSidebarVisible] = useRecoilState(isHrSidebarVisibleState);
  const [isSelectMember, setIsSelectMember] = useRecoilState(isSelectMemberState);


  let marginLeft = 0;
  if (isSidebarVisible) {
    marginLeft += 200;
  }
  if (isHrSidebarVisible) {
    marginLeft += 0;
  }

  return (
    <main className="page-wrapper">
      <Header />

      <div className="content-wrapper" style={{ marginLeft: `${marginLeft}px` }}>
        {isSidebarVisible && <Sidebar />}
        <Outlet />
      </div>
    </main>
  );
};

export default BaseLayout;