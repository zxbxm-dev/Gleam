import React, { useState } from "react";
import "./Register.scss";
import { Login_Logo, ArrowDown, ArrowUp } from "../../assets/images/index";
import CustomModal from '../../components/modal/CustomModal';
import { ResetPwServices } from "../../services/login/RegisterServices";
import { useNavigate, Link } from "react-router-dom";

const ResetPw = () => {
    let navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState({
        company: '',
        department: '',
        team: '',
        spot: '',
        position: ''
    });
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    const [isFaliedIdModalOpen, setFaliedModalOpen] = useState(false);
    const [isSpot, setIsSpot] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [resetpassword, setResetPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [id, setUserID] = useState("");
    const [question1, setQuestion1] = useState("");
    const [question2, setQuestion2] = useState("");
    const [name, setName] = useState("");

    const handleFooter1Click = () => {
        setSuccessModalOpen(false);
        navigate('/login');
    };

    const handleFooter2Click = () => {
        setFaliedModalOpen(false);
    };

    const handleIDChange = (event: any) => {
        setUserID(event.target.value);
    };
    const handleques1Change = (event: any) => {
        setQuestion1(event.target.value);
    };
    const handleques2Change = (event: any) => {
        setQuestion2(event.target.value);
    };
    const handleNameChange = (event: any) => {
        setName(event.target.value);
    };
    const handlePhoneChange = (event: any) => {
        setPhoneNumber(event.target.value);
    };

    const handlePwChange = (event: any) => {
        const value = event.target.value;
        setResetPassword(value);
        setPasswordError(!validatePassword(value) ? "비밀번호는 영어, 숫자, 특수문자를 포함한 8자리 이상이여야 합니다." : "");
    };

    const handlerePwChange = (event: any) => {
        const value = event.target.value;
        setConfirmPassword(value);
        setConfirmPasswordError(value !== resetpassword ? "비밀번호가 일치하지 않습니다." : "");
    };

    const validatePassword = (password: any) => {
        const PasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return PasswordRegex.test(password);
    };


    const toggleSelect = () => {
        setIsSpot(!isSpot);
    }

    const handleOptionClick = (optionName: any, optionValue: any) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [optionName]: optionValue
        }));

        setIsSpot(false);
    };

    const handleSubmit = () => {
        if (!id || !name || !selectedOptions.position || !phoneNumber || !question1 || !question2 || !resetpassword || !confirmPassword) {
            console.error("필수 항목을 모두 작성해주세요.");
            return;
        }

        const formData = {
            userID: id,
            username: name,
            position: selectedOptions.position,
            phoneNumber: phoneNumber,
            question1: question1,
            question2: question2,
            resetpassword: resetpassword
        };

        // API 호출
        ResetPwServices(formData)
            .then(response => {
                setSuccessModalOpen(true);
            })
            .catch(error => {
                // 오류 발생 시
                console.error("오류:", error);
                setFaliedModalOpen(true);
            });
    };

    return (
        <div className="FindID">
            <div className="LogoBox">
                <Link to="/login">
                    <img className="ResLogo" src={Login_Logo} alt="LoginLogo" />
                </Link>
                <span className="ResText">패스워드 재설정</span>
            </div>
            <div className="RegistorBox">
                <div className="MiniBox">
                    <span>아이디 입력</span>
                    <input type="text" className="TextInput" placeholder="아이디를 입력해 주세요." onChange={handleIDChange} />
                </div>
                <div className="MiniBox">
                    <span>성명 입력</span>
                    <input type="text" className="TextInput" placeholder="성명을 입력해 주세요." onChange={handleNameChange} />
                </div>
                <div className="MiniphoneBox">
                    <div className="Phone">
                        <span>휴대폰 번호 입력</span>
                        {/* {phoneNumberError ?
                            <input
                                type="text"
                                className={`TextInput ${phoneNumberError && "Error"}`}
                                placeholder="휴대폰 번호를 입력해 주세요."
                                value={phoneNumber}
                                style={{ border: "1px solid #D56D6D" }}
                            />
                            : */}
                        <input
                            type="text"
                            className="TextInput"
                            placeholder="휴대폰 번호를 입력해 주세요."
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                        />
                        {/* } */}
                    </div>
                    {/* <div className="ErrorMessageBox">
                        {phoneNumberError && <div className="ErrorMessage">{phoneNumberError}</div>}
                    </div> */}
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
                <div className="MinisBox">
                    <span>
                        패스워드 재설정<br />
                        본인 확인용 질문<br />
                        (2개 다 입력)
                    </span>
                    <div className="Question">
                        <div className="Ques">
                            <span>어머니의 성은 무엇입니까?</span>
                            <input type="text" className="TextInput" placeholder="답을 입력해 주세요." onChange={handleques1Change} />
                        </div>
                        <div className="Ques">
                            <span>졸업한 초등학교는 어디입니까?</span>
                            <input type="text" className="TextInput" placeholder="답을 입력해 주세요." onChange={handleques2Change} />
                        </div>
                    </div>
                </div>

                <div className="MiniphoneBox">
                    <div className="Phone">
                        <span>패스워드 설정</span>
                        {passwordError ?
                            <input
                                type="password"
                                className={`TextInput ${passwordError && "Error"}`}
                                placeholder="비밀번호를 입력해 주세요."
                                value={resetpassword}
                                onChange={handlePwChange}
                                style={{ border: "1px solid #D56D6D" }}
                            />
                            :
                            <input
                                type="password"
                                className={`TextInput ${passwordError && "Error"}`}
                                placeholder="비밀번호를 입력해 주세요."
                                value={resetpassword}
                                onChange={handlePwChange}
                            />
                        }
                    </div>
                    <div className="ErrorMessageBox">
                        {passwordError && <div className="ErrorMessage">{passwordError}</div>}
                    </div>
                </div>
                <div className="MiniphoneBox">
                    <div className="Phone">
                        <span>패스워드 재입력</span>
                        {confirmPasswordError ?
                            <input
                                type="password"
                                className={`TextInput ${confirmPasswordError && "Error"}`}
                                placeholder="비밀번호를 재입력해 주세요."
                                value={confirmPassword}
                                onChange={handlerePwChange}
                                style={{ border: "1px solid #D56D6D" }}
                            />
                            :
                            <input
                                type="password"
                                className={`TextInput ${confirmPasswordError && "Error"}`}
                                placeholder="비밀번호를 재입력해 주세요."
                                value={confirmPassword}
                                onChange={handlerePwChange}
                            />
                        }
                    </div>
                    <div className="ErrorMessageBox">
                        {confirmPasswordError && <div className="ErrorMessage">{confirmPasswordError}</div>}
                    </div>
                </div>
            </div>


            <div className="ResBtnBox">
                <button className="ResBtn" onClick={handleSubmit}>확인</button>
            </div>

            <CustomModal
                isOpen={isSuccessModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                header={'알림'}
                footer1={'확인'}
                footer1Class="green-btn"
                onFooter1Click={handleFooter1Click}
            >
                <div>
                    패스워드 재설정이 완료 되었습니다.
                </div>
            </CustomModal>

            <CustomModal
                isOpen={isFaliedIdModalOpen}
                onClose={() => setFaliedModalOpen(false)}
                header={'알림'}
                footer1={'확인'}
                footer1Class="green-btn"
                onFooter1Click={handleFooter2Click}
            >
                <div>
                    패스워드 재설정에 실패 했습니다.
                </div>
            </CustomModal>
        </div>
    )
}

export default ResetPw;