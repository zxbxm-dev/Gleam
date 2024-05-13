import React, { useState } from "react";
import { Login_Logo, ArrowDown, ArrowUp, ModalCheck } from "../../assets/images/index";
import "./FindID.scss";
import {
    Modal,
    ModalContent,
    ModalHeader,
    useDisclosure,
    ModalBody,
} from '@chakra-ui/react';
import { FindIDServices } from "../../services/login/RegisterServices";
import { Link } from "react-router-dom";

const FindID = () => {
    const [selectedOptions, setSelectedOptions] = useState({ spot: '' });
    const [isSpot, setIsSpot] = useState(false);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: isAddModalClose } = useDisclosure();
    const { isOpen: isNotModalOpen, onOpen: onNotdModalOpen, onClose: isNotModalClose } = useDisclosure();


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
        if (!name || !phoneNumber || !selectedOptions.spot) {
            console.error("필수 항목을 모두 작성해주세요.");
            return;
        }

        const formData = {
            username: name,
            spot: selectedOptions.spot,
            phoneNumber: phoneNumber
        };

        // API 호출
        FindIDServices(formData)
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
                    <img className="ResLogo" src={Login_Logo} alt="LoginLogo"/>
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
                            <span>{selectedOptions.spot ? selectedOptions.spot : '직위를 선택해주세요'}</span>
                            <img src={isSpot ? ArrowUp : ArrowDown} alt="Arrow"/>
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
            </div>
            <div className="FindIDBtn">
                <button onClick={handleSubmit}>확인</button>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={isAddModalClose} size='xl' isCentered={true}>
                <ModalContent width="400px" height='200px' borderRadius='5px'>
                    <ModalHeader className='ModalHeader' paddingLeft="15px" height='34px' color='white' bg='#746E58' border='0' fontFamily='var(--font-family-Noto)' borderTopRadius='5px' fontSize="14px">알림</ModalHeader>
                    <ModalBody className='ModalBody'>
                        <img src={ModalCheck} alt="ModalCheck"/>

                        아이디 찾기 완료<br />
                        아이디 :

                        <div>
                            <button>비밀번호 재설정</button>
                            <button>로그인</button>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal isOpen={isNotModalOpen} onClose={isNotModalClose} size='xl' isCentered={true}>
                <ModalContent width="400px" height='200px' borderRadius='5px'>
                    <ModalHeader className='ModalHeader' paddingLeft="15px" height='34px' color='white' bg='#746E58' border='0' fontFamily='var(--font-family-Noto)' borderTopRadius='5px' fontSize="14px">알림</ModalHeader>
                    <ModalBody className='ModalBody'>
                        가입된 정보가 없습니다.
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default FindID;