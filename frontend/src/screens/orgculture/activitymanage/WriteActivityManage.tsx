import "./ActivityManage.scss";
import {
  DeleteIcon,
} from "../../../assets/images/index";
import { useNavigate, Link } from "react-router-dom";
import { Select } from '@chakra-ui/react';
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';

const WriteActivityManage = () => {
  let navigate = useNavigate();
  
  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <Link to={"/activitymanage"} className="sub_header">활동관리</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="main_header">
            <div className="header_name_sm">공지사항 작성</div>
          </div>

          <div className="content_container">
            <div className="write_container">
              <input type="text" className="write_title" placeholder="제목을 입력해 주세요."/>
              <div className="writor_container">
                <div className="write_info">작성자</div>
                <div className="write_info">구민석</div>
                <div className="write_border" />
                <div className="write_info">작성일</div>
                <div className="write_info">2024/04/09</div>
                <div className="write_border" />
                <div className="write_info">종류구분</div>
                <Select placeholder='선택없음' width='100px' size='xs'>
                  <option value='option1'>직원공지</option>
                  <option value='option2'>자유게시판</option>
                </Select>
              </div>
              <div>
              <Editor
                initialValue="내용을 입력해 주세요."
                height="430px"
                initialEditType="wysiwyg"
                useCommandShortcut={false}
                hideModeSwitch={true}
                plugins={[colorSyntax]}
                language="ko-KR"
              />
              </div>
            </div>

            <div className="activity_main_bottom">
              <div className="attachment_content">
                <button className="primary_button">파일 첨부하기</button>
                <div className="attachment_name">워크숍 규정.pdf</div>
                <img src={DeleteIcon} alt="DeleteIcon" />
              </div>
              <div>
                <button className="second_button" onClick={() => {navigate("/activitymanage")}}>등록</button>
              </div>
            </div>
          </div>
        

        </div>
      </div>  
    </div>
  );
};

export default WriteActivityManage;