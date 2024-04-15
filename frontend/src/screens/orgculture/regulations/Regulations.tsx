import "./Regulations.scss";
import {
  SearchIcon
} from "../../../assets/images/index";

const Regulations = () => {
  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <div className="sub_header">사내규정</div>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="main_header">
            <div className="header_name">사내규정</div>
            <div className="input-wrapper">
              <input type="search" className="input_form" />
              <img src={SearchIcon} alt="SearchIcon" className="search-icon" />
            </div>
          </div>
        
        </div>
      </div>  
    </div>
  );
};

export default Regulations;