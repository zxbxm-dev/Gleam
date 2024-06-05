import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "./layout/BaseLayout";
import { useRecoilValue } from 'recoil';
import { userState } from './recoil/atoms';
import PrivateRoute from "./layout/PrivateRoute";
import ProtectedRoute from "./layout/ProtectedRoute";
import {
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
  PageNotFound,
  Register,
  FindID,
  ResetPw,
  EditRegis,
  UserManagement,
} from "./screens";

function App() {
  const user = useRecoilValue(userState);
  const isLogin = localStorage.getItem('isLoggedIn') === 'true';
  const isPerformance = user.username === '김효은' || user.username === '이정훈' || user.username === '이유정'; // 인사평가제출
  const isHumanResources = user.team === '관리팀' || user.username === '이정훈' || user.username === '이유정'; // 인사정보관리
  const isAttendance = user.team === '관리팀' || user.username === '이정훈' || user.username === '이유정' || user.spot === '연구실장'; // 근태관리
  const isOperating = user.team === '지원팀' || user.username === '이정훈'; // 운영비관리
  const isAuthorized = user.team === '관리팀' || user.username === '이정훈'; // 회원관리

  return (
    <>
      <Router>
        <Routes>
          <Route path="/*" element={<PageNotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/findId" element={<FindID />} />
          <Route path="/resetpw" element={<ResetPw />} />
          <Route path="/editres" element={<EditRegis />} />

          <Route element={<PrivateRoute isAllowed={isLogin} />}>
            <Route element={<BaseLayout />}>
              <Route path="/" element={<Announcement />} />
              <Route path="/writeAnnounce" element={<WriteAnnounce />} />
              <Route path="/detailAnnounce/:id" element={<DetailAnnounce />} />

              <Route path="/orgchart" element={<OrgChart />} />

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
              <Route element={<ProtectedRoute isAllowed={isPerformance} redirectPath="/" />}>
                <Route path="/manage-perform" element={<ManagePerform />} />
              </Route>

              <Route element={<ProtectedRoute isAllowed={isAttendance} redirectPath="/" />}>
                {/* 근태 관리 */}
                <Route path="/annual-manage" element={<AnnualManage />} />
                <Route path="/attendance-regist" element={<AttendanceRegist />} />
              </Route>

              <Route element={<ProtectedRoute isAllowed={isHumanResources} redirectPath="/" />}>
                {/* 인사 정보 관리 */}
                <Route path="/human-resources" element={<HumanResource />} />
              </Route>

              <Route element={<ProtectedRoute isAllowed={isOperating} redirectPath="/" />}>  
                {/* 운영비 관리 */}
                <Route path="/operating-manage" element={<Operating />} />
              </Route>

              <Route element={<ProtectedRoute isAllowed={isAuthorized} redirectPath="/" />}>  
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
