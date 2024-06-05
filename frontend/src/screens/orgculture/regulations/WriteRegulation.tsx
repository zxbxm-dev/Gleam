import React, { useState, useRef } from "react";
import "./Regulations.scss";
import {
  DeleteIcon,
} from "../../../assets/images/index";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';
import { WriteRegul, EditRegul } from "../../../services/announcement/Regulation";
import { useRecoilValue } from 'recoil';
import { userState } from '../../../recoil/atoms';
interface Attachment {
  file: File;
  fileName: string;
}

const WriteRegulation = () => {
  let navigate = useNavigate();
  const { state: editData } = useLocation();
  const editorRef = useRef<any>(null);
  const [value, setValue] = useState("");
  const [isfileUpload, setIsFileUpload] = useState(false);

  const [form, setForm] = useState<{
    content: string;
    title: string;
    attachment: Attachment | null;
  }>({
    content: "",
    title: "",
    attachment: null,
  });
  const user = useRecoilValue(userState);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileData = { file: file, fileName: file.name };
      setForm({ ...form, attachment: fileData as any });
    }
  };

  const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const currentDate = formatDate(new Date());

  const handleTitleChange = (event: any) => {
    setForm({ ...form, title: event.target.value });
  };
  
  const handleSubmit = async (data: any) => {
    const { title, content } = form;

    if (title === "") {
      alert("게시물 제목을 입력해 주세요.");
      return;
    } else if (content === "") {
      alert("내용을 입력해 주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("userID", user.id);
    formData.append("username", user.username);
    formData.append("date", currentDate);
    formData.append("title", title);
    formData.append("content", content);
    if (form.attachment) {
      formData.append("attachment", (form.attachment as any).file);
      formData.append("attachmentName", (form.attachment as any).fileName);
    }

    WriteRegul(formData)
      .then(response => {
        // 성공적으로 등록되었을 때 처리
        navigate("/regulations");
      })
      .catch(error => {
        // 실패 시 처리
        console.error("등록에 실패했습니다.");
      });

      if (editData) {
        data = { ...data, id: editData.id };
        await EditRegul(data, formData);
      }
  };

  const onChange = () => {
    const data = editorRef.current.getInstance().getHTML();
    setForm({ ...form, content: data })
    
    if (editData && editData?.fileUrl) {
      setIsFileUpload(true);
    } else setIsFileUpload(false);
  };

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
            <div className="header_name_sm">사내규정 작성</div>
          </div>

          <div className="content_container">
            <div className="write_container">
              <input type="text" className="write_title" placeholder="제목을 입력해 주세요." onChange={handleTitleChange} />
              <div className="writor_container">
                <div className="write_info">작성자</div>
                <div className="write_info">{user.username}</div>
                <div className="write_border" />
                <div className="write_info">작성일</div>
                <div className="write_info">{currentDate}</div>
              </div>
              <div className="DesktopInput">
                <Editor
                  ref={editorRef}
                  initialValue="내용을 입력해 주세요."
                  height='60vh'
                  onChange={onChange}
                  initialEditType="wysiwyg"
                  useCommandShortcut={false}
                  hideModeSwitch={true}
                  plugins={[colorSyntax]}
                  language="ko-KR"
                />
              </div>

              <div className="LaptopInput">
                <Editor
                  ref={editorRef}
                  initialValue="내용을 입력해 주세요."
                  height='53vh'
                  onChange={onChange}
                  initialEditType="wysiwyg"
                  useCommandShortcut={false}
                  hideModeSwitch={true}
                  plugins={[colorSyntax]}
                  language="ko-KR"
                />
              </div>
              <div className="regulation_main_bottom">
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
                  {form.attachment && <div className="attachment_name">{form.attachment.fileName}</div>}
                  {form.attachment && <img src={DeleteIcon} alt="DeleteIcon" onClick={() => setForm({ ...form, attachment: null })} />}
                </div>
                <div>
                  <button className="second_button" onClick={handleSubmit}>등록</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteRegulation;