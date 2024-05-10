import React, { useState } from 'react';
import "../Performance.scss";
import { useNavigate, Link } from "react-router-dom";
import {
  FileUploadIcon,
  AttachmentIcon,
  DeleteIcon,
} from "../../../assets/images/index";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

type PDFFile = string | File | null;

const SubmitPerform = () => {
  let navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const handleSumbitFile = () => {
    onOpen();
  }

  return (
    <div className="content">
      <div className="content_header" style={{ justifyContent: 'space-between' }}>
        <Link to={"/submitPerform"} className="sub_header">인사평가 제출</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="write_container">
            <div className="write_top_container">
              <div className="top_left_content">
                <span style={{fontFamily: 'var(--font-family-Noto-M)', fontSize: '32px'}}>제출 파일 리스트</span>
              </div>

              <div className="top_right_content">

                <button className='approve_button' onClick={handleSumbitFile}>제출하기</button>
                <button className="upload_button">
                  <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', gap: '5px'}}>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
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
      </div>  
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalContent height='200px' bg='#fff' borderTopRadius='10px'>
          <ModalHeader className='ModalHeader' height='34px' bg='#746E58' fontSize='14px' color='#fff' borderTopRadius='10px' fontFamily='var(--font-family-Noto-B)'>알림</ModalHeader>
          <ModalCloseButton color='#fff' fontSize='12px' top='0'/>
          <ModalBody className="cancle_modal_content">
            제출이 완료되었습니다.
          </ModalBody>

          <ModalFooter gap='10px' justifyContent='center'>
            <button className="cancle_button" onClick={() => {navigate("/submit-perform")}}>확인</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SubmitPerform;