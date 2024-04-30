import { Outlet } from "react-router-dom";
import { Header, Sidebar, MemberSidebar } from "../components";
import { useRecoilState } from 'recoil';
import { isSidebarVisibleState, isHrSidebarVisibleState } from '../recoil/atoms';

const BaseLayout = () => {
  const [isSidebarVisible] = useRecoilState(isSidebarVisibleState);
  const [isHrSidebarVisible] = useRecoilState(isHrSidebarVisibleState);

  let marginLeft = 0;
  if (isSidebarVisible) {
    marginLeft += 250;
  }
  if (isHrSidebarVisible) {
    marginLeft += 250;
  }
  
  const handleMemberClick = (name: string, dept: string, team: string, position: string) => {
    // 선택된 멤버 정보를 새로운 Member 배열로 생성
    const newMember = [name, dept, team, position];
    console.log('선택한 멤버 정보', newMember)
  };

  return (
    <main className="page-wrapper">
      <Header />

      <div className="content-wrapper" style={{ marginLeft: `${marginLeft}px` }}>
        {isSidebarVisible && <Sidebar />}
        {isHrSidebarVisible && <MemberSidebar onClickMember={(name, dept, team, position) => handleMemberClick(name, dept, team, position)}/>}
        <Outlet />
      </div>
    </main>
  );
};

export default BaseLayout;