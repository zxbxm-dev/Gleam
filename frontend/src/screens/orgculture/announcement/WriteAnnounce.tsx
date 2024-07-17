import React, { useState, useRef, useEffect } from "react";
import { DeleteIcon } from "../../../assets/images/index";
import { useNavigate, useLocation } from "react-router-dom";
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';
import { WriteAnnounce, EditAnno } from "../../../services/announcement/Announce";
import { useRecoilValue } from 'recoil';
import { userState } from '../../../recoil/atoms';

interface Attachment {
  file: File;
  fileName: string;
}

const WriteAnnouncement = () => {
  const { state: editData } = useLocation();
  let navigate = useNavigate();
  const editorRef = useRef<any>(null);
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

  const [isfileUpload, setIsFileUpload] = useState(false);
  const user = useRecoilValue(userState);

  console.log(isfileUpload);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const fileData = { file: file, fileName: file.name };
      setForm({ ...form, attachment: fileData });
    }
  };

  useEffect(() => {
    
    if (editData) {
      const { title, attachment, pdffile } = editData;

      const content = editData.content;
      setForm({
        title: title || "",
        content: content || "",
        attachment: attachment || null,
        pdffile: pdffile || ""
      });

      if (attachment && attachment.fileUrl) {
        setIsFileUpload(true);
      }
      if (editorRef.current) {
        editorRef.current.getInstance().setHTML(content || "");
      }
    }

  }, [editData]);

  const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, title: event.target.value });
  };

  const currentDate = formatDate(new Date());

  const Anno_id = sessionStorage.getItem('Anno_id');

  const handleSubmit = async () => {
    const { content } = form;

    const title = form.title || (editData ? editData.title : '');

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

    const views = 0;
    
    try {
      if (editData) {

        formData.append("views", editData.view.toString());
        const data = { ...editData, id: editData.id };
        await EditAnno(data, formData, Anno_id);
        console.log("공지사항 수정 성공");
      } else {
        formData.append("views", views.toString());
        if (title === "") {
          alert("게시물 제목을 입력해 주세요.");
          return;
        } else if (content === "") {
          alert("내용을 입력해 주세요.");
          return;
        }

        const response = await WriteAnnounce(formData);
        console.log("공지사항 등록 성공:", response.data);
      }
      navigate("/");
    } catch (error) {
      console.error("공지사항 처리 중 오류:", error);
      alert("공지사항 처리 중 오류가 발생했습니다.");
    }
  };

  const oncontentChange = () => {
    const data = editorRef.current.getInstance().getHTML();
    setForm({ ...form, content: data });
    if (editData && editData.fileUrl) {
      setIsFileUpload(true);
    } else {
      setIsFileUpload(false);
    }
  };

  return (
    <div className="content">
      <div className="content_container">
          <div className="main_header">
            {editData ? (
              <div className="header_name_sm">공지사항 수정</div>
            ) : (
              <div className="header_name_sm">공지사항 작성</div>
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
              <div>
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
                  toolbarItems={[
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol', 'task', 'indent', 'outdent'],
                    ['image', 'link'],
                    ['scrollSync'],                    
                  ]}
                />
              </div>
              {editData && editData.pdffile ? (
                <div>기존 파일 : {editData.pdffile.slice(18)}</div>
              ) : (
                <div></div>
              )}
              <div className="announce_main_bottom">
                <div className="attachment_content">
                  <label htmlFor="fileInput" className="white_button">
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

export default WriteAnnouncement;