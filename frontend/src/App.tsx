import "./App.scss";
import "./style/index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BaseLayout from "./layout/BaseLayout";
import { useRecoilValue } from "recoil";
import { userState } from "./recoil/atoms";
import PrivateRoute from "./layout/PrivateRoute";
import ProtectedRoute from "./layout/ProtectedRoute";
import PublicRoute from "./layout/PublicRoute";
import {
  PageNotFound,
  PageNotAuth,
  Login,
  Announcement,
  WriteAnnounce,
  DetailAnnounce,
  OrgChart,
  Regulations,
  WriteRegulation,
  DetailRegulation,
  Calendar,
  Report,
  WriteReport,
  Approval,
  DetailApproval,
  DetailDocument,
  Employment,
  SubmitPerform,
  DetailSubmit,
  ManagePerform,
  DetailManagePerform,
  HumanResource,
  AnnualManage,
  AttendanceRegist,
  Operating,
  Register,
  FindID,
  ResetPw,
  EditRegis,
  UserManagement,
  MeetingRoom,
  Project,
  Mail,
  WriteMail,
  Message,
} from "./screens";
import ChatLayout from "./layout/ChatLayout";

function App() {
  const user = useRecoilValue(userState);
  const isLogin = localStorage.getItem("isLoggedIn") === "true";
  const isPerformance =
    (user.team === "관리팀" && user.position === "팀장") ||
    user.position === "대표이사" ||
    user.position === "센터장"; // 인사평가제출
  const isHumanResources =
    user.team === "관리팀" ||
    user.position === "대표이사" ||
    user.position === "센터장" ||
    (user.position === "부서장" && user.department === "관리부"); // 인사정보관리
  const isAttendance =
    user.team === "관리팀" ||
    user.position === "대표이사" ||
    user.position === "센터장" ||
    user.position === "연구실장" ||
    (user.position === "부서장" && user.department === "관리부"); // 근태관리
  const isOperating = user.team === "지원팀" || user.position === "대표이사"; // 운영비관리
  const isAuthorized =
    user.team === "관리팀" ||
    user.position === "대표이사" ||
    (user.position === "부서장" && user.department === "관리부"); // 회원관리

  const router = createBrowserRouter([
    { path: "*", element: <PageNotFound /> },
    { path: "/notAuth", element: <PageNotAuth /> },
    {
      element: <PublicRoute isAllowed={isLogin} redirectPath="/" />,
      children: [
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/findId", element: <FindID /> },
        { path: "/resetpw", element: <ResetPw /> },
      ],
    },
    {
      element: <ChatLayout />,
      children: [{ path: "/messanger", element: <Message /> }],
    },
    {
      element: <PrivateRoute isAllowed={isLogin} />,
      children: [
        { path: "/editres", element: <EditRegis /> },
        {
          element: <BaseLayout />,
          children: [
            { path: "/", element: <Announcement /> },
            { path: "/mail", element: <Mail /> },
            { path: "/writeMail", element: <WriteMail /> },
            { path: "/writeAnnounce", element: <WriteAnnounce /> },
            { path: "/detailAnnounce/:id", element: <DetailAnnounce /> },
            { path: "/orgchart", element: <OrgChart /> },
            { path: "/meetingroom", element: <MeetingRoom /> },
            { path: "/project", element: <Project /> },
            { path: "/regulations", element: <Regulations /> },
            { path: "/writeRegulation", element: <WriteRegulation /> },
            { path: "/detailRegulation/:id", element: <DetailRegulation /> },
            { path: "/calendar", element: <Calendar /> },
            { path: "/report", element: <Report /> },
            { path: "/writeReport", element: <WriteReport /> },
            { path: "/approval", element: <Approval /> },
            { path: "/detailApproval/:id", element: <DetailApproval /> },
            { path: "/detailDocument/:id", element: <DetailDocument /> },
            { path: "/employment", element: <Employment /> },
            { path: "/submit-perform", element: <SubmitPerform /> },
            { path: "/detailSubmit", element: <DetailSubmit /> },
            {
              element: (
                <ProtectedRoute
                  isAllowed={isPerformance}
                  redirectPath="/notAuth"
                />
              ),
              children: [
                { path: "/manage-perform", element: <ManagePerform /> },
                {
                  path: "/detail-manage-perform",
                  element: <DetailManagePerform />,
                },
              ],
            },
            {
              element: (
                <ProtectedRoute
                  isAllowed={isAttendance}
                  redirectPath="/notAuth"
                />
              ),
              children: [
                { path: "/annual-manage", element: <AnnualManage /> },
                { path: "/attendance-regist", element: <AttendanceRegist /> },
              ],
            },
            {
              element: (
                <ProtectedRoute
                  isAllowed={isHumanResources}
                  redirectPath="/notAuth"
                />
              ),
              children: [
                { path: "/human-resources", element: <HumanResource /> },
              ],
            },
            {
              element: (
                <ProtectedRoute
                  isAllowed={isOperating}
                  redirectPath="/notAuth"
                />
              ),
              children: [{ path: "/operating-manage", element: <Operating /> }],
            },
            {
              element: (
                <ProtectedRoute
                  isAllowed={isAuthorized}
                  redirectPath="/notAuth"
                />
              ),
              children: [
                { path: "/user-management", element: <UserManagement /> },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
