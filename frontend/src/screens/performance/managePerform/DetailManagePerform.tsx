import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import CustomModal from "../../../components/modal/CustomModal";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { DetailPerform, DeletePerform } from "../../../services/performance/PerformanceServices";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

type PDFFile = string | File | null;

const DetailManagePerform = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const [selectedMember] = useState(location.state?.username);
  const [perform_filename] = useState(location.state?.filename);
  const [file, setFile] = useState<PDFFile>('');
  const [numPages, setNumPages] = useState<number>(0);
  const [isDeleteDocuModalOpen, setDeleteDocuModalOPen] = useState(false);

  const fetchDetailPerform = async (perform_filename: string) => {
    const params = {
      filename: perform_filename
    }
    try {
      const response = await DetailPerform(params);

      if(response.status === 200) {
        const url = URL.createObjectURL(response.data);
        setFile(url);
        console.log(file)
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  }

  useEffect(() => {
    fetchDetailPerform(perform_filename);
  }, [perform_filename])


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

  const handleDeleteDocument = (perform_filename: string) => {
    const params = {
      filename: perform_filename
    }
    setDeleteDocuModalOPen(false);
    DeletePerform(params)
    .then((response) => {
      console.log("인사평가 문서가 삭제되었습니다.", response);
    })
    .catch((error) => {
      console.error("인사평가 문서 삭제에 실패했습니다.", error);
    });
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
              <button className="white_button" onClick={() => {setDeleteDocuModalOPen(true)}}>삭제</button>
            </div>
          </div>

          <div className="detail_pdf_container">
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
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
        onFooter1Click={() => handleDeleteDocument(perform_filename)}
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