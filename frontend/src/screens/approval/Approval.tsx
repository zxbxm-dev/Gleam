import { useState, useEffect } from "react";
import { ReactComponent as RightIcon } from "../../assets/images/Common/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../assets/images/Common/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../assets/images/Common/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../assets/images/Common/FirstLeftIcon.svg";
import {
  Asc_Icon,
  Desc_Icon,
} from "../../assets/images/index";
import { useNavigate } from "react-router-dom";
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
      userID: user.userID,
      username: user.username
    };

    try {
      const response = await getMyReports(params);
      return response.data;

    } catch (error) {
      console.log("Failed to fetch data");
    }
  };

  useQuery("myReports", fetchMyReports, {
    onSuccess: (data) => setMyDocument(data),
    onError: (error) => {
      console.log(error)
    }
  });

  // 결재할 문서 목록 불러오기
  const fetchDocumentsToApprove = async () => {
    const params = {
      username: user.username
    };

    try {
      const response = await getDocumentsToApprove(params);
      setApprovaling(response.data);

      return response.data;
    } catch (error) {
      // throw new Error("Failed to fetch data");
      console.log("Failed to fetch data");
    }
  };
  useQuery("DocumentsToApprove", fetchDocumentsToApprove, {
    onSuccess: (data) => setApprovaling(data),
    onError: (error) => {
      console.log(error)
    }
  });

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

  useQuery("DocumentsInProgress", fetchDocumentsInProgress, {
    onSuccess: (data) => setInProgress(data),
    onError: (error) => {
      console.log(error)
    }
  });


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

  useQuery("RejectedDocuments", fetchRejectedDocuments, {
    onSuccess: (data) => setRejected(data),
    onError: (error) => {
      console.log(error)
    }
  });

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

  useQuery("ApprovedDocuments", fetchApprovedDocuments, {
    onSuccess: (data) => setCompleDocument(data),
    onError: (error) => {
      console.log(error)
    }
  });

  const handleSort = (sortKey: string, targetState: any[], setTargetState: React.Dispatch<React.SetStateAction<any[]>>) => {
    // 정렬 상태 변수를 저장하는 Map
    const sortOrders: Map<string, ["asc" | "desc", React.Dispatch<React.SetStateAction<"asc" | "desc">>]> = new Map([
      ["id", [idSortOrder, setIdSortOrder]],
      ["selectForm", [titleSortOrder, setTitleSortOrder]],
      ["sendDate", [dateSortOrder, setDateSortOrder]],
      ["updatedAt", [dateSortOrder, setDateSortOrder]],
      ["state", [stateSortOrder, setStateSortOrder]],
      ["username", [writerSortOrder, setWriterSortOrder]],
    ]);
    const [currentSortOrder, setCurrentSortOrder] = sortOrders.get(sortKey) || ["asc", setIdSortOrder];

    const sortedDocuments = [...targetState].sort((a, b) => {
      console.log(sortKey)
      if (currentSortOrder === "asc") {
        console.log(a[sortKey], b[sortKey])
        return a[sortKey] > b[sortKey] ? 1 : -1;
      } else {
        return a[sortKey] < b[sortKey] ? 1 : -1;
      }
    });

    console.log(sortedDocuments)
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
                <col width="30%" />
                <col width="22%" />
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
                  <th className="HoverTab" onClick={() => handleSort("selectForm", approvalings, setApprovaling)}>
                    제목
                    {titleSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("sendDate", approvalings, setApprovaling)}>
                    결재수신일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th>진행상황</th>
                  <th className="HoverTab" onClick={() => handleSort("username", approvalings, setApprovaling)}>
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
                {(approvalings || [])
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((approvaling, index) => {
                    const formatDate = (dateString: string) => {
                      const date = new Date(dateString);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      const hours = String(date.getHours()).padStart(2, '0');
                      const minutes = String(date.getMinutes()).padStart(2, '0');
                      return `${year}-${month}-${day} ${hours}:${minutes}`;
                    };

                    const formattedSendDate = formatDate(approvaling.sendDate);

                    return (
                      <tr key={approvaling.id} className="board_content">
                        <td>
                          {approvalings?.length -
                              ((page - 1) * postPerPage + index)}
                        </td>
                        <td style={{ textAlign: 'center' }}>{approvaling.selectForm}</td>
                        <td>{formattedSendDate}</td>
                        <td>{approvaling.approval} / {approvaling.currentSigner}</td>
                        <td>{approvaling.username} {approvaling.team ? ` / ${approvaling.team}` : (approvaling.dept ? ` / ${approvaling.dept}` : '')} </td>
                        <td>
                          <button className="primary_button" onClick={() => { navigate(`/detailApproval/${approvaling.id}`, { state: { documentInfo: approvaling } }) }}>
                            결재하기
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>

              <div className="approval_main_bottom">
                <Pagination
                  activePage={page}
                  itemsCountPerPage={postPerPage}
                  totalItemsCount={approvalings?.length}
                  pageRangeDisplayed={Math.ceil(approvalings?.length / postPerPage)}
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
                <col width="24%" />
                <col width="15%" />
                <col width="15%" />
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
                  <th className="HoverTab" onClick={() => handleSort("selectForm", inProgress, setInProgress)}>
                    제목
                    {titleSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("sendDate", inProgress, setInProgress)}>
                    결재수신일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("updatedAt", inProgress, setInProgress)}>
                    결재발신일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th>진행상황</th>
                  <th className="HoverTab" onClick={() => handleSort("username", inProgress, setInProgress)}>
                    작성자/부서
                    {writerSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th>확인</th>
                </tr>
              </thead>
              <tbody className="board_container">
                {(inProgress || [])
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((inProgres, index) => {
                    const formatDate = (dateString: string) => {
                      const date = new Date(dateString);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      const hours = String(date.getHours()).padStart(2, '0');
                      const minutes = String(date.getMinutes()).padStart(2, '0');
                      return `${year}-${month}-${day} ${hours}:${minutes}`;
                    };

                    const formattedSendDate = formatDate(inProgres.sendDate);
                    const formattedUpdatedAt = formatDate(inProgres.updatedAt);

                    return (
                      <tr key={inProgres.id} className="board_content">
                        <td>
                          {inProgress?.length -
                              ((page - 1) * postPerPage + index)}
                        </td>
                        <td style={{ textAlign: 'center' }}>{inProgres.selectForm}</td>
                        <td>{formattedSendDate}</td>
                        <td>{formattedUpdatedAt}</td>
                        <td>{inProgres.approval} / {inProgres.currentSigner}</td>
                        <td>{inProgres.username} {inProgres.team ? ` / ${inProgres.team}` : (inProgres.dept ? ` / ${inProgres.dept}` : '')} </td>
                        <td>
                          <button className="primary_button" onClick={() => { navigate(`/detailDocument/${inProgres.id}`, { state: { documentInfo: inProgres } }) }}>
                            문서확인
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>

              <div className="approval_main_bottom">
                <Pagination
                  activePage={page}
                  itemsCountPerPage={postPerPage}
                  totalItemsCount={inProgress?.length}
                  pageRangeDisplayed={Math.ceil(inProgress?.length / postPerPage)}
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
                <col width="24%" />
                <col width="15%" />
                <col width="15%" />
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
                  <th className="HoverTab" onClick={() => handleSort("selectForm", rejecteds, setRejected)}>
                    제목
                    {titleSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("sendDate", rejecteds, setRejected)}>
                    결재수신일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("updatedAt", rejecteds, setRejected)}>
                    결재반려일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th>진행상황</th>
                  <th className="HoverTab" onClick={() => handleSort("username", rejecteds, setRejected)}>
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
                {(rejecteds || [])
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((rejected, index) => {
                    const formatDate = (dateString: string) => {
                      const date = new Date(dateString);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      const hours = String(date.getHours()).padStart(2, '0');
                      const minutes = String(date.getMinutes()).padStart(2, '0');
                      return `${year}-${month}-${day} ${hours}:${minutes}`;
                    };

                    const formattedSendDate = formatDate(rejected.sendDate);
                    const formattedUpdatedAt = formatDate(rejected.updatedAt);

                    return (
                      <tr key={rejected.id} className="board_content">
                        <td>
                          {rejecteds?.length -
                              ((page - 1) * postPerPage + index)}
                        </td>
                        <td style={{ textAlign: 'center' }}>{rejected.selectForm}</td>
                        <td>{formattedSendDate}</td>
                        <td>{formattedUpdatedAt}</td>
                        <td>{rejected.approval} / {rejected.currentSigner}</td>
                        <td>{rejected.username} {rejected.team ? ` / ${rejected.team}` : (rejected.dept ? ` / ${rejected.dept}` : '')} </td>
                        <td>
                          <button className="primary_button" onClick={() => { navigate(`/detailDocument/${rejected.id}`, { state: { documentInfo: rejected } }) }}>
                            문서확인
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>

              <div className="approval_main_bottom">
                <Pagination
                  activePage={page}
                  itemsCountPerPage={postPerPage}
                  totalItemsCount={rejecteds?.length}
                  pageRangeDisplayed={Math.ceil(rejecteds?.length / postPerPage)}
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
                <col width="24%" />
                <col width="15%" />
                <col width="15%" />
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
                  <th className="HoverTab" onClick={() => handleSort("selectForm", compleDocuments, setCompleDocument)}>
                    제목
                    {titleSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("sendDate", compleDocuments, setCompleDocument)}>
                    결재수신일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("updatedAt", compleDocuments, setCompleDocument)}>
                    결재완료일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th>진행상황</th>
                  <th className="HoverTab" onClick={() => handleSort("username", compleDocuments, setCompleDocument)}>
                    작성자/부서
                    {writerSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th>확인</th>
                </tr>
              </thead>
              <tbody className="board_container">
                {(compleDocuments || [])
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((compledocument, index) => {
                    const formatDate = (dateString: string) => {
                      const date = new Date(dateString);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      const hours = String(date.getHours()).padStart(2, '0');
                      const minutes = String(date.getMinutes()).padStart(2, '0');
                      return `${year}-${month}-${day} ${hours}:${minutes}`;
                    };

                    const formattedSendDate = formatDate(compledocument.sendDate);
                    const formattedUpdatedAt = formatDate(compledocument.updatedAt);

                    return (
                      <tr key={compledocument.id} className="board_content">
                        <td>
                          {compleDocuments?.length -
                              ((page - 1) * postPerPage + index)}
                        </td>
                        <td style={{ textAlign: 'center' }}>{compledocument.selectForm}</td>
                        <td>{formattedSendDate}</td>
                        <td>{formattedUpdatedAt}</td>
                        <td>{compledocument.approval} / {compledocument.currentSigner}</td>
                        <td>{compledocument.username} / {compledocument.dept}</td>
                        <td>
                          <button className="primary_button" onClick={() => { navigate(`/detailDocument/${compledocument.id}`, { state: { documentInfo: compledocument } }) }}>
                            문서확인
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>

              <div className="approval_main_bottom">
                <Pagination
                  activePage={page}
                  itemsCountPerPage={postPerPage}
                  totalItemsCount={compleDocuments?.length}
                  pageRangeDisplayed={Math.ceil(compleDocuments?.length / postPerPage)}
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
                  <th className="HoverTab" onClick={() => handleSort("selectForm", mydocuments, setMyDocument)}>
                    제목
                    {titleSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("sendDate", mydocuments, setMyDocument)}>
                    결재발신일자
                    {dateSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th className="HoverTab" onClick={() => handleSort("updatedAt", mydocuments, setMyDocument)}>
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
                  <th className="HoverTab" onClick={() => handleSort("username", mydocuments, setMyDocument)}>
                    작성자/부서
                    {writerSortOrder === 'asc' ?
                      <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
                      :
                      <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
                    }
                  </th>
                  <th>확인</th>
                </tr>
              </thead>
              <tbody className="board_container">
                {(mydocuments || [])
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((mydocument, index) => {
                    const formatDate = (dateString: string) => {
                      const date = new Date(dateString);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      const hours = String(date.getHours()).padStart(2, '0');
                      const minutes = String(date.getMinutes()).padStart(2, '0');
                      return `${year}-${month}-${day} ${hours}:${minutes}`;
                    };
              
                    const formattedSendDate = formatDate(mydocument.sendDate);
                    const formattedUpdatedAt = formatDate(mydocument.updatedAt);

                    return (
                      <tr key={mydocument.id} className="board_content">
                        <td>
                          {mydocuments?.length -
                            ((page - 1) * postPerPage + index)}
                        </td>
                        <td style={{ textAlign: 'center' }}>{mydocument.selectForm}</td>
                        <td>{formattedSendDate}</td>
                        <td>{formattedUpdatedAt}</td>
                        <td>{mydocument.approval} / {mydocument.currentSigner}</td>
                        <td>{mydocument.status}</td>
                        <td>{mydocument.username} {mydocument.team ? ` / ${mydocument.team}` : (mydocument.dept ? ` / ${mydocument.dept}` : '')} </td>
                        <td>
                          <button className="primary_button" onClick={() => { navigate(`/detailDocument/${mydocument.id}`, { state: { documentInfo: mydocument } }) }}>
                            문서확인
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>

              <div className="approval_main_bottom">
                <Pagination
                  activePage={page}
                  itemsCountPerPage={postPerPage}
                  totalItemsCount={mydocuments?.length}
                  pageRangeDisplayed={Math.ceil(mydocuments?.length / postPerPage)}
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
      // case "vacation":
      //   return (
      //     <>
      //       <table className="approval_board_list">
      //         <colgroup>
      //           <col width="6%" />
      //           <col width="14%" />
      //           <col width="15%" />
      //           <col width="15%" />
      //           <col width="10%" />
      //           <col width="10%" />
      //           <col width="20%" />
      //           <col width="10%" />
      //         </colgroup>
      //         <thead>
      //           <tr className="board_header">
      //             <th className="HoverTab" onClick={() => handleSort("id", vacations, setVacation)}>
      //               순번
      //               {idSortOrder === 'asc' ?
      //                 <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
      //                 :
      //                 <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
      //               }
      //             </th>
      //             <th className="HoverTab" onClick={() => handleSort("title", vacations, setVacation)}>
      //               제목
      //               {titleSortOrder === 'asc' ?
      //                 <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
      //                 :
      //                 <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
      //               }
      //             </th>
      //             <th className="HoverTab" onClick={() => handleSort("date", vacations, setVacation)}>
      //               결재수신일자
      //               {dateSortOrder === 'asc' ?
      //                 <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
      //                 :
      //                 <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
      //               }
      //             </th>
      //             <th className="HoverTab" onClick={() => handleSort("sadate", vacations, setVacation)}>
      //               결재발신일자
      //               {dateSortOrder === 'asc' ?
      //                 <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
      //                 :
      //                 <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
      //               }
      //             </th>
      //             <th>진행상황</th>
      //             <th className="HoverTab" onClick={() => handleSort("state", vacations, setVacation)}>
      //               처리상황
      //               {stateSortOrder === 'asc' ?
      //                 <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
      //                 :
      //                 <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
      //               }
      //             </th>
      //             <th className="HoverTab" onClick={() => handleSort("writer", vacations, setVacation)}>
      //               작성자/부서
      //               {writerSortOrder === 'asc' ?
      //                 <img src={Asc_Icon} alt="Asc_Icon" className="sort_icon" />
      //                 :
      //                 <img src={Desc_Icon} alt="Desc_Icon" className="sort_icon" />
      //               }
      //             </th>
      //             <th>결재</th>
      //           </tr>
      //         </thead>
      //         <tbody className="board_container">
      //           {vacations
      //             .slice((page - 1) * postPerPage, page * postPerPage)
      //             .map((vacation) => (
      //               <tr key={vacation.id} className="board_content">
      //                 <td>{vacation.id}</td>
      //                 <td style={{ textAlign: 'center' }}>{vacation.title}</td>
      //                 <td>{vacation.date}</td>
      //                 <td>{vacation.date}</td>
      //                 <td>{vacation.progress} / {vacation.maxprogress}</td>
      //                 <td>{vacation.state}</td>
      //                 <td>{vacation.writer}</td>
      //                 <td><button className="primary_button" onClick={() => { navigate('/detailDocument') }}>문서확인</button></td>
      //               </tr>
      //             ))
      //           }
      //         </tbody>
      //         <div className="approval_main_bottom">
      //           <Pagination
      //             activePage={page}
      //             itemsCountPerPage={postPerPage}
      //             totalItemsCount={mydocuments.length}
      //             pageRangeDisplayed={Math.ceil(mydocuments.length / postPerPage)}
      //             prevPageText={<LeftIcon />}
      //             nextPageText={<RightIcon />}
      //             firstPageText={<FirstLeftIcon />}
      //             lastPageText={<LastRightIcon />}
      //             onChange={handlePageChange}
      //           />
      //         </div>
      //       </table>
      //     </>
      //   );
      default:
        return null;
    }
  };
  
  return (
    <div className="content">
      <div className="approval_top">
        <div className="approval_top_first">
          <div className={`${selectedTab === "myDocuments" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("myDocuments")}>
            <span>내문서</span> <span className="document_count">{mydocuments?.length}</span>
          </div>
          <div className={`${selectedTab === "approval" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("approval")}>
            <span>결재 할 문서</span> <span className="document_count">{approvalings?.length}</span>
          </div>
          <div className={`${selectedTab === "inProgress" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("inProgress")}>
            <span>결재 진행 중 문서</span> <span className="document_count">{inProgress?.length}</span>
          </div>
          <div className={`${selectedTab === "rejected" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("rejected")}>
            <span>반려 문서</span> <span className="document_count">{rejecteds?.length}</span>
          </div>
          <div className={`${selectedTab === "completed" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("completed")}>
            <span>결재 완료 문서</span> <span className="document_count">{compleDocuments?.length}</span>
          </div>
          {/* {user.username === '우현지' ? (
            <div className={`${selectedTab === "vacation" ? "approval_tab_clicked" : "approval_tab"}`} onClick={() => handleTabClick("vacation")}>
              <span>휴가문서관리</span> <span className="document_count">{vacations.length}</span>
            </div>
          )
            :
            <></>
          } */}
        </div>
      </div>

      <div className="approval_btm">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Approval;