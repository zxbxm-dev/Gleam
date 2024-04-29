import "./Announcement.scss";
import { useState } from 'react';
import {
  Plus_btn,
  Minus_btn,
} from "../../../assets/images/index";
import { useNavigate, Link } from "react-router-dom";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import testPDF from '../../../assets/pdf/취업규칙_포체인스_001.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

type PDFFile = string | File | null;

const DetailAnnounce = () => {
  let navigate = useNavigate();
  const [file, setFile] = useState<PDFFile>(testPDF);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(800); // 초기 페이지 너비

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const downloadPDF = () => {
    const link = document.createElement('a');
    setFile(testPDF)
    link.href = testPDF;
    link.download = 'test.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWidthIncrease = () => {
    setPageWidth(pageWidth + 100); // 너비 증가
  };

  const handleWidthDecrease = () => {
    setPageWidth(pageWidth - 100); // 너비 감소
  };

  // 전체 페이지 렌더링 함수
  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <Page 
          key={`page_${i}`}
          pageNumber={i} 
          width={pageWidth}
        />
      );
    }
    return pages;
  };

  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <Link to={"/announcement"} className="sub_header">공지사항</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="main_header2">
            <div className="header_name_bg">
              2025년 인사평가 공지
            </div>
            <div className="detail_container">
              <div className="info_content">
                <div className="write_info">작성자</div>
                <div className="write_info">구민석</div>
                <div className="write_border" />
                <div className="write_info">작성일</div>
                <div className="write_info">2024/04/09</div>
                <div className="write_border" />
                <div className="write_info">조회수</div>
                <div className="write_info">14562</div>
              </div>

              <div className="btn_content">
                <button onClick={handleWidthDecrease}><img src={Minus_btn} alt="Minus_btn"/></button>
                <button onClick={handleWidthIncrease}><img src={Plus_btn} alt="Plus_btn"/></button>
                <button className="red_button">삭제</button>
                <button className="download_button" onClick={downloadPDF}>다운로드</button>
                <button className="white_button">수정</button>
                <button className="second_button" onClick={() => navigate("/announcement")}>목록</button>
              </div>
            </div>
          </div>

          <div className="detail_content">
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
              {renderPages()}
            </Document>
          </div>

        </div>
      </div>  
    </div>
  );
};

export default DetailAnnounce;