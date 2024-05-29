import React, { useState, useRef } from "react";
import "./ActivityManage.scss";
import {
  DeleteIcon,
} from "../../../assets/images/index";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Select } from '@chakra-ui/react';
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';
import { WriteActiv, EditActivity } from "../../../services/announcement/Activity";
import CustomModal from "../../../components/modal/CustomModal";

interface Attachment {
  file: File;
  fileName: string;
}

const WriteActivityManage = () => {
  let navigate = useNavigate();
  const { state: editData } = useLocation();
  const [isTypeSelectOpenModal, setTypeSelectOpenModal] = useState(false)
  const editorRef = useRef<any>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [value, setValue] = useState("");
  const [isfileUpload, setIsFileUpload] = useState(false);

  const [form, setForm] = useState<{
    content: string;
    title: string;
    attachment: Attachment | null;
    category: string;
  }>({
    content: "",
    title: "",
    attachment: null,
    category: ""
  });


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const handleTitleChange = (event: any) => {
    setForm({ ...form, title: event.target.value });
  };

  const handleCategoryChange = (event: any) => {
    setForm({ ...form, category: event.target.value });
  };

  const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const currentDate = formatDate(new Date());

  const handleSubmit = async (data: any) => {
    const { title, content, category } = form;
    if (category === "선택없음") {
      setTypeSelectOpenModal(true);
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
    if (editData) {
      data = { ...data, id: editData.id };
      await EditActivity(data, formData);
    }
  };

  const handleTypeSelect = () => {
    setTypeSelectOpenModal(false);
  }

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
                  value={form.category}
                  onChange={handleCategoryChange}
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
      <CustomModal
        isOpen={isTypeSelectOpenModal}
        onClose={() => setTypeSelectOpenModal(false)}
        header={'알림'}
        footer1={'확인'}
        footer1Class="green-btn"
        onFooter1Click={handleTypeSelect}
      >
        <div>
          종류구분을 선택해 주세요.
        </div>
      </CustomModal>
    </div>
  );
};

export default WriteActivityManage;