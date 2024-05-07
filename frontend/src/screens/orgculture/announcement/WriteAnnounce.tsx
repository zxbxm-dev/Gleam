import React,{useState} from "react";
import "./Announcement.scss";
import {
  DeleteIcon,
} from "../../../assets/images/index";
import { useNavigate, Link } from "react-router-dom";
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';

const WriteAnnounce = () => {
  let navigate = useNavigate();

  const [attachment, setAttachment] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const formatDate = (date:any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const currentDate = formatDate(new Date());

  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <Link to={"/announcement"} className="sub_header">공지사항</Link>
      </div>

      <div className="content_container">
        <div className="container">
          <div className="main_header">
            <div className="header_name_sm">공지사항 작성</div>
          </div>

          <div className="content_container">
            <div className="write_container">
              <input type="text" className="write_title" placeholder="제목을 입력해 주세요." />
              <div className="writor_container">
                <div className="write_info">작성자</div>
                <div className="write_info">구민석</div>
                <div className="write_border" />
                <div className="write_info">작성일</div>
                <div className="write_info">{currentDate}</div>
              </div>
              <div className="DesktopInput">
                <Editor
                  initialValue="내용을 입력해 주세요."
                  height='60vh'
                  initialEditType="wysiwyg"
                  useCommandShortcut={false}
                  hideModeSwitch={true}
                  plugins={[colorSyntax]}
                  language="ko-KR"
                />
              </div>

              <div className="LaptopInput">
                <Editor
                  initialValue="내용을 입력해 주세요."
                  height='53vh'
                  initialEditType="wysiwyg"
                  useCommandShortcut={false}
                  hideModeSwitch={true}
                  plugins={[colorSyntax]}
                  language="ko-KR"
                />
              </div>

              <div className="announce_main_bottom">
                <div className="attachment_content">
                  <label htmlFor="fileInput" className="primary_button">
                    파일 첨부하기
                    <input
                      id="fileInput"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </label>
                  {attachment && <div className="attachment_name">{attachment.name}</div>}
                  {attachment && <img src={DeleteIcon} alt="DeleteIcon" onClick={() => setAttachment(null)} />}
                </div>
                <div>
                  <button className="second_button" onClick={() => { navigate("/announcement") }}>등록</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteAnnounce;