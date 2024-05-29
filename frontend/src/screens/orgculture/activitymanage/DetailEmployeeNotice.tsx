import "./ActivityManage.scss";
import { useState, useEffect } from 'react';
import {
  AttachmentIcon,
  DeleteIcon,
} from "../../../assets/images/index";
import { Input } from '@chakra-ui/react'
import { useNavigate, Link } from "react-router-dom";
import CustomModal from "../../../components/modal/CustomModal";
import { DetailTableActivity, DeleteActivity } from "../../../services/announcement/Activity";
import { useLocation } from 'react-router-dom';

interface Announcement {
  name: string;
  date: string;
}

const DetailEmployeeNotice = () => {
  let navigate = useNavigate();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailActivity, setDetailActivity] = useState<Announcement | null>(null);

  const location = useLocation();
  const pathnameParts = location.pathname.split('/');
  const Regul_id = pathnameParts[pathnameParts.length - 1];

  const fetchDetailRegul = async (Regul_id: string) => {
    try {
      const response = await DetailTableActivity(Regul_id);
      setDetailActivity(response.data);
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
      await DeleteActivity(Regul_id);
      navigate("/employeeNotice");
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
        <Link to={"/activitymanage"} className="main_header">활동관리</Link>
        <div className="main_header">＞</div>
        <Link to={"/employeeNotice"} className="sub_header">직원공지</Link>
      </div>

      <div className="content_container">
        <div className="container">
          <div className="main_header2">
            <div className="header_name_bg">
              OOO의 경조사를 축하합니다.
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
                <Link to="/writeActivityManage" state={detailActivity} ><button className="white_button">수정</button></Link>
                <button className="second_button" onClick={() => navigate("/employeeNotice")}>목록</button>
              </div>
            </div>
          </div>

          <div className="content_container">
            <div className="Employee_content">
              <div className="content_top">
                축하합니다.
              </div>
              <div className="content_btm">
                <div className="btm_title">첨부파일</div>
                <div className="btm_attachment">
                  <div className="btm_attachment_display">
                    <img src={AttachmentIcon} alt="AttachmentIcon" />
                    <div>청첩장 이미지.png</div>
                  </div>
                  <div className="btm_attachment_display">
                    <img src={AttachmentIcon} alt="AttachmentIcon" />
                    <div>첨부파일 이미지.jpg</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="Employee_comment">
              <div className="comment_title">
                댓글(2)
              </div>

              <div className="comment_container">
                <div className="comment_left">
                  <div className="comment_name">서주희</div>
                  <div className="comment_content">축하합니다~</div>
                  <img src={DeleteIcon} alt="DeleteIcon" />
                </div>
                <div className="comment_right">
                  <div>2024.02.05</div>
                  <div className="border_right"></div>
                  <div>18:15:36</div>
                </div>
              </div>

              <div className="comment_container">
                <div className="comment_left">
                  <div className="comment_name">전아름</div>
                  <div className="comment_content">축하합니다~</div>
                </div>
                <div className="comment_right">
                  <div>2024.02.05</div>
                  <div className="border_right"></div>
                  <div>18:15:36</div>
                </div>
              </div>

              <div className="comment_container">
                <div className="comment_input_left">
                  <div className="comment_name">서주희</div>
                </div>
                <div className="comment_input_right">
                  <Input placeholder='댓글을 입력해 주세요.' height='100px' />
                  <button className="second_button">등록</button>
                </div>
              </div>

            </div>
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

export default DetailEmployeeNotice;