import { Outlet } from "react-router-dom";
import { Header, Sidebar, MemberSidebar } from "../components";
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
    marginLeft += 200;
  }
  
  const handleMemberClick = (name: string, dept: string, team: string, position: string) => {
    // 선택된 멤버 정보를 새로운 Member 배열로 생성
    const newMember = [name, dept, team, position];
    setIsSelectMember(newMember);
    console.log(isSelectMember)
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