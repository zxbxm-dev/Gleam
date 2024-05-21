import { useState, useEffect } from "react";
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
  const [approval, setApproval] = useState<any[]>([]);
  const [approvalings, setApprovaling] = useState<any[]>([]);
  const [inProgress, setInProgress] = useState<any[]>([]);
  const [rejecteds, setRejected] = useState<any[]>([]);
  const [mydocuments, setMyDocument] = useState<any[]>([]);
  const [compleDocuments, setCompleDocument] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [titleSortOrder, setTitleSortOrder] = useState<"asc" | "desc">("asc");
  const [dateSortOrder, setDateSortOrder] = useState<"asc" | "desc">("asc");
  const [stateSortOrder, setStateSortOrder] = useState<"asc" | "desc">("asc");
  const [writerSortOrder, setWriterSortOrder] = useState<"asc" | "desc">("asc");


  const handlePageChange = (page: number) => {
    setPage(page);
  }

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };
  useEffect(() => {
    const initialAnnouncements = [
      { id: 1, title: "공지사항", date: "2024-05-01", progress: 0, maxprogress: 3, state: "미결재", writer: "서주희", approvalline: ['진유빈', '김효은', '이정훈'] },
      { id: 2, title: "ㅁㄹㄴㅇ", date: "2024-05-02", progress: 0, maxprogress: 5, state: "미결재", writer: "우현지", approvalline: ['진유빈', '김효은', '이정훈'] },
      { id: 3, title: "공지사항", date: "2024-05-03", progress: 0, maxprogress: 3, state: "미결재", writer: "구민석", approvalline: ['진유빈', '김효은', '이정훈'] },
      { id: 4, title: "ㅌㅊㅋㅍ", date: "2024-05-01", progress: 2, maxprogress: 3, state: "미결재", writer: "김도환", approvalline: ['진유빈', '김효은', '이정훈'] },
      { id: 5, title: "ㄴㅇㅎㄴ", date: "2024-05-02", progress: 1, maxprogress: 3, state: "미결재", writer: "김태희", approvalline: ['진유빈', '김효은', '이정훈'] },
      { id: 6, title: "sgdfg", date: "2024-05-03", progress: 3, maxprogress: 3, state: "결재완료", writer: "함다슬", approvalline: ['진유빈', '김효은', '이정훈'] },
      { id: 7, title: "df", date: "2024-05-01", progress: 3, maxprogress: 3, state: "결재완료", writer: "진유빈", approvalline: ['김효은', '이정훈'] },
      { id: 8, title: "ewretwrwet", date: "2024-05-02", progress: 0, maxprogress: 3, state: "미결재", writer: "서주희", approvalline: ['진유빈', '김효은', '이정훈'] },
      { id: 9, title: "sdfh", date: "2024-05-01", progress: 3, maxprogress: 3, state: "결재완료", writer: "서주희", approvalline: ['진유빈', '김효은', '이정훈'] },
      { id: 10, title: "xcvb", date: "2024-05-02", progress: 1, maxprogress: 3, state: "반려", writer: "구민석", approvalline: ['진유빈', '김효은', '이정훈'] },
      { id: 11, title: "tyoyyty", date: "2024-05-01", progress: 0, maxprogress: 3, state: "미결재", writer: "우현지", approvalline: ['진유빈', '김효은', '이정훈'] },
      { id: 12, title: "op", date: "2024-05-02", progress: 0, maxprogress: 3, state: "미결재", writer: "장현지", approvalline: ['진유빈', '김효은', '이정훈'] },
    ];
    setApproval(initialAnnouncements);
  }, []);

  useEffect(() => { // 결재할문서 필터링
    const filteredDocuments = approval.filter(doc => doc.approvalline.indexOf('진유빈') === doc.progress && doc.state === '미결재');
    const initializedDocuments = filteredDocuments.map((doc, index) => ({
      ...doc,
      id: filteredDocuments.length - index
    }));
    setApprovaling(initializedDocuments);
  }, [approval]);

  useEffect(() => { // 결재진행중문서 필터링
    const filteredDocuments = approval.filter(doc => doc.approvalline.includes('진유빈') && doc.state === '미결재');
    const initializedDocuments = filteredDocuments.map((doc, index) => ({
      ...doc,
      id: filteredDocuments.length - index
    }));
    setInProgress(initializedDocuments);
  }, [approval]);

  useEffect(() => { // 반려문서 필터링
    const filteredDocuments = approval.filter(doc => doc.state === '반려');
    const initializedDocuments = filteredDocuments.map((doc, index) => ({
      ...doc,
      id: filteredDocuments.length - index
    }));
    setRejected(initializedDocuments);
  }, [approval]);

  useEffect(() => { // 결재완료문서 필터링
    const filteredDocuments = approval.filter(doc => doc.progress === doc.maxprogress);
    const initializedDocuments = filteredDocuments.map((doc, index) => ({
      ...doc,
      id: filteredDocuments.length - index
    }));
    setCompleDocument(initializedDocuments);
  }, [approval]);

  useEffect(() => { // 내문서 필터링
    const filteredDocuments = approval.filter(doc => doc.writer === "구민석");
    const initializedDocuments = filteredDocuments.map((doc, index) => ({
      ...doc,
      id: filteredDocuments.length - index
    }));
    setMyDocument(initializedDocuments);
  }, [approval]);

  const handleSort = () => {
    const sortedDocuments = [...approvalings].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });
    setApprovaling(sortedDocuments);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleTitleSort = () => {
    const sortedDocuments = [...approvalings].sort((a, b) => {
      if (titleSortOrder === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    setApprovaling(sortedDocuments);
    setTitleSortOrder(titleSortOrder === "asc" ? "desc" : "asc");
  };

  const handleDateSort = () => {
    const sortedDocuments = [...approvalings].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateSortOrder === "asc") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
    setApprovaling(sortedDocuments);
    setDateSortOrder(dateSortOrder === "asc" ? "desc" : "asc");
  };

  const handleStateSort = () => {
    const sortedDocuments = [...approvalings].sort((a, b) => {
      if (stateSortOrder === "asc") {
        return a.state.localeCompare(b.state);
      } else {
        return b.state.localeCompare(a.state);
      }
    });
    setApprovaling(sortedDocuments);
    setStateSortOrder(stateSortOrder === "asc" ? "desc" : "asc");
  };

  const handleWriterSort = () => {
    const sortedDocuments = [...approvalings].sort((a, b) => {
      if (writerSortOrder === "asc") {
        return a.writer.localeCompare(b.writer);
      } else {
        return b.writer.localeCompare(a.writer);
      }
    });
    setApprovaling(sortedDocuments);
    setWriterSortOrder(writerSortOrder === "asc" ? "desc" : "asc");
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
                <col width="6%" />
                <col width="20%" />
                <col width="22%" />
                <col width="10%" />
                <col width="10%" />
                <col width="22%" />
                <col width="10%" />
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th onClick={handleSort} style={{ cursor: "pointer" }}>순번</th>
                  <th onClick={handleTitleSort} style={{ cursor: "pointer" }}>제목</th>
                  <th onClick={handleDateSort} style={{ cursor: "pointer" }}>결재수신일자</th>
                  <th>진행상황</th>
                  <th onClick={handleStateSort} style={{ cursor: "pointer" }}>처리상황</th>
                  <th onClick={handleWriterSort} style={{ cursor: "pointer" }}>작성자/부서</th>
                  <th>결재</th>
                </tr>
              </thead>
              <tbody className="board_container">
                {approvalings
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((approvaling) => (
                    <tr key={approvaling.id} className="board_content">
                      <td>{approvaling.id}</td>
                      <td style={{ textAlign: 'center' }}>{approvaling.title}</td>
                      <td>{approvaling.date}</td>
                      <td>{approvaling.progress} / {approvaling.maxprogress}</td>
                      <td>{approvaling.state}</td>
                      <td>{approvaling.writer}</td>
                      <td><button className="approval_button" onClick={() => { navigate('/detailApproval') }}>결재하기</button></td>
                    </tr>
                  ))
                }
              </tbody>
              <div className="approval_main_bottom">
                <Pagination
                  activePage={page}
                  itemsCountPerPage={postPerPage}
                  totalItemsCount={approvalings.length}
                  pageRangeDisplayed={Math.ceil(approvalings.length / postPerPage)}
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
                <col width="6%" />
                <col width="14%" />
                <col width="15%" />
                <col width="15%" />
                <col width="10%" />
                <col width="10%" />
                <col width="20%" />
                <col width="10%" />
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
                {inProgress
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((inProgres) => (
                    <tr key={inProgres.id} className="board_content">
                      <td>{inProgres.id}</td>
                      <td style={{ textAlign: 'center' }}>{inProgres.title}</td>
                      <td>{inProgres.date}</td>
                      <td>{inProgres.date}</td>
                      <td>{inProgres.progress} / {inProgres.maxprogress}</td>
                      <td>{inProgres.state}</td>
                      <td>{inProgres.writer}</td>
                      <td><button className="document_button">문서확인</button></td>
                    </tr>
                  ))
                }
              </tbody>
              <div className="approval_main_bottom">
                <Pagination
                  activePage={page}
                  itemsCountPerPage={postPerPage}
                  totalItemsCount={inProgress.length}
                  pageRangeDisplayed={Math.ceil(inProgress.length / postPerPage)}
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
                <col width="6%" />
                <col width="14%" />
                <col width="15%" />
                <col width="15%" />
                <col width="10%" />
                <col width="10%" />
                <col width="20%" />
                <col width="10%" />
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th>순번</th>
                  <th>제목</th>
                  <th>결재수신일자</th>
                  <th>결재반려일자</th>
                  <th>진행상황</th>
                  <th>처리상황</th>
                  <th>작성자/부서</th>
                  <th>결재</th>
                </tr>
              </thead>
              <tbody className="board_container">
                {rejecteds
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((rejected) => (
                    <tr key={rejected.id} className="board_content">
                      <td>{rejected.id}</td>
                      <td style={{ textAlign: 'center' }}>{rejected.title}</td>
                      <td>{rejected.date}</td>
                      <td>{rejected.date}</td>
                      <td>{rejected.progress} / {rejected.maxprogress}</td>
                      <td>{rejected.state}</td>
                      <td>{rejected.writer}</td>
                      <td><button className="document_button">문서확인</button></td>
                    </tr>
                  ))
                }
              </tbody>
              <div className="approval_main_bottom">
                <Pagination
                  activePage={page}
                  itemsCountPerPage={postPerPage}
                  totalItemsCount={rejecteds.length}
                  pageRangeDisplayed={Math.ceil(rejecteds.length / postPerPage)}
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
                <col width="6%" />
                <col width="14%" />
                <col width="15%" />
                <col width="15%" />
                <col width="10%" />
                <col width="10%" />
                <col width="20%" />
                <col width="10%" />
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th>순번</th>
                  <th>제목</th>
                  <th>결재수신일자</th>
                  <th>결재완료일자</th>
                  <th>진행상황</th>
                  <th>처리상황</th>
                  <th>작성자/부서</th>
                  <th>결재</th>
                </tr>
              </thead>
              <tbody className="board_container">
                {compleDocuments
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((compledocument) => (
                    <tr key={compledocument.id} className="board_content">
                      <td>{compledocument.id}</td>
                      <td style={{ textAlign: 'center' }}>{compledocument.title}</td>
                      <td>{compledocument.date}</td>
                      <td>{compledocument.date}</td>
                      <td>{compledocument.progress} / {compledocument.maxprogress}</td>
                      <td>{compledocument.state}</td>
                      <td>{compledocument.writer}</td>
                      <td><button className="document_button">문서확인</button></td>
                    </tr>
                  ))
                }
              </tbody>
              <div className="approval_main_bottom">
                <Pagination
                  activePage={page}
                  itemsCountPerPage={postPerPage}
                  totalItemsCount={compleDocuments.length}
                  pageRangeDisplayed={Math.ceil(compleDocuments.length / postPerPage)}
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
                <col width="6%" />
                <col width="14%" />
                <col width="15%" />
                <col width="15%" />
                <col width="10%" />
                <col width="10%" />
                <col width="20%" />
                <col width="10%" />
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th>순번</th>
                  <th>제목</th>
                  <th>결재수신일자</th>
                  <th>처리일자</th>
                  <th>진행상황</th>
                  <th>처리상황</th>
                  <th>작성자/부서</th>
                  <th>결재</th>
                </tr>
              </thead>
              <tbody className="board_container">
                {mydocuments
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((mydocument) => (
                    <tr key={mydocument.id} className="board_content">
                      <td>{mydocument.id}</td>
                      <td style={{ textAlign: 'center' }}>{mydocument.title}</td>
                      <td>{mydocument.date}</td>
                      <td>{mydocument.date}</td>
                      <td>{mydocument.progress} / {mydocument.maxprogress}</td>
                      <td>{mydocument.state}</td>
                      <td>{mydocument.writer}</td>
                      <td><button className="document_button">문서확인</button></td>
                    </tr>
                  ))
                }
              </tbody>
              <div className="approval_main_bottom">
                <Pagination
                  activePage={page}
                  itemsCountPerPage={postPerPage}
                  totalItemsCount={mydocuments.length}
                  pageRangeDisplayed={Math.ceil(mydocuments.length / postPerPage)}
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

  console.log(mydocuments)

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
                <span>결재 할 문서</span> <span className="document_count">{approvalings.length}</span>
              </div>
              <div className={`${selectedTab === "inProgress" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("inProgress")}>
                <span>결재 진행 중 문서</span> <span className="document_count">{inProgress.length}</span>
              </div>
              <div className={`${selectedTab === "rejected" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("rejected")}>
                <span>반려 문서</span> <span className="document_count">{rejecteds.length}</span>
              </div>
            </div>
            <div className="approval_top_second">
              <div className={`${selectedTab === "completed" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("completed")}>
                <span>결재 완료 문서</span> <span className="document_count">{compleDocuments.length}</span>
              </div>
              <div className={`${selectedTab === "myDocuments" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("myDocuments")}>
                <span>내문서</span> <span className="document_count">{mydocuments.length}</span>
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