import "./Announcement.scss";
import { useEffect, useState } from 'react';
import {
  Plus_btn,
  Minus_btn,
} from "../../../assets/images/index";
import { useNavigate, Link } from "react-router-dom";
import CustomModal from "../../../components/modal/CustomModal";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { DetailTableAnnounce, DeleteAnno } from "../../../services/announcement/Announce";
// import testPDF from '../../../assets/pdf/취업규칙_포체인스_001.pdf';
import { useLocation } from 'react-router-dom';
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
  view: number;
  pdffile: string;
}

const DetailAnnounce = () => {
  let navigate = useNavigate();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailAnno, setDetailAnno] = useState<Announcement | null>(null);
  const [file, setFile] = useState<PDFFile>();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(800); // 초기 페이지 너비

  const location = useLocation();
  const pathnameParts = location.pathname.split('/');
  const Anno_id = pathnameParts[pathnameParts.length - 1];

  useEffect(() => {
    sessionStorage.setItem('Anno_id', Anno_id);
  }, [Anno_id]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const downloadPDF = () => {
    const link = document.createElement('a');
    // detailAnno에서 직접적으로 pdffile 경로를 사용하도록 설정
    link.href = detailAnno?.pdffile || '';
    link.download = 'download.pdf';
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

  const handleCancle = () => {
    setDeleteModalOpen(false);
  }

  const fetchDetailAnno = async (Anno_id: string) => {
    try {
      const response = await DetailTableAnnounce(Anno_id);
      console.log(response.data);

      setDetailAnno({
        content: response.data.content,
        date: response.data.date,
        title: response.data.title,
        username: response.data.username,
        view: response.data.view,
        pdffile: response.data.pdffile
      });
      setFile(`http://localhost:3000/${response.data.pdffile}`);
    } catch (error) {
      console.error("fetching detailanno : ", error);
    }
  }

  useEffect(() => {
    fetchDetailAnno(Anno_id);
  }, [Anno_id]);

  const handleDelete = async () => {
    setDeleteModalOpen(false);
    try {
      await DeleteAnno(Anno_id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting announcement: ", error);
    }
  };


  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <Link to={"/"} className="sub_header">공지사항</Link>
      </div>

      <div className="content_container">
        <div className="container">
          <div className="main_header2">
            <div className="header_name_bg">
              2025년 인사평가 공지
            </div>
            <div className="detail_container">
              {detailAnno && (
                <div className="info_content">
                  <div className="write_info">작성자</div>
                  <div className="write_info">{detailAnno.username}</div>
                  <div className="write_border" />
                  <div className="write_info">작성일</div>
                  <div className="write_info">{new Date(detailAnno.date).toISOString().substring(0, 10)}</div>
                  <div className="write_border" />
                  <div className="write_info">조회수</div>
                  <div className="write_info">{detailAnno.view}</div>
                </div>
              )}

              <div className="btn_content">
                <button onClick={handleWidthDecrease}><img src={Minus_btn} alt="Minus_btn" /></button>
                <button onClick={handleWidthIncrease}><img src={Plus_btn} alt="Plus_btn" /></button>
                <button className="red_button" onClick={() => setDeleteModalOpen(true)}>삭제</button>
                <button className="white_button" onClick={downloadPDF}>다운로드</button>
                <Link to="/writeAnnounce" state={detailAnno} ><button className="white_button">수정</button></Link>
                <button className="second_button" onClick={() => navigate("/")}>목록</button>
              </div>
            </div>
          </div>

          <div className="detail_content">
            {detailAnno && (
              <div>
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                  {renderPages()}
                </Document>
                <div dangerouslySetInnerHTML={{ __html: detailAnno.content }} />
              </div>
            )}
          </div>

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

export default DetailAnnounce;