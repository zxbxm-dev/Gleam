import React, { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import CustomModal from "../../components/modal/CustomModal";
import { userState } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";
import {
  WriteApprovalOp,
  WriteApproval,
  HandleApproval,
  CheckReport,
  getDocumentsInProgress,
  getRejectedDocuments,
  getReportOpinion,
  getMyReports,
} from "../../services/approval/ApprovalServices";
import {
  PersonData,
  QuitterPersonData,
} from "../../services/person/PersonServices";
import { useLocation, useNavigate } from "react-router-dom";
import { add_refer } from "../../assets/images";
import { RejectOp } from "./DetailDocument";

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

const DetailApproval = () => {
  let navigate = useNavigate();
  const [isSignModalOpen, setSignModalOpen] = useState(false);
  const [isEmptySignModalOpen, setEmptySignModalOpen] = useState(false);
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isCheckSignModalOpen, setCheckSignModalOpen] = useState(false);
  const [optionButtonDisabe, setOptionButtonDisabe] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isReferenceVisible, setIsReferenceVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");
  const {
    onOpen: onOpinionModalOpen,
    onClose: onOpinionModalClose,
    isOpen: isOpinionModalOpen,
  } = useDisclosure();
  const {
    onOpen: onRejectionModalOpen,
    onClose: onRejectionModalClose,
    isOpen: isRejectionModalOpen,
  } = useDisclosure();
  const [file, setFile] = useState<PDFFile>("");
  const [numPages, setNumPages] = useState<number>(0);
  const [checksignup, setCheckSignUp] = useState<boolean[]>([]);
  const [signupindex, setSignUpIndex] = useState<number>(0);
  const [signDates, setSignDates] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const user = useRecoilValue(userState);
  const [personData, setPersonData] = useState<Person[] | null>(null);
  const [quitterPersonData, setQuitterPersonData] = useState<Person[] | null>(
    null
  );
  const [rejectOpinionData, setRejectOpinionData] = useState<RejectOp[]>([]);
  const [opinion, setOpinion] = useState("");
  const [rejection, setRejection] = useState("");
  const [buttonDisable, setButtonDisable] = useState(true);
  const [nextData, setNextData] = useState<any[]>([]);
  const [rejectedData, setRejectedData] = useState<any[]>([]);
  const [newOpinion, setNewOpinion] = useState<string | null>(null);

  const params = {
    username: user.username,
  };

  const location = useLocation();
  const pathnameParts = location.pathname.split("/");
  const report_id = pathnameParts[pathnameParts.length - 1];
  const documentInfo = useState(location.state?.documentInfo);
  const status = useState(location.state?.status);

  const [signatories, setSignatories] = useState<any[]>([]);
  const approveLine = documentInfo[0].personSigning
    .split(",")
    .map((item: any) => item.trim())
    .reverse(); // 결재 해야할 사람
  const approvedLine =
    documentInfo[0].pending?.split(",").map((item: any) => item.trim()) ?? []; // 결재 끝난 사람
  const combinedLine = approvedLine.concat(approveLine); // 전체 결재라인
  const approveDates =
    documentInfo[0]?.approveDate?.split(",").map((item: any) => item.trim()) ??
    [];

  const getNextData = async () => {
    const params = {
      userID: user.userID,
      username: user.username,
    };
    try {
      const response = await getMyReports(params);
      const data = response.data;
      console.log(data);
      const hi = data.find((item: any) => item.id === documentInfo[0].id);
      setNextData(hi);
    } catch (error) {
      console.log(error);
    }
  };
  const getRejectedData = async () => {
    try {
      const response = await getRejectedDocuments(params);
      const data = response.data;
      const hi = data.find((item: any) => item.id === documentInfo[0].id);
      setRejectedData(hi);
    } catch (error) {
      console.log(error);
    }
  };
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

    fetchData();
    quitterfetchData();
  }, []);

  useEffect(() => {
    // setFile(testPDF);
    const initialChecks = new Array(signatories.length).fill(false);
    const approvedCount = Number(documentInfo[0].approval);

    for (let i = 0; i < approvedCount; i++) {
      initialChecks[i] = true;
    }

    for (let i = approvedCount; i < signatories.length; i++) {
      initialChecks[i] = false;
    }

    setCheckSignUp(initialChecks);
    setSignDates(new Array(signatories.length).fill(""));
  }, []);

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

  const canUserSignAtIndex = (index: number) => {
    for (let i = 0; i < index; i++) {
      if (
        (signatories[i] === user.position ||
          combinedLine[i] === user.username) &&
        !checksignup[i]
      ) {
        return false;
      }
    }

    return (
      (signatories[index] === user.position ||
        combinedLine[index] === user.username) &&
      !checksignup[index]
    );
  };

  const handleSignModal = (index: number) => {
    if (canUserSignAtIndex(index)) {
      if (!user.Sign) {
        setEmptySignModalOpen(true);
      } else {
        setSignModalOpen(true);
        setSignUpIndex(index);
      }
    }
  };

  const handleSign = (index: number) => {
    const newCheckSignUp = [...checksignup];
    newCheckSignUp[index] = true;
    setCheckSignUp(newCheckSignUp);

    const newSignDates = [...signDates];
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear().toString().slice(2)}/${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${currentDate.getDate().toString().padStart(2, "0")}`;
    newSignDates[index] = formattedDate;
    setSignDates(newSignDates);

    setSignModalOpen(false);
  };

  useEffect(() => {
    let nonEmptyValues = signDates.filter((value) => value.trim() !== "");

    if (nonEmptyValues.length > 0) {
      setButtonDisable(false);
    }
  }, [signDates]);

  const handleSignDel = (index: number) => {
    const newCheckSignUp = [...checksignup];
    newCheckSignUp[index] = false;
    setCheckSignUp(newCheckSignUp);

    const newSignDates = [...signDates];
    newSignDates[index] = "";
    setSignDates(newSignDates);

    setSignModalOpen(false);
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

  const handleOpinionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOpinion(e.target.value);
  };

  const handleRejectionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRejection(e.target.value);
  };

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

  //의견 작성하기
  const handleSubmitOpinion = async (report_id: string) => {
    if (newOpinion) {
      try {
        const formData = {
          userID: user.userID,
          username: user.username,
          position: user.position,
          opinion: opinion,
        };

        if (opinion) {
          await WriteApprovalOp(report_id, formData);
        }
        setOpinion("");
        onOpinionModalClose();
      } catch (error) {
        alert("Failed to submit opinion.");
        onOpinionModalClose();
      }
    }
  };

  // 반려 작성하기
  const handleSubmitRejection = async (report_id: string) => {
    try {
      const formData = {
        userID: user.userID,
        username: user.username,
        position: user.position,
        opinion: rejection,
        type: "rejection",
      };
      await WriteApproval(report_id, formData);
      getRejectedData();
      alert("반려 사유가 등록되었습니다.");
      setRejection("");
      onRejectionModalClose();
      navigate(`/detailDocument/${documentInfo[0].id}`, {
        state: { documentInfo: rejectedData },
      });
    } catch (error) {
      alert("Failed to submit rejection.");
      onRejectionModalClose();
    }
  };

  const handleApproval = async (report_id: string) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear().toString().slice(2)}/${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${currentDate.getDate().toString().padStart(2, "0")}`;
    const formData = new FormData();
    formData.append("userID", user.userID);
    formData.append("username", user.username);
    formData.append("approveDate", formattedDate);

    if (signupindex !== documentInfo[0]?.approval) {
      setCheckSignModalOpen(true);
      return;
    }

    HandleApproval(report_id, formData)
      .then(() => {
        console.log("보고서 결재에 성공했습니다.");
        setModalContent("결재완료되었습니다.");
        setApproveModalOpen(true);
        getNextData();
      })
      .catch((error) => {
        console.error("보고서 결재에 실패했습니다.", error);
        if (error.response) {
          const { status } = error.response;
          switch (status) {
            case 403:
              setModalContent("이미 결재를 완료한 사용자입니다.");
              setApproveModalOpen(true);
              break;
          }
        }
      });
  };

  const getSignUrl = (username: string) => {
    const user =
      personData?.find((person) => person.username === username) ||
      quitterPersonData?.find((person) => person.username === username);
    return user ? user.Sign : null;
  };

  useEffect(() => {
    if (
      documentInfo[0].opinionName.replace(/\s*\(.*?\)$/, "") === user.username
    ) {
      setOptionButtonDisabe(true);
    }
  }, [documentInfo]);

  const addOpinion = () => {
    setNewOpinion(opinion);
  };

  useEffect(() => {
    if (newOpinion) {
      setIsVisible(true);
    }
  }, [newOpinion, documentInfo]);

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
    reportOpinionData();
    getNextData();
  }, []);

  return (
    <div className="content">
      <div className="content_container">
        <div className="container">
          <div className="approval_write_container">
            <div className="approval_write_container">
              <div className="top_right_content">
                <button
                  className={
                    buttonDisable ? "disable_button" : "primary_button"
                  }
                  disabled={buttonDisable}
                  onClick={async () => {
                    await handleSubmitOpinion(report_id);
                    await handleApproval(report_id);
                  }}
                >
                  확인
                </button>
                <Popover
                  placement="right-start"
                  isOpen={isOpinionModalOpen}
                  onOpen={onOpinionModalOpen}
                  onClose={onOpinionModalClose}
                >
                  <PopoverTrigger>
                    <button
                      className={
                        optionButtonDisabe ? "disable_button" : "white_button"
                      }
                      disabled={optionButtonDisabe}
                    >
                      의견 작성
                    </button>
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
                        의견 작성
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
                                value={opinion}
                                onChange={handleOpinionChange}
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
                              setIsReferenceVisible(true);
                              setOptionButtonDisabe(true);
                              addOpinion();
                              onOpinionModalClose();
                            }}
                          >
                            등록
                          </button>
                          <button
                            className="white_button"
                            onClick={() => {
                              onOpinionModalClose();
                              setOpinion("");
                            }}
                          >
                            취소
                          </button>
                        </div>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>

                <Popover
                  placement="right-start"
                  isOpen={isRejectionModalOpen}
                  onOpen={onRejectionModalOpen}
                  onClose={onRejectionModalClose}
                >
                  <PopoverTrigger>
                    {user.username === documentInfo[0].username ? (
                      <></>
                    ) : (
                      <button className="red_button">반려하기</button>
                    )}
                  </PopoverTrigger>
                  <button className="white_button" onClick={exportToPDF}>
                    다운로드
                  </button>
                  <Portal>
                    <PopoverContent
                      width="410px"
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
                        반려 사유 작성
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
                            <div className="CompanionWrite">반려자</div>
                            <div className="Writer">
                              {user.username}&nbsp;{user.position}
                            </div>
                          </div>
                          <div className="TextAreaBox">
                            <div className="CompanionTitle">반려 사유</div>
                            <div>
                              <textarea
                                className="TextAreaCompanion"
                                placeholder="내용을 입력해주세요."
                                value={rejection}
                                onChange={handleRejectionChange}
                              />
                              <div className="warn_text">
                                * 반려 시 결재는 진행하실 수 없습니다.
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="button-wrap">
                          <button
                            className="second_button"
                            onClick={() => {
                              handleSubmitRejection(report_id);
                              handleSubmitOpinion(report_id);
                            }}
                          >
                            등록
                          </button>
                          <button
                            className="white_button"
                            onClick={onRejectionModalClose}
                          >
                            취소
                          </button>
                        </div>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </div>
            </div>
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
                          {canUserSignAtIndex(index) ? (
                            <div
                              className="Bottom"
                              onClick={() => handleSignModal(index)}
                            >
                              {checksignup[index] ? (
                                <img
                                  className="SignImg"
                                  src={`${getSignUrl(user.username)}` || ""}
                                  alt="sign"
                                />
                              ) : (
                                <></>
                              )}
                            </div>
                          ) : (
                            <div className="Bottom_notHover">
                              {checksignup[index] ? (
                                <img
                                  className="SignImg"
                                  src={
                                    `${getSignUrl(combinedLine[index])}` || ""
                                  }
                                  alt="sign"
                                />
                              ) : (
                                <></>
                              )}
                            </div>
                          )}
                          <div className="BtmDate">
                            {approveDates[index] || signDates[index]}
                          </div>
                        </div>
                      ))}
                    </div>
                    {renderPages()}
                  </div>
                </Document>
              </div>
              {(rejectOpinionData.length > 0 ||
                documentInfo[0].referName ||
                newOpinion) && (
                // {(rejectOpinionData.length > 0 || newOpinion) && (
                <div className="detail_documnet_box">
                  {documentInfo[0].referName && (
                    <div className="detail_documnet_refer">
                      <div className="refer_title">
                        <p>참조</p>
                        {/* <img src={add_refer} /> */}
                      </div>
                      <div>{documentInfo[0].referName}</div>
                    </div>
                  )}
                  {rejectOpinionData.length > 0 || newOpinion ? (
                    <>
                      <div
                        className={`detail_documnet_comment ${
                          documentInfo[0].opinionName ||
                          documentInfo[0].rejectName ||
                          newOpinion
                            ? "show"
                            : ""
                        }`}
                      >
                        {newOpinion && (
                          <>
                            <div
                              className={`testtest ${isVisible ? "show" : ""}`}
                            >
                              <div className="reject_requester show">
                                <p>의견 작성자</p>
                                <div>
                                  {user.username}{" "}
                                  {user.assignPosition !== "작성자"
                                    ? user.assignPosition
                                    : ""}
                                </div>
                              </div>
                              <div className="opinion">
                                {newOpinion && `${newOpinion}`}
                              </div>
                            </div>
                          </>
                        )}
                        {rejectOpinionData.map((reject) => (
                          <>
                            <div className="reject_requester show">
                              <p>
                                {reject.type === "opinion" && (
                                  <p>의견 작성자</p>
                                )}
                                {/* {reject.type === "requestReject" && (
                                  <p>반려요청자</p>
                                )}
                                {reject.type === "requestCancle" && (
                                  <p>결재취소요청자</p>
                                )}
                                {reject.type === "canclellation" && (
                                  <p>결재취소자</p>
                                )} */}
                                {reject.type === "rejection" && <p>반려자</p>}
                              </p>
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
                                .split(",")
                                .map((item: string) => item.trim())
                                .join("\n\n")}
                            </div>
                          </>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CustomModal
        isOpen={isSignModalOpen}
        onClose={() => setSignModalOpen(false)}
        header={"알림"}
        headerTextColor="White"
        footer1={"서명"}
        footer1Class="green-btn"
        footer2={"취소"}
        onFooter1Click={() => handleSign(signupindex)}
        footer2Class="gray-btn"
        onFooter2Click={() => handleSignDel(signupindex)}
      >
        <div>서명하시겠습니까?</div>
      </CustomModal>

      <CustomModal
        isOpen={isEmptySignModalOpen}
        onClose={() => setEmptySignModalOpen(false)}
        header={"알림"}
        headerTextColor="White"
        footer1={"확인"}
        footer1Class="green-btn"
        onFooter1Click={() => setEmptySignModalOpen(false)}
      >
        <div>
          {user.username}님의 서명이 존재하지않습니다. <br />
          회원수정에서 서명을 등록해주세요.
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isReferenceVisible}
        onClose={() => setIsReferenceVisible(false)}
        header={"알림"}
        headerTextColor="White"
        footer1={"확인"}
        footer1Class="green-btn"
        onFooter1Click={() => setIsReferenceVisible(false)}
      >
        <div>의견 작성이 완료되었습니다.</div>
      </CustomModal>

      <CustomModal
        isOpen={isApproveModalOpen}
        onClose={() => {
          setApproveModalOpen(false);
          navigate(`/detailDocument/${documentInfo[0].id}`, {
            state: { documentInfo: nextData },
          });
        }}
        header={"알림"}
        headerTextColor="White"
      >
        <div>{modalContent}</div>
      </CustomModal>

      <CustomModal
        isOpen={isCheckSignModalOpen}
        onClose={() => setCheckSignModalOpen(false)}
        header={"알림"}
        headerTextColor="White"
        footer1={"확인"}
        footer1Class="green-btn"
        onFooter1Click={() => setCheckSignModalOpen(false)}
      >
        <div>
          본인 서명란을 클릭 후 <br />
          서명을 완료해주세요.
        </div>
      </CustomModal>
    </div>
  );
};

export default DetailApproval;
