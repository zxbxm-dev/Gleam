import "./App.scss";
import "./style/index.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "./layout/BaseLayout";
import { useRecoilValue } from 'recoil';
import { userState } from './recoil/atoms';
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
  Project
} from "./screens";

function App() {
  const user = useRecoilValue(userState);
  const isLogin = localStorage.getItem('isLoggedIn') === 'true';
  const isPerformance = (user.team === '관리팀'&& user.position === '팀장') || user.position === '대표이사' || user.position === '센터장'; // 인사평가제출
  const isHumanResources = user.team === '관리팀' || user.position === '대표이사' || user.position === '센터장'; // 인사정보관리
  const isAttendance = user.team === '관리팀' || user.position === '대표이사' || user.position === '센터장' || user.position === '연구실장'; // 근태관리
  const isOperating = user.team === '지원팀' || user.position === '대표이사'; // 운영비관리
  const isAuthorized = user.team === '관리팀' || user.position === '대표이사'; // 회원관리

  return (
    <>
      <Router>
        <Routes>
          <Route path="/*" element={<PageNotFound />} />
          <Route path="/notAuth" element={<PageNotAuth />} />

          <Route element={<PublicRoute isAllowed={isLogin} redirectPath="/" />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/findId" element={<FindID />} />
            <Route path="/resetpw" element={<ResetPw />} />
          </Route>

          <Route element={<PrivateRoute isAllowed={isLogin} />}>
            <Route path="/editres" element={<EditRegis />} />
            <Route element={<BaseLayout />}>
              <Route path="/" element={<Announcement />} />
              <Route path="/writeAnnounce" element={<WriteAnnounce />} />
              <Route path="/detailAnnounce/:id" element={<DetailAnnounce />} />

              <Route path="/orgchart" element={<OrgChart />} />
              <Route path="/meetingroom" element={<MeetingRoom />} />
              <Route path="/project" element={<Project />} />

              <Route path="/regulations" element={<Regulations />} />
              <Route path="/writeRegulation" element={<WriteRegulation />} />
              <Route path="/detailRegulation/:id" element={<DetailRegulation />} />

              {/* 휴가 관리 */}
              <Route path="/calendar" element={<Calendar />} />

              {/* 보고서 */}
              <Route path="/report" element={<Report />} />
              <Route path="/writeReport" element={<WriteReport />} />

              {/* 보고서 결재 */}
              <Route path="/approval" element={<Approval />} />
              <Route path="/detailApproval" element={<DetailApproval />} />
              <Route path="/detailDocument" element={<DetailDocument />} />

              {/* 채용공고 */}
              <Route path="/employment" element={<Employment />} />

              {/* 인사평가 */}
              <Route path="/submit-perform" element={<SubmitPerform />} />
              <Route path="/detailSubmit" element={<DetailSubmit />} />
              <Route element={<ProtectedRoute isAllowed={isPerformance} redirectPath="/notAuth" />}>
                <Route path="/manage-perform" element={<ManagePerform />} />
              </Route>

              <Route element={<ProtectedRoute isAllowed={isAttendance} redirectPath="/notAuth" />}>
                {/* 근태 관리 */}
                <Route path="/annual-manage" element={<AnnualManage />} />
                <Route path="/attendance-regist" element={<AttendanceRegist />} />
              </Route>

              <Route element={<ProtectedRoute isAllowed={isHumanResources} redirectPath="/notAuth" />}>
                {/* 인사 정보 관리 */}
                <Route path="/human-resources" element={<HumanResource />} />
              </Route>

              <Route element={<ProtectedRoute isAllowed={isOperating} redirectPath="/notAuth" />}>
                {/* 운영비 관리 */}
                <Route path="/operating-manage" element={<Operating />} />
              </Route>

              <Route element={<ProtectedRoute isAllowed={isAuthorized} redirectPath="/notAuth" />}>
                {/* 회원 관리 */}
                <Route path="/user-management" element={<UserManagement />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
