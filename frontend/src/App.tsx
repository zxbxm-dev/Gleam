import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "./layout/BaseLayout";
import { 
  ActivityManage,
  Announcement,
  OrgChart,
  Regulations,
  PageNotFound } from "./screens";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route path="/activitymanage" element={<ActivityManage />} />
            <Route path="/announcement" element={<Announcement />} />
            <Route path="/orgchart" element={<OrgChart />} />
            <Route path="/regulations" element={<Regulations />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
