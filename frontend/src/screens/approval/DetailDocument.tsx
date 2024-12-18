import React, { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Document, Page, pdfjs } from "react-pdf";
import CustomModal from "../../components/modal/CustomModal";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  CheckReport,
  DeleteReport,
  getReportOpinion,
  RequestCancleDocument,
  RequestReject,
} from "../../services/approval/ApprovalServices";
import {
  PersonData,
  QuitterPersonData,
} from "../../services/person/PersonServices";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atoms";
import {
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { add_refer } from "../../assets/images";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

type PDFFile = string | File | null;

interface Person {
  userId: string;
  username: string;
  position: string;
  department: string;
  team: string;
  phoneNumber?: string;
  usermail?: string;
  entering: Date;
  attachment: string;
  Sign: string;
}

export interface RejectOp {
  assignPosition: string;
  content: string;
  createdAt: string;
  opinionId: number;
  position: string;
  reportId: number;
  type: string;
  updatedAt: string;
  username: string;
}

const DetailDocument = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const user = useRecoilValue(userState);
  const [file, setFile] = useState<PDFFile>("");
  const [numPages, setNumPages] = useState<number>(0);
  const [memoState, setMemoState] = useState<string>("");
  const [rejectOpinionData, setRejectOpinionData] = useState<RejectOp[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDeleteeventModalOpen, setDeleteEventModalOPen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathnameParts = location.pathname.split("/");
  const report_id = pathnameParts[pathnameParts.length - 1];
  const documentInfo = useState(location.state?.documentInfo);
  const [checksignup, setCheckSignUp] = useState<boolean[]>([]);
  const [personData, setPersonData] = useState<Person[] | null>(null);
  const [quitterPersonData, setQuitterPersonData] = useState<Person[] | null>(
    null
  );
  const [canReject, setCanReject] = useState(false);
  const [requestReject, setRequestReject] = useState<string | null>(null);
  const [requestCancle, setRequestCancle] = useState<string | null>(null);

  const {
    onOpen: onOpinionModalOpen,
    onClose: onOpinionModalClose,
    isOpen: isOpinionModalOpen,
  } = useDisclosure();

  const [signatories, setSignatories] = useState<any[]>([]);
  const approveLine =
    documentInfo[0].pending?.split(",").map((item: any) => item.trim()) ?? []; // 아직 결재가 진행중일때
  const completedapproveLine =
    documentInfo[0].completed?.split(",").map((item: any) => item.trim()) ?? []; // 결재가 모두 완료 됐을 시 결재라인
  const rejectapproveLine =
    documentInfo[0].rejected?.split(",").map((item: any) => item.trim()) ?? []; // 반려됐을 때 결재라인
  const approveDates =
    documentInfo[0]?.approveDate?.split(",").map((item: any) => item.trim()) ??
    [];
  const referLine =
    documentInfo[0].referName?.split(",").map((item: any) => item.trim()) ?? [];
  const shouldHideDeleteButton =
    approveLine.length > 0 || referLine.includes(user.username);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PersonData();
        setPersonData(response.data);
      } catch (err) {
        console.error("Error fetching person data:", err);
      }
    };

    const quitterfetchData = async () => {
      try {
        const response = await QuitterPersonData();
        setQuitterPersonData(response.data);
      } catch (err) {
        console.error("Error fetching quitter person data:", err);
      }
    };

    reportOpinionData();
    fetchData();
    quitterfetchData();
  }, []);
  useEffect(() => {
    const initialChecks = new Array(signatories.length).fill(false);
    const approvedCount = Number(documentInfo[0].approval);

    for (let i = 0; i < approvedCount; i++) {
      initialChecks[i] = true;
    }

    for (let i = approvedCount; i < signatories.length; i++) {
      initialChecks[i] = false;
    }

    setCheckSignUp(initialChecks);
  }, []);

  const fetchCheckReport = async (report_id: string) => {
    try {
      const response = await CheckReport(report_id);

      if (response.status === 200) {
        const url = URL.createObjectURL(response.data);
        setFile(url);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchCheckReport(report_id);

    if (documentInfo[0]?.opinionName) {
      setMemoState("opinion");
    } else if (documentInfo[0]?.rejectName) {
      setMemoState("reject");
    }

    try {
      const parsedString = JSON.parse(documentInfo[0]?.Payment);
      const parsedarray = JSON.parse(parsedString);

      const filteredApproveLine = parsedarray
        .filter((item: any) => item.name !== "참조")
        .map((item: any) => item.name);

      setSignatories(filteredApproveLine.reverse());
    } catch (error) {
      console.error("Failed to parse JSON:", error);
    }
  }, [report_id]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const exportToPDF = async () => {
    const element = containerRef.current;
    if (!element) {
      console.error("Element not found");
      return;
    }

    const images = Array.from(element.getElementsByTagName("img"));
    const loadPromises = images.map((img) => {
      if (!img.complete) {
        return new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject();
        });
      }
      return Promise.resolve();
    });

    try {
      await Promise.all(loadPromises);
      const pdf = new jsPDF("p", "mm", "a4");
      element.style.height = element.scrollHeight + "px";

      await html2canvas(element, {
        logging: true,
        allowTaint: true,
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "png", 0, 0, imgWidth, imgHeight);
        if (numPages > 1) {
          pdf.addPage();
        }
      });

      for (let i = 2; i <= numPages; i++) {
        const pageElement = document.querySelector(
          `[data-page-number="${i}"]`
        ) as HTMLElement;
        if (pageElement) {
          await html2canvas(pageElement, {
            allowTaint: true,
            useCORS: true,
          }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (i > 2) {
              pdf.addPage();
            }

            pdf.addImage(imgData, "png", 0, 0, imgWidth, imgHeight);
          });
        }
      }

      pdf.save(`${documentInfo[0].pdffile}`);
    } catch (error) {
      console.error("Failed to load images", error);
    }
  };

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <Page
          key={`page_${i}`}
          pageNumber={i}
          width={1000}
          data-page-number={i}
        />
      );
    }
    return pages;
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await DeleteReport(report_id);
      console.log("Report deleted successfully:", response);
      setDeleteEventModalOPen(false);
      navigate("/approval");
    } catch (error) {
      console.log("Failed to delete report:", error);
    }
  };

  const getSignUrl = (username: string) => {
    const user =
      personData?.find((person) => person.username === username) ||
      quitterPersonData?.find((person) => person.username === username);
    return user ? user.Sign : null;
  };

  const reportOpinionData = async () => {
    try {
      const response = await getReportOpinion(report_id);
      const sortedData = response.data.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setRejectOpinionData(sortedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (signatories.length > 0) {
      if (
        signatories.includes("관리팀장") &&
        documentInfo[0].pending?.includes("김효은")
      ) {
        setCanReject(true);
      }
      if (
        signatories.includes("담당자") &&
        documentInfo[0].pending?.includes("한지희")
      ) {
        setCanReject(true);
      }
      if (
        !signatories.includes("관리팀장") &&
        !signatories.includes("담당자") &&
        (documentInfo[0].pending?.includes("진유빈") ||
          documentInfo[0].pending?.includes("이정열") ||
          documentInfo[0].pending?.includes("김현지"))
      ) {
        setCanReject(true);
      }
      if (
        signatories.includes("연구실장") &&
        (documentInfo[0].pending?.includes("심민지") ||
          documentInfo[0].pending?.includes("윤민지"))
      ) {
        setCanReject(true);
      }
    }
  }, [signatories]);

  useEffect(() => {
    if (documentInfo[0].opinionName || documentInfo[0].rejectName) {
      setIsVisible(true); // 조건이 충족될 때만 표시
    } else {
      setIsVisible(false); // 조건이 충족되지 않으면 숨김
    }
  }, [documentInfo]);

  // 결재 취소 요청하기
  const handleRequestCancle = async () => {
    try {
      const formData = {
        userID: user.userID,
        username: user.username,
        position: user.position,
        opinion: requestCancle,
      };

      if (requestCancle) {
        const res = await RequestCancleDocument(report_id, formData);
        if (res) {
          reportOpinionData();
        }
      }
      onOpinionModalClose();
    } catch (error) {
      alert("Failed to submit opinion.");
      onOpinionModalClose();
    }
  };

  // 반려 요청하기
  const handleRequestReject = async () => {
    try {
      const formData = {
        userID: user.userID,
        username: user.username,
        position: user.position,
        opinion: requestReject,
      };

      if (requestReject) {
        const res = await RequestReject(report_id, formData);
        if (res) {
          reportOpinionData();
        }
      }
      onOpinionModalClose();
    } catch (error) {
      alert("Failed to submit opinion.");
      onOpinionModalClose();
    }
  };

  return (
    <div className="content">
      <div className="oper_header_right">
        <button
          className="primary_button"
          onClick={() => {
            navigate("/approval");
          }}
        >
          확인
        </button>

        {!shouldHideDeleteButton && (
          <button
            className="red_button"
            onClick={() => setDeleteEventModalOPen(true)}
          >
            삭제
          </button>
        )}

        {canReject ? (
          <Popover
            placement="right-start"
            isOpen={isOpinionModalOpen}
            onOpen={onOpinionModalOpen}
            onClose={onOpinionModalClose}
          >
            <PopoverTrigger>
              <button className="white_button">결재취소요청</button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent
                width="400px"
                border="0"
                borderRadius="5px"
                boxShadow="0px 0px 5px #444"
              >
                <PopoverHeader
                  color="white"
                  bg="#76CB7E"
                  border="0"
                  fontFamily="var(--font-family-Noto-B)"
                  borderTopRadius="5px"
                  fontSize="14px"
                >
                  결재취소요청
                </PopoverHeader>
                <PopoverCloseButton color="white" />
                <PopoverBody
                  display="flex"
                  flexDirection="column"
                  padding="0px"
                  justifyContent="center"
                  alignItems="center"
                  fontSize="14px"
                  paddingRight="15px"
                  style={{
                    paddingBottom: "15px",
                  }}
                >
                  <div className="opinionBox">
                    <div className="WriterBox">
                      <div className="Write">작성자</div>
                      <div className="Writer">
                        {user.username}&nbsp;{user.position}
                      </div>
                    </div>
                    <div className="TextAreaBox">
                      <div className="Title">내용</div>
                      <div>
                        <textarea
                          className="TextAreaStyle"
                          placeholder="내용을 입력해주세요."
                          // value={opinion}
                          onChange={(e) => {
                            setRequestCancle(e.target.value);
                          }}
                        />
                        <div className="warn_text">
                          * 결재 미완료 시 의견작성은 진행되지 않습니다.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="button-wrap">
                    <button
                      className="second_button"
                      onClick={() => {
                        handleRequestCancle();
                        onOpinionModalClose();
                      }}
                    >
                      등록
                    </button>
                    <button
                      className="white_button"
                      onClick={() => {
                        onOpinionModalClose();
                        // setOpinion("");
                      }}
                    >
                      취소
                    </button>
                  </div>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        ) : (
          <Popover
            placement="right-start"
            isOpen={isOpinionModalOpen}
            onOpen={onOpinionModalOpen}
            onClose={onOpinionModalClose}
          >
            <PopoverTrigger>
              <button className="red_button">반려요청</button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent
                width="400px"
                border="0"
                borderRadius="5px"
                boxShadow="0px 0px 5px #444"
              >
                <PopoverHeader
                  color="white"
                  bg="#76CB7E"
                  border="0"
                  fontFamily="var(--font-family-Noto-B)"
                  borderTopRadius="5px"
                  fontSize="14px"
                >
                  반려요청
                </PopoverHeader>
                <PopoverCloseButton color="white" />
                <PopoverBody
                  display="flex"
                  flexDirection="column"
                  padding="0px"
                  justifyContent="center"
                  alignItems="center"
                  fontSize="14px"
                  paddingRight="15px"
                  style={{
                    paddingBottom: "15px",
                  }}
                >
                  <div className="opinionBox">
                    <div className="WriterBox">
                      <div className="Write">작성자</div>
                      <div className="Writer">
                        {user.username}&nbsp;{user.position}
                      </div>
                    </div>
                    <div className="TextAreaBox">
                      <div className="Title">내용</div>
                      <div>
                        <textarea
                          className="TextAreaStyle"
                          placeholder="내용을 입력해주세요."
                          // value={opinion}
                          onChange={(e) => {
                            setRequestReject(e.target.value);
                          }}
                        />
                        <div className="warn_text">
                          * 결재 미완료 시 의견작성은 진행되지 않습니다.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="button-wrap">
                    <button
                      className="second_button"
                      onClick={() => {
                        handleRequestReject();
                        onOpinionModalClose();
                      }}
                    >
                      등록
                    </button>
                    <button
                      className="white_button"
                      onClick={() => {
                        onOpinionModalClose();
                        // setOpinion("");
                      }}
                    >
                      취소
                    </button>
                  </div>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        )}
        <button className="white_button" onClick={exportToPDF}>
          다운로드
        </button>
      </div>

      <div className="content_container">
        <div className="approval_write_container">
          {/* {memoState ? (
            memoState === "reject" ? (
              <>
                <div className="write_top_container_document">
                  <div className="document_container">
                    <div className="document_title">반려자</div>
                    <div className="document_content">
                      {documentInfo[0].rejectName}
                    </div>
                  </div>
                  <div className="document_container">
                    <div className="document_title">반려사유</div>
                    <div className="document_content">
                      {documentInfo[0].rejectContent}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="write_top_container_document">
                  <div className="document_container">
                    <div className="document_title">작성자</div>
                    <div className="document_content">
                      {documentInfo[0].opinionName}
                    </div>
                  </div>
                  <div className="document_container">
                    <div className="document_title">의견 내용</div>
                    <div
                      className="document_content"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {documentInfo[0].opinionContent
                        .split(",")
                        .map((item: string) => item.trim())
                        .join("\n")}
                    </div>
                  </div>
                </div>
              </>
            )
          ) : (
            <></>
          )} */}
          <div className="detail_documnet_contain">
            <div className="write_btm_container">
              <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                <div ref={containerRef} id="report-to-xls">
                  <div className="PaymentLine">
                    {signatories.map((signatory, index) => (
                      <div className="Pay" key={index}>
                        <input
                          className="Top"
                          type="text"
                          placeholder={signatory}
                          disabled
                        />
                        <div className="Bottoms">
                          {checksignup[index] &&
                            (rejectapproveLine[index] ? (
                              <img
                                className="SignImg"
                                src={`${getSignUrl(rejectapproveLine[index])}`}
                                alt="sign"
                              />
                            ) : documentInfo[0].approval <
                              documentInfo[0].currentSigner ? (
                              <img
                                className="SignImg"
                                src={`${getSignUrl(approveLine[index])}` || ""}
                                alt="sign"
                              />
                            ) : (
                              <img
                                className="SignImg"
                                src={
                                  `${getSignUrl(
                                    completedapproveLine[index]
                                  )}` || ""
                                }
                                alt="sign"
                              />
                            ))}
                        </div>
                        <div className="BtmDate">
                          {approveDates[index] || ""}
                        </div>
                      </div>
                    ))}
                  </div>
                  {renderPages()}
                </div>
              </Document>
            </div>
            {(rejectOpinionData.length > 0 || documentInfo[0].referName) && (
              <div className="detail_documnet_box">
                {documentInfo[0].referName && (
                  <div className="detail_documnet_refer">
                    <div className="refer_title">
                      <p>참조</p>
                      <img src={add_refer} />
                    </div>
                    <div>{documentInfo[0].referName}</div>
                  </div>
                )}
                {rejectOpinionData.length > 0 ? (
                  <div
                    className={`detail_documnet_comment ${
                      isVisible ? "show" : ""
                    }`}
                  >
                    {rejectOpinionData.map((reject) => (
                      <React.Fragment key={reject.opinionId}>
                        <div className="reject_requester show">
                          {reject.type === "opinion" && <p>의견 작성자</p>}
                          {reject.type === "requestReject" && <p>반려요청자</p>}
                          {reject.type === "requestCancle" && (
                            <p>결재취소요청자</p>
                          )}
                          {reject.type === "canclellation" && <p>결재취소자</p>}
                          {reject.type === "rejection" && <p>반려자</p>}
                          <div>
                            {reject.username}{" "}
                            {reject.assignPosition !== "작성자"
                              ? reject.assignPosition
                              : ""}
                          </div>
                        </div>
                        <div
                          className="document_content"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {reject.content
                            ?.split(",")
                            .map((item: string) => item.trim())
                            .join("\n\n")}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      <CustomModal
        isOpen={isDeleteeventModalOpen}
        onClose={() => setDeleteEventModalOPen(false)}
        header={"알림"}
        footer1={"삭제"}
        footer1Class="red-btn"
        onFooter1Click={handleDeleteEvent}
        footer2={"취소"}
        footer2Class="gray-btn"
        onFooter2Click={() => setDeleteEventModalOPen(false)}
      >
        <div>삭제하시겠습니까?</div>
      </CustomModal>
    </div>
  );
};

export default DetailDocument;
