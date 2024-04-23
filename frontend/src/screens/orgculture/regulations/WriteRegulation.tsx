import "./Regulations.scss";
import {
  DeleteIcon,
} from "../../../assets/images/index";
import { useNavigate, Link } from "react-router-dom";
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';

const WriteRegulation = () => {
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
              </div>
              <div>
              <Editor
                initialValue="내용을 입력해 주세요."
                height="530px"
                initialEditType="wysiwyg"
                useCommandShortcut={false}
                hideModeSwitch={true}
                plugins={[colorSyntax]}
                language="ko-KR"
              />
              </div>
            </div>

            <div className="regulation_main_bottom">
              <div className="attachment_content">
                <button className="primary_button">파일 첨부하기</button>
                <div className="attachment_name">워크숍 규정.pdf</div>
                <img src={DeleteIcon} alt="DeleteIcon" />
              </div>
              <div>
                <button className="second_button" onClick={() => {navigate("/regulations")}}>등록</button>
              </div>
            </div>
          </div>
        

        </div>
      </div>  
    </div>
  );
};

export default WriteRegulation;