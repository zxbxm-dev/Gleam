import "./ActivityManage.scss";
import { useNavigate, Link } from "react-router-dom";

const ActivityManage = () => {
  let navigate = useNavigate();

  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <Link to={"/activitymanage"} className="sub_header">활동관리</Link>
      </div>
      
      <div className="content_container">
        <div className="active_container">
          <div className="board_container">
            <div className="board_content">

              <div className="board_top">
                <div className="board_name">직원 공지</div>
                <Link to={"/employeeNotice"}><div className="board_add">글 더보기 +</div></Link>
              </div>

              <div className="board_btm">
                <div className="board_unit">
                  <div className="board_title">OOO직원 경조사 공지</div>
                  <div className="board_date">2024.02.05</div>
                </div>
                <div className="board_unit">
                  <div className="board_title">OOO직원 경조사 공지</div>
                  <div className="board_date">2024.02.05</div>
                </div>
                <div className="board_unit">
                  <div className="board_title">OOO직원 경조사 공지</div>
                  <div className="board_date">2024.02.05</div>
                </div>
                <div className="board_unit">
                  <div className="board_title">OOO직원 경조사 공지</div>
                  <div className="board_date">2024.02.05</div>
                </div>
                <div className="board_unit">
                  <div className="board_title">OOO직원 경조사 공지</div>
                  <div className="board_date">2024.02.05</div>
                </div>
              </div>
            </div>

            <div className="board_content">

              <div className="board_top">
                <div className="board_name">자유게시판</div>
                <Link to={"/freeboard"}><div className="board_add">글 더보기 +</div></Link>
              </div>

              <div className="board_btm">
                <div className="board_unit">
                  <div className="board_title">자유게시판테스트1</div>
                  <div className="board_date">2024.02.05</div>
                </div>
                <div className="board_unit">
                  <div className="board_title">자유게시판테스트2</div>
                  <div className="board_date">2024.02.05</div>
                </div>
                <div className="board_unit">
                  <div className="board_title">자유게시판테스트3</div>
                  <div className="board_date">2024.02.05</div>
                </div>
                <div className="board_unit">
                  <div className="board_title">자유게시판테스트4</div>
                  <div className="board_date">2024.02.05</div>
                </div>
                <div className="board_unit">
                  <div className="board_title">자유게시판테스트5</div>
                  <div className="board_date">2024.02.05</div>
                </div>
              </div>

            </div>
          </div>

          <div className="btn_wrap">
            <button className="primary_button" onClick={() => {navigate("/writeActivityManage")}}>게시물 작성</button>
          </div>

        </div>
      </div>  
    </div>
  );
};

export default ActivityManage;