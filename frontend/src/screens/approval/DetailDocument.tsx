import React, { useEffect, useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Page, pdfjs } from 'react-pdf';
import CustomModal from "../../components/modal/CustomModal";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { CheckReport, DeleteReport } from '../../services/approval/ApprovalServices';
import { useLocation, useNavigate } from 'react-router-dom';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

type PDFFile = string | File | null;

const DetailDocument = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const [file, setFile] = useState<PDFFile>('');
  const [numPages, setNumPages] = useState<number>(0);
  const [memoState, setMemoState] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDeleteeventModalOpen, setDeleteEventModalOPen] = useState(false);
  const pathnameParts = location.pathname.split('/');
  const report_id = pathnameParts[pathnameParts.length - 1];
  const documentInfo = useState(location.state?.documentInfo);
  const [checksignup, setCheckSignUp] = useState<boolean[]>([]);

  const [signatories, setSignatories] = useState<any[]>([]);
  const approveLine = documentInfo[0].personSigning.split(',').map((item:any) => item.trim()).reverse();
  const approveDates = documentInfo[0]?.approveDate?.split(',').map((item:any) => item.trim()) ?? [];

  useEffect(() => {
    const initialChecks = new Array(signatories.length).fill(false);
    const approvedCount = Number(documentInfo[0].approval);

    for (let i = 0; i < approvedCount; i++) {
      initialChecks[i] = true;
    }

    for (let i = approvedCount; i < signatories.length; i++) {
      initialChecks[i] = false;
    }

    setCheckSignUp(initialChecks);
  }, []);

  const fetchCheckReport = async (report_id: string) => {
    try {
      const response = await CheckReport(report_id);
  
      if (response.status === 200) {
        const url = URL.createObjectURL(response.data);
        setFile(url);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };
  
  useEffect(() => {
    fetchCheckReport(report_id);

    if (documentInfo[0]?.opinionName) {
      setMemoState('opinion');
    } else if (documentInfo[0]?.rejectName) {
      setMemoState('reject');
    }

    try {
      const parsedString = JSON.parse(documentInfo[0]?.Payment);
      const parsedarray = JSON.parse(parsedString);
  
      const filteredApproveLine = parsedarray
        .filter((item: any) => item.name !== '참조')
        .map((item: any) => item.name);
  
      setSignatories(filteredApproveLine.reverse());
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }

  }, [report_id]);

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

    pdf.save(`${documentInfo[0].pdffile}`);
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

  const handleDeleteEvent = async () => {
    try {
      const response = await DeleteReport(report_id);
      console.log("Report deleted successfully:", response);
      setDeleteEventModalOPen(false);
      navigate('/approval');
    } catch (error) {
      console.log("Failed to delete report:", error);
    }
  };

  return (
    <div className="content">
      <div className='oper_header_right'>
        <button className='primary_button' onClick={() => navigate(-1)}>확인</button>
        <button className='white_button' onClick={exportToPDF}>다운로드</button>
        <button className='red_button' onClick={() => setDeleteEventModalOPen(true)}>삭제</button>
      </div>

      <div className="content_container">
        <div className="approval_write_container">
          <div className="write_top_container_document">
            {memoState ? (
              memoState === 'reject' ?
                <>
                  <div className='document_container'>
                    <div className='document_title'>반려자</div>
                    <div className='document_content'>{documentInfo[0].rejectName}</div>
                  </div>
                  <div className='document_container'>
                    <div className='document_title'>반려사유</div>
                    <div className='document_content'>{documentInfo[0].rejectContent}</div>
                  </div>
                </>
                :
                <>
                  <div className='document_container'>
                    <div className='document_title'>작성자</div>
                    <div className='document_content'>{documentInfo[0].opinionName}</div>
                  </div>
                  <div className='document_container'>
                    <div className='document_title'>의견 내용</div>
                    <div className='document_content'>{documentInfo[0].opinionContent}</div>
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
                      <div className='Bottoms'>
                        {checksignup[index] &&
                          <img className='SignImg' src={`http://localhost:3000/uploads/${approveLine[index]}_서명.png`} alt="sign" />
                        }
                      </div>
                      <div className='BtmDate'>{approveDates[index] || ''}</div>
                    </div>
                  ))}
                </div>
                {renderPages()}
              </div>
            </Document>
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
