import React, { useState, useRef } from "react";
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
import { WriteActiv } from "../../../services/announcement/Activity";

const WriteActivityManage = () => {
  let navigate = useNavigate();
  const editorRef = useRef<any>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("선택없음");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
  };

  const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const currentDate = formatDate(new Date());

  const handleSubmit = () => {

    if (category === "선택없음") {
      alert("종류를 선택해 주세요.")
      return;
    } else if (title === "") {
      alert("게시물 제목을 입력해 주세요.")
      return;
    } else if (content === "") {
      alert("내용을 입력해 주세요.")
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (attachment) {
      formData.append("attachment", attachment);
      formData.append("attachmentName", attachment.name);
    }
    formData.append("date", currentDate);

    WriteActiv(formData)
      .then(response => {
        // 성공적으로 등록되었을 때 처리
        navigate("/announcement");
      })
      .catch(error => {
        // 실패 시 처리
        console.error("등록에 실패했습니다.");
      });
  };

  const onChange = () => {
    const data = editorRef.current.getInstance().getHTML();
    setContent(data);
  };

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
            <div className="header_name_sm">게시물 작성</div>
          </div>

          <div className="content_container">
            <div className="write_container">
              <input type="text" className="write_title" placeholder="제목을 입력해 주세요." onChange={handleTitleChange} />
              <div className="writor_container">
                <div className="write_info">작성자</div>
                <div className="write_info">구민석</div>
                <div className="write_border" />
                <div className="write_info">작성일</div>
                <div className="write_info">{currentDate}</div>
                <div className="write_border" />
                <div className="write_info">종류구분</div>
                <Select
                  placeholder='선택없음'
                  width='100px'
                  size='xs'
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value='직원공지'>직원공지</option>
                  <option value='자유게시판'>자유게시판</option>
                </Select>
              </div>
              <div className="DesktopInput">
                <Editor
                  ref={editorRef}
                  onChange={onChange}
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
                  ref={editorRef}
                  onChange={onChange}
                  initialValue="내용을 입력해 주세요."
                  height='53vh'
                  initialEditType="wysiwyg"
                  useCommandShortcut={false}
                  hideModeSwitch={true}
                  plugins={[colorSyntax]}
                  language="ko-KR"
                />
              </div>
              <div className="activity_main_bottom">
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

export default WriteActivityManage;