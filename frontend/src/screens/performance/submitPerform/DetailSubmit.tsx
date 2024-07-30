import React, { useState } from 'react';
import {
  FileUploadIcon,
  AttachmentIcon,
  DeleteIcon,
} from "../../../assets/images/index";
import CustomModal from '../../../components/modal/CustomModal';
import { WritePerform } from '../../../services/performance/PerformanceServices';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../recoil/atoms';
import { useNavigate } from 'react-router-dom';

type PDFFile = string | File | null;

const SubmitPerform = () => {
  let navigate = useNavigate();
  const [isSubmitModalOpen, setSubmitModalOpen] = useState(false);
  const user = useRecoilValue(userState);
  const [files, setFiles] = useState<PDFFile[]>([]);

  // 파일 선택 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files);
      setFiles([...files, ...selectedFiles]);
      console.log(files)
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };


  //인사평가 제출
  const handleSumbitFile = () => {
    const validFiles = files.filter(file => file !== null);
  
    if (validFiles.length === 0) {
      console.error('No files to submit');
      return;
    }
  
    const formData = new FormData();
    validFiles.forEach((file) => {
      formData.append('files', file!);
    });
    formData.append("userID", user.id);
    formData.append("username", user.username);
    formData.append("team", user.team);
    formData.append("department", user.department);
    formData.append("company", user.company);

    WritePerform(formData)
      .then(response => {
        console.log("Files submitted successfully:", response);
        setSubmitModalOpen(true);
      })
      .catch(error => {
        console.error('Error submitting files:', error);
      });
  };
  
  return (
    <div className="content">
      <div className="content_container">
        <div className="Submit_write_container">
          <div className="write_top_container">
            <div className="top_left_content">
              <span style={{fontFamily: 'var(--font-family-Noto-M)', fontSize: '32px'}}>제출 파일 리스트</span>
            </div>

            <div className="top_right_content">

              <button className='primary_button' onClick={handleSumbitFile}>제출하기</button>
              <button className="white_button">
                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', gap: '5px'}}>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <img src={FileUploadIcon} alt="FileUploadIcon" />
                  파일 업로드
                </label>
              </button>
            </div>
          </div>

          <div className="write_btm_container2">
            {files.length > 0 ? (
              <div className='attachment-area'>
                <p className='attachment-title'>첨부파일</p>
                <ul className='attachment-content'>
                  {files.map((file, index) => (
                    <div style={{display: 'flex', gap: '10px', marginBottom: '5px'}} key={index}>
                      <img src={AttachmentIcon} alt="AttachmentIcon" />
                      <li key={index}>{file instanceof File ? file.name : file}</li>
                      <img src={DeleteIcon} alt="DeleteIcon" onClick={() => handleDeleteFile(index)} style={{cursor: 'pointer'}}/>
                    </div>
                  ))}
                </ul>
              </div>
            ) : (
              <div
                className="upload-area"
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
              >
                <div className='upload-text-top'>
                  <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', gap: '5px'}}>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    파일 첨부하기 +
                  </label>
                </div>
                <div className='upload-text-btm'>클릭 후 파일 선택이나 드래그로 파일 첨부 가능합니다.</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <CustomModal
        isOpen={isSubmitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        header={'알림'}
        footer1={'확인'}
        footer1Class="green-btn"
        onFooter1Click={() => {setSubmitModalOpen(false); navigate("/");}}
      >
        <div>
          제출이 완료되었습니다.
        </div>
      </CustomModal>
    </div>
  );
};

export default SubmitPerform;