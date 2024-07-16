import React, { useState, useEffect } from "react";
import "./Register.scss";
import { Login_Logo, ArrowDown, ArrowUp } from "../../assets/images/index";
import { RegisterServices, CheckID } from "../../services/login/RegisterServices";
import { Link, useNavigate } from "react-router-dom";
import CustomModal from '../../components/modal/CustomModal';

const Register = () => {
	let navigate = useNavigate();
	const [selectedOptions, setSelectedOptions] = useState({
		company: '',
		department: '',
		team: '',
		spot: '',
		position: ''
	});
	const [isRegistModalOpen, setRegistModalOpen] = useState(false);
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
	const [id, setUserID] = useState("");
	const [question1, setQuestion1] = useState("");
	const [question2, setQuestion2] = useState("");
	const [name, setName] = useState("");
	const [mail, setMail] = useState("");
	const [Agree, setAgree] = useState(true);
	const [enterDate, setEnterDate] = useState("");
	const [enterDateError, setEnterDateError] = useState("");
	const [checkID, setIsCheckID] = useState(false);

	const handleFooter1Click = () => {
		setRegistModalOpen(false);
		navigate('/login');
	};


	const handleInputChange = (event: any, field: any) => {
    const value = event.target.value;
    const restrictedCharsRegex = /[{}[\]()]/;

    // 입력값이 제한된 문자를 포함하는지 확인
    if (restrictedCharsRegex.test(value)) {
        return;
    }

    switch (field) {
        case 'userID':
            setUserID(value);
            break;
        case 'password':
            setPassword(value);
            setPasswordError(!validatePassword(value) ? "비밀번호는 영어, 숫자, 특수문자를 포함한 8자리 이상이여야 합니다." : "");
            break;
        case 'confirmPassword':
            setConfirmPassword(value);
            setConfirmPasswordError(value !== password ? "비밀번호가 일치하지 않습니다." : "");
            break;
        case 'phoneNumber':
            setPhoneNumber(value);
            setPhoneNumberError(!validatePhoneNumber(value) ? "유효한 휴대폰 번호를 입력하세요.(예: 01012345678)" : "");
            break;
        case 'enterDate':
            setEnterDate(value);
            setEnterDateError(!validateEnterDate(value) ? "유효한 날짜 형식(예: 20990101)이어야 합니다." : "");
            break;
        case 'ques1':
            setQuestion1(value);
            break;
        case 'ques2':
            setQuestion2(value);
            break;
        case 'name':
            setName(value);
            break;
        case 'Mail':
            setMail(value);
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

	const validateEnterDate = (date: any) => {
			const dateRegex = /^20\d{6}$/;
			return dateRegex.test(date);
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

	const handleAgree = () => {
		setAgree(true);
	};

	const handleNotAgree = () => {
		setAgree(false);
	};

	const handleClick = () => {
		if (Agree) {
			handleNotAgree();
		} else {
			handleAgree();
		}
	};

	useEffect(() => {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");
		const todayString = `${year}${month}${day}`;
		setEnterDate(todayString);
	}, []);

	const handleSubmit = () => {
		if (!id || !password || !confirmPassword || !question1 || !question2 || !name || !mail || !phoneNumber || !Agree) {
			console.error("필수 항목을 모두 작성해주세요.");
			return;
		}

		if (!checkID) {
			alert("중복확인을 진행해 주세요.")
			return;
		}

		const formattedEnterDate = `${enterDate.substring(0, 4)}-${enterDate.substring(4, 6)}-${enterDate.substring(6, 8)}`;

		const formData = {
			userID: id,
			password: password,
			question1: question1,
			question2: question2,
			username: name,
			usermail: mail + '@four-chains.com',
			company: selectedOptions.company,
			department: selectedOptions.department,
			team: selectedOptions.team,
			spot: selectedOptions.spot,
			position: selectedOptions.position,
			phoneNumber: phoneNumber,
			attachment: null,
			Sign: null,
			leavedate: null,
			entering: formattedEnterDate
		};

		// API 호출
		RegisterServices(formData)
			.then(response => {
				setRegistModalOpen(true);
			})
			.catch(error => {
				// 오류 발생 시
				console.error("회원가입 오류:", error);
				setRegistModalOpen(true);
			});
	};

	const handleCheckID = () => {
		const UserID = id;
		CheckID(UserID)
			.then(response => {
				setIsCheckID(true);
				alert("중복확인 완료");
			})
			.catch(error => {
				console.error("중복확인 오류:", error);
				alert("존재하는 아이디입니다.");
			})
	};

	console.log("입력된 메일", mail)
	return (
		<div className="Register">
			<Link to="/login">
				<img className="ResLogo" src={Login_Logo} alt="LoginLogo" />
			</Link>
			<span className="ResText">회원가입</span>

			<div className="RegistorBox">
				<div className="LeftFlex">
					<div className="MinimBox">
						<span>아이디 입력</span>
						<input type="text" className="ShortTextInput" value={id} placeholder="아이디를 입력해 주세요." onChange={(event) => handleInputChange(event, 'userID')} />
						<button className="CheckID" onClick={handleCheckID}>중복 확인</button>
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
								<input
									type="text"
									className="TextInput"
									value={question1}
									placeholder="답을 입력해 주세요."
									onChange={(event) => handleInputChange(event, 'ques1')}
								/>
							</div>
							<div className="Ques">
								<span>졸업한 초등학교는 어디입니까?</span>
								<input
									type="text"
									className="TextInput"
									value={question2}
									placeholder="답을 입력해 주세요."
									onChange={(event) => handleInputChange(event, 'ques2')}
								/>
							</div>
						</div>
					</div>
					<div className="MiniBox">
						<span>성명 입력</span>
						<input
							type="text"
							value={name}
							className="TextInput"
							placeholder="성명을 입력해 주세요."
							onChange={(event) => handleInputChange(event, 'name')}
						/>
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
						<input
							type="text"
							value={mail}
							className="ShortTextInput"
							onChange={(event) => handleInputChange(event, 'Mail')}
							placeholder="두레이 메일주소 입력"
						/>
						&nbsp;@&nbsp;four-chains.com
					</div>
					<div className="MiniphoneBox">
						<div className="Phone">
							<span>입사일자</span>
							{enterDateError ?
								<input
									type="text"
									className={`TextInput ${enterDateError && "Error"}`}
									placeholder="ex) 20990101"
									value={enterDate}
									onChange={(e) => handleInputChange(e, 'enterDate')}
									style={{ border: "1px solid #D56D6D" }}
								/>
								:
								<input
									type="text"
									className={`TextInput ${enterDateError && "Error"}`}
									placeholder="ex) 20990101"
									value={enterDate}
									onChange={(e) => handleInputChange(e, 'enterDate')}
								/>
							}
						</div>
						<div className="ErrorMessageBox">
							{enterDateError && <div className="ErrorMessage">{enterDateError}</div>}
						</div>
					</div>
				</div>
				<div className="RightFlex">
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
					<div className="flexsbox">
						<span className="FlexSpan">
							개인정보<br />
							수집·이용 동의<br />
							(필수)
						</span>
						<div className="Bo">
							<div className="First">
								1. 수집하는 개인정보 항목
								• 필수 정보: 성명, 직위, 소속 부서, 연락처(핸드폰 번호),
								이메일, 서명 이미지<br /><br />

								2. 개인정보의 수집 및 이용 목적
								• 회원가입 및 서비스 이용을 위한 식별 및 인증
								• 업무 목적에 따른 연락 및 안내
								• 업무 협업을 위한 사내 메신저 및 업무 관리 시스템 이용<br /><br />

								3. 개인정보의 보유 및 이용 기간
								• 수집된 개인정보는 회원 탈퇴 시까지 보유되며, 이후
								해당 정보는 안전하게 파기됩니다.<br /><br />

								4. 동의 거부 권리 및 거부 시 불이익 내용
								• 필수 정보의 제공에 동의하지 않을 경우 회원가입 및
								서비스 이용이 불가능합니다.
							</div>
							<label className="Radio">
								<input
									type="checkbox"
									name="contactss"
									value="Bovalue"
									checked={Agree}
									onChange={() => setAgree(!Agree)}
								/>
								<span onClick={handleClick}>동의합니다.</span>
							</label>
						</div>
					</div>
				</div>
			</div>
			<div className="ResBtnBox">
				<button className="ResBtn" onClick={handleSubmit}>회원가입 승인 요청</button>
			</div>

			<CustomModal
				isOpen={isRegistModalOpen}
				onClose={() => setRegistModalOpen(false)}
				header={'알림'}
				footer1={'확인'}
				footer1Class="green-btn"
				onFooter1Click={handleFooter1Click}
			>
				<div>
					회원 가입 승인 요청이 완료 되었습니다.
				</div>
			</CustomModal>
		</div>
	)
}
export default Register;