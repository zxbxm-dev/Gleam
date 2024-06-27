import { useState, useEffect } from "react";
import { ReactComponent as RightIcon } from "../../assets/images/Common/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../assets/images/Common/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../assets/images/Common/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../assets/images/Common/FirstLeftIcon.svg";
import {
  Asc_Icon,
  Desc_Icon,
} from "../../assets/images/index";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';

import { useQuery } from "react-query";
import { getMyReports, getDocumentsToApprove, getDocumentsInProgress, getRejectedDocuments, getApprovedDocuments } from "../../services/approval/ApprovalServices";

const Approval = () => {
  let navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [page, setPage] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState<string>("myDocuments");
  const [postPerPage, setPostPerPage] = useState<number>(10);
  const [mydocuments, setMyDocument] = useState<any[]>([]); // 내 문서
  const [approvalings, setApprovaling] = useState<any[]>([]); // 결재할 문서
  const [inProgress, setInProgress] = useState<any[]>([]); // 결재 진행중 문서
  const [rejecteds, setRejected] = useState<any[]>([]); // 반려된 문서
  const [compleDocuments, setCompleDocument] = useState<any[]>([]); // 완료된 문서
  const [vacations, setVacation] = useState<any[]>([]);
  const [idSortOrder, setIdSortOrder] = useState<"asc" | "desc">("asc");
  const [titleSortOrder, setTitleSortOrder] = useState<"asc" | "desc">("asc");
  const [dateSortOrder, setDateSortOrder] = useState<"asc" | "desc">("asc");
  const [stateSortOrder, setStateSortOrder] = useState<"asc" | "desc">("asc");
  const [writerSortOrder, setWriterSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1600) {
        setPostPerPage(10); // Desktop
      } else if (window.innerWidth >= 992) {
        setPostPerPage(8); // Laptop
      } else {
        setPostPerPage(8);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePageChange = (page: number) => {
    setPage(page);
  }

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

// 내 문서 목록 불러오기
const fetchMyReports = async () => {
  const params = {
    userID: user.userID
  };

  try {
    const response = await getMyReports(params); // params를 직접 전달
    return response.data;
  } catch (error) {
    // throw new Error("Failed to fetch data");
    console.log("Failed to fetch data");
  }
};

// 결재할 문서 목록 불러오기
const fetchDocumentsToApprove = async () => {
  const params = {
    username: user.username
  };

  try {
    const response = await getDocumentsToApprove(params);
    return response.data;
  } catch (error) {
    // throw new Error("Failed to fetch data");
    console.log("Failed to fetch data");
  }
};


// 결재 진행 중인 문서 목록 불러오기
const fetchDocumentsInProgress = async () => {
  const params = {
    username: user.username
  };

  try {
    const response = await getDocumentsInProgress(params);
    return response.data;
  } catch (error) {
    // throw new Error("Failed to fetch data");
    console.log("Failed to fetch data");
  }
};

// 반려된 문서 목록 불러오기
const fetchRejectedDocuments = async () => {
  const params = {
    username: user.username
  };

  try {
    const response = await getRejectedDocuments(params);
    return response.data;
  } catch (error) {
    // throw new Error("Failed to fetch data");
    console.log("Failed to fetch data");
  }
};

// 결재 완료된 문서 목록 불러오기
const fetchApprovedDocuments = async () => {
  const params = {
    username: user.username
  };

  try {
    const response = await getApprovedDocuments(params);
    return response.data;
  } catch (error) {
    // throw new Error("Failed to fetch data");
    console.log("Failed to fetch data");
  }
};


useEffect(() => {
  if (selectedTab === "approval") {
    fetchDocumentsToApprove();
  } else if (selectedTab === "inProgress") {
    fetchDocumentsInProgress();
  } else if (selectedTab === "rejected") {
    fetchRejectedDocuments();
  } else if (selectedTab === "completed") {
    fetchApprovedDocuments();
  } else if (selectedTab === "myDocuments") {
    fetchMyReports();
  }
}, [selectedTab]);
  const handleSort = (sortKey: string, targetState: any[], setTargetState: React.Dispatch<React.SetStateAction<any[]>>) => {
    // 정렬 상태 변수를 저장하는 Map
    const sortOrders: Map<string, ["asc" | "desc", React.Dispatch<React.SetStateAction<"asc" | "desc">>]> = new Map([
      ["id", [idSortOrder, setIdSortOrder]],
      ["title", [titleSortOrder, setTitleSortOrder]],
      ["date", [dateSortOrder, setDateSortOrder]],
      ["sadate", [dateSortOrder, setDateSortOrder]],
      ["state", [stateSortOrder, setStateSortOrder]],
      ["writer", [writerSortOrder, setWriterSortOrder]],
    ]);

    const [currentSortOrder, setCurrentSortOrder] = sortOrders.get(sortKey) || ["asc", setIdSortOrder];

    const sortedDocuments = [...targetState].sort((a, b) => {
      if (currentSortOrder === "asc") {
        return a[sortKey] > b[sortKey] ? 1 : -1;
      } else {
        return a[sortKey] < b[sortKey] ? 1 : -1;
      }
    });

    setCurrentSortOrder(currentSortOrder === "asc" ? "desc" : "asc");
    setTargetState(sortedDocuments);
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
                  <th className="HoverTab" onClick={() => handleSort("id", approvalings, setApprovaling)}>
                    순번
                    {idSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("title", approvalings, setApprovaling)}>
                    제목
                    {titleSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("date", approvalings, setApprovaling)}>
                    결재수신일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th>진행상황</th>
                  <th className="HoverTab" onClick={() => handleSort("state", approvalings, setApprovaling)}>
                    처리상황
                    {stateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("writer", approvalings, setApprovaling)}>
                    작성자/부서
                    {writerSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
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
                      <td style={{ display: 'flex', justifyContent: 'center', height: '52px', alignItems: 'center' }}><button className="primary_button" onClick={() => { navigate('/detailApproval') }}>결재하기</button></td>
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
                  <th className="HoverTab" onClick={() => handleSort("id", inProgress, setInProgress)}>
                    순번
                    {idSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("title", inProgress, setInProgress)}>
                    제목
                    {titleSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("date", inProgress, setInProgress)}>
                    결재수신일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("sadate", inProgress, setInProgress)}>
                    결재발신일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th>진행상황</th>
                  <th className="HoverTab" onClick={() => handleSort("state", inProgress, setInProgress)}>
                    처리상황
                    {stateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("writer", inProgress, setInProgress)}>
                    작성자/부서
                    {writerSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
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
                      <td><button className="primary_button" onClick={() => { navigate('/detailDocument') }}>문서확인</button></td>
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
                  <th className="HoverTab" onClick={() => handleSort("id", rejecteds, setRejected)}>
                    순번
                    {idSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("title", rejecteds, setRejected)}>
                    제목
                    {titleSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("date", rejecteds, setRejected)}>
                    결재수신일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("sadate", rejecteds, setRejected)}>
                    결재반려일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th>진행상황</th>
                  <th className="HoverTab" onClick={() => handleSort("state", rejecteds, setRejected)}>
                    처리상황
                    {stateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("writer", rejecteds, setRejected)}>
                    작성자/부서
                    {writerSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
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
                      <td><button className="primary_button" onClick={() => { navigate('/detailDocument') }}>문서확인</button></td>
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
                  <th className="HoverTab" onClick={() => handleSort("id", compleDocuments, setCompleDocument)}>
                    순번
                    {idSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("title", compleDocuments, setCompleDocument)}>
                    제목
                    {titleSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("date", compleDocuments, setCompleDocument)}>
                    결재수신일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("sadate", compleDocuments, setCompleDocument)}>
                    결재완료일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th>진행상황</th>
                  <th className="HoverTab" onClick={() => handleSort("state", compleDocuments, setCompleDocument)}>
                    처리상황
                    {stateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("writer", compleDocuments, setCompleDocument)}>
                    작성자/부서
                    {writerSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
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
                      <td><button className="primary_button" onClick={() => { navigate('/detailDocument') }}>문서확인</button></td>
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
                  <th className="HoverTab" onClick={() => handleSort("id", mydocuments, setMyDocument)}>
                    순번
                    {idSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("title", mydocuments, setMyDocument)}>
                    제목
                    {titleSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("date", mydocuments, setMyDocument)}>
                    결재수신일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("sadate", mydocuments, setMyDocument)}>
                    처리일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th>진행상황</th>
                  <th className="HoverTab" onClick={() => handleSort("state", mydocuments, setMyDocument)}>
                    처리상황
                    {stateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("writer", mydocuments, setMyDocument)}>
                    작성자/부서
                    {writerSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
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
                      <td><button className="primary_button" onClick={() => { navigate('/detailDocument') }}>문서확인</button></td>
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
      case "vacation":
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
                  <th className="HoverTab" onClick={() => handleSort("id", vacations, setVacation)}>
                    순번
                    {idSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("title", vacations, setVacation)}>
                    제목
                    {titleSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("date", vacations, setVacation)}>
                    결재수신일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("sadate", vacations, setVacation)}>
                    결재발신일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th>진행상황</th>
                  <th className="HoverTab" onClick={() => handleSort("state", vacations, setVacation)}>
                    처리상황
                    {stateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("writer", vacations, setVacation)}>
                    작성자/부서
                    {writerSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th>결재</th>
                </tr>
              </thead>
              <tbody className="board_container">
                {vacations
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((vacation) => (
                    <tr key={vacation.id} className="board_content">
                      <td>{vacation.id}</td>
                      <td style={{ textAlign: 'center' }}>{vacation.title}</td>
                      <td>{vacation.date}</td>
                      <td>{vacation.date}</td>
                      <td>{vacation.progress} / {vacation.maxprogress}</td>
                      <td>{vacation.state}</td>
                      <td>{vacation.writer}</td>
                      <td><button className="primary_button" onClick={() => { navigate('/detailDocument') }}>문서확인</button></td>
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

  return (
    <div className="content">
      <div className="approval_top">
        <div className="approval_top_first">
          <div className={`${selectedTab === "myDocuments" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("myDocuments")}>
            <span>내문서</span> <span className="document_count">{mydocuments.length}</span>
          </div>
          <div className={`${selectedTab === "approval" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("approval")}>
            <span>결재 할 문서</span> <span className="document_count">{approvalings.length}</span>
          </div>
          <div className={`${selectedTab === "inProgress" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("inProgress")}>
            <span>결재 진행 중 문서</span> <span className="document_count">{inProgress.length}</span>
          </div>
          <div className={`${selectedTab === "rejected" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("rejected")}>
            <span>반려 문서</span> <span className="document_count">{rejecteds.length}</span>
          </div>
          <div className={`${selectedTab === "completed" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("completed")}>
            <span>결재 완료 문서</span> <span className="document_count">{compleDocuments.length}</span>
          </div>
          {user.username === '우현지' ? (
            <div className={`${selectedTab === "vacation" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("vacation")}>
              <span>휴가문서관리</span> <span className="document_count">{vacations.length}</span>
            </div>
          )
            :
            <></>
          }
        </div>
      </div>

      <div className="approval_btm">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Approval;