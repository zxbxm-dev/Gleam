import { useState } from "react";
import "./Announcement.scss";
import {
  SearchIcon,
} from "../../../assets/images/index";
import { ReactComponent as RightIcon } from "../../../assets/images/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../../assets/images/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../../assets/images/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../../assets/images/FirstLeftIcon.svg";

import Pagination from "react-js-pagination";


const Announcement = () => {
  const [page, setPage] = useState<number>(1); 

  const postPerPage: number = 10;

  const handlePageChange = (page: number) => {
    setPage(page);
  }
  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <div className="sub_header">공지사항</div>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="main_header">
            <div className="header_name">공지사항</div>
            <div className="input-wrapper">
              <input type="search" className="input_form" />
              <img src={SearchIcon} alt="SearchIcon" className="search-icon" />
            </div>
          </div>

          <div>
            <table className="board_list">
              <colgroup>
                <col width="6%"/>
                <col width="74%"/>
                <col width="10%"/>
                <col width="10%"/>
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th>구분</th>
                  <th>제목</th>
                  <th>조회수</th>
                  <th>등록일</th>
                </tr>
              </thead>
              <tbody>
                <tr className="board_content">
                  <td style={{color: '#D56D6D'}}>공지</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>2025년 인사평가 공지</td>
                  <td>567</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td style={{color: '#D56D6D'}}>공지</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>24/01/08 사내 행사 변경</td>
                  <td>567</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td style={{color: '#D56D6D'}}>공지</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>휴가서 양식 변경 사항</td>
                  <td>567</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td style={{color: '#D56D6D'}}>공지</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>각 부서 채용 예정 인원</td>
                  <td>567</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td style={{color: '#D56D6D'}}>공지</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>하계 휴가 공지</td>
                  <td>567</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td style={{color: '#D56D6D'}}>공지</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>2025년 법정의무교육 시행 예정</td>
                  <td>567</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td style={{color: '#D56D6D'}}>공지</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>2025년 인사발령</td>
                  <td>567</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td style={{color: '#D56D6D'}}>공지</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>기획팀 신입사원</td>
                  <td>567</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td style={{color: '#D56D6D'}}>공지</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>2024년 사내 행사</td>
                  <td>567</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content" style={{borderBottom: '2px solid #DCDCDC'}}>
                  <td style={{color: '#D56D6D'}}>공지</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>2024년 사내 워크숍</td>
                  <td>567</td>
                  <td>2099-99-99</td>
                </tr>
              </tbody>
            </table>


            <div className="main_bottom">
              <Pagination 
                activePage={page}
                itemsCountPerPage={postPerPage}
                totalItemsCount={100}
                pageRangeDisplayed={5}
                prevPageText={<LeftIcon />}
                nextPageText={<RightIcon />}
                firstPageText={<FirstLeftIcon />}
                lastPageText={<LastRightIcon />}
                onChange={handlePageChange}
              />

              <button className="primary_button">게시물 작성</button>
            </div>
          </div>

        </div>
      </div>  
    </div>
  );
};

export default Announcement;