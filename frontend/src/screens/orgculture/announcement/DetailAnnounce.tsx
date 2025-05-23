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
import { useRecoilValue } from 'recoil';
import { userState } from '../../../recoil/atoms';
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
  const user = useRecoilValue(userState);
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
        view: response.data.views,
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

  const canEditOrDelete = detailAnno && (user.team === '관리팀' || user.username === detailAnno.username);

  return (
    <div className="content">
      <div className="content_container">
          <div className="main_header2">
            <div className="header_name_bg">
              {detailAnno && (
                <div>{detailAnno.title}</div>
              )}
            </div>
            <div className="announce_detail_container">
              {detailAnno && (
                <div className="info_content">
                  <div>작성자</div>
                  <div>{detailAnno.username}</div>
                  <div>|</div>
                  <div>작성일</div>
                  <div>{new Date(detailAnno.date).toISOString().substring(0, 10)}</div>
                  <div>|</div>
                  <div>조회수</div>
                  <div>{detailAnno.view}</div>
                </div>
              )}

              <div className="btn_content">
                <button onClick={handleWidthDecrease}><img src={Minus_btn} alt="Minus_btn"/></button>
                <button onClick={handleWidthIncrease}><img src={Plus_btn} alt="Plus_btn"/></button>
                {canEditOrDelete && (
  <>
                <button className="red_button" onClick={() => setDeleteModalOpen(true)}>삭제</button>
                <Link to="/writeAnnounce" className="white_button" state={detailAnno} ><button >수정</button></Link>
  </>
)}
                <button className="white_button" onClick={downloadPDF}>다운로드</button>
                <button className="primary_button" onClick={() => navigate("/")}>목록</button>
              </div>
            </div>
          </div>

          <div className="announce_detail_content">
            {detailAnno && (
              <div className="detail_content_box">
                <div className="detail_content_pdf">
                  {detailAnno.pdffile ? (
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                      {renderPages()}
                    </Document>
                  ) : (
                    <>
                    </>
                  )}
                </div>
                <div className="detail_content_title" dangerouslySetInnerHTML={{ __html: detailAnno.content }} />
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

export default DetailAnnounce;