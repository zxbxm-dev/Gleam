import "./Report.scss";
import { useNavigate, Link } from "react-router-dom";

const Report = () => {
  let navigate = useNavigate();

  const handleReportClick = (reportName: string) => {
    navigate("/writeReport", { state: { reportName } });
  }
  
  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/report"} className="sub_header">보고서</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="report_container">
          <div className="report_type">
              <div className="report_content">
                <div className="report_title">공통 보고서</div>
                <div className="report_name" onClick={() => handleReportClick("주간업무일지")}>주간업무일지</div>
                <div className="report_name" onClick={() => handleReportClick("지출품의서")}>지출품의서</div>
                <div className="report_name" onClick={() => handleReportClick("휴가신청서")}>휴가신청서</div>
              </div>

              <div className="report_content">
                <div className="report_title">기타</div>
                <div className="report_name" onClick={() => handleReportClick("시말서")}>시말서</div>
                {/* <div className="report_name" onClick={() => handleReportClick("사직서")}>사직서</div> */}
                <div className="report_name" onClick={() => handleReportClick("휴직원")}>휴직원</div>
                <div className="report_name" onClick={() => handleReportClick("복직원")}>복직원</div>
              </div>
            </div>

            <div className="report_type">
              <div className="report_content">
                <div className="report_title">워크숍</div>
                <div className="report_name" onClick={() => handleReportClick("워크숍 신청서")}>워크숍 신청서</div>
                <div className="report_name" onClick={() => handleReportClick("워크숍 보고서 (프로젝트 회의)")}>워크숍 보고서 (프로젝트 회의)</div>
                <div className="report_name" onClick={() => handleReportClick("워크숍 보고서 (야유회)")}>워크숍 보고서 (야유회)</div>
                <div className="report_name" onClick={() => handleReportClick("지출내역서")}>지출내역서</div>
                <div className="report_name" onClick={() => handleReportClick("예산신청서 (지원팀)")}>예산신청서 (지원팀)</div>
              </div>

              <div className="report_content">
                <div className="report_title">기획서</div>
                <div className="report_name" onClick={() => handleReportClick("기획서")}>기획서</div>
                <div className="report_name" onClick={() => handleReportClick("최종보고서")}>최종보고서</div>
                <div className="report_name" onClick={() => handleReportClick("프로젝트 계획서")}>프로젝트 계획서</div>
              </div>
            </div>
          </div>
        </div>
      </div>  
      
    </div>
  );
};

export default Report;