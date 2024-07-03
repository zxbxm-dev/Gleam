import React, { useState } from "react";
import "./Register.scss";
import { Login_Logo, DeleteIcon, ArrowDown, ArrowUp, FileUploadIcon } from "../../assets/images/index";
import { RegisterEditServices } from "../../services/login/RegisterServices";
import CustomModal from "../../components/modal/CustomModal";
import { Link } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';

interface SelectedOptions {
    company: string;
    department: string;
    team: string;
    spot: string;
    position: string;
    phoneNumber: string;
    password: string;
}
const EditRegis = () => {
    const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
        company: '',
        department: '',
        team: '',
        spot: '',
        position: '',
        phoneNumber: '',
        password: ''
    });

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isDepart, setIsDepart] = useState(false);
    const [isTeam, setIsTeam] = useState(false);
    const [isSpot, setIsSpot] = useState(false);
    const [isPosition, setIsPosition] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [attachment, setAttachment] = useState<File | null>(null);
    const [Sign, setSign] = useState<File | null>(null);
    const [formData, setFormData] = useState<SelectedOptions>({
        company: '',
        department: '',
        team: '',
        spot: '',
        position: '',
        phoneNumber: '',
        password: ''
    });
    const user = useRecoilValue(userState);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAttachment(file);
        }
    };

    const handleSignFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSign(file);
        }
    };

    const handleInputChange = (event: any, field: any) => {
        const value = event.target.value;
        const restrictedCharsRegex = /[{}[\]()]/

        // 입력값이 제한된 문자를 포함하는지 확인
        if (restrictedCharsRegex.test(value)) {
            // 제한된 문자를 포함하고 있으면 처리하지 않음
            return;
        }

        setSelectedOptions(prevOptions => ({
            ...prevOptions,
            [field]: value
        }));

        switch (field) {
            case 'password':
                setPassword(value);
                setPasswordError(!validatePassword(value) ? "비밀번호는 영어, 숫자, 특수문자를 포함한 8자리 이상이여야 합니다." : "");
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                setConfirmPasswordError(value !== selectedOptions.password ? "비밀번호가 일치하지 않습니다." : "");
                break;
            case 'phoneNumber':
                setPhoneNumber(value);
                setPhoneNumberError(!validatePhoneNumber(value) ? "유효한 휴대폰 번호를 입력하세요." : "");
                break;
            default:
                break;
        }
    };

	const validatePhoneNumber = (phone: any) => {
		const phoneRegex = /^\d{8,12}$/;
		return phoneRegex.test(phone);
	};

    const validatePassword = (password: any) => {
        const PasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return PasswordRegex.test(password);
    };

    const handleOptionClick = (optionName: any, optionValue: any) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [optionName]: optionValue
        }));

        if (optionName === 'company') {
            setSelectedOptions(prevState => ({
                ...prevState,
                department: '',
                team: ''
            }));
            setIsDepart(false);
            setIsTeam(false);
        }

        setIsTeam(false);
        setIsDepart(false);
        setIsSpot(false);
        setIsPosition(false);
    };

    const toggleSelect = (dropdownIndex: any) => {
        switch (dropdownIndex) {
            case 1:
                setIsDepart(!isDepart);
                setIsTeam(false);
                setIsSpot(false);
                setIsPosition(false);
                break;
            case 2:
                setIsTeam(!isTeam);
                setIsDepart(false);
                setIsSpot(false);
                setIsPosition(false);
                break;
            case 3:
                setIsSpot(!isSpot);
                setIsDepart(false);
                setIsTeam(false);
                setIsPosition(false);
                break;
            case 4:
                setIsPosition(!isPosition);
                setIsDepart(false);
                setIsTeam(false);
                setIsSpot(false);
                break;
            default:
                break;
        }
    };

    const renderTeams = () => {
        switch (selectedOptions.department) {
            case '알고리즘 연구실':
                return (
                    <>
                        <div className="op" onClick={() => handleOptionClick('team', '암호 연구팀')}>암호 연구팀</div>
                        <div className="op" onClick={() => handleOptionClick('team', 'AI 연구팀')}>AI 연구팀</div>
                    </>
                );
            case '동형분석 연구실':
                return (
                    <>
                        <div className="op" onClick={() => handleOptionClick('team', '동형분석 연구팀')}>동형분석 연구팀</div>
                    </>
                );
            case '블록체인 연구실':
                return (
                    <>
                        <div className="op" onClick={() => handleOptionClick('team', '크립토 블록체인 연구팀')}>크립토 블록체인 연구팀</div>
                        <div className="op" onClick={() => handleOptionClick('team', 'API 개발팀')}>API 개발팀</div>
                    </>
                );
            case '개발부':
                return (
                    <>
                        <div className="op" onClick={() => handleOptionClick('team', '개발 1팀')}>개발 1팀</div>
                        <div className="op" onClick={() => handleOptionClick('team', '개발 2팀')}>개발 2팀</div>
                    </>
                );
            case '관리부':
                return (
                    <>
                        <div className="op" onClick={() => handleOptionClick('team', '관리팀')}>관리팀</div>
                        <div className="op" onClick={() => handleOptionClick('team', '지원팀')}>지원팀</div>
                        <div className="op" onClick={() => handleOptionClick('team', '시설팀')}>시설팀</div>
                    </>
                );
            case '블록체인 사업부':
                return (
                    <>
                        <div className="op" onClick={() => handleOptionClick('team', '블록체인 1팀')}>블록체인 1팀</div>
                    </>
                );
            case '마케팅부':
                return (
                    <>
                        <div className="op" onClick={() => handleOptionClick('team', '디자인팀')}>디자인팀</div>
                        <div className="op" onClick={() => handleOptionClick('team', '기획팀')}>기획팀</div>
                    </>
                );
            default:
                return null;
        }
    };
    const handleSubmit = () => {
        const modifiedData: { [key: string]: string } = {};

        for (const key in formData) {
            if (formData.hasOwnProperty(key) && formData[key as keyof SelectedOptions] !== selectedOptions[key as keyof SelectedOptions]) {
                modifiedData[key as keyof SelectedOptions] = selectedOptions[key as keyof SelectedOptions];
            }
        }

        modifiedData.userID = user.id;

        // FormData 생성
        const formDataToSend = new FormData();
        for (const key in modifiedData) {
            if (modifiedData.hasOwnProperty(key)) {
                formDataToSend.append(key, modifiedData[key]);
            }
        }
        // 이미지 파일 추가
        if (attachment) {
            formDataToSend.append('attachment', attachment);
        }
        if (Sign) {
            formDataToSend.append('sign', Sign);
        }

        // API 호출
        RegisterEditServices(formDataToSend)
            .then(response => {
                setAddModalOpen(true);
            })
            .catch(error => {
                // 오류 발생 시
                console.error("오류:", error);
            });
    };


    return (
        <div className="Register">
            <Link to="/">
                <img className="ResLogo" src={Login_Logo} alt="LoginLogo" />
            </Link>
            <span className="ResText">회원정보 수정</span>

            <div className="RegistorBox">
                <div className="LeftFlex">
                    <div className="MiniBox">
                        <span>아이디 입력</span>
                        <span className="localinput">{user.id}</span>
                    </div>
                    <div className="MiniphoneBox">
                        <div className="Phone">
                            <span>패스워드 설정</span>
                            {passwordError ?
                                <input
                                    type="password"
                                    className={`TextInput ${passwordError && "Error"}`}
                                    placeholder="비밀번호를 입력해 주세요."
                                    value={password}
                                    onChange={(event) => handleInputChange(event, 'password')}
                                    style={{ border: "1px solid #D56D6D" }}
                                />
                                :
                                <input
                                    type="password"
                                    className={`TextInput ${passwordError && "Error"}`}
                                    placeholder="비밀번호를 입력해 주세요."
                                    value={password}
                                    onChange={(event) => handleInputChange(event, 'password')}
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
                                    onChange={(event) => handleInputChange(event, 'confirmPassword')}
                                    style={{ border: "1px solid #D56D6D" }}
                                />
                                :
                                <input
                                    type="password"
                                    className={`TextInput ${confirmPasswordError && "Error"}`}
                                    placeholder="비밀번호를 재입력해 주세요."
                                    value={confirmPassword}
                                    onChange={(event) => handleInputChange(event, 'confirmPassword')}
                                />}
                        </div>
                        <div className="ErrorMessageBox">
                            {confirmPasswordError && <div className="ErrorMessage">{confirmPasswordError}</div>}
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
                                <span className="localinput">{user.question1}</span>
                            </div>
                            <div className="Ques">
                                <span>졸업한 초등학교는 어디입니까?</span>
                                <span className="localinput">{user.question2}</span>
                            </div>
                        </div>
                    </div>
                    <div className="MiniBox">
                        <span>성명 입력</span>
                        <span className="localinput">{user.username}</span>
                    </div>
                    <div className="MiniphoneBox">
                        <div className="Phone">
                            <span>휴대폰 번호 입력</span>
                            {phoneNumberError ?
                                <input
                                    type="text"
                                    className={`TextInput ${phoneNumberError && "Error"}`}
                                    placeholder="휴대폰 번호를 입력해 주세요."
                                    value={phoneNumber}
                                    onChange={(event) => handleInputChange(event, 'phoneNumber')}
                                    style={{ border: "1px solid #D56D6D" }}
                                />
                                :
                                <input
                                    type="text"
                                    className={`TextInput ${phoneNumberError && "Error"}`}
                                    placeholder="휴대폰 번호를 입력해 주세요."
                                    value={phoneNumber}
                                    onChange={(event) => handleInputChange(event, 'phoneNumber')}
                                />
                            }
                        </div>
                        <div className="ErrorMessageBox">
                            {phoneNumberError && <div className="ErrorMessage">{phoneNumberError}</div>}
                        </div>
                    </div>
                    <div className="MinimBox">
                        <span>메일 입력</span>
                        <div className="localinput">{user.usermail}</div>
                    </div>
                </div>
                <div className="RightFlex">
                    <div className="MinimBox">
                        <span>입사일자</span>
                        <div className="localinput">{user.entering}</div>
                    </div>
                    <div className="UploadBox">
                        <span>증명사진 업로드</span>
                        <div className="attachment_content">
                            <label htmlFor="fileInput" className="primary_button">
                                <img src={FileUploadIcon} alt="FileUploadIcon" />
                                파일 첨부하기
                                <input
                                    id="fileInput"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                            </label>
                            <div className="attachmentBox">
                                {attachment ? <div className="attachment_name">{attachment.name}</div> : <div className="attachment_name">파일을 선택해 주세요.</div>}
                                {attachment && <img src={DeleteIcon} alt="DeleteIcon" onClick={() => setAttachment(null)} />}
                            </div>
                        </div>
                    </div>
                    <div className="UploadBox">
                        <span>서명 업로드</span>
                        <div className="attachment_content">
                            <label htmlFor="signfileInput" className="primary_button">
                                <img src={FileUploadIcon} alt="FileUploadIcon" />
                                파일 첨부하기
                                <input
                                    id="signfileInput"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={handleSignFileChange}
                                />
                            </label>
                            <div className="attachmentBox">
                                {Sign ? <div className="attachment_name">{Sign.name}</div> : <div className="attachment_name">파일을 선택해 주세요.</div>}
                                {Sign && <img src={DeleteIcon} alt="DeleteIcon" onClick={() => setAttachment(null)} />}
                            </div>
                        </div>
                    </div>
                    <div className="flexbox">
                        <span className="FlexSpan">회사 구분</span>
                        <fieldset>
                            <label>
                                <input type="radio" name="company" value="R&D" onClick={() => handleOptionClick('company', 'R&D')} />
                                <span>R&D</span>
                            </label>

                            <label>
                                <input type="radio" name="company" value="본사" onClick={() => handleOptionClick('company', '본사')} />
                                <span>본사</span>
                            </label>
                        </fieldset>
                    </div>
                    <div className="flexbox">
                        <span className="FlexSpan">부서</span>
                        <div className="custom-select">
                            <div className="select-header" onClick={() => toggleSelect(1)}>
                                <span>{selectedOptions.department ? selectedOptions.department : '부서를 선택해주세요'}</span>
                                <img src={isDepart ? ArrowUp : ArrowDown} alt="Arrow" />
                            </div>
                            {isDepart && (
                                <div className="options">
                                    {selectedOptions.company === 'R&D' ? (
                                        <>
                                            <div className="op" onClick={() => handleOptionClick('department', '알고리즘 연구실')}>알고리즘 연구실</div>
                                            <div className="op" onClick={() => handleOptionClick('department', '동형분석 연구실')}>동형분석 연구실</div>
                                            <div className="op" onClick={() => handleOptionClick('department', '블록체인 연구실')}>블록체인 연구실</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="op" onClick={() => handleOptionClick('department', '개발부')}>개발부</div>
                                            <div className="op" onClick={() => handleOptionClick('department', '관리부')}>관리부</div>
                                            <div className="op" onClick={() => handleOptionClick('department', '블록체인 사업부')}>블록체인 사업부</div>
                                            <div className="op" onClick={() => handleOptionClick('department', '마케팅부')}>마케팅부</div>
                                        </>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                    <div className="flexbox">
                        <span className="FlexSpan">팀</span>
                        <div className="custom-select">
                            <div className="select-header" onClick={() => toggleSelect(2)}>
                                <span>{selectedOptions.team ? selectedOptions.team : '팀을 선택해주세요'}</span>
                                <img src={isTeam ? ArrowUp : ArrowDown} alt="Arrow" />
                            </div>
                            {isTeam && (
                                <div className="options">
                                    {renderTeams()}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flexbox">
                        <span className="FlexSpan">직위</span>
                        <div className="custom-select">
                            <div className="select-header" onClick={() => toggleSelect(3)}>
                                <span>{selectedOptions.spot ? selectedOptions.spot : '직위를 선택해주세요'}</span>
                                <img src={isSpot ? ArrowUp : ArrowDown} alt="Arrow" />
                            </div>
                            {isSpot && (
                                <div className="options">
                                    <div className="op" onClick={() => handleOptionClick('spot', '사원')}>사원</div>
                                    <div className="op" onClick={() => handleOptionClick('spot', '책임')}>책임</div>
                                    <div className="op" onClick={() => handleOptionClick('spot', '수석')}>수석</div>
                                    <div className="op" onClick={() => handleOptionClick('spot', '상무')}>상무</div>
                                    <div className="op" onClick={() => handleOptionClick('spot', '전무')}>전무</div>
                                    <div className="op" onClick={() => handleOptionClick('spot', '대표이사')}>대표이사</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flexbox">
                        <span className="FlexSpan">직책</span>
                        <div className="custom-select">
                            <div className="select-header" onClick={() => toggleSelect(4)}>
                                <span>{selectedOptions.position ? selectedOptions.position : '직책을 선택해주세요'}</span>
                                <img src={isPosition ? ArrowUp : ArrowDown} alt="Arrow" />
                            </div>
                            {isPosition && (
                                <div className="options">
                                    {selectedOptions.company === 'R&D' ? (
                                        <>
                                            <div className="op" onClick={() => handleOptionClick('position', '연구원')}>연구원</div>
                                            <div className="op" onClick={() => handleOptionClick('position', '팀장')}>팀장</div>
                                            <div className="op" onClick={() => handleOptionClick('position', '연구실장')}>연구실장</div>
                                            <div className="op" onClick={() => handleOptionClick('position', '센터장')}>센터장</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="op" onClick={() => handleOptionClick('position', '사원')}>사원</div>
                                            <div className="op" onClick={() => handleOptionClick('position', '팀장')}>팀장</div>
                                            <div className="op" onClick={() => handleOptionClick('position', '부서장')}>부서장</div>
                                            <div className="op" onClick={() => handleOptionClick('position', '이사')}>이사</div>
                                            <div className="op" onClick={() => handleOptionClick('position', '대표이사')}>대표이사</div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="ResBtnBox">
                <button className="ResBtn" onClick={handleSubmit}>회원정보 수정</button>
            </div>

            <CustomModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                header={'알림'}
            >
                <div>
                    회원 수정이 완료되었습니다.
                </div>
            </CustomModal>
        </div>
    )
}
export default EditRegis;