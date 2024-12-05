import { useState, useEffect } from "react";
import {
  slide_downArrow,
  Right_Arrow,
  White_Arrow,
  spinnerBtm,
  spinnerTop,
  removeDocument,
  openSetting,
  addDocumentImage,
  document_Arrow,
} from "../../assets/images/index";
import CustomModal from "../../components/modal/CustomModal";
import {
  AddDocuments,
  GetDocuments,
  EditDocuments,
  ManagerEditDocuments,
  DeleteDocument,
} from "../../services/report/documentServices";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atoms";
import { set } from "react-hook-form";

interface Document {
  documentId: number;
  docType: string;
  docTitle: string;
  docNumber: number;
  docPerson: string;
  docPersonTeam: string;
  docPersondept: string;
  team: string;
  username: string;
  userposition: string;
}

const IncludeReSlide = () => {
  const user = useRecoilValue(userState);
  const [slideVisible, setSlideVisible] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isTeamDocsOpen, setIsTeamDocsOpen] = useState(false);
  const [isTeamDocsOpen2, setIsTeamDocsOpen2] = useState<boolean[]>([]);
  const [isPublicDocsOpen, setIsPublicDocsOpen] = useState(false);
  const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editAlertOpen, setEditAlertOpen] = useState(false);
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);
  const [editNumberAlertOpen, setEditNumberAlertOpen] = useState(false);
  const [addDocument, setAddDocument] = useState({
    docType: "",
    docTitle: "",
    docNumber: "",
  });
  // 문서 데이터 상태
  const [documents, setDocuments] = useState<Document[]>([]);
  // const [editModes, setEditModes] = useState(
  //     documents.map(() => false) // 각 문서마다 false로 초기화
  // );
  const [ismanagerMode, setIsManagerMode] = useState(false); // 관리부 - 편집 버튼 상태
  const [ismanagerEditMode, setIsManagerEditMode] = useState(false); // 관리부 - 수정 버튼 상태
  const [editDocumentId, setEditDocumentId] = useState<number | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [selectedDocTitle, setSelectedDocTitle] = useState<string | null>(null);
  const [selectedDocNumber, setSelectedDocNumber] = useState<number | null>(
    null
  );
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [teamEditModes, setTeamEditModes] = useState<any[]>([]); // 팀 문서 편집 모드
  const [publicEditModes, setPublicEditModes] = useState<boolean[]>([]); // 공용 문서 편집 모드
  const [docNumber, setdocNumber] = useState<number | null>(null);
  const [selectItem, setSelectItem] = useState<number | null>(null);
  const [staticTitle, setStaticTitle] = useState<string | null>(null);
  const [staticDocNumber, setStaticDocNumber] = useState<number | null>(null);
  const [newDocNumber, setNewDocNumber] = useState<number | null>(null);
  const [teamData, setTeamData] = useState<any[]>([]);

  //관리자 수정 클릭
  const handleManagEditClick = (documentId: number) => {
    documents.map((item) => {
      if (item.documentId === documentId) {
        setIsManagerEditMode(true);
        setIsPopupOpen(true);
      }
      setSelectedDocId(documentId);
    });
  };

  //선택된 아이디에 따른 각 상태 저장
  useEffect(() => {
    if (selectedDocId !== null) {
      const selectedDoc = documents.find(
        (doc) => doc.documentId === selectedDocId
      );
      if (selectedDoc) {
        setSelectedDocTitle(selectedDoc.docTitle);
        setStaticTitle(selectedDoc.docTitle);
        setStaticDocNumber(selectedDoc.docNumber);
        setSelectedDocNumber(selectedDoc.docNumber);
        setSelectedDocType(selectedDoc.docType);
      }
    }
  }, [selectedDocId, documents]);

  //일반 사용자 - 편집
  const handleEditClick = (
    index: number,
    documentId: number,
    docType: string
  ) => {
    setSelectedDocId(documentId);

    if (docType === "Team") {
      setSelectedDocType("Team");

      setTeamEditModes((prev) => {
        return prev.map((_, i) => documents[i].documentId === documentId);
      });
    } else if (docType === "Public") {
      setSelectedDocType("Public");
      setPublicEditModes((prev) => {
        const newEditModes = prev.map(() => false);

        newEditModes[index] = true;
        return newEditModes;
      });
    }
  };

  // 컴포넌트 렌더링 시 문서 데이터 가져오기
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const userID = user.userID;

    try {
      const response = await GetDocuments(userID);
      if (user.position === "부서장") {
        setDocuments(response.data.documentsForManager || []);
      } else {
        setDocuments(response.data.documents || []);
      }
    } catch (error) {
      console.error("문서 조회 실패:", error);
    }
  };

  const toggleSlide = () => {
    setSlideVisible((prev) => !prev);
  };

  const handleCancelClick = () => {
    setIsPopupOpen(false);
    setIsManagerEditMode(false);
    setSelectedDocTitle(staticTitle);
    setSelectedDocNumber(staticDocNumber);
  };

  //input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (ismanagerEditMode) {
      if (name === "docTitle") {
        setSelectedDocTitle(value);
      } else if (name === "docNumber") {
        setSelectedDocNumber(value ? Number(value) : null);
      } else if (name === "docType") {
        setSelectedDocType(value);
      }
    } else {
      setAddDocument((prevState) => ({
        ...prevState,
        [name]: name === "docNumber" ? (value ? Number(value) : null) : value,
      }));
    }
  };

  const handlePopup = () => {
    setIsSuccessPopupOpen(false);
  };

  //관리부 - 문서 추가
  const handleSubmit = async () => {
    const userID = user.userID;
    const formData = {
      docType: addDocument.docType,
      docTitle: addDocument.docTitle,
      docNumber: addDocument.docNumber,
    };

    try {
      const response = await AddDocuments(userID, formData);
      console.log("문서 추가 성공:", response.data);
      if (response.status === 207) {
        setErrorAlertOpen(true);
        return;
      }
      setIsPopupOpen(false);
      setIsSuccessPopupOpen(true);
      fetchDocuments();
    } catch (error) {
      console.error("문서 추가 실패:", error);
      alert("문서 추가에 실패했습니다.");
    }
  };
  // 스피너 증가
  // const handleNumberIncrease = (index: number, docType: string) => {
  //   setDocuments((prevDocuments) => {
  //     // 해당 문서가 맞는지 체크하여 증가시킴
  //     const updatedDocuments = prevDocuments.map((doc, i) => {
  //       if (i === index && selectedDocType === docType) {
  //         return { ...doc, docNumber: doc.docNumber + 1 };
  //       }
  //       console.log(doc);
  //       return doc;
  //     });
  //     return updatedDocuments;
  //   });
  // };

  // 스피너 감소
  // const handleNumberDecrease = (index: number, docType: string) => {
  //   setDocuments((prevDocuments) => {
  //     // 해당 문서가 맞는지 체크하여 감소시킴
  //     const updatedDocuments = prevDocuments.map((doc, i) => {
  //       if (i === index && selectedDocType === docType) {
  //         return { ...doc, docNumber: Math.max(doc.docNumber - 1, 0) };
  //       }
  //       return doc;
  //     });
  //     return updatedDocuments;
  //   });
  // };

  //문서번호 수정
  const handleEditConfirm = async (index: any, id: number) => {
    documents.map(async (item) => {
      const updateData = {
        docTitle: item.docTitle,
        docNumber: item.docNumber,
        userName: user.username,
        userposition: user.position,
      };
      if (item.documentId === id) {
        setNewDocNumber(item.docNumber);
        try {
          const response = await EditDocuments(id, updateData);
          setTeamEditModes((prev) => prev.map(() => false));
          setPublicEditModes((prev) => prev.map(() => false));
          console.log("문서 번호 수정 성공:", response.data);
          setNewDocNumber(item.docNumber);

          if (response) {
            setEditNumberAlertOpen(true);
          }

          fetchDocuments();
          // setEditModes((prevEditModes) => {
          //     const newEditModes = [...prevEditModes];
          //     newEditModes[index] = false;
          //     return newEditModes;
          // });
        } catch (error) {
          console.error("문서 번호 수정 실패:", error);
          alert("문서 번호 수정에 실패했습니다.");
        }
      }
    });
  };

  //관리팀 - 문서번호 수정
  const handleManagerEdit = async () => {
    const updateData = {
      documentId: selectItem,
      docNumber: selectedDocNumber,
      docTitle: staticTitle,
      newDocTitle: selectedDocTitle,
      docType: selectedDocType,
    };

    try {
      const response = await ManagerEditDocuments(updateData);
      if (response) {
        setEditAlertOpen(true);
        setIsPopupOpen(false);
      }
      if (response.status === 207) {
        alert("중복 된 문서명입니다.");
        return;
      }
      console.log("문서 번호 수정 성공:", response.data);
      fetchDocuments();
    } catch (error) {
      console.error("문서 번호 수정 실패:", error);
      alert("문서 번호 수정에 실패했습니다.");
    }
  };

  const up = (id: number) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((code) =>
        code.documentId === id
          ? { ...code, docNumber: code.docNumber + 1 } // 스프레드 연산자로 새로운 객체 생성
          : code
      )
    );
  };

  const down = (id: number) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((code) =>
        code.documentId === id
          ? { ...code, docNumber: code.docNumber - 1 } // 스프레드 연산자로 새로운 객체 생성
          : code
      )
    );
  };

  const selectBox = (id: number, doc: any) => {
    setStaticTitle(doc.docTitle);
    setSelectedDocType(doc.docType);
    setSelectItem(id);
  };

  const handleDeleteDocument = async () => {
    setIsDeletePopUpOpen(false);
    const data = {
      documentId: selectItem,
      docType: selectedDocType,
      docTitle: staticTitle,
    };
    try {
      const res = await DeleteDocument(data);
      if (res) {
        fetchDocuments();
        setDeleteAlertOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // position이 부서장일 경우
  useEffect(() => {
    if (user.position === "부서장") {
      const groupedData = documents.reduce((acc: any, item) => {
        if (item.team !== null) {
          // acc에 이미 존재하는 팀이 있는지 직접 확인
          const existingTeam = acc.find(
            (team: { name: string }) => team.name === item.team
          );

          if (existingTeam) {
            // 이미 존재하면 item 전체를 추가
            existingTeam.data.push(item);
          } else {
            // 존재하지 않으면 새 팀 추가
            acc.push({ name: item.team, data: [item] });
          }
        }
        return acc;
      }, []);

      if (groupedData.length === 0 && user.department === "관리부") {
        groupedData.push({ name: "관리팀" }, { name: "지원팀" });
      }
      if (groupedData.length === 0 && user.department === "개발부") {
        groupedData.push({ name: "개발 1팀" }, { name: "개발 2팀" });
      }
      if (groupedData.length === 0 && user.department === "마케팅부") {
        groupedData.push({ name: "디자인팀" }, { name: "기획팀" });
      }
      if (groupedData.length === 0 && user.department === "알고리즘 연구실") {
        groupedData.push(
          { name: "AI 연구팀" },
          { name: "암호 연구팀" },
          { name: "API 개발팀" },
          { name: "크립토 블록체인 연구팀" }
        );
      }
      const sortedTeamData = [...groupedData].sort(
        (a: { name: string }, b: { name: string }) => {
          if (user.department === "관리부") {
            if (groupedData.length === 0) {
              const order = ["관리팀", "지원팀", "시설팀"];
              return order.indexOf(a.name) - order.indexOf(b.name);
            }
          }
          if (user.department === "개발부") {
            if (a.name === "개발 1팀") return -1;
            if (b.name === "개발 2팀") return 1;
          }
          if (user.department === "마케팅부") {
            if (a.name === "디자인팀") return -1;
            if (b.name === "기획팀") return 1;
          }
          if (user.department === "알고리즘 연구실") {
            if (user.department === "알고리즘 연구실") {
              const order = [
                "AI 연구팀",
                "암호 연구팀",
                "API 개발팀",
                "크립토 블록체인 연구팀",
              ];
              return order.indexOf(a.name) - order.indexOf(b.name);
            }
          }
          // if (user.department === "블록체인 연구실") {
          // }
          return 0;
        }
      );
      setTeamData(sortedTeamData);
    }
  }, [documents]);

  useEffect(() => {
    setIsTeamDocsOpen2(new Array(teamData.length).fill(false));
  }, []);

  const toggleTeamDocs = (index: number) => {
    setIsTeamDocsOpen2((prev) => {
      if (!Array.isArray(prev)) {
        return prev;
      }

      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <div className="project_slide_container">
      <div
        className={`project_slide ${slideVisible ? "visible" : ""}`}
        onClick={toggleSlide}
      >
        <span className="additional_content_title">
          {user.company} 문서 번호 관리
        </span>
        <img
          src={White_Arrow}
          alt="White Arrow"
          className={slideVisible ? "img_rotate" : ""}
        />
      </div>

      <div className={`additional_content ${slideVisible ? "visible" : ""}`}>
        {user.department === "관리부" && (
          <div className="modalplusbtn">
            {ismanagerMode ? (
              <>
                <div className="document_gap">
                  <button onClick={() => setIsManagerMode(false)}>
                    <div style={{ display: "flex" }}>
                      <img className="document_openSetting" src={openSetting} />
                      <img className="document_Arrow" src={document_Arrow} />
                    </div>
                  </button>

                  <button onClick={() => setIsPopupOpen(true)}>
                    <img src={addDocumentImage} />
                  </button>
                  <button
                    onClick={() => {
                      setIsDeletePopUpOpen(true);
                    }}
                  >
                    <img src={removeDocument} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="document_gap">
                  <button
                    style={{ width: "auto" }}
                    onClick={() => {
                      setIsManagerMode(true);
                      setTeamEditModes((prev) => prev.map(() => false));
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <img className="document_Arrow2" src={document_Arrow} />
                      <img className="document_openSetting" src={openSetting} />
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {user.position === "부서장" || user.position === "연구실장" ? (
          teamData.map((data: any, index: number) => (
            <div className="project_content" key={data.name}>
              <div
                className="project_name_container"
                onClick={() => toggleTeamDocs(index)}
              >
                <div className="name_leftTop">
                  <img
                    src={isTeamDocsOpen2[index] ? slide_downArrow : Right_Arrow}
                    alt="toggle"
                  />
                  <span className="project_name">{data.name}</span>
                </div>
              </div>

              {isTeamDocsOpen2[index] && (
                <div className="team_documents_content">
                  <div className="TeamDocBox">
                    {data.data?.map((doc: any, index: any) => (
                      <div className="TeamDocBox" key={index}>
                        <div
                          className={
                            selectItem === doc.documentId
                              ? "TeamDocActive"
                              : "TeamDoc"
                          }
                          onClick={() => {
                            selectBox(doc.documentId, doc);
                          }}
                        >
                          <div className="DocTitle">{doc.docTitle}</div>
                          <div className="DocNum">
                            {doc.docNumber}

                            {selectedDocId === doc.documentId &&
                            ismanagerMode === false ? (
                              <div className="docNumControls">
                                <button
                                  className="num-up-button"
                                  onClick={() => {
                                    //   handleNumberIncrease(index, "Team")
                                    up(doc.documentId);
                                  }}
                                >
                                  <img src={spinnerTop} />
                                </button>
                                <button
                                  className="num-down-button"
                                  onClick={() => {
                                    //   handleNumberDecrease(index, "Team")
                                    down(doc.documentId);
                                  }}
                                >
                                  <img src={spinnerBtm} />
                                </button>
                              </div>
                            ) : null}
                          </div>
                          <div className="DocPerson">
                            {doc.username ? doc.username : "관리부 수정"}{" "}
                            {doc.userposition
                              ? doc.userposition
                              : doc.docPersondept}
                          </div>
                          <button
                            className="edit-button"
                            onClick={() =>
                              ismanagerMode
                                ? handleManagEditClick(doc.documentId)
                                : selectedDocId === doc.documentId
                                ? handleEditConfirm(index, doc.documentId)
                                : handleEditClick(index, doc.documentId, "Team")
                            }
                          >
                            {ismanagerMode
                              ? "수정"
                              : selectedDocId === doc.documentId
                              ? "확인"
                              : "편집"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="project_content">
            <div
              className="project_name_container"
              onClick={() => setIsTeamDocsOpen((prev) => !prev)}
            >
              <div className="name_leftTop">
                <img
                  src={isTeamDocsOpen ? slide_downArrow : Right_Arrow}
                  alt="toggle"
                />
                <span className="project_name">팀 문서</span>
              </div>
            </div>

            {isTeamDocsOpen && (
              <div className="team_documents_content">
                <div className="TeamDocBox">
                  {documents
                    .filter((doc) => doc.docType === "Team")
                    .map((doc, index) => (
                      <div className="TeamDocBox" key={index}>
                        <div
                          className={
                            selectItem === doc.documentId
                              ? "TeamDocActive"
                              : "TeamDoc"
                          }
                          onClick={() => {
                            selectBox(doc.documentId, doc);
                          }}
                        >
                          <div className="DocTitle">{doc.docTitle}</div>
                          <div className="DocNum">
                            {doc.docNumber}

                            {selectedDocId === doc.documentId && (
                              <div className="docNumControls">
                                <button
                                  className="num-up-button"
                                  onClick={() => {
                                    //   handleNumberIncrease(index, "Team")
                                    up(doc.documentId);
                                  }}
                                >
                                  <img src={spinnerTop} />
                                </button>
                                <button
                                  className="num-down-button"
                                  onClick={() => {
                                    //   handleNumberDecrease(index, "Team")
                                    down(doc.documentId);
                                  }}
                                >
                                  <img src={spinnerBtm} />
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="DocPerson">
                            {doc.username ? doc.username : "관리부 수정"}{" "}
                            {doc.userposition
                              ? doc.userposition
                              : doc.docPersondept}
                          </div>
                          <button
                            className="edit-button"
                            onClick={() =>
                              ismanagerMode
                                ? handleManagEditClick(doc.documentId)
                                : selectedDocId === doc.documentId
                                ? handleEditConfirm(index, doc.documentId)
                                : handleEditClick(index, doc.documentId, "Team")
                            }
                          >
                            {ismanagerMode
                              ? "수정"
                              : selectedDocId === doc.documentId
                              ? "확인"
                              : "편집"}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="project_content">
          <div
            className="project_name_container"
            onClick={() => setIsPublicDocsOpen((prev) => !prev)}
          >
            <div className="name_leftBottom">
              <img
                src={isPublicDocsOpen ? slide_downArrow : Right_Arrow}
                alt="toggle"
              />
              <span className="project_name">공용 문서</span>
            </div>
          </div>

          {isPublicDocsOpen && (
            <div className="team_documents_content">
              <div className="TeamDocBox">
                {documents
                  .filter((doc) => doc.docType === "Public")
                  .map((doc, index) => (
                    <div className="TeamDocBox" key={index}>
                      <div
                        className={
                          selectItem === doc.documentId
                            ? "TeamDocActive"
                            : "TeamDoc"
                        }
                        onClick={() => {
                          selectBox(doc.documentId, doc);
                        }}
                      >
                        <div className="DocTitle">{doc.docTitle}</div>
                        <div className="DocNum">
                          {doc.docNumber}
                          {selectedDocId === doc.documentId && (
                            <div className="docNumControls">
                              <button
                                className="num-up-button"
                                onClick={() => {
                                  //   handleNumberIncrease(
                                  //     doc.documentId,
                                  //     "Public"
                                  //   );
                                  up(doc.documentId);
                                }}
                              >
                                <img src={spinnerTop} />
                              </button>
                              <button
                                className="num-down-button"
                                onClick={() => {
                                  //   handleNumberDecrease(
                                  //     doc.documentId,
                                  //     "Public"
                                  //   );
                                  down(doc.documentId);
                                }}
                              >
                                <img src={spinnerBtm} />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="DocPerson">
                          {doc.username ? doc.username : "관리부 수정"}{" "}
                          {doc.userposition
                            ? doc.userposition
                            : doc.docPersondept}
                        </div>
                        <button
                          className="edit-button"
                          onClick={() =>
                            ismanagerMode
                              ? handleManagEditClick(doc.documentId)
                              : selectedDocId === doc.documentId
                              ? handleEditConfirm(index, doc.documentId)
                              : handleEditClick(index, doc.documentId, "Public")
                          }
                        >
                          {ismanagerMode
                            ? "수정"
                            : selectedDocId === doc.documentId
                            ? "확인"
                            : "편집"}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* plusbtn클릭시 나오는 팝업창 */}

      <CustomModal
        isOpen={isPopupOpen} // 모달 열림 상태
        onClose={() => {
          setIsPopupOpen(false); // 모달 닫기
          setIsManagerEditMode(false);
          setSelectedDocTitle(staticTitle);
          setSelectedDocNumber(staticDocNumber);
        }}
        header="문서 추가"
        headerTextColor="#fff"
        footer1="취소"
        footer2={ismanagerEditMode ? "수정" : "추가"}
        footer1Class="gray-btn"
        footer2Class="back-green-btn"
        height="235px"
        width="350px"
        onFooter1Click={handleCancelClick}
        onFooter2Click={() => {
          if (ismanagerEditMode) {
            handleManagerEdit();
          } else {
            handleSubmit();
          }
        }}
      >
        <form
          className="body-container"
          onSubmit={(e) => {
            e.preventDefault();
            setIsPopupOpen(false);
            setIsSuccessPopupOpen(true);
          }}
        >
          <div className="formDiv">
            <div className="doc_docOption">
              <div className="division">문서 구분</div>
              <input
                type="radio"
                id="team"
                name="docType"
                value="Team"
                checked={
                  ismanagerEditMode
                    ? selectedDocType === "Team"
                    : addDocument.docType === "Team"
                }
                onChange={handleInputChange}
              />
              <label htmlFor="team" className="docetc">
                팀 문서
              </label>

              <input
                type="radio"
                id="share"
                name="docType"
                value="Public"
                checked={
                  ismanagerEditMode
                    ? selectedDocType === "Public"
                    : addDocument.docType === "Public"
                }
                onChange={handleInputChange}
              />
              <label htmlFor="share" className="docetc">
                공용 문서
              </label>
            </div>

            <div className="input-field">
              <label htmlFor="doc_docTitle">문서 제목</label>
              <input
                type="text"
                id="docTitle"
                name="docTitle"
                value={
                  ismanagerEditMode
                    ? selectedDocTitle ?? ""
                    : addDocument.docTitle
                }
                required
                placeholder="문서 제목을 입력해 주세요."
                onChange={handleInputChange}
              />
            </div>

            <div className="input-field">
              <label htmlFor="doc_docNumber">현재 문서 번호</label>
              <input
                type="text"
                id="docNumber"
                name="docNumber"
                value={
                  ismanagerEditMode
                    ? selectedDocNumber ?? ""
                    : addDocument.docNumber
                }
                required
                placeholder="시작될 문서 번호를 입력해 주세요."
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      </CustomModal>

      {/* 추가 버튼 클릭시 뜨는 창 */}
      <CustomModal
        isOpen={isSuccessPopupOpen} // 모달 열림 상태
        onClose={() => {
          setIsSuccessPopupOpen(false); // 모달 닫기
        }}
        header="알림"
        headerTextColor="#fff"
        footer1="확인"
        footer1Class="back-green-btn"
        height="200px"
        width="400px"
        onFooter1Click={handlePopup}
      >
        <div
          className="body-container"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div className="addDocu">
            <h2>새로운 문서가 추가 되었습니다.</h2>
          </div>
        </div>
      </CustomModal>

      {/* 문서 삭제 완료시 뜨는 창 */}
      <CustomModal
        isOpen={deleteAlertOpen} // 모달 열림 상태
        onClose={() => {
          setDeleteAlertOpen(false); // 모달 닫기
        }}
        header="알림"
        headerTextColor="#fff"
        footer1="확인"
        footer1Class="back-green-btn"
        height="200px"
        width="400px"
        onFooter1Click={() => {
          setDeleteAlertOpen(false);
        }}
      >
        <div
          className="body-container"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div className="addDocu">
            <h2>해당 문서가 삭제되었습니다.</h2>
          </div>
        </div>
      </CustomModal>

      {/* 문서 수정 완료시 뜨는 창 */}
      <CustomModal
        isOpen={editAlertOpen} // 모달 열림 상태
        onClose={() => {
          setEditAlertOpen(false); // 모달 닫기
        }}
        header="알림"
        headerTextColor="#fff"
        footer1="확인"
        footer1Class="back-green-btn"
        height="200px"
        width="400px"
        onFooter1Click={() => {
          setEditAlertOpen(false);
        }}
      >
        <div
          className="body-container"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div className="addDocu">
            <h2>문서가 수정되었습니다.</h2>
          </div>
        </div>
      </CustomModal>

      {/* 문서 번호 수정 완료시 뜨는 창 */}
      <CustomModal
        isOpen={editNumberAlertOpen} // 모달 열림 상태
        onClose={() => {
          setEditNumberAlertOpen(false); // 모달 닫기
          setSelectedDocId(null);
        }}
        header="알림"
        headerTextColor="#fff"
        footer1="확인"
        footer1Class="back-green-btn"
        height="200px"
        width="400px"
        onFooter1Click={() => {
          setEditNumberAlertOpen(false);
          setSelectedDocId(null);
        }}
      >
        <div
          className="body-container"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div className="addDocu">
            <h2>문서 번호가 {newDocNumber}로 변경되었습니다.</h2>
          </div>
        </div>
      </CustomModal>

      {/* 중복된 문서제목이 있을경우에 뜨는 창 */}
      <CustomModal
        isOpen={errorAlertOpen} // 모달 열림 상태
        onClose={() => {
          setErrorAlertOpen(false); // 모달 닫기
        }}
        header="알림"
        headerTextColor="#fff"
        footer1="확인"
        footer1Class="back-green-btn"
        height="200px"
        width="400px"
        onFooter1Click={() => {
          setErrorAlertOpen(false);
        }}
      >
        <div
          className="body-container"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div className="addDocu">
            <h2>중복 된 문서명입니다.</h2>
          </div>
        </div>
      </CustomModal>

      {/* 문서 삭제 버튼 클릭시 뜨는 창 */}
      <CustomModal
        isOpen={isDeletePopUpOpen} // 모달 열림 상태
        onClose={() => {
          setIsDeletePopUpOpen(false); // 모달 닫기
        }}
        header="알림"
        headerTextColor="#fff"
        footer1="취소"
        footer2="확인"
        footer1Class="gray-btn"
        footer2Class="back-green-btn"
        height="200px"
        width="400px"
        onFooter2Click={handleDeleteDocument}
        onFooter1Click={() => {
          setIsDeletePopUpOpen(false);
        }}
      >
        <div
          className="body-container"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div className="addDocu">
            <h2>해당 문서를 삭제하시겠습니까?</h2>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default IncludeReSlide;
