import { Outlet } from "react-router-dom";
import { MessageHeader, MessageSidebar } from "../components";

const ChatLayout = () => {

    return (
        <main className="page-wrapper">
            <MessageHeader />

            <div className="content-wrapper" style={{ display: 'flex' }}>
                <MessageSidebar />
                <Outlet />
            </div>
        </main>
    );
};

export default ChatLayout;