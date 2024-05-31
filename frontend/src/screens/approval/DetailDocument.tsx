import React, { useEffect, useState, useRef } from 'react';
import "./Approval.scss";
import { Link, useNavigate } from "react-router-dom";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Page, pdfjs } from 'react-pdf';
import CustomModal from "../../components/modal/CustomModal";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import testPDF from '../../assets/pdf/[서식-A106-1] TF팀 기획서.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

type PDFFile = string | File | null;

const DetailDocument = () => {
  let navigate = useNavigate();
  const [file, setFile] = useState<PDFFile>('');
  const [numPages, setNumPages] = useState<number>(0);
  const [memoState, setMemoState] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDeleteeventModalOpen, setDeleteEventModalOPen] = useState(false);

  const signatories = ['작성자', '팀장', '부서장', '지원팀장', '대표'];

  useEffect(() => {
    setFile(testPDF);
    setMemoState('reject'); // 보고서 반려, 의견 작성 시 
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const exportToPDF = async () => {
    const element = containerRef.current;
    if (!element) {
      console.error('Element not found');
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    element.style.height = element.scrollHeight + 'px';

    await html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpg');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'JPG', 0, 0, imgWidth, imgHeight);
      if (numPages > 1) {
        pdf.addPage();
      }
    });

    for (let i = 2; i <= numPages; i++) {
      const pageElement = document.querySelector(`[data-page-number="${i}"]`) as HTMLElement;
      if (pageElement) {
        await html2canvas(pageElement).then((canvas) => {
          const imgData = canvas.toDataURL('image/jpg');
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (i > 2) {
            pdf.addPage();
          }

          pdf.addImage(imgData, 'JPG', 0, 0, imgWidth, imgHeight);
        });
      }
    }

    pdf.save('보고서.pdf');
  };

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <Page
          key={`page_${i}`}
          pageNumber={i}
          width={1000}
          data-page-number={i}
        />
      );
    }
    return pages;
  };

  const handleDeleteEvent = () => {
    console.log('삭제')
  }


  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/report"} className="sub_header">보고서 결재</Link>
      </div>
      <div className='oper_header_right'>
        <button className='oper_edit_button' onClick={() => navigate("/approval")}>확인</button>
        <button className='oper_download_button' onClick={exportToPDF}>인쇄하기</button>
        <button className='oper_delete_button' onClick={() => setDeleteEventModalOPen(true)}>삭제</button>
      </div>

      <div className="content_container">
        <div className="container">
          <div className="write_container">
            <div className="write_top_container_document">
              {memoState ? (
                memoState === 'reject' ?
                  <>
                    <div className='document_container'>
                      <div className='document_title'>반려자</div>
                      <div className='document_content'>반려한 사람</div>
                    </div>
                    <div className='document_container'>
                      <div className='document_title'>반려사유</div>
                      <div className='document_content'>반려 내용</div>
                    </div>
                  </>
                :
                  <>
                    <div className='document_container'>
                      <div className='document_title'>작성자</div>
                      <div className='document_content'>의견 장석한 사람</div>
                    </div>
                    <div className='document_container'>
                      <div className='document_title'>의견 내용</div>
                      <div className='document_content'>의견 내용</div>
                    </div>
                  </>
              ) : (
               <>
               </>
              )}
            </div>
            <div className="write_btm_container">
              <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                <div ref={containerRef} id="report-to-xls">
                  <div className='PaymentLine'>
                    {signatories.map((signatory, index) => (
                      <div className='Pay' key={index}>
                        <input className='Top' type="text" placeholder={signatory} disabled />
                        <div className='Bottom'>
                          
                        </div>
                        <div className='BtmDate'></div>
                      </div>
                    ))}
                  </div>
                  {renderPages()}
                </div>
              </Document>
            </div>
          </div>
        </div>
      </div>
      
      <CustomModal
        isOpen={isDeleteeventModalOpen}
        onClose={() => setDeleteEventModalOPen(false)}
        header={'알림'}
        footer1={'삭제'}
        footer1Class="red-btn"
        onFooter1Click={handleDeleteEvent}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => setDeleteEventModalOPen(false)}
      >
        <div>
          삭제하시겠습니까?
        </div>
      </CustomModal>
    </div>
  );
};

export default DetailDocument;
