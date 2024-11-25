import { useState } from "react";
import { ModalPlusButton, Right_Arrow, White_Arrow } from "../../assets/images/index";
import CustomModal from "../../components/modal/CustomModal";
import { AddDocuments } from "../../services/report/documentServices";
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';

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


    const toggleSlide = () => {
        setSlideVisible(prev => !prev)
    }

    const handleCancelClick = () => {
        setIsPopupOpen(false);
    }

    const handleInputChange = (e:any) => {
        const { name, value } = e.target;
        setAddDocument((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    
    const handlePopup = () => {
        setIsSuccessPopupOpen(false);
    }

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
        } catch (error) {
            console.error("문서 추가 실패:", error);
            alert("문서 추가에 실패했습니다.");
        }
    };

    return (
        <div className="project_slide_container">
            <div className={`project_slide ${slideVisible ? 'visible' : ''}`} onClick={toggleSlide}>
                <span className="additional_content_title">본사 문서 번호 관리</span>
                <img src={White_Arrow} alt="White Arrow" className={slideVisible ? "img_rotate" : ""} />
            </div>

            <div className={`additional_content ${slideVisible ? 'visible' : ''}`}>
                <div className="modalplusbtn">
                    <button onClick={() => setIsPopupOpen(true)}>
                        <img src={ModalPlusButton} alt="plusbutton" />
                    </button>
                </div>

                <div className="project_content">
                    <div className="project_name_container" onClick={() => setIsTeamDocsOpen(prev => !prev)}>
                        <div className="name_leftTop">
                            <img src={Right_Arrow} alt="toggle" />
                            <span className="project_name">팀 문서</span>
                        </div>
                    </div>

                    {isTeamDocsOpen && (
                        <div className="team_documents_content">
                            {/* 팀 문서 내용 여기 추가 */}
                            <ul>
                                <li>팀 문서 1</li>
                                <li>팀 문서 2</li>
                                <li>팀 문서 3</li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="project_content">
                    <div className="project_name_container" onClick={() => setIsPublicDocsOpen(prev => !prev)}>
                        <div className="name_leftBottom">
                            <img src={Right_Arrow} alt="toggle" />
                            <span className="project_name">공용 문서</span>
                        </div>
                    </div>

                    {isPublicDocsOpen && (
                        <div className="public_documents_content">
                            {/* 공용 문서 내용 여기 추가 */}
                            <ul>
                                <li>공용 문서 1</li>
                                <li>공용 문서 2</li>
                                <li>공용 문서 3</li>
                            </ul>
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
                footer2="추가"
                footer1Class="gray-btn"
                footer2Class="back-green-btn"
                height="235px"
                width="350px"
                onFooter1Click={handleCancelClick}
                 onFooter2Click={() => handleSubmit()} 
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
        value="팀 문서"
        checked={addDocument.docType === "팀 문서"}
        onChange={handleInputChange}
    />
    <label htmlFor="team" className="docetc">팀 문서</label>

    <input
        type="radio"
        id="share"
        name="docType"
        value="공용 문서"
        checked={addDocument.docType === "공용 문서"}
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
        value={addDocument.docTitle}
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
        value={addDocument.docNumber}
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
                footer1Class="footer-button"
                height="200px"
                width="400px"
                onFooter1Click={handlePopup}
            >
                <div className="body-container">
                    <div className="popup_content2">
                        <h2>새로운 문서가 추가 되었습니다.</h2>
                    </div>
                </div>
            </CustomModal>
        </div >
    )
}

export default IncludeReSlide;