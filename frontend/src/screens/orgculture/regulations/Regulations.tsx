import { useState } from "react";
import "./Regulations.scss";
import {
  SearchIcon
} from "../../../assets/images/index";
import { ReactComponent as RightIcon } from "../../../assets/images/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../../assets/images/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../../assets/images/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../../assets/images/FirstLeftIcon.svg";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "react-js-pagination";

const Regulations = () => {
  let navigate = useNavigate();
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
        <Link to={"/regulations"} className="sub_header">사내규정</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="main_header">
            <div className="header_name">사내규정</div>
            <div className="input-wrapper">
              <input type="search" className="input_form" />
              <img src={SearchIcon} alt="SearchIcon" className="search-icon" />
            </div>
          </div>

          <div>
            <table className="regulation_board_list">
              <colgroup>
                <col width="6%"/>
                <col width="84%"/>
                <col width="10%"/>
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th>순번</th>
                  <th>제목</th>
                  <th>등록일</th>
                </tr>
              </thead>
              <tbody>
                <tr className="board_content">
                  <td>1</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}><Link to={"/detailRegulation"}>취업 규칙</Link></td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>2</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>취업 규칙</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>3</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>취업 규칙</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>4</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>취업 규칙</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>5</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>취업 규칙</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>6</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>취업 규칙</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>7</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>취업 규칙</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>8</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>취업 규칙</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>9</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>취업 규칙</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>10</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>취업 규칙</td>
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

            </div>
            <button className="primary_button" onClick={() => {navigate("/writeRegulation")}}>게시물 작성</button>
          </div>

        </div>
      </div>  
    </div>
  );
};

export default Regulations;