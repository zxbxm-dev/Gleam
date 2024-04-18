import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "./layout/BaseLayout";
import { 
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
  Approval,
  Employment,
  PerFormReport,
  MemberEval,
  ReaderEval,
  SelfAssessment,
  FinalResult,
  HumanResource,
  AnnualManage,
  AttendanceRegist,
  PageNotFound } from "./screens";

function App() {
  return (
    <>
      <Router>
        <Routes>
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

            {/* 보고서 결재 */}
            <Route path="/approval" element={<Approval />} />
            
            {/* 채용공고 */}
            <Route path="/employment" element={<Employment />} />

            {/* 인사평가 */}
            <Route path="/performance-report" element={<PerFormReport />} />
            <Route path="/member-evaluation" element={<MemberEval />} />
            <Route path="/reader-evaluation" element={<ReaderEval />} />
            <Route path="/self-assessment" element={<SelfAssessment />} />
            <Route path="/final-result" element={<FinalResult />} />

            {/* 인사 정보 관리 */}
            <Route path="/human-resources" element={<HumanResource />} />

            {/* 근태 관리 */}
            <Route path="/annual-manage" element={<AnnualManage />} />
            <Route path="/attendance-regist" element={<AttendanceRegist />} />

            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
