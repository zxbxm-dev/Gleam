import "./Regulations.scss";
import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import CustomModal from "../../../components/modal/CustomModal";
import { DetailTableRegul, DeleteRegul } from "../../../services/announcement/Regulation";
import { useLocation } from 'react-router-dom';


interface Announcement {
  name: string;
  date: string;
}


const DetailRegulation = () => {
  let navigate = useNavigate();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailRegul, setDetailRegul] = useState<Announcement | null>(null);
  const location = useLocation();
  const pathnameParts = location.pathname.split('/');
  const Regul_id = pathnameParts[pathnameParts.length - 1];

  const fetchDetailRegul = async (Regul_id: string) => {
    try {
      const response = await DetailTableRegul(Regul_id);
      setDetailRegul(response.data);
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
      <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <Link to={"/regulations"} className="sub_header">사내규정</Link>
      </div>

      <div className="content_container">
        <div className="container">
          <div className="main_header2">
            <div className="header_name_bg">
              취업규칙
            </div>
            <div className="detail_container">
              <div className="info_content">
                <div className="write_info">작성자</div>
                <div className="write_info">구민석</div>
                <div className="write_border" />
                <div className="write_info">작성일</div>
                <div className="write_info">2024/04/09</div>
              </div>

              <div className="btn_content">
                <button className="red_button" onClick={() => setDeleteModalOpen(true)}>삭제</button>
                <Link to="/writeAnnounce" state={detailRegul} ><button className="white_button">수정</button></Link>
                <button className="second_button" onClick={() => navigate("/regulations")}>목록</button>
              </div>
            </div>
          </div>
          <div className="content_container">

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

export default DetailRegulation;