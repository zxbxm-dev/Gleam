import { Outlet } from "react-router-dom";
import { Header, MessageSidebar } from "../components";

const ChatLayout = () => {

    return (
        <main className="page-wrapper">
            <Header />

            <div className="content-wrapper" style={{ display: 'flex' }}>
                <MessageSidebar />
                <Outlet />
            </div>
        </main>
    );
};

export default ChatLayout;