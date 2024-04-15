import "./Regulations.scss";
import { useNavigate, Link } from "react-router-dom";


const DetailRegulation = () => {
  let navigate = useNavigate();

  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <Link to={"/regulations"} className="sub_header">사내규정</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="main_header2">
            <div className="header_name_bg">
              취업규칙
            </div>
            <div className="detail_container">
              <div className="info_content">
                <div className="write_info">작성자</div>
                <div className="write_info">구민석</div>
                <div className="write_border" />
                <div className="write_info">작성일</div>
                <div className="write_info">2024/04/09</div>
              </div>

              <div className="btn_content">
                <button className="white_button">삭제</button>
                <button className="white_button">수정</button>
                <button className="second_button" onClick={() => navigate("/regulations")}>목록</button>
              </div>
            </div>
          </div>

          <div className="content_container">
            
          </div>
        

        </div>
      </div>  
    </div>
  );
};

export default DetailRegulation;