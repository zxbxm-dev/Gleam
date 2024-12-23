import { useState, useEffect } from "react";
import { ReactComponent as RightIcon } from "../../assets/images/Common/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../assets/images/Common/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../assets/images/Common/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../assets/images/Common/FirstLeftIcon.svg";
import {
  Asc_Icon,
  Desc_Icon,
  SelectDownArrow,
  SelectArrow,
  report_Down,
  report_Up,
  new_Icon,
} from "../../assets/images/index";
import { useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atoms";
import useMediaQuery from "../../hooks/MediaQuery";
import { useQuery } from "react-query";
import {
  getMyReports,
  getDocumentsToApprove,
  getDocumentsInProgress,
  getRejectedDocuments,
  getApprovedDocuments,
  getRecheckDocuments,
} from "../../services/approval/ApprovalServices";
import ReportStatus from "../../components/ReportPayment/ReportStatus";

const Approval = () => {
  let navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [page, setPage] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState<string>(
    sessionStorage.getItem("selectedTab") || "myDocuments"
  );
  const [postPerPage, setPostPerPage] = useState<number>(10);
  const [mydocuments, setMyDocument] = useState<any[]>([]); // 내 문서
  const [originalMyDocuments, setOriginalMyDocuments] = useState<any[]>([]);
  const [approvalings, setApprovaling] = useState<any[]>([]); // 결재할 문서
  const [originalApprovaling, setOriginalApprovaling] = useState<any[]>([]);
  const [inProgress, setInProgress] = useState<any[]>([]); // 결재 진행중 문서
  const [originalInProgress, setOriginalInProgress] = useState<any[]>([]);
  const [rejecteds, setRejected] = useState<any[]>([]); // 만료된 문서
  const [originalRejected, setOriginalRejected] = useState<any[]>([]);
  const [compleDocuments, setCompleDocument] = useState<any[]>([]); // 완료된 문서
  const [referenceDocuments, setReferenceDocuments] = useState<any[]>([]); // 참조된 문서
  const [originalCompleDocument, setOriginalCompleDocument] = useState<any[]>(
    []
  );
  const [recheckDocument, setRecheckDocument] = useState<any[]>([]); // 재확인 문서
  const [idSortOrder, setIdSortOrder] = useState<"asc" | "desc">("asc");
  const [titleSortOrder, setTitleSortOrder] = useState<"asc" | "desc">("asc");
  const [dateSortOrder, setDateSortOrder] = useState<"asc" | "desc">("asc");
  const [stateSortOrder, setStateSortOrder] = useState<"asc" | "desc">("asc");
  const [writerSortOrder, setWriterSortOrder] = useState<"asc" | "desc">("asc");
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState("전체 문서");
  const [reportStatusOpen, setReportStatusOpen] = useState(false);
  const [reportButtonValue, setReportButtonValue] = useState<String | null>(
    "myDocuments"
  );
  const isTabletOrAbove = useMediaQuery("(max-width: 1024px)"); //브라우저 크기 측정

  const SelectOpen = () => {
    setSelectOpen(!selectOpen);
  };

  const SelectOptions = (report: string) => {
    if (selectedTab === "myDocuments") {
      // 내문서
      if (report === "전체 문서") {
        setMyDocument(originalMyDocuments);
      } else {
        const filteredDocuments = originalMyDocuments.filter(
          (doc) => doc.selectForm === report
        );
        setMyDocument(filteredDocuments);
      }
    } else if (selectedTab === "approval") {
      // 결재할문서
      if (report === "전체 문서") {
        setApprovaling(originalApprovaling);
      } else {
        const filteredDocuments = originalApprovaling.filter(
          (doc) => doc.selectForm === report
        );
        setApprovaling(filteredDocuments);
      }
    } else if (selectedTab === "inProgress") {
      // 결재 진행 중
      if (report === "전체 문서") {
        setInProgress(originalInProgress);
      } else {
        const filteredDocuments = originalInProgress.filter(
          (doc) => doc.selectForm === report
        );
        setInProgress(filteredDocuments);
      }
    } else if (selectedTab === "rejected") {
      // 만료
      if (report === "전체 문서") {
        setRejected(originalRejected);
      } else {
        const filteredDocuments = originalRejected.filter(
          (doc) => doc.selectForm === report
        );
        setRejected(filteredDocuments);
      }
    } else if (selectedTab === "completed") {
      // 결재완료
      if (report === "전체 문서") {
        setCompleDocument(originalCompleDocument);
      } else {
        const filteredDocuments = originalCompleDocument.filter(
          (doc) => doc.selectForm === report
        );
        setCompleDocument(filteredDocuments);
      }
    } else if (selectedTab === "reference") {
      // 반려
      if (report === "전체 문서") {
        setReferenceDocuments(referenceDocuments);
      } else {
        const filteredDocuments = referenceDocuments.filter(
          (doc) => doc.selectForm === report
        );
        setReferenceDocuments(filteredDocuments);
      }
    }

    setSelectedReport(report);
    setSelectOpen(false);
  };

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
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  // 내 문서 목록 불러오기
  const fetchMyReports = async () => {
    const params = {
      userID: user.userID,
      username: user.username,
    };

    try {
      const response = await getMyReports(params);

      return (response.data = response.data.filter(
        (item: any) => item.status !== "참조"
      ));
    } catch (error) {
      console.log("Failed to fetch data");
    }
  };

  useQuery("myReports", fetchMyReports, {
    onSuccess: (data) => {
      setMyDocument(data);
      setOriginalMyDocuments(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const getMyReference = async () => {
    const params = {
      userID: user.userID,
      username: user.username,
    };

    try {
      const response = await getMyReports(params);

      setReferenceDocuments(
        (response.data = response.data.filter(
          (item: any) => item.status === "참조"
        ))
      );

      return (response.data = response.data.filter(
        (item: any) => item.status !== "참조"
      ));
    } catch (error) {
      console.log("Failed to fetch data");
    }
  };

  useEffect(() => {
    getMyReference();
  }, []);

  // 결재할 문서 목록 불러오기
  const fetchDocumentsToApprove = async () => {
    const params = {
      username: user.username,
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
    onSuccess: (data) => {
      setApprovaling(data);
      setOriginalApprovaling(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // 결재 진행 중인 문서 목록 불러오기
  const fetchDocumentsInProgress = async () => {
    const params = {
      username: user.username,
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
    onSuccess: (data) => {
      setInProgress(data);
      setOriginalInProgress(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // 반려된 문서 목록 불러오기
  const fetchRejectedDocuments = async () => {
    const params = {
      username: user.username,
    };

    try {
      const response = await getRejectedDocuments(params);
      return response.data;
    } catch (error) {
      // throw new Error("Failed to fetch data");
      console.log("Failed to fetch data");
    }
  };

  useEffect(() => {
    getMyReference();
  }, []);

  useQuery("RejectedDocuments", fetchRejectedDocuments, {
    onSuccess: (data) => {
      setRejected(data);
      setOriginalRejected(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // 결재 완료된 문서 목록 불러오기
  const fetchApprovedDocuments = async () => {
    const params = {
      username: user.username,
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
    onSuccess: (data) => {
      setCompleDocument(data);
      setOriginalCompleDocument(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSort = (
    sortKey: string,
    targetState: any[],
    setTargetState: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    // 정렬 상태 변수를 저장하는 Map
    const sortOrders: Map<
      string,
      ["asc" | "desc", React.Dispatch<React.SetStateAction<"asc" | "desc">>]
    > = new Map([
      ["id", [idSortOrder, setIdSortOrder]],
      ["selectForm", [titleSortOrder, setTitleSortOrder]],
      ["sendDate", [dateSortOrder, setDateSortOrder]],
      ["deleteDate", [dateSortOrder, setDateSortOrder]],
      ["updatedAt", [dateSortOrder, setDateSortOrder]],
      ["state", [stateSortOrder, setStateSortOrder]],
      ["username", [writerSortOrder, setWriterSortOrder]],
    ]);
    const [currentSortOrder, setCurrentSortOrder] = sortOrders.get(sortKey) || [
      "asc",
      setIdSortOrder,
    ];

    const sortedDocuments = [...targetState].sort((a, b) => {
      console.log(sortKey);
      if (currentSortOrder === "asc") {
        console.log(a[sortKey], b[sortKey]);
        return a[sortKey] > b[sortKey] ? 1 : -1;
      } else {
        return a[sortKey] < b[sortKey] ? 1 : -1;
      }
    });

    console.log(sortedDocuments);
    setCurrentSortOrder(currentSortOrder === "asc" ? "desc" : "asc");
    setTargetState(sortedDocuments);
  };

  const reportButtonClick = (item: any) => {
    setReportButtonValue(item);
  };

  useEffect(() => {
    sessionStorage.setItem("selectedTab", selectedTab);
  }, [selectedTab]);

  const renderTabContent = () => {
    switch (selectedTab) {
      case "main":
        return <div></div>;
      case "approval":
        return (
          <>
            {isTabletOrAbove ? (
              //APP
              <div className="Mobile_approval_board_list">
                <div className="board_container">
                  {(approvalings || [])
                    .slice((page - 1) * postPerPage, page * postPerPage)
                    .map((approvaling, index) => {
                      const formatDate = (dateString: string) => {
                        const date = new Date(dateString);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const day = String(date.getDate()).padStart(2, "0");
                        const hours = String(date.getHours()).padStart(2, "0");
                        const minutes = String(date.getMinutes()).padStart(
                          2,
                          "0"
                        );
                        return `${year}-${month}-${day} ${hours}:${minutes}`;
                      };

                      const formattedSendDate = formatDate(
                        approvaling.sendDate
                      );

                      return (
                        <div key={approvaling.id} className="board_content">
                          <div className="App_Report">
                            <div
                              className="App_ReportName"
                              style={{ textAlign: "center" }}
                            >
                              {approvaling.selectForm}
                            </div>
                            <div>{formattedSendDate.split(" ")[0]}</div>
                            <div>
                              {approvaling.approval} /{" "}
                              {approvaling.currentSigner}
                            </div>
                            <div>
                              {approvaling.username}{" "}
                              {approvaling.team
                                ? ` / ${approvaling.team}`
                                : approvaling.dept
                                ? ` / ${approvaling.dept}`
                                : ""}{" "}
                            </div>
                          </div>

                          <div>
                            <button
                              className="primary_button"
                              onClick={() => {
                                navigate(`/detailApproval/${approvaling.id}`, {
                                  state: { documentInfo: approvaling },
                                });
                              }}
                            >
                              결재하기
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="approval_main_bottom">
                  <Pagination
                    activePage={page}
                    itemsCountPerPage={postPerPage}
                    totalItemsCount={approvalings?.length}
                    pageRangeDisplayed={Math.ceil(
                      approvalings?.length / postPerPage
                    )}
                    prevPageText={<LeftIcon />}
                    nextPageText={<RightIcon />}
                    firstPageText={<FirstLeftIcon />}
                    lastPageText={<LastRightIcon />}
                    onChange={handlePageChange}
                  />
                </div>
              </div>
            ) : (
              //WEB
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
                    <th
                      className="HoverTab"
                      onClick={() =>
                        handleSort("id", approvalings, setApprovaling)
                      }
                    >
                      순번
                      {idSortOrder === "asc" ? (
                        <img
                          src={Asc_Icon}
                          alt="Asc_Icon"
                          className="sort_icon"
                        />
                      ) : (
                        <img
                          src={Desc_Icon}
                          alt="Desc_Icon"
                          className="sort_icon"
                        />
                      )}
                    </th>
                    <th
                      className="HoverTab"
                      onClick={() =>
                        handleSort("selectForm", approvalings, setApprovaling)
                      }
                    >
                      제목
                      {titleSortOrder === "asc" ? (
                        <img
                          src={Asc_Icon}
                          alt="Asc_Icon"
                          className="sort_icon"
                        />
                      ) : (
                        <img
                          src={Desc_Icon}
                          alt="Desc_Icon"
                          className="sort_icon"
                        />
                      )}
                    </th>
                    <th
                      className="HoverTab"
                      onClick={() =>
                        handleSort("sendDate", approvalings, setApprovaling)
                      }
                    >
                      결재수신일자
                      {dateSortOrder === "asc" ? (
                        <img
                          src={Asc_Icon}
                          alt="Asc_Icon"
                          className="sort_icon"
                        />
                      ) : (
                        <img
                          src={Desc_Icon}
                          alt="Desc_Icon"
                          className="sort_icon"
                        />
                      )}
                    </th>
                    <th>진행상황</th>
                    <th
                      className="HoverTab"
                      onClick={() =>
                        handleSort("username", approvalings, setApprovaling)
                      }
                    >
                      작성자/부서
                      {writerSortOrder === "asc" ? (
                        <img
                          src={Asc_Icon}
                          alt="Asc_Icon"
                          className="sort_icon"
                        />
                      ) : (
                        <img
                          src={Desc_Icon}
                          alt="Desc_Icon"
                          className="sort_icon"
                        />
                      )}
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
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const day = String(date.getDate()).padStart(2, "0");
                        const hours = String(date.getHours()).padStart(2, "0");
                        const minutes = String(date.getMinutes()).padStart(
                          2,
                          "0"
                        );
                        return `${year}-${month}-${day} ${hours}:${minutes}`;
                      };

                      const formattedSendDate = formatDate(
                        approvaling.sendDate
                      );

                      return (
                        <tr key={approvaling.id} className="board_content">
                          <td>
                            {idSortOrder === "asc"
                              ? approvalings?.length -
                                ((page - 1) * postPerPage + index)
                              : (page - 1) * postPerPage + index + 1}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {approvaling.selectForm}
                          </td>
                          <td>{formattedSendDate}</td>
                          <td>
                            {approvaling.approval} / {approvaling.currentSigner}
                          </td>
                          <td>
                            {approvaling.username}{" "}
                            {approvaling.team
                              ? ` / ${approvaling.team}`
                              : approvaling.dept
                              ? ` / ${approvaling.dept}`
                              : ""}{" "}
                          </td>
                          <td>
                            <button
                              className="primary_button"
                              onClick={() => {
                                navigate(`/detailApproval/${approvaling.id}`, {
                                  state: { documentInfo: approvaling },
                                });
                              }}
                            >
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
                    pageRangeDisplayed={Math.ceil(
                      approvalings?.length / postPerPage
                    )}
                    prevPageText={<LeftIcon />}
                    nextPageText={<RightIcon />}
                    firstPageText={<FirstLeftIcon />}
                    lastPageText={<LastRightIcon />}
                    onChange={handlePageChange}
                  />
                </div>
              </table>
            )}
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
                  <th
                    className="HoverTab"
                    onClick={() => handleSort("id", inProgress, setInProgress)}
                  >
                    순번
                    {idSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("selectForm", inProgress, setInProgress)
                    }
                  >
                    제목
                    {titleSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("sendDate", inProgress, setInProgress)
                    }
                  >
                    결재수신일자
                    {dateSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("updatedAt", inProgress, setInProgress)
                    }
                  >
                    결재발신일자
                    {dateSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th>진행상황</th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("username", inProgress, setInProgress)
                    }
                  >
                    작성자/부서
                    {writerSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
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
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const day = String(date.getDate()).padStart(2, "0");
                      const hours = String(date.getHours()).padStart(2, "0");
                      const minutes = String(date.getMinutes()).padStart(
                        2,
                        "0"
                      );
                      return `${year}-${month}-${day} ${hours}:${minutes}`;
                    };

                    const formattedSendDate = formatDate(inProgres.sendDate);
                    const formattedUpdatedAt = formatDate(inProgres.updatedAt);

                    return (
                      <tr key={inProgres.id} className="board_content">
                        <td>
                          {idSortOrder === "asc"
                            ? inProgress?.length -
                              ((page - 1) * postPerPage + index)
                            : (page - 1) * postPerPage + index + 1}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {inProgres.selectForm}
                        </td>
                        <td>{formattedSendDate}</td>
                        <td>{formattedUpdatedAt}</td>
                        <td>
                          {inProgres.approval} / {inProgres.currentSigner}
                        </td>
                        <td>
                          {inProgres.username}{" "}
                          {inProgres.team
                            ? ` / ${inProgres.team}`
                            : inProgres.dept
                            ? ` / ${inProgres.dept}`
                            : ""}{" "}
                        </td>
                        <td>
                          <button
                            className="primary_button"
                            onClick={() => {
                              navigate(`/detailDocument/${inProgres.id}`, {
                                state: { documentInfo: inProgres },
                              });
                            }}
                          >
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
                  pageRangeDisplayed={Math.ceil(
                    inProgress?.length / postPerPage
                  )}
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
                {/* <col width="10%" /> */}
                <col width="20%" />
                <col width="20%" />
                {/* <col width="10%" /> */}
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th
                    className="HoverTab"
                    onClick={() => handleSort("id", rejecteds, setRejected)}
                  >
                    순번
                    {idSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("selectForm", rejecteds, setRejected)
                    }
                  >
                    제목
                    {titleSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("sendDate", rejecteds, setRejected)
                    }
                  >
                    결재수신일자
                    {dateSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() => handleSort("state", rejecteds, setRejected)}
                  >
                    처리상황
                    {stateSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  {/* <th className="HoverTab">삭제예정일</th> */}
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("username", rejecteds, setRejected)
                    }
                  >
                    작성자/부서
                    {writerSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th>확인</th>
                </tr>
              </thead>
              <tbody className="board_container">
                {(rejecteds || [])
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((rejected, index) => {
                    const formatDate = (dateString: string) => {
                      const date = new Date(dateString);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const day = String(date.getDate()).padStart(2, "0");
                      const hours = String(date.getHours()).padStart(2, "0");
                      const minutes = String(date.getMinutes()).padStart(
                        2,
                        "0"
                      );
                      return `${year}-${month}-${day} ${hours}:${minutes}`;
                    };

                    const formattedSendDate = formatDate(rejected.sendDate);
                    const date = new Date(formattedSendDate.replace(" ", "T"));
                    date.setDate(date.getDate() + 30);
                    const newDate = date.toISOString().split("T")[0];
                    const formattedUpdatedAt = formatDate(rejected.updatedAt);

                    return (
                      <tr key={rejected.id} className="board_content">
                        <td>
                          {idSortOrder === "asc"
                            ? rejecteds?.length -
                              ((page - 1) * postPerPage + index)
                            : (page - 1) * postPerPage + index + 1}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {rejected.selectForm}
                        </td>
                        <td>{formattedSendDate}</td>
                        <td>반려됨</td>
                        {/* <td>{newDate}</td> */}
                        <td>
                          {rejected.username}{" "}
                          {rejected.team
                            ? ` / ${rejected.team}`
                            : rejected.dept
                            ? ` / ${rejected.dept}`
                            : ""}{" "}
                        </td>
                        <td>
                          <button
                            className="primary_button"
                            onClick={() => {
                              navigate(`/detailDocument/${rejected.id}`, {
                                state: { documentInfo: rejected },
                              });
                            }}
                          >
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
                  pageRangeDisplayed={Math.ceil(
                    rejecteds?.length / postPerPage
                  )}
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
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("id", compleDocuments, setCompleDocument)
                    }
                  >
                    순번
                    {idSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort(
                        "selectForm",
                        compleDocuments,
                        setCompleDocument
                      )
                    }
                  >
                    제목
                    {titleSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("sendDate", compleDocuments, setCompleDocument)
                    }
                  >
                    결재수신일자
                    {dateSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort(
                        "updatedAt",
                        compleDocuments,
                        setCompleDocument
                      )
                    }
                  >
                    결재완료일자
                    {dateSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th>진행상황</th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("username", compleDocuments, setCompleDocument)
                    }
                  >
                    작성자/부서
                    {writerSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
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
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const day = String(date.getDate()).padStart(2, "0");
                      const hours = String(date.getHours()).padStart(2, "0");
                      const minutes = String(date.getMinutes()).padStart(
                        2,
                        "0"
                      );
                      return `${year}-${month}-${day} ${hours}:${minutes}`;
                    };

                    const formattedSendDate = formatDate(
                      compledocument.sendDate
                    );
                    const formattedUpdatedAt = formatDate(
                      compledocument.updatedAt
                    );

                    return (
                      <tr key={compledocument.id} className="board_content">
                        <td>
                          {idSortOrder === "asc"
                            ? compleDocuments?.length -
                              ((page - 1) * postPerPage + index)
                            : (page - 1) * postPerPage + index + 1}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {compledocument.selectForm}
                        </td>
                        <td>{formattedSendDate}</td>
                        <td>{formattedUpdatedAt}</td>
                        <td>
                          {compledocument.approval} /{" "}
                          {compledocument.currentSigner}
                        </td>
                        <td>
                          {compledocument.username}{" "}
                          {compledocument.team
                            ? ` / ${compledocument.team}`
                            : compledocument.dept
                            ? ` / ${compledocument.dept}`
                            : ""}{" "}
                        </td>
                        <td>
                          <button
                            className="primary_button"
                            onClick={() => {
                              navigate(`/detailDocument/${compledocument.id}`, {
                                state: { documentInfo: compledocument },
                              });
                            }}
                          >
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
                  pageRangeDisplayed={Math.ceil(
                    compleDocuments?.length / postPerPage
                  )}
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
                  <th
                    className="HoverTab"
                    onClick={() => handleSort("id", mydocuments, setMyDocument)}
                  >
                    순번
                    {idSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("selectForm", mydocuments, setMyDocument)
                    }
                  >
                    제목
                    {titleSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("sendDate", mydocuments, setMyDocument)
                    }
                  >
                    결재발신일자
                    {dateSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("updatedAt", mydocuments, setMyDocument)
                    }
                  >
                    처리일자
                    {dateSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th>진행상황</th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("state", mydocuments, setMyDocument)
                    }
                  >
                    처리상황
                    {stateSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("username", mydocuments, setMyDocument)
                    }
                  >
                    작성자/부서
                    {writerSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
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
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const day = String(date.getDate()).padStart(2, "0");
                      const hours = String(date.getHours()).padStart(2, "0");
                      const minutes = String(date.getMinutes()).padStart(
                        2,
                        "0"
                      );
                      return `${year}-${month}-${day} ${hours}:${minutes}`;
                    };

                    const formattedSendDate = formatDate(mydocument.sendDate);
                    const formattedUpdatedAt = formatDate(mydocument.updatedAt);

                    return (
                      <tr key={mydocument.id} className="board_content">
                        <td>
                          {idSortOrder === "asc"
                            ? mydocuments?.length -
                              ((page - 1) * postPerPage + index)
                            : (page - 1) * postPerPage + index + 1}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {mydocument.selectForm}
                        </td>
                        <td>{formattedSendDate}</td>
                        <td>{formattedUpdatedAt}</td>
                        <td>
                          {mydocument.approval} / {mydocument.currentSigner}
                        </td>
                        <td>{mydocument.status}</td>
                        <td>
                          {mydocument.username}{" "}
                          {mydocument.team
                            ? ` / ${mydocument.team}`
                            : mydocument.dept
                            ? ` / ${mydocument.dept}`
                            : ""}{" "}
                        </td>
                        <td>
                          <button
                            className="primary_button"
                            onClick={() => {
                              navigate(`/detailDocument/${mydocument.id}`, {
                                state: { documentInfo: mydocument },
                              });
                            }}
                          >
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
                  pageRangeDisplayed={Math.ceil(
                    mydocuments?.length / postPerPage
                  )}
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
      case "recheckDocument":
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
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("id", recheckDocument, setRecheckDocument)
                    }
                  >
                    순번
                    {idSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort(
                        "selectForm",
                        recheckDocument,
                        setRecheckDocument
                      )
                    }
                  >
                    제목
                    {titleSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort(
                        "sendDate",
                        recheckDocument,
                        setRecheckDocument
                      )
                    }
                  >
                    결재수신일자
                    {dateSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>

                  <th>진행상황</th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort("state", recheckDocument, setRecheckDocument)
                    }
                  >
                    처리상황
                    {dateSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort(
                        "username",
                        recheckDocument,
                        setRecheckDocument
                      )
                    }
                  >
                    작성자/부서
                    {writerSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th>확인</th>
                </tr>
              </thead>
              <tbody className="board_container">
                {(recheckDocument || [])
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((recheckDocument, index) => {
                    const formatDate = (dateString: string) => {
                      const date = new Date(dateString);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const day = String(date.getDate()).padStart(2, "0");
                      const hours = String(date.getHours()).padStart(2, "0");
                      const minutes = String(date.getMinutes()).padStart(
                        2,
                        "0"
                      );
                      return `${year}-${month}-${day} ${hours}:${minutes}`;
                    };

                    const formattedSendDate = formatDate(
                      recheckDocument.sendDate
                    );
                    const formattedUpdatedAt = formatDate(
                      recheckDocument.updatedAt
                    );

                    return (
                      <tr key={recheckDocument.id} className="board_content">
                        <td>
                          {idSortOrder === "asc"
                            ? recheckDocument?.length -
                              ((page - 1) * postPerPage + index)
                            : (page - 1) * postPerPage + index + 1}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {recheckDocument.selectForm}
                        </td>
                        <td>{formattedSendDate}</td>
                        <td>{formattedUpdatedAt}</td>
                        <td>
                          {recheckDocument.approval} /{" "}
                          {recheckDocument.currentSigner}
                        </td>
                        <td>
                          {recheckDocument.username}{" "}
                          {recheckDocument.team
                            ? ` / ${recheckDocument.team}`
                            : recheckDocument.dept
                            ? ` / ${recheckDocument.dept}`
                            : ""}{" "}
                        </td>
                        <td>
                          <button
                            className="primary_button"
                            onClick={() => {
                              navigate(
                                `/detailDocument/${recheckDocument.id}`,
                                {
                                  state: { documentInfo: recheckDocument },
                                }
                              );
                            }}
                          >
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
                  pageRangeDisplayed={Math.ceil(
                    rejecteds?.length / postPerPage
                  )}
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
      case "reference":
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
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort(
                        "id",
                        referenceDocuments,
                        setReferenceDocuments
                      )
                    }
                  >
                    순번
                    {idSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort(
                        "selectForm",
                        referenceDocuments,
                        setReferenceDocuments
                      )
                    }
                  >
                    제목
                    {titleSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort(
                        "sendDate",
                        referenceDocuments,
                        setReferenceDocuments
                      )
                    }
                  >
                    결재발신일자
                    {dateSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort(
                        "updatedAt",
                        referenceDocuments,
                        setReferenceDocuments
                      )
                    }
                  >
                    처리일자
                    {dateSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th>진행상황</th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort(
                        "state",
                        referenceDocuments,
                        setReferenceDocuments
                      )
                    }
                  >
                    처리상황
                    {stateSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th
                    className="HoverTab"
                    onClick={() =>
                      handleSort(
                        "username",
                        referenceDocuments,
                        setReferenceDocuments
                      )
                    }
                  >
                    작성자/부서
                    {writerSortOrder === "asc" ? (
                      <img
                        src={Asc_Icon}
                        alt="Asc_Icon"
                        className="sort_icon"
                      />
                    ) : (
                      <img
                        src={Desc_Icon}
                        alt="Desc_Icon"
                        className="sort_icon"
                      />
                    )}
                  </th>
                  <th>확인</th>
                </tr>
              </thead>
              <tbody className="board_container">
                {(referenceDocuments || [])
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((referencedocument, index) => {
                    const formatDate = (dateString: string) => {
                      const date = new Date(dateString);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const day = String(date.getDate()).padStart(2, "0");
                      const hours = String(date.getHours()).padStart(2, "0");
                      const minutes = String(date.getMinutes()).padStart(
                        2,
                        "0"
                      );
                      return `${year}-${month}-${day} ${hours}:${minutes}`;
                    };

                    const formattedSendDate = formatDate(
                      referencedocument.sendDate
                    );
                    const formattedUpdatedAt = formatDate(
                      referencedocument.updatedAt
                    );

                    return (
                      <tr key={referencedocument.id} className="board_content">
                        <td>
                          {idSortOrder === "asc"
                            ? referenceDocuments.length -
                              ((page - 1) * postPerPage + index)
                            : (page - 1) * postPerPage + index + 1}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {referencedocument.selectForm}
                        </td>
                        <td>{formattedSendDate}</td>
                        <td>{formattedUpdatedAt}</td>
                        <td>
                          {referencedocument.approval} /{" "}
                          {referencedocument.currentSigner}
                        </td>
                        <td>{referencedocument.status}</td>
                        <td>
                          {referencedocument.username}{" "}
                          {referencedocument.team
                            ? ` / ${referencedocument.team}`
                            : referencedocument.dept
                            ? ` / ${referencedocument.dept}`
                            : ""}{" "}
                        </td>
                        <td>
                          <button
                            className="primary_button"
                            onClick={() => {
                              navigate(
                                `/detailDocument/${referencedocument.id}`,
                                {
                                  state: { documentInfo: referencedocument },
                                }
                              );
                            }}
                          >
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
                  totalItemsCount={referenceDocuments?.length}
                  pageRangeDisplayed={Math.ceil(
                    referenceDocuments?.length / postPerPage
                  )}
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

  useEffect(() => {
    if (
      selectedTab === "approval" ||
      selectedTab === "inProgress" ||
      selectedTab === "completed" ||
      selectedTab === "reference"
    ) {
      setReportStatusOpen(true);
    } else {
      setReportStatusOpen(false);
    }
  }, [selectedTab]);

  return (
    <div className="content">
      <div
        className={
          reportStatusOpen
            ? "approval_content_box"
            : "approval_content_box_open"
        }
      >
        <div className="approval_top">
          <div className="report_button_contain">
            <button
              className={
                reportStatusOpen
                  ? "report_button_box_active"
                  : "report_button_box"
              }
              onClick={() => {
                reportButtonClick("reportStatus");
                setSelectedTab(selectedTab);
                setReportStatusOpen(!reportStatusOpen);
              }}
            >
              <div className="report_toggle_box">
                <div>진행상태</div>
                <img
                  src={reportStatusOpen ? report_Up : report_Down}
                  alt="SelectArrow"
                  className="SelectArrow"
                />
              </div>
            </button>
            {/* 재확인 문서 임시 안보임 */}
            {/* <button
              className={
                selectedTab === "recheckDocument"
                  ? "report_button_box_active2"
                  : "report_button_box2"
              }
              onClick={() => {
                reportButtonClick("recheckDocument");
                setSelectedTab("recheckDocument");
                setReportStatusOpen(false);
              }}
            >
              재확인 문서
              <img src={new_Icon} alt="new_Icon" className="new_Icon" />
              <p>{recheckDocument.length}</p>
            </button> */}
            <button
              className={
                selectedTab === "myDocuments"
                  ? "report_button_box_active"
                  : "report_button_box"
              }
              onClick={() => {
                reportButtonClick("myDocuments");
                setSelectedTab("myDocuments");
                setReportStatusOpen(false);
              }}
            >
              내 문서
              <p>{mydocuments?.length}</p>
            </button>
            <button
              className={
                selectedTab === "rejected"
                  ? "report_button_box_active"
                  : "report_button_box"
              }
              onClick={() => {
                reportButtonClick("doneDocument");
                setSelectedTab("rejected");
                setReportStatusOpen(false);
              }}
            >
              만료 문서
              <p>{rejecteds?.length}</p>
            </button>
          </div>

          {reportStatusOpen ? (
            <div className="child_Box">
              {reportStatusOpen ? (
                <ReportStatus
                  selectedTab={selectedTab}
                  mydocuments={mydocuments}
                  approvalings={approvalings}
                  inProgress={inProgress}
                  rejecteds={rejecteds}
                  compleDocuments={compleDocuments}
                  setSelectedReport={setSelectedReport}
                  setSelectedTab={setSelectedTab}
                  SelectOptions={SelectOptions}
                  referenceDocuments={referenceDocuments}
                />
              ) : (
                <div className="approval_top_first"></div>
              )}
              <div className="approval_top_selector">
                <div className="approval_top_selector_title">양식 선택</div>
                <div className="approval_top_selector_box" onClick={SelectOpen}>
                  <img
                    src={selectOpen ? SelectDownArrow : SelectArrow}
                    alt="SelectArrow"
                    className="SelectArrow"
                  />
                  <span className="selector_title">{selectedReport}</span>
                </div>
                {selectOpen ? (
                  <div className="Select_report_Content">
                    <div
                      className="Option"
                      onClick={() => SelectOptions("전체 문서")}
                    >
                      <span className="Option_title">전체 문서</span>
                    </div>
                    <div>공동</div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("주간업무일지")}
                    >
                      <span className="Option_title">주간업무일지</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("휴가신청서")}
                    >
                      <span className="Option_title">휴가신청서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("지출품의서")}
                    >
                      <span className="Option_title">지출품의서</span>
                    </div>

                    <div>프로젝트</div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("기획서")}
                    >
                      <span className="Option_title">기획서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("중간보고서")}
                    >
                      <span className="Option_title">중간보고서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("최종보고서")}
                    >
                      <span className="Option_title">최종보고서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("TF팀 기획서")}
                    >
                      <span className="Option_title">TF팀 기획서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("TF팀 프로젝트 계획서")}
                    >
                      <span className="Option_title">TF팀 프로젝트 계획서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("TF팀 중간보고서")}
                    >
                      <span className="Option_title">TF팀 중간보고서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("TF팀 프로젝트 결과 보고서")}
                    >
                      <span className="Option_title">
                        TF팀 프로젝트 결과 보고서
                      </span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("박람회 보고서")}
                    >
                      <span className="Option_title">박람회 보고서</span>
                    </div>

                    <div>인사</div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("휴직원")}
                    >
                      <span className="Option_title">휴직원</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("복직원")}
                    >
                      <span className="Option_title">복직원</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("시말서")}
                    >
                      <span className="Option_title">시말서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("경위서")}
                    >
                      <span className="Option_title">경위서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("진급추천서")}
                    >
                      <span className="Option_title">진급추천서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("퇴직금 중간정산 신청서")}
                    >
                      <span className="Option_title">
                        퇴직금 중간정산 신청서
                      </span>
                    </div>

                    <div>총무</div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("출장 신청서")}
                    >
                      <span className="Option_title">출장 신청서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("출장 보고서")}
                    >
                      <span className="Option_title">출장 보고서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("출장비내역서")}
                    >
                      <span className="Option_title">출장비내역서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("자기개발비 신청서")}
                    >
                      <span className="Option_title">자기개발비 신청서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("법인카드 신청서")}
                    >
                      <span className="Option_title">법인카드 신청서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("지출내역서")}
                    >
                      <span className="Option_title">지출내역서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("예산신청서")}
                    >
                      <span className="Option_title">예산신청서</span>
                    </div>

                    <div>기타</div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("워크숍 신청서")}
                    >
                      <span className="Option_title">워크숍 신청서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("야유회 보고서")}
                    >
                      <span className="Option_title">야유회 보고서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("프로젝트 회의 보고서")}
                    >
                      <span className="Option_title">프로젝트 회의 보고서</span>
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          ) : (
            <>
              {reportStatusOpen && (
                <ReportStatus
                  selectedTab={selectedTab}
                  mydocuments={mydocuments}
                  approvalings={approvalings}
                  inProgress={inProgress}
                  rejecteds={rejecteds}
                  compleDocuments={compleDocuments}
                  setSelectedReport={setSelectedReport}
                  setSelectedTab={setSelectedTab}
                  SelectOptions={SelectOptions}
                />
              )}
              <div className="approval_top_selector">
                <div className="approval_top_selector_title">양식 선택</div>
                <div className="approval_top_selector_box" onClick={SelectOpen}>
                  <img
                    src={selectOpen ? SelectDownArrow : SelectArrow}
                    alt="SelectArrow"
                    className="SelectArrow"
                  />
                  <span className="selector_title">{selectedReport}</span>
                </div>
                {selectOpen ? (
                  <div className="Select_report_Content">
                    <div
                      className="Option"
                      onClick={() => SelectOptions("전체 문서")}
                    >
                      <span className="Option_title">전체 문서</span>
                    </div>
                    <div>공동</div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("주간업무일지")}
                    >
                      <span className="Option_title">주간업무일지</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("휴가신청서")}
                    >
                      <span className="Option_title">휴가신청서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("지출품의서")}
                    >
                      <span className="Option_title">지출품의서</span>
                    </div>

                    <div>프로젝트</div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("기획서")}
                    >
                      <span className="Option_title">기획서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("중간보고서")}
                    >
                      <span className="Option_title">중간보고서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("최종보고서")}
                    >
                      <span className="Option_title">최종보고서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("TF팀 기획서")}
                    >
                      <span className="Option_title">TF팀 기획서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("TF팀 프로젝트 계획서")}
                    >
                      <span className="Option_title">TF팀 프로젝트 계획서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("TF팀 중간보고서")}
                    >
                      <span className="Option_title">TF팀 중간보고서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("TF팀 프로젝트 결과 보고서")}
                    >
                      <span className="Option_title">
                        TF팀 프로젝트 결과 보고서
                      </span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("박람회 보고서")}
                    >
                      <span className="Option_title">박람회 보고서</span>
                    </div>

                    <div>인사</div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("휴직원")}
                    >
                      <span className="Option_title">휴직원</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("복직원")}
                    >
                      <span className="Option_title">복직원</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("시말서")}
                    >
                      <span className="Option_title">시말서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("경위서")}
                    >
                      <span className="Option_title">경위서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("진급추천서")}
                    >
                      <span className="Option_title">진급추천서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("퇴직금 중간정산 신청서")}
                    >
                      <span className="Option_title">
                        퇴직금 중간정산 신청서
                      </span>
                    </div>

                    <div>총무</div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("출장 신청서")}
                    >
                      <span className="Option_title">출장 신청서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("출장 보고서")}
                    >
                      <span className="Option_title">출장 보고서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("출장비내역서")}
                    >
                      <span className="Option_title">출장비내역서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("자기개발비 신청서")}
                    >
                      <span className="Option_title">자기개발비 신청서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("법인카드 신청서")}
                    >
                      <span className="Option_title">법인카드 신청서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("지출내역서")}
                    >
                      <span className="Option_title">지출내역서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("예산신청서")}
                    >
                      <span className="Option_title">예산신청서</span>
                    </div>

                    <div>기타</div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("워크숍 신청서")}
                    >
                      <span className="Option_title">워크숍 신청서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("야유회 보고서")}
                    >
                      <span className="Option_title">야유회 보고서</span>
                    </div>
                    <div
                      className="Option"
                      onClick={() => SelectOptions("프로젝트 회의 보고서")}
                    >
                      <span className="Option_title">프로젝트 회의 보고서</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          )}

          <div className="approval_btm">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Approval;
