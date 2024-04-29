import { useState } from 'react';
import "../Performance.scss";
import { useNavigate, Link } from "react-router-dom";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import testPDF from '../../../assets/pdf/인사평가개요.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const SubmitPerform = () => {
  let navigate = useNavigate();
  const [numPages, setNumPages] = useState<number>(0);

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

  return (
    <div className="content">
      <div className="content_header" style={{ justifyContent: 'space-between' }}>
        <Link to={"/submitPerform"} className="sub_header">인사평가 제출</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="perform_content">
            <Document file={testPDF} onLoadSuccess={onDocumentLoadSuccess}>
              {renderPages()}
            </Document>
            <div>* 위 내용을 읽고 확인했습니다.</div>
            <button className='approval_button' onClick={() => navigate('/detailSubmit')}>제출하기</button>
          </div>
        </div>
      </div>  
      
    </div>
  );
};

export default SubmitPerform;