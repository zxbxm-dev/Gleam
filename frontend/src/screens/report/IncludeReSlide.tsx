import { useState } from "react";
import { ModalPlusButton, Right_Arrow, White_Arrow } from "../../assets/images/index";

const IncludeReSlide = () => {
    const [slideVisible, setSlideVisible] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

    const toggleSlide = () => {
        setSlideVisible(prev => !prev)
    }

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
                    <div className="project_name_container">
                        <div className="name_leftTop">
                            <img src={Right_Arrow} alt="toggle" />
                            <span className="project_name">팀 문서</span>
                        </div>
                    </div>

                    <div className="project_name_container">
                        <div className="name_leftBottom">
                            <img src={Right_Arrow} alt="toggle" />
                            <span className="project_name">공용 문서</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* plusbtn클릭시 나오는 팝업창 */}
            {
                isPopupOpen && (
                    <div className="popup">
                        <div className="popup_content">
                            <form>
                                <div className="formDiv">
                                    <div className="doc_docOption">
                                        <label>문서 구분</label>
                                        <input
                                            type="radio"
                                            id="team"
                                            name="docType"
                                            value="팀 문서"
                                        // checked={selectedDocType === "팀 문서"}
                                        // onChange={handleDocTypeChange}
                                        />
                                        <label htmlFor="team" className="docetc">팀 문서</label>

                                        <input
                                            type="radio"
                                            id="share"
                                            name="docType"
                                            value="공용 문서"
                                        // checked={selectedDocType === "공용 문서"}
                                        // onChange={handleDocTypeChange}
                                        />
                                        <label htmlFor="share" className="docetc">공용 문서</label>
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="doc_docTitle">문서 제목</label>
                                        <input
                                            type="text"
                                            id="docTitle"
                                            name="docTitle"
                                            // value={docTitle}
                                            // onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="doc_docNumber">현재 문서 번호</label>
                                        <input
                                            type="text"
                                            id="docNumber"
                                            name="docNumber"
                                            // value={docNumber}
                                            // onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                </div>


                                {/* 취소 및 추가 버튼 */}
                                <div className="button-container">
                                    <button type="button">취소</button>
                                    <button type="submit" onClick={() => {
                                        setIsPopupOpen(false)
                                        setIsSuccessPopupOpen(true);
                                        }}>추가</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* 추가 버튼 클릭시 뜨는 창 */}
            {
                isSuccessPopupOpen && (
                    <div className="popup2">
                        <div className="popup_content2">
                            <h2>새로운 문서가 추가 되었습니다.</h2>
                            <p className="button-container">
                                <button onClick={() => setIsSuccessPopupOpen(false)}>확인</button>
                            </p>
                        </div>
                    </div>
                )
            }


        </div>
    )
}

export default IncludeReSlide;