import { useState } from "react";
import "./Approval.scss";
import { ReactComponent as RightIcon } from "../../assets/images/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../assets/images/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../assets/images/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../assets/images/FirstLeftIcon.svg";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "react-js-pagination";

const Approval = () => {
  let navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState<string>("main");
  const postPerPage: number = 10;

  const handlePageChange = (page: number) => {
    setPage(page);
  }

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "main":
        return (
          <div>

          </div>
        );
      case "approval":
        return (
          <>
            <table className="approval_board_list">
              <colgroup>
                <col width="6%"/>
                <col width="20%"/>
                <col width="22%"/>
                <col width="10%"/>
                <col width="10%"/>
                <col width="22%"/>
                <col width="10%"/>
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th>순번</th>
                  <th>제목</th>
                  <th>결재수신일자</th>
                  <th>진행상황</th>
                  <th>처리상황</th>
                  <th>작성자/부서</th>
                  <th>결재</th>
                </tr>
              </thead>
              <tbody className="board_container">
                <tr className="board_content">
                  <td>10</td>
                  <td style={{textAlign: 'center'}}>휴가신청서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>0/3</td>
                  <td>미결재</td>
                  <td>서주희 / 디자인팀</td>
                  <td><button className="approval_button" onClick={() => {navigate('/detailApproval')}}>결재하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>9</td>
                  <td style={{textAlign: 'center'}}>주간업무일지</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>0/5</td>
                  <td>미결재</td>
                  <td>우현지 / 관리팀</td>
                  <td><button className="approval_button">결재하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>8</td>
                  <td style={{textAlign: 'center'}}>휴가신청서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>0/3</td>
                  <td>미결재</td>
                  <td>구민석 / 개발 1팀</td>
                  <td><button className="approval_button">결재하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>7</td>
                  <td style={{textAlign: 'center'}}>워크숍 신청서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>0/5</td>
                  <td>미결재</td>
                  <td>김도환 / 블록체인 1팀</td>
                  <td><button className="approval_button">결재하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>6</td>
                  <td style={{textAlign: 'center'}}>지출내역서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>0/3</td>
                  <td>미결재</td>
                  <td>김태희 / 지원팀</td>
                  <td><button className="approval_button">결재하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>5</td>
                  <td style={{textAlign: 'center'}}>휴가신청서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>0/5</td>
                  <td>미결재</td>
                  <td>함다슬 / 기획팀</td>
                  <td><button className="approval_button">결재하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>4</td>
                  <td style={{textAlign: 'center'}}>주간업무일지</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>0/3</td>
                  <td>미결재</td>
                  <td>진유빈 / 개발부</td>
                  <td><button className="approval_button">결재하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>3</td>
                  <td style={{textAlign: 'center'}}>워크숍 신청서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>0/5</td>
                  <td>미결재</td>
                  <td>서주희 / 디자인팀</td>
                  <td><button className="approval_button">결재하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>2</td>
                  <td style={{textAlign: 'center'}}>기획서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>0/3</td>
                  <td>미결재</td>
                  <td>우현지 / 관리팀</td>
                  <td><button className="approval_button">결재하기</button></td>
                </tr>
                <tr className="board_content" style={{borderBottom: '2px solid #DCDCDC'}}>
                  <td>1</td>
                  <td style={{textAlign: 'center'}}>휴가신청서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>0/3</td>
                  <td>미결재</td>
                  <td>장현지 / 개발 1팀</td>
                  <td><button className="approval_button">결재하기</button></td>
                </tr>
              </tbody>
              <div className="approval_main_bottom">
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
            </table>
          </>
        );
      case "inProgress":
        return (
          <>
            <table className="approval_board_list">
              <colgroup>
                <col width="6%"/>
                <col width="14%"/>
                <col width="15%"/>
                <col width="15%"/>
                <col width="10%"/>
                <col width="10%"/>
                <col width="20%"/>
                <col width="10%"/>
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th>순번</th>
                  <th>제목</th>
                  <th>결재수신일자</th>
                  <th>결재발신일자</th>
                  <th>진행상황</th>
                  <th>처리상황</th>
                  <th>작성자/부서</th>
                  <th>결재</th>
                </tr>
              </thead>
              <tbody className="board_container">
                <tr className="board_content">
                  <td>3</td>
                  <td style={{textAlign: 'center'}}>워크숍 신청서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>2/5</td>
                  <td>미결재</td>
                  <td>서주희 / 디자인팀</td>
                  <td><button className="document_button">문서확인</button></td>
                </tr>
                <tr className="board_content">
                  <td>2</td>
                  <td style={{textAlign: 'center'}}>기획서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>1/3</td>
                  <td>미결재</td>
                  <td>우현지 / 관리팀</td>
                  <td><button className="document_button">문서확인</button></td>
                </tr>
                <tr className="board_content" style={{borderBottom: '2px solid #DCDCDC'}}>
                  <td>1</td>
                  <td style={{textAlign: 'center'}}>휴가신청서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>2/3</td>
                  <td>미결재</td>
                  <td>장현지 / 개발 1팀</td>
                  <td><button className="document_button">문서확인</button></td>
                </tr>
              </tbody>
              <div className="approval_main_bottom">
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
            </table>
          </>
        );
      case "rejected":
        return (
          <>
            <table className="approval_board_list">
              <colgroup>
                <col width="6%"/>
                <col width="14%"/>
                <col width="15%"/>
                <col width="15%"/>
                <col width="10%"/>
                <col width="10%"/>
                <col width="20%"/>
                <col width="10%"/>
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th>순번</th>
                  <th>제목</th>
                  <th>결재수신일자</th>
                  <th>결재발신일자</th>
                  <th>진행상황</th>
                  <th>처리상황</th>
                  <th>작성자/부서</th>
                  <th>결재</th>
                </tr>
              </thead>
              <tbody className="board_container">
                <tr className="board_content">
                  <td>1</td>
                  <td style={{textAlign: 'center'}}>워크숍 신청서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>1/3</td>
                  <td>반려</td>
                  <td>서주희 / 디자인팀</td>
                  <td><button className="document_button">문서확인</button></td>
                </tr>
              </tbody>
              <div className="approval_main_bottom">
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
            </table>
          </>
        );
      case "completed":
        return (
          <>
            <table className="approval_board_list">
              <colgroup>
                <col width="6%"/>
                <col width="14%"/>
                <col width="15%"/>
                <col width="15%"/>
                <col width="10%"/>
                <col width="10%"/>
                <col width="20%"/>
                <col width="10%"/>
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th>순번</th>
                  <th>제목</th>
                  <th>결재수신일자</th>
                  <th>결재발신일자</th>
                  <th>진행상황</th>
                  <th>처리상황</th>
                  <th>작성자/부서</th>
                  <th>결재</th>
                </tr>
              </thead>
              <tbody className="board_container">
                <tr className="board_content">
                  <td>2</td>
                  <td style={{textAlign: 'center'}}>기획서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>3/3</td>
                  <td>결재완료</td>
                  <td>우현지 / 관리팀</td>
                  <td><button className="document_button">문서확인</button></td>
                </tr>
                <tr className="board_content" style={{borderBottom: '2px solid #DCDCDC'}}>
                  <td>1</td>
                  <td style={{textAlign: 'center'}}>휴가신청서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>5/5</td>
                  <td>결재완료</td>
                  <td>장현지 / 개발 1팀</td>
                  <td><button className="document_button">문서확인</button></td>
                </tr>
              </tbody>
              <div className="approval_main_bottom">
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
            </table>
          </>
        );
      case "myDocuments":
        return (
          <>
            <table className="approval_board_list">
              <colgroup>
                <col width="6%"/>
                <col width="14%"/>
                <col width="15%"/>
                <col width="15%"/>
                <col width="10%"/>
                <col width="10%"/>
                <col width="20%"/>
                <col width="10%"/>
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th>순번</th>
                  <th>제목</th>
                  <th>결재수신일자</th>
                  <th>결재발신일자</th>
                  <th>진행상황</th>
                  <th>처리상황</th>
                  <th>작성자/부서</th>
                  <th>결재</th>
                </tr>
              </thead>
              <tbody className="board_container">
                <tr className="board_content">
                  <td>3</td>
                  <td style={{textAlign: 'center'}}>프로젝트 기획서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>2/3</td>
                  <td>참조</td>
                  <td>구민석 / 개발 1팀</td>
                  <td><button className="document_button">문서확인</button></td>
                </tr>
                <tr className="board_content">
                  <td>2</td>
                  <td style={{textAlign: 'center'}}>기획서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>2/3</td>
                  <td>미결재</td>
                  <td>구민석 / 개발 1팀</td>
                  <td><button className="document_button">문서확인</button></td>
                </tr>
                <tr className="board_content" style={{borderBottom: '2px solid #DCDCDC'}}>
                  <td>1</td>
                  <td style={{textAlign: 'center'}}>휴가신청서</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>2099-99-99 &nbsp;&nbsp; 22:22</td>
                  <td>5/5</td>
                  <td>결재완료</td>
                  <td>구민석 / 개발 1팀</td>
                  <td><button className="document_button">문서확인</button></td>
                </tr>
              </tbody>
              <div className="approval_main_bottom">
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
            </table>
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/approval"} className="sub_header">보고서 결재</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="approval_top">
            <div className="approval_top_first">
              <div className={`${selectedTab === "approval" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("approval")}>
                <span>결재 할 문서</span> <span className="document_count">10</span>
              </div>
              <div className={`${selectedTab === "inProgress" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("inProgress")}>
                <span>결재 진행 중 문서</span> <span className="document_count">3</span>
              </div>
              <div className={`${selectedTab === "rejected" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("rejected")}>
                <span>반려 문서</span> <span className="document_count">1</span>
              </div>
            </div>
            <div className="approval_top_second">
              <div className={`${selectedTab === "completed" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("completed")}>
                <span>결재 완료 문서</span> <span className="document_count">2</span>
              </div>
              <div className={`${selectedTab === "myDocuments" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("myDocuments")}>
                <span>내문서</span> <span className="document_count">3</span>
              </div>
            </div>
          </div>

          <div className="approval_btm">
            {renderTabContent()}
          </div>
        </div>
      </div>  
      
    </div>
  );
};

export default Approval;