import "./Report.scss";
import { Link } from "react-router-dom";

const Report = () => {
  

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/report"} className="sub_header">보고서</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="report_container">
            <div className="report_type">
              <div></div>
            </div>
            <div className="report_btn">
              <button className="temp_button">임시저장 파일 보기</button>
            </div>
          </div>
        </div>
      </div>  
      
    </div>
  );
};

export default Report;