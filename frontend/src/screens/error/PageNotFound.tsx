import "./PageNot.scss";
import {
  PageNotIcon
} from "../../assets/images/index";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  let navigate = useNavigate();

  return (
    <div className="not_authorization">
      <div className="content_box">
        <div className="content_box_top">
          <div className="content_box_img">
            <img src={PageNotIcon} alt="PageNotIcon" />
          </div>
        </div>
        <div className="content_box_btm">
          <div className="content_box_text">
            존재하지 않는 페이지입니다. <br/>
            개발팀에 문의해 주세요.
          </div>
          <div className="content_box_manage">
            관리자 - 개발 1팀 장현지 팀장
          </div>
          <div className="content_box_btn">
            <button className="main_button" onClick={() => navigate('/')}>메인으로</button>
            <button className="back_button" onClick={() => navigate(-1)}>돌아가기</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound;