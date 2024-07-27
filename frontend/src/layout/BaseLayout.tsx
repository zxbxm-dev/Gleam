import { useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "../components";
import { useRecoilState } from 'recoil';
import { isSidebarVisibleState, isHrSidebarVisibleState } from '../recoil/atoms';

const BaseLayout = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useRecoilState(isSidebarVisibleState);
  const [isHrSidebarVisible] = useRecoilState(isHrSidebarVisibleState);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');

    const handleMediaQueryChange = (event:any) => {
      setIsSidebarVisible(!event.matches);
    };

    handleMediaQueryChange(mediaQuery);

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [setIsSidebarVisible]);

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
