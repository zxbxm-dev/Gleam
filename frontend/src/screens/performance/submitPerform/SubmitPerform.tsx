import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../recoil/atoms';
import { uploadOutline } from '../../../services/report/ReportServices';

import testPDF from '../../../assets/pdf/인사평가개요(안내).pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const SubmitPerform = () => {
  let navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [numPages, setNumPages] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <Page
          key={`page_${i}`}
          pageNumber={i}
          width={1200}
        />
      );
    }
    return pages;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('filename', selectedFile.name);

      await uploadOutline(formData);

    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="content">
      <div className="content_container">
        <div className="perform_content">
          <div className="pdf-container">
            <Document file={testPDF} onLoadSuccess={onDocumentLoadSuccess}>
              {(user.team === '관리팀' || user.position === '센터장') && (
                <div className='Upload'>
                  {!selectedFile &&
                    <>
                      <label className="primary_button" htmlFor="input-file">
                        파일 선택
                      </label>
                      <input type="file" id="input-file" accept=".pdf" style={{ display: "none" }} onChange={handleFileChange} />
                    </>
                  }
                  {selectedFile &&
                    <div className='btn_gap'>
                      <button className='primary_button' onClick={handleUpload} disabled={!selectedFile || uploading}>
                        업로드
                      </button>
                      <button className='gray-btn' onClick={() => setSelectedFile(null)}>
                        취소
                      </button>
                    </div>
                  }
                </div>
              )}
              {renderPages()}
              <div className='pdf-button'>
                <div>* 위 내용을 읽고 확인했습니다.</div>
                <button className='primary_button' onClick={() => navigate('/detailSubmit')}>제출하기</button>
              </div>
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitPerform;