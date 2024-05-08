import "./ActivityManage.scss";
import {
  AttachmentIcon,
  DeleteIcon,
} from "../../../assets/images/index";
import { Input } from '@chakra-ui/react'
import { useNavigate, Link } from "react-router-dom";


const DetailEmployeeNotice = () => {
  let navigate = useNavigate();

  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <Link to={"/activitymanage"} className="main_header">활동관리</Link>
        <div className="main_header">＞</div>
        <Link to={"/employeeNotice"} className="sub_header">직원공지</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="main_header2">
            <div className="header_name_bg">
              OOO의 경조사를 축하합니다.
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
                <button className="second_button" onClick={() => navigate("/employeeNotice")}>목록</button>
              </div>
            </div>
          </div>

          <div className="content_container">
            <div className="Employee_content">
              <div className="content_top">
                축하합니다.
              </div>
              <div className="content_btm">
                <div className="btm_title">첨부파일</div>
                <div className="btm_attachment">
                  <div className="btm_attachment_display">
                    <img src={AttachmentIcon} alt="AttachmentIcon" />
                    <div>청첩장 이미지.png</div>
                  </div>
                  <div className="btm_attachment_display">
                    <img src={AttachmentIcon} alt="AttachmentIcon" />
                    <div>첨부파일 이미지.jpg</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="Employee_comment">
              <div className="comment_title">
                댓글(2)
              </div>

              <div className="comment_container">
                <div className="comment_left">
                  <div className="comment_name">서주희</div>
                  <div className="comment_content">축하합니다~</div>
                  <img src={DeleteIcon} alt="DeleteIcon" />
                </div>
                <div className="comment_right">
                  <div>2024.02.05</div>
                  <div className="border_right"></div>
                  <div>18:15:36</div>
                </div>
              </div>

              <div className="comment_container">
                <div className="comment_left">
                  <div className="comment_name">전아름</div>
                  <div className="comment_content">축하합니다~</div>
                </div>
                <div className="comment_right">
                  <div>2024.02.05</div>
                  <div className="border_right"></div>
                  <div>18:15:36</div>
                </div>
              </div>

              <div className="comment_container">
                <div className="comment_input_left">
                  <div className="comment_name">서주희</div>
                </div>
                <div className="comment_input_right">
                  <Input placeholder='댓글을 입력해 주세요.' height='100px'/>
                  <button className="second_button">등록</button>
                </div>
              </div>

            </div>
          </div>
        

        </div>
      </div>  
    </div>
  );
};

export default DetailEmployeeNotice;