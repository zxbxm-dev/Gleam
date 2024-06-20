import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import {
  Plus_btn,
  Minus_btn,
} from "../../../assets/images/index";
import CustomModal from "../../../components/modal/CustomModal";
import { DetailTableRegul, DeleteRegul } from "../../../services/announcement/Regulation";
import { useLocation } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

type PDFFile = string | File | null;

interface Announcement {
  content: string;
  date: string;
  title: string;
  username: string;
  pdffile: string;
}

const DetailRegulation = () => {
  let navigate = useNavigate();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailRegul, setDetailRegul] = useState<Announcement | null>(null);
  const location = useLocation();
  const [file, setFile] = useState<PDFFile>();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(800);

  const pathnameParts = location.pathname.split('/');
  const Regul_id = pathnameParts[pathnameParts.length - 1];

  useEffect(() => {
    sessionStorage.setItem('Regul_id', Regul_id);
  }, [Regul_id]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = detailRegul?.pdffile || '';
    link.download = 'download.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const handleWidthIncrease = () => {
    setPageWidth(pageWidth + 100); // 너비 증가
  };

  const handleWidthDecrease = () => {
    setPageWidth(pageWidth - 100); // 너비 감소
  };

  const fetchDetailRegul = async (Regul_id: string) => {
    try {
      const response = await DetailTableRegul(Regul_id);

      setDetailRegul({
        content: response.data.content,
        date: response.data.date,
        title: response.data.title,
        username: response.data.username,
        pdffile: response.data.pdffile
      });

      setFile(`http://localhost:3000/${response.data.pdffile}`);
    } catch (error) {
      console.error("fetching detailanno : ", error);
    }
  }

  useEffect(() => {
    fetchDetailRegul(Regul_id);
  }, [Regul_id]);


  const handleDelete = async () => {
    setDeleteModalOpen(false);
    try {
      await DeleteRegul(Regul_id);
      navigate("/regulations");
    } catch (error) {
      console.error("Error deleting announcement: ", error);
    }
  };

  const handleCancle = () => {
    setDeleteModalOpen(false);
  }

  return (
    <div className="content">
      <div className="content_container">
        <div className="main_header2">
          <div className="header_name_bg">
            {detailRegul && (
              <div>{detailRegul.title}</div>
            )}
          </div>
          <div className="regulation_detail_container">
            {detailRegul && (
              <div className="info_content">
                <div>작성자</div>
                <div>{detailRegul.username}</div>
                <div>|</div>
                <div>작성일</div>
                <div>{new Date(detailRegul.date).toISOString().substring(0, 10)}</div>
              </div>
            )}
            <div className="btn_content">
              <button onClick={handleWidthDecrease}><img src={Minus_btn} alt="Minus_btn" className="resize_button" /></button>
              <button onClick={handleWidthIncrease}><img src={Plus_btn} alt="Plus_btn" className="resize_button" /></button>
              <button className="red_button" onClick={() => setDeleteModalOpen(true)}>삭제</button>
              <button className="white_button" onClick={downloadPDF}>다운로드</button>
              <Link to="/writeRegulation" state={detailRegul} ><button className="white_button">수정</button></Link>
              <button className="primary_button" onClick={() => navigate("/regulations")}>목록</button>
            </div>
          </div>
        </div>

        <div className="regultaion_detail_content">
          {detailRegul && (
            <div className="detail_content_box">
              <div className="detail_content_pdf">
                {detailRegul.pdffile ? (
                  <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                    {renderPages()}
                  </Document>
                ) : (
                  <>
                  </>
                )}
              </div>
              <div className="detail_content_title" dangerouslySetInnerHTML={{ __html: detailRegul.content }} />
            </div>
          )}
        </div>
      </div>
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        header={'알림'}
        footer1={'삭제'}
        footer1Class="red-btn"
        onFooter1Click={handleDelete}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={handleCancle}
      >
        <div>
          삭제하시겠습니까?
        </div>
      </CustomModal>
    </div>
  );
};

export default DetailRegulation;