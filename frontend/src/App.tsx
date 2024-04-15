import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "./layout/BaseLayout";
import { 
  ActivityManage,
  WriteActivityManage,
  Announcement,
  WriteAnnounce,
  EmployeeNotice,
  FreeBoard,
  DetailAnnounce,
  OrgChart,
  Regulations,
  WriteRegulation,
  DetailRegulation,
  PageNotFound } from "./screens";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route path="/activitymanage" element={<ActivityManage />} />
            <Route path="/writeActivityManage" element={<WriteActivityManage />} />
            <Route path="/employeeNotice" element={<EmployeeNotice />} />
            <Route path="/freeBoard" element={<FreeBoard />} />

            <Route path="/announcement" element={<Announcement />} />
            <Route path="/writeAnnounce" element={<WriteAnnounce />} />
            <Route path="/detailAnnounce" element={<DetailAnnounce />} />

            <Route path="/orgchart" element={<OrgChart />} />

            <Route path="/regulations" element={<Regulations />} />
            <Route path="/writeRegulation" element={<WriteRegulation />} />
            <Route path="/detailRegulation" element={<DetailRegulation />} />

            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
