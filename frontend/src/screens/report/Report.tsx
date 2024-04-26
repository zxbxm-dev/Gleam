import "./Report.scss";
import { useNavigate, Link } from "react-router-dom";

const Report = () => {
  let navigate = useNavigate();

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
                <div className="report_name" onClick={() => {navigate("/writeReport")}}>주간업무일지</div>
                <div className="report_name">지출품의서</div>
                <div className="report_name">휴가신청서</div>
              </div>

              <div className="report_content">
                <div className="report_title">기타</div>
                <div className="report_name">시말서</div>
                <div className="report_name">사직서</div>
                <div className="report_name">휴직원</div>
                <div className="report_name">복직원</div>
              </div>
            </div>

            <div className="report_type">
              <div className="report_content">
                <div className="report_title">워크숍</div>
                <div className="report_name">워크숍 신청서</div>
                <div className="report_name">워크숍 보고서 (프로젝트 회의)</div>
                <div className="report_name">워크숍 보고서 (야유회)</div>
                <div className="report_name">지출내역서</div>
                <div className="report_name">예산신청서 (지원팀)</div>
              </div>

              <div className="report_content">
                <div className="report_title">기획서</div>
                <div className="report_name">기획서</div>
                <div className="report_name">최종보고서</div>
                <div className="report_name">프로젝트 기획서</div>
              </div>
            </div>
            <div className="report_btn">
              <button className="temp_button" onClick={() => {navigate("/tempReportStorage")}}>임시저장 파일 보기</button>
            </div>
          </div>
        </div>
      </div>  
      
    </div>
  );
};

export default Report;