import { Outlet } from "react-router-dom";
import { Header, MessageSidebar } from "../components";
import { useRecoilState } from 'recoil';
import { isSidebarVisibleState } from '../recoil/atoms';

const ChatLayout = () => {
    const [isSidebarVisible] = useRecoilState(isSidebarVisibleState);

    return (
        <main className="page-wrapper">
            <Header />

            <div className="content-wrapper">
                {isSidebarVisible && <MessageSidebar />}
                <Outlet />
            </div>
        </main>
    );
};

export default ChatLayout;