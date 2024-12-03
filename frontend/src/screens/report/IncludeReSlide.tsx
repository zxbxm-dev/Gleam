import { useState, useEffect } from "react";
import {
  slide_downArrow,
  Right_Arrow,
  White_Arrow,
  spinnerBtm,
  spinnerTop,
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

interface Document {
  documentId: number;
  docType: string;
  docTitle: string;
  docNumber: number;
  docPerson: string;
  docPersonTeam: string;
  docPersondept: string;
}

const IncludeReSlide = () => {
  const user = useRecoilValue(userState);
  const [slideVisible, setSlideVisible] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isTeamDocsOpen, setIsTeamDocsOpen] = useState(false);
  const [isPublicDocsOpen, setIsPublicDocsOpen] = useState(false);
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
  const [teamEditModes, setTeamEditModes] = useState<boolean[]>([]); // 팀 문서 편집 모드
  const [publicEditModes, setPublicEditModes] = useState<boolean[]>([]); // 공용 문서 편집 모드
  const [docNumber, setdocNumber] = useState<number | null>(null);
  const [selectItem, setSelectItem] = useState<number | null>(null);
  const [staticTitle, setStaticTitle] = useState<string | null>(null);

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
        setSelectedDocNumber(selectedDoc.docNumber);
        setSelectedDocType(selectedDoc.docType);
      }
    }
  }, [selectedDocId, documents]);

  //일반 사용자 - 편집
  const handleEditClick = (documentId: number, docType: string) => {
    setSelectedDocId(documents[documentId].documentId);

    if (docType === "Team") {
      setSelectedDocType("Team");
      setTeamEditModes((prev) => {
        const newEditModes = [...prev];
        newEditModes[documentId] = !newEditModes[documentId];
        return newEditModes;
      });
    } else if (docType === "Public") {
      setSelectedDocType("Public");
      setPublicEditModes((prev) => {
        const newEditModes = [...prev];
        newEditModes[documentId] = !newEditModes[documentId];
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
      setDocuments(response.data.documents || []);
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
        try {
          const response = await EditDocuments(id, updateData);
          setTeamEditModes((prev) => prev.map(() => false));
          setPublicEditModes((prev) => prev.map(() => false));
          console.log("문서 번호 수정 성공:", response.data);

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

  const selectBox = (id: number) => {
    setSelectItem(id);
  };

  const handleDeleteDocument = async () => {
    const data = {
      documentId: selectItem,
      documentType: selectedDocType,
      documentTitle: staticTitle,
    };
    const res = await DeleteDocument(data);

    console.log("삭제 성공? : ", res.data);
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
                <button onClick={() => setIsPopupOpen(true)}>추가</button>
                <button
                  onClick={() => {
                    handleDeleteDocument();
                  }}
                >
                  삭제
                </button>
                <button onClick={() => setIsManagerMode(false)}>닫기</button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsManagerMode(true);
                  setTeamEditModes((prev) => prev.map(() => false));
                }}
              >
                편집
              </button>
            )}
          </div>
        )}

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
                          selectBox(doc.documentId);
                        }}
                      >
                        <div className="DocTitle">{doc.docTitle}</div>
                        <div className="DocNum">
                          {doc.docNumber}

                          {teamEditModes[index] && (
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
                          {doc.docPerson}{" "}
                          {doc.docPersonTeam
                            ? doc.docPersonTeam
                            : doc.docPersondept}
                        </div>
                        <button
                          className="edit-button"
                          onClick={() =>
                            ismanagerMode
                              ? handleManagEditClick(doc.documentId)
                              : teamEditModes[index]
                              ? handleEditConfirm(index, doc.documentId)
                              : handleEditClick(index, "Team")
                          }
                        >
                          {ismanagerMode
                            ? "수정"
                            : teamEditModes[index]
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
                          selectBox(doc.documentId);
                        }}
                      >
                        <div className="DocTitle">{doc.docTitle}</div>
                        <div className="DocNum">
                          {doc.docNumber}
                          {publicEditModes[index] && (
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
                          {doc.docPerson}{" "}
                          {doc.docPersonTeam
                            ? doc.docPersonTeam
                            : doc.docPersondept}
                        </div>
                        <button
                          className="edit-button"
                          onClick={() =>
                            ismanagerMode
                              ? handleManagEditClick(doc.documentId)
                              : publicEditModes[index]
                              ? handleEditConfirm(index, doc.documentId)
                              : handleEditClick(index, "Public")
                          }
                        >
                          {ismanagerMode
                            ? "수정"
                            : publicEditModes[index]
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
    </div>
  );
};

export default IncludeReSlide;
