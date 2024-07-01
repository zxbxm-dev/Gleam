import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import CustomModal from "../../../components/modal/CustomModal";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();


const DetailManagePerform = () => {
  const location = useLocation();
  let navigate = useNavigate();
  const [selectedMember] = useState(location.state?.username)
  const [numPages, setNumPages] = useState<number>(0);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isDeleteDocuModalOpen, setDeleteDocuModalOPen] = useState(false);

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

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.download = '인사기록카드_구민석.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="content">
      <div className="content_container">
        <div className="detail_manage_perform">
          <div className="detail_top_container">
            <div className="top_left_content">
              {selectedMember}
            </div>
            <div className="top_right_content">
              <button className="white_button" onClick={() => navigate(-1)}>확인</button>
              <button className="white_button" onClick={downloadPDF}>인쇄하기</button>
              <button className="white_button" onClick={() => setDeleteDocuModalOPen(true)}>삭제</button>
            </div>
          </div>

          <div className="detail_pdf_container">
            <Document file={attachment} onLoadSuccess={onDocumentLoadSuccess}>
              {renderPages()}
            </Document>
          </div>
        </div>
      </div>

      <CustomModal
        isOpen={isDeleteDocuModalOpen}
        onClose={() => setDeleteDocuModalOPen(false)}
        header={'알림'}
        footer1={'삭제'}
        footer1Class="red-btn"
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => setDeleteDocuModalOPen(false)}
      >
        <div>
          삭제하시겠습니까?
        </div>
      </CustomModal>
    </div>
  );
};

export default DetailManagePerform;