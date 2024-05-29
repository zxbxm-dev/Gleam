import { useState, useEffect } from "react";
import "./ActivityManage.scss";
import {
  NewIcon,
  AttachmentIcon,
} from "../../../assets/images/index";
import { useNavigate, Link } from "react-router-dom";
import {CheckActivity} from "../../../services/announcement/Activity";

const ActivityManage = () => {
  let navigate = useNavigate();
  // const [employnotices, setEmployNotice] = useState<any[]>([]);
  // const [freeboards, setFreeBoard] = useState<any[]>([]);
  const [activitys, setactivity] = useState<any[]>([]);

  const isNewNotice = (noticeDate: string) => {
    const today = new Date();
    const noticeDateTime = new Date(noticeDate).getTime();
    const todayTime = today.getTime();
    const diffTime = todayTime - noticeDateTime;
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= 7 && diffDays >= 0;
  };

  useEffect(() => {
    const fetchactivity = async () => {
      try {
        const response = await CheckActivity();
        setactivity(response.data);
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };

    fetchactivity();
  }, []);

  // useEffect(() => {
  //   const initialemploynotices = [
  //     { id: 1, title: "OOO 직원 경조사 공지 1", writer: "구민석", views: 100, date: "2024-05-17" , attachment: 'jpg' },
  //     { id: 2, title: "OOO 직원 경조사 공지 2", writer: "구민석", views: 200, date: "2024-05-16" , attachment: 'jpg'},
  //     { id: 3, title: "OOO 직원 경조사 공지 3", writer: "구민석", views: 300, date: "2024-05-15" , attachment: ''},
  //     { id: 4, title: "OOO 직원 경조사 공지 4 게시글 제목이 길어지면 축약으로 바꿔줘", writer: "구민석", views: 100, date: "2024-05-14" , attachment: ''},
  //     { id: 5, title: "OOO 직원 경조사 공지 5", writer: "구민석", views: 200, date: "2024-05-13" , attachment: ''},
  //     { id: 6, title: "OOO 직원 경조사 공지 6", writer: "구민석", views: 300, date: "2024-05-12" , attachment: ''},
  //     { id: 7, title: "OOO 직원 경조사 공지 7", writer: "구민석", views: 100, date: "2024-05-11" , attachment: ''},
  //     { id: 8, title: "OOO 직원 경조사 공지 8", writer: "구민석", views: 200, date: "2024-05-10" , attachment: ''},
  //     { id: 9, title: "OOO 직원 경조사 공지 9", writer: "구민석", views: 100, date: "2024-05-09" , attachment: ''},
  //     { id: 10, title: "OOO 직원 경조사 공지 10", writer: "구민석", views: 200, date: "2024-05-08" , attachment: ''},
  //     { id: 11, title: "OOO 직원 경조사 공지 11", writer: "구민석", views: 100, date: "2024-05-07" , attachment: ''},
  //     { id: 12, title: "OOO 직원 경조사 공지 12", writer: "구민석", views: 200, date: "2024-05-06" , attachment: ''},
  //     { id: 13, title: "OOO 직원 경조사 공지 13", writer: "구민석", views: 200, date: "2024-05-05" , attachment: ''},
  //     { id: 14, title: "OOO 직원 경조사 공지 14", writer: "구민석", views: 200, date: "2024-05-04" , attachment: ''},
  //     { id: 15, title: "OOO 직원 경조사 공지 15", writer: "구민석", views: 200, date: "2024-05-03" , attachment: ''},
  //   ];

  //   const initialfreeboards = [
  //     { id: 1, title: "자유게시판 1", writer: "구민석", views: 100, date: "2024-05-17" , attachment: '' },
  //     { id: 2, title: "자유게시판 2", writer: "구민석", views: 200, date: "2024-05-17" , attachment: 'png'},
  //     { id: 3, title: "자유게시판 3 제목이 길어지면 축약으로 바꿔줘", writer: "구민석", views: 300, date: "2024-05-16" , attachment: ''},
  //     { id: 4, title: "자유게시판 4", writer: "구민석", views: 100, date: "2024-05-16" , attachment: ''},
  //     { id: 5, title: "자유게시판 5", writer: "구민석", views: 200, date: "2024-05-15" , attachment: ''},
  //     { id: 6, title: "자유게시판 6", writer: "구민석", views: 300, date: "2024-05-09" , attachment: ''},
  //     { id: 7, title: "자유게시판 7", writer: "구민석", views: 100, date: "2024-05-09" , attachment: ''},
  //     { id: 8, title: "자유게시판 8", writer: "구민석", views: 200, date: "2024-05-09" , attachment: ''},
  //     { id: 9, title: "자유게시판 9", writer: "구민석", views: 100, date: "2024-05-09" , attachment: ''},
  //     { id: 10, title: "자유게시판 10", writer: "구민석", views: 200, date: "2024-05-08" , attachment: ''},
  //     { id: 11, title: "자유게시판 11", writer: "구민석", views: 100, date: "2024-05-07" , attachment: ''},
  //     { id: 12, title: "자유게시판 12", writer: "구민석", views: 200, date: "2024-05-06" , attachment: ''},
  //     { id: 13, title: "자유게시판 13", writer: "구민석", views: 200, date: "2024-05-05" , attachment: ''},
  //     { id: 14, title: "자유게시판 14", writer: "구민석", views: 200, date: "2024-05-04" , attachment: ''},
  //     { id: 15, title: "자유게시판 15", writer: "구민석", views: 200, date: "2024-05-03" , attachment: ''},
  //   ];

  //   setEmployNotice(initialemploynotices);
  //   setFreeBoard(initialfreeboards);
  // }, []);

  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <Link to={"/activitymanage"} className="sub_header">활동관리</Link>
      </div>
      
      <div className="content_container">
        <div className="active_container">
          <div className="board_container">
            <div className="board_content">

              <div className="board_top">
                <div className="board_name">직원 공지</div>
                <Link to={"/employeeNotice"}><div className="board_add">글 더보기 +</div></Link>
              </div>

              <div className="board_btm">
                {activitys
                .slice(0, 10)
                .map((activitys) => (
                  <div className="board_unit">
                    <div className="board_title">
                      <span style={{marginRight: '5px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '250px'}}>
                        <Link to={`/detailEmployeeNotice/${activitys.id}`}>{activitys.title}</Link>
                      </span> 
                      {activitys.attachment ? 
                        <img src={AttachmentIcon} alt="AttachmentIcon" />
                        :
                        <></>
                      }
                      {isNewNotice(activitys.date) ?
                        <img src={NewIcon} alt="NewIcon" />
                        :
                        <></>
                      }

                    </div>
                    <div className="board_date">{activitys.date}</div>
                  </div>  
                ))}
              </div>
            </div>

            <div className="board_content">

              <div className="board_top">
                <div className="board_name">자유게시판</div>
                <Link to={"/freeboard"}><div className="board_add">글 더보기 +</div></Link>
              </div>

              <div className="board_btm">
                {activitys
                  .slice(0, 10)
                  .map((activitys) => (
                    <div className="board_unit">
                      <div className="board_title">
                        <span style={{marginRight: '5px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '250px'}}>
                          <Link to={"/detailFreeBoard"}>{activitys.title}</Link>
                        </span> 
                        {activitys.attachment ? 
                          <img src={AttachmentIcon} alt="AttachmentIcon" />
                          :
                          <></>
                        }
                        {isNewNotice(activitys.date) ?
                          <img src={NewIcon} alt="NewIcon" />
                          :
                          <></>
                        }

                      </div>
                      <div className="board_date">{activitys.date}</div>
                    </div>  
                  ))}
              </div>
            </div>
          </div>

          <div className="btn_wrap">
            <button className="primary_button" onClick={() => {navigate("/writeActivityManage")}}>게시물 작성</button>
          </div>

        </div>
      </div>  
    </div>
  );
};

export default ActivityManage;