import React, { useState } from "react";
import { Login_Logo, ArrowDown, ArrowUp, ModalCheck } from "../../assets/images/index";
import "./FindID.scss";
import CustomModal from '../../components/modal/CustomModal';
import { FindIDServices } from "../../services/login/RegisterServices";
import { useNavigate, Link } from "react-router-dom";

const FindID = () => {
    let navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState({ position: '' });
    const [isSpot, setIsSpot] = useState(false);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isNotUserModalOpen, setNotUserModalOpen] = useState(false);
    const [isFindIdModalOpen, setFindIdModalOpen] = useState(false);
    const [findID, setFindID] = useState("");

    const handleFooter1Click = () => {
        setFindIdModalOpen(false);
        navigate('/resetpw');
    };

    const handleFooter2Click = () => {
        setFindIdModalOpen(false);
        navigate('/login');
    };

    const handleNameChange = (event: any) => {
        setName(event.target.value);
    };

    const handlePhoneChange = (event: any) => {
        setPhoneNumber(event.target.value);
    };

    const handleOptionClick = (optionName: any, optionValue: any) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [optionName]: optionValue
        }));

        setIsSpot(false);
    };

    const toggleSelect = () => {
        setIsSpot(!isSpot);
    }

    const handleSubmit = () => {
        if (!name || !phoneNumber || !selectedOptions.position) {
            console.error("필수 항목을 모두 작성해주세요.");
            return;
        }

        const formData = {
            username: name,
            position: selectedOptions.position,
            phoneNumber: phoneNumber
        };

        // API 호출
        FindIDServices(formData)
            .then(response => {
                setFindID(response.data.userId);
                setFindIdModalOpen(true);
            })
            .catch(error => {
                // 오류 발생 시
                console.error("오류:", error);
                setNotUserModalOpen(true);
            });
    };

    return (
        <div className="FindID">
            <div className="LogoBox">
                <Link to="/login">
                    <img className="ResLogo" src={Login_Logo} alt="LoginLogo" />
                </Link>
                <span className="ResText">아이디 찾기</span>
            </div>

            <div className="FindBox">
                <div className="MiniBox">
                    <span>성명 입력</span>
                    <input className="TextInput" type="text" onChange={handleNameChange} />
                </div>
                <div className="MiniBox">
                    <span>핸드폰 번호</span>
                    <input className="TextInput" type="text" onChange={handlePhoneChange} />
                </div>
                <div className="flexbox">
                    <span className="FlexSpan">직위</span>
                    <div className="custom-select">
                        <div className="select-header" onClick={() => toggleSelect()}>
                            <span>{selectedOptions.position ? selectedOptions.position : '직위를 선택해주세요'}</span>
                            <img src={isSpot ? ArrowUp : ArrowDown} alt="Arrow" />
                        </div>
                        {isSpot && (
                            <div className="options">
                                <div className="op" onClick={() => handleOptionClick('position', '사원')}>사원</div>
                                <div className="op" onClick={() => handleOptionClick('position', '연구원')}>연구원</div>
                                <div className="op" onClick={() => handleOptionClick('position', '팀장')}>팀장</div>
                                <div className="op" onClick={() => handleOptionClick('position', '연구실장')}>연구실장</div>
                                <div className="op" onClick={() => handleOptionClick('position', '부서장')}>부서장</div>
                                <div className="op" onClick={() => handleOptionClick('position', '이사')}>이사</div>
                                <div className="op" onClick={() => handleOptionClick('position', '대표이사')}>대표이사</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="FindIDBtn">
                <button onClick={handleSubmit}>확인</button>
            </div>

            <CustomModal
                isOpen={isFindIdModalOpen}
                onClose={() => setFindIdModalOpen(false)}
                header={'알림'}
                height="300px"
                footer1={'비밀번호 재설정'}
                footer1Class="green-btn"
                onFooter1Click={handleFooter1Click}
                footer2={'로그인'}
                footer2Class="back-green-btn"
                onFooter2Click={handleFooter2Click}
            >
                <img src={ModalCheck} alt="ModalCheck" className="FindID-img" />

                아이디 찾기 완료<br />
                아이디 : {findID}
            </CustomModal>

            <CustomModal
                isOpen={isNotUserModalOpen}
                onClose={() => setNotUserModalOpen(false)}
                header={'알림'}
            >
                <div>
                    가입된 정보가 없습니다.
                </div>
            </CustomModal>
        </div>
    )
}

export default FindID;