import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "./layout/BaseLayout";
import { 
  Login,
  ActivityManage,
  WriteActivityManage,
  Announcement,
  WriteAnnounce,
  EmployeeNotice,
  DetailEmployeeNotice,
  FreeBoard,
  DetailFreeBoard,
  DetailAnnounce,
  OrgChart,
  Regulations,
  WriteRegulation,
  DetailRegulation,
  Calendar,
  Report,
  WriteReport,
  TempReportStorage,
  Approval,
  DetailApproval,
  Employment,
  SubmitPerform,
  DetailSubmit,
  ManagePerform,
  HumanResource,
  AnnualManage,
  AttendanceRegist,
  PageNotFound } from "./screens";

import { useRecoilState } from 'recoil';
import { userState } from './recoil/atoms';

function App() {

  const [userInfo] = useRecoilState(userState);
  console.log(userInfo);
  return (
    <>
      <Router>
        <Routes>
          <Route path="*" element={<Login />} />

          <Route element={<BaseLayout />}>
            {/* 활동관리 */}
            <Route path="/activitymanage" element={<ActivityManage />} />
            <Route path="/writeActivityManage" element={<WriteActivityManage />} />
            <Route path="/employeeNotice" element={<EmployeeNotice />} />
            <Route path="/detailEmployeeNotice" element={<DetailEmployeeNotice />} />
            <Route path="/freeBoard" element={<FreeBoard />} />
            <Route path="/detailFreeBoard" element={<DetailFreeBoard />} />

            <Route path="/announcement" element={<Announcement />} />
            <Route path="/writeAnnounce" element={<WriteAnnounce />} />
            <Route path="/detailAnnounce" element={<DetailAnnounce />} />

            <Route path="/orgchart" element={<OrgChart />} />

            <Route path="/regulations" element={<Regulations />} />
            <Route path="/writeRegulation" element={<WriteRegulation />} />
            <Route path="/detailRegulation" element={<DetailRegulation />} />

            {/* 휴가 관리 */}
            <Route path="/calendar" element={<Calendar />} />

            {/* 보고서 */}
            <Route path="/report" element={<Report />} />
            <Route path="/writeReport" element={<WriteReport />} />
            <Route path="/tempReportStorage" element={<TempReportStorage />} />

            {/* 보고서 결재 */}
            <Route path="/approval" element={<Approval />} />
            <Route path="/detailApproval" element={<DetailApproval />} />
            
            {/* 채용공고 */}
            <Route path="/employment" element={<Employment />} />

            {/* 인사평가 */}
            <Route path="/submit-perform" element={<SubmitPerform />} />
            <Route path="/detailSubmit" element={<DetailSubmit />} />
            <Route path="/manage-perform" element={ userInfo.team === '관리팀' ? <ManagePerform /> : <PageNotFound />} />


            {/* 인사 정보 관리 */}
            <Route path="/human-resources" element={ userInfo.team === '관리팀' ? <HumanResource /> : <PageNotFound />} />

            {/* 근태 관리 */}
            <Route path="/annual-manage" element={ userInfo.team === '관리팀' ? <AnnualManage /> : <PageNotFound />} />
            <Route path="/attendance-regist" element={ userInfo.team === '관리팀' ? <AttendanceRegist /> : <PageNotFound />} />

            <Route path="/404" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
