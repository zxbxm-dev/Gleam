import React, { useState, useRef, useEffect } from "react";
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
  const [isFileUpload, setIsFileUpload] = useState(false);

  const [form, setForm] = useState<{
    content: string;
    title: string;
    attachment: Attachment | null;
    pdffile: string;
  }>({
    content: "",
    title: "",
    attachment: null,
    pdffile: ""
  });

  const user = useRecoilValue(userState);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileData = { file: file, fileName: file.name };
      setForm({ ...form, attachment: fileData });
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

  useEffect(() => {
    if (editData) {
      const { content, title, attachment, pdffile } = editData;
      setForm({
        content: content || "",
        title: title || "",
        attachment: attachment ? { file: attachment.file, fileName: attachment.fileName } : null,
        pdffile: pdffile || ""
      });
      if (editorRef.current) {
        editorRef.current.getInstance().setHTML(content || "");
      }
      if (attachment) {
        setIsFileUpload(true);
      }
    }
  }, [editData]);

  const Regul_id = sessionStorage.getItem('Regul_id');

  const handleSubmit = async () => {
    const { content } = form;

    const title = form.title || (editData ? editData.title : '');

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
      formData.append("attachment", form.attachment.file);
      formData.append("attachmentName", form.attachment.fileName);
    }

    try {
      if (editData) {
        const data = { ...editData, id: editData.id };
        await EditRegul(data, formData, Regul_id);
        console.log("사내규정 수정 성공");
      } else {
        const response = await WriteRegul(formData);
        console.log("사내규정 등록 성공:", response.data);
      }
      navigate("/regulations");
    } catch (error) {
      console.error("사내규정 처리 중 오류:", error);
      alert("사내규정 처리 중 오류가 발생했습니다.");
    }
  };

  const oncontentChange = () => {
    const data = editorRef.current.getInstance().getHTML();
    setForm({ ...form, content: data });
  };

  return (
    <div className="content">
      <div className="content_container">
        <div className="main_header">
          {editData ? (
            <div className="header_name_sm">사내규정 수정</div>
          ) : (
            <div className="header_name_sm">사내규정 작성</div>
          )}
        </div>

        <div className="content_container">
          <div className="write_container">
            <input
              type="text"
              className="write_title"
              placeholder="제목을 입력해 주세요."
              value={form.title || (editData ? editData.title : '')}
              onChange={handleTitleChange}
            />
            <div className="writor_container">
              <div>작성자</div>
              <div>{user.username}</div>
              <div>|</div>
              {editData ? (
                <div>수정일</div>
              ) : (
                <div>작성일</div>
              )}
              <div>{currentDate}</div>
            </div>
            <div className="">
              <Editor
                ref={editorRef}
                initialValue={form.content ? "있음" : "내용을 입력해주세요."}
                height={window.innerWidth >= 1600 ? '70vh' : '60vh'}
                onChange={oncontentChange}
                initialEditType="wysiwyg"
                useCommandShortcut={false}
                hideModeSwitch={true}
                plugins={[colorSyntax]}
                language="ko-KR"
              />
            </div>
            {editData && editData.pdffile ? (
              <div>기존 파일 : {editData.pdffile.slice(18)}</div>
            ) : (
              <div></div>
            )}
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
                <button className="primary_button" onClick={handleSubmit}>등록</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteRegulation;
