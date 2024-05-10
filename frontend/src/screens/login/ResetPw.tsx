import React, { useState } from "react";
import "./Register.scss";
import { Login_Logo, ArrowDown, ArrowUp } from "../../assets/images/index";
import {
    Modal,
    ModalContent,
    ModalHeader,
    useDisclosure,
    ModalBody,
} from '@chakra-ui/react';
import { ResetPwServices } from "../../services/login/RegisterServices";
import { Link } from "react-router-dom";

const ResetPw = () => {
    const [selectedOptions, setSelectedOptions] = useState({
        company: '',
        department: '',
        team: '',
        spot: '',
        position: ''
    });
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: isAddModalClose } = useDisclosure();
    const { isOpen: isNotModalOpen, onOpen: onNotdModalOpen, onClose: isNotModalClose } = useDisclosure();
    const [isSpot, setIsSpot] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [resetpassword, setResetPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [id, setUserID] = useState("");
    const [question1, setQuestion1] = useState("");
    const [question2, setQuestion2] = useState("");
    const [name, setName] = useState("");

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
        setResetPassword(event.target.value);
    };
    const handlerePwChange = (event: any) => {
        setConfirmPassword(event.target.value);
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
        if (!id || !name || !selectedOptions.spot || !phoneNumber || !question1 || !question2 || !resetpassword || !confirmPassword) {
            console.error("필수 항목을 모두 작성해주세요.");
            return;
        }

        const formData = {
            userID: id,
            username: name,
            spot: selectedOptions.spot,
            phoneNumber: phoneNumber,
            question1: question1,
            question2: question2,
            resetpassword: resetpassword
        };

        // API 호출
        ResetPwServices(formData)
            .then(response => {
                onAddModalOpen();
            })
            .catch(error => {
                // 오류 발생 시
                console.error("오류:", error);
                onNotdModalOpen();
            });
    };

    return (
        <div className="FindID">
            <div className="LogoBox">
                <Link to="/login">
                    <img className="ResLogo" src={Login_Logo} />
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
                            <span>{selectedOptions.spot ? selectedOptions.spot : '직위를 선택해주세요'}</span>
                            <img src={isSpot ? ArrowUp : ArrowDown} />
                        </div>
                        {isSpot && (
                            <div className="options">
                                <div className="op" onClick={() => handleOptionClick('spot', '사원')}>사원</div>
                                <div className="op" onClick={() => handleOptionClick('spot', '책임')}>책임</div>
                                <div className="op" onClick={() => handleOptionClick('spot', '수석')}>수석</div>
                                <div className="op" onClick={() => handleOptionClick('spot', '상무')}>상무</div>
                                <div className="op" onClick={() => handleOptionClick('spot', '전무')}>전무</div>
                                <div className="op" onClick={() => handleOptionClick('spot', '대표')}>대표</div>
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
                        {/* {passwordError ?
                            <input
                                type="password"
                                className={`TextInput ${passwordError && "Error"}`}
                                placeholder="비밀번호를 입력해 주세요."
                                value={password}
                                style={{ border: "1px solid #D56D6D" }}
                            />
                            : */}
                        <input
                            type="password"
                            className="TextInput"
                            placeholder="비밀번호를 입력해 주세요."
                            value={resetpassword}
                            onChange={handlePwChange}
                        />
                        {/* } */}
                    </div>
                    {/* <div className="ErrorMessageBox">
                        {passwordError && <div className="ErrorMessage">{passwordError}</div>}
                    </div> */}
                </div>
                <div className="MiniphoneBox">
                    <div className="Phone">
                        <span>패스워드 재입력</span>
                        {/* {confirmPasswordError ?
                            <input
                                type="password"
                                className={`TextInput ${confirmPasswordError && "Error"}`}
                                placeholder="비밀번호를 재입력해 주세요."
                                value={confirmPassword}
                                style={{ border: "1px solid #D56D6D" }}
                            />
                            : */}
                        <input
                            type="password"
                            className="TextInput"
                            placeholder="비밀번호를 재입력해 주세요."
                            value={confirmPassword}
                            onChange={handlerePwChange}
                        />
                        {/* } */}
                    </div>
                    {/* <div className="ErrorMessageBox">
                        {confirmPasswordError && <div className="ErrorMessage">{confirmPasswordError}</div>}
                    </div> */}
                </div>
            </div>


            <div className="ResBtnBox">
                <button className="ResBtn" onClick={handleSubmit}>확인</button>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={isAddModalClose} size='xl' isCentered={true}>
                <ModalContent width="400px" height='200px' borderRadius='5px'>
                    <ModalHeader className='ModalHeader' paddingLeft="15px" height='34px' color='white' bg='#746E58' border='0' fontFamily='var(--font-family-Noto)' borderTopRadius='5px' fontSize="14px">알림</ModalHeader>
                    <ModalBody className='ModalBody'>
                        패스워드 재설정이 완료되었습니다.
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Modal isOpen={isNotModalOpen} onClose={isNotModalClose} size='xl' isCentered={true}>
                <ModalContent width="400px" height='200px' borderRadius='5px'>
                    <ModalHeader className='ModalHeader' paddingLeft="15px" height='34px' color='white' bg='#746E58' border='0' fontFamily='var(--font-family-Noto)' borderTopRadius='5px' fontSize="14px">알림</ModalHeader>
                    <ModalBody className='ModalBody'>
                        패스워드 재설정에 실패했습니다.
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ResetPw;