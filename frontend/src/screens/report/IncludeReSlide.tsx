import { useState, useEffect } from "react";
import { slide_downArrow, Right_Arrow, White_Arrow, spinnerBtm, spinnerTop } from "../../assets/images/index";
import CustomModal from "../../components/modal/CustomModal";
import { AddDocuments, GetDocuments, EditDocuments, ManagerEditDocuments } from "../../services/report/documentServices";
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';

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
    const [editModes, setEditModes] = useState(
        documents.map(() => false) // 각 문서마다 false로 초기화
    );
    const [ismanagerEditMode, setIsManagerEditMode] = useState(false); // 관리부 - 편집 버튼 상태
    const [editDocumentId, setEditDocumentId] = useState<number | null>(null);
    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
console.log(editDocumentId);

const handleManagEditClick = (documentId: number) => {
    setSelectedDocId(documents[documentId].documentId);
    // setEditModes((prev) => {
    //     const newEditModes = [...prev];
    //     newEditModes[documentId] = !newEditModes[documentId];
    //     setEditDocumentId(documentId);
    //     return newEditModes;
    // });
};

    const handleEditClick = (documentId: number) => {
        setSelectedDocId(documents[documentId].documentId);
        setEditModes((prev) => {
            const newEditModes = [...prev];
            newEditModes[documentId] = !newEditModes[documentId];
            setEditDocumentId(documentId);
            return newEditModes;
        });
    };

    // 컴포넌트 렌더링 시 문서 데이터 가져오기
    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        const userID = user.userID;

        try {
            const response = await GetDocuments(userID);
            setDocuments(response.data.documents);
        } catch (error) {
            console.error("문서 조회 실패:", error);
        }
    };

    const toggleSlide = () => {
        setSlideVisible(prev => !prev)
    }

    const handleCancelClick = () => {
        setIsPopupOpen(false);
    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;

        const updatedValue = name === 'docNumber' ? Number(value) : value;

        setAddDocument((prev) => ({
            ...prev,
            [name]: updatedValue,
        }));
    };

    const handlePopup = () => {
        setIsSuccessPopupOpen(false);
    }

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


    const handleNumberIncrease = (index: number) => {
        setDocuments((prevDocuments) => {
            const updatedDocuments = [...prevDocuments];
            updatedDocuments[index] = {
                ...updatedDocuments[index],
                docNumber: updatedDocuments[index].docNumber + 1,
            };
            return updatedDocuments;
        });
    };

    const handleNumberDecrease = (index: number) => {
        setDocuments((prevDocuments) => {
            const updatedDocuments = [...prevDocuments];
            updatedDocuments[index] = {
                ...updatedDocuments[index],
                docNumber: Math.max(updatedDocuments[index].docNumber - 1, 0),
            };
            return updatedDocuments;
        });
    };

    //문서번호 수정
    const handleEditConfirm = async (index: any) => {
        const updatedDoc = documents[index];
        const updateData = {
            docTitle: updatedDoc.docTitle,
            docNumber: updatedDoc.docNumber,
            userName: user.username,
            userposition: user.position,
        };

        try {
            const response = await EditDocuments(selectedDocId, updateData);
            console.log("문서 번호 수정 성공:", response.data);
            fetchDocuments();
        } catch (error) {
            console.error("문서 번호 수정 실패:", error);
            alert("문서 번호 수정에 실패했습니다.");
        }
    };



    //관리팀 - 문서번호 수정
    const handleManagerEdit = async (index: any) => {
        const updatedDoc = documents[index];
        const updateData = {
            docTitle: updatedDoc.docTitle,
            docNumber: updatedDoc.docNumber,
            userName: user.username,
            userposition: user.position,
        };

        try {
            const response = await ManagerEditDocuments(selectedDocId, updateData);
            console.log("문서 번호 수정 성공:", response.data);
            fetchDocuments();
        } catch (error) {
            console.error("문서 번호 수정 실패:", error);
            alert("문서 번호 수정에 실패했습니다.");
        }
    };

    return (
        <div className="project_slide_container">
            <div className={`project_slide ${slideVisible ? 'visible' : ''}`} onClick={toggleSlide}>
                <span className="additional_content_title">{user.company} 문서 번호 관리</span>
                <img src={White_Arrow} alt="White Arrow" className={slideVisible ? "img_rotate" : ""} />
            </div>

            <div className={`additional_content ${slideVisible ? 'visible' : ''}`}>
                {user.department === "관리부" &&
                    <div className="modalplusbtn">
                        {ismanagerEditMode ? (
                            <>
                                <button onClick={() => setIsPopupOpen(true)}>추가</button>
                                <button>삭제</button>
                                <button onClick={() => setIsManagerEditMode(false)}>닫기</button>
                            </>
                        ) : (
                            <button onClick={() => setIsManagerEditMode(true)}>편집</button>
                        )}
                    </div>
                }

                <div className="project_content">
                    <div className="project_name_container" onClick={() => setIsTeamDocsOpen(prev => !prev)}>
                        <div className="name_leftTop">
                            <img src={isTeamDocsOpen ? slide_downArrow : Right_Arrow} alt="toggle" />
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
                                            <div className="TeamDoc">
                                                <div className="DocTitle">{doc.docTitle}</div>
                                                <div className="DocNum">
                                                    {doc.docNumber}
                                                    {editModes[index] && (
                                                        <div className="docNumControls">
                                                            <button
                                                                className="num-up-button"
                                                                onClick={() => handleNumberIncrease(index)}
                                                            >
                                                                <img src={spinnerTop} />
                                                            </button>
                                                            <button
                                                                className="num-down-button"
                                                                onClick={() => handleNumberDecrease(index)}
                                                            >
                                                                <img src={spinnerBtm} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="DocPerson">
                                                    {doc.docPerson} {doc.docPersonTeam ? doc.docPersonTeam : doc.docPersondept}
                                                </div>
                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        ismanagerEditMode
                                                            ? setIsPopupOpen(true)
                                                            : editModes[index]
                                                                ? handleEditConfirm(index)
                                                                : handleEditClick(index)
                                                    }
                                                >
                                                    {ismanagerEditMode ? "수정" : editModes[index] ? "확인" : "편집"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="project_content">
                    <div className="project_name_container" onClick={() => setIsPublicDocsOpen(prev => !prev)}>
                        <div className="name_leftBottom">
                            <img src={isPublicDocsOpen ? slide_downArrow : Right_Arrow} alt="toggle" />
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
                                            <div className="TeamDoc">
                                                <div className="DocTitle">{doc.docTitle}</div>
                                                <div className="DocNum">
                                                    {doc.docNumber}
                                                    {editModes[index] && (
                                                        <div className="docNumControls">
                                                            <button
                                                                className="num-up-button"
                                                                onClick={() => handleNumberIncrease(index)}
                                                            >
                                                                <img src={spinnerTop} />
                                                            </button>
                                                            <button
                                                                className="num-down-button"
                                                                onClick={() => handleNumberDecrease(index)}
                                                            >
                                                                <img src={spinnerBtm} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="DocPerson">
                                                    {doc.docPerson} {doc.docPersonTeam ? doc.docPersonTeam : doc.docPersondept}
                                                </div>
                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        ismanagerEditMode
                                                            ? handleEditClick(index)
                                                            : editModes[index]
                                                                ? handleEditConfirm(index)
                                                                : handleEditClick(index)
                                                    }
                                                >
                                                    {ismanagerEditMode ? "수정" : editModes[index] ? "확인" : "편집"}
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
                }}
                header="문서 추가"
                headerTextColor="#fff"
                footer1="취소"
                footer2={ismanagerEditMode?"수정" :"추가"}
                footer1Class="gray-btn"
                footer2Class="back-green-btn"
                height="235px"
                width="350px"
                onFooter1Click={handleCancelClick}
                onFooter2Click={() => {
                    if (ismanagerEditMode && selectedDocId !== null) {
                        handleManagerEdit(selectedDocId);
                    } else {
                        handleSubmit();
                    }
                }}
            >
                <form className="body-container" onSubmit={(e) => {
                    e.preventDefault();
                    setIsPopupOpen(false);
                    setIsSuccessPopupOpen(true);
                }}>
                    <div className="formDiv">
                        <div className="doc_docOption">
                            <div className="division">문서 구분</div>
                            <input
                                type="radio"
                                id="team"
                                name="docType"
                                value="Team"
                                checked={addDocument.docType === "Team" || (ismanagerEditMode && editDocumentId !== null && documents[editDocumentId]?.docType === "Team")}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="team" className="docetc">팀 문서</label>

                            <input
                                type="radio"
                                id="share"
                                name="docType"
                                value="Public"
                                checked={addDocument.docType === "Public" || (ismanagerEditMode && editDocumentId !== null && documents[editDocumentId]?.docType === "Public")}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="share" className="docetc">공용 문서</label>
                        </div>

                        <div className="input-field">
                            <label htmlFor="doc_docTitle">문서 제목</label>
                            <input
                                type="text"
                                id="docTitle"
                                name="docTitle"
                                value={ismanagerEditMode && selectedDocId !== null ? documents[selectedDocId]?.docTitle : addDocument.docNumber}
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
                                value={ismanagerEditMode && selectedDocId !== null ? documents[selectedDocId]?.docNumber : addDocument.docNumber}
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
                <div className="body-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <div className="addDocu">
                        <h2>새로운 문서가 추가 되었습니다.</h2>
                    </div>
                </div>
            </CustomModal>
        </div >
    )
}

export default IncludeReSlide;