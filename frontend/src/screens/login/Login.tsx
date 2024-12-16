import React, { useState } from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { Login_Logo } from "../../assets/images/index";
import { LoginServices } from "../../services/login/LoginService";
import CustomModal from "../../components/modal/CustomModal";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "../../recoil/atoms";

const Login = () => {
  let navigate = useNavigate();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");

  const [userID, setuserID] = useState("");
  const [password, setPassword] = useState("");

  const setUserState = useSetRecoilState(userState);

  const handleLogin = async () => {
    try {
      const response = await LoginServices(userID, password);

      const userData = response.data.user;
      const enteringDateString = new Date(userData.entering)
        .toISOString()
        .substring(0, 10);

      const userStateData = {
        id: userID,
        username: userData.username,
        userID: userData.userId,
        usermail: userData.usermail,
        phoneNumber: userData.phoneNumber,
        company: userData.company,
        department: userData.department,
        team: userData.team,
        position: userData.position,
        spot: userData.spot,
        question1: userData.ques1,
        question2: userData.ques2,
        entering: enteringDateString,
        attachment: userData.attachment,
        assignPosition: userData.assignPosition,
        Sign: userData.Sign,
        MobileCard: "사용 안함",
      };

      setUserState(userStateData);
      localStorage.setItem("usertoken", response.data.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userState", JSON.stringify(userStateData));

      navigate("/");
    } catch (error: any) {
      if (error.response) {
        const { status } = error.response;
        switch (status) {
          case 401:
            setModalContent("비밀번호가 일치하지 않습니다.");
            break;
          case 403:
            setModalContent("승인 대기 중입니다. 승인 완료 후 로그인하세요.");
            break;
          case 404:
            setModalContent("사용자를 찾을 수 없습니다.");
            break;
          case 500:
            setModalContent(
              "서버 오류가 발생했습니다. 개발팀에 문의해 주세요."
            );
            break;
          default:
            setModalContent("로그인에 실패했습니다.");
        }
      } else {
        setModalContent(
          "네트워크 오류가 발생했습니다. 나중에 다시 시도해주세요."
        );
      }
      setLoginModalOpen(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login_container">
      <img className="Linker" src={Login_Logo} alt="Login_Logo" />

      <input
        placeholder="아이디를 입력해 주세요. "
        value={userID}
        onChange={(e) => setuserID(e.target.value)}
        onKeyDown={handleKeyPress}
        className="InputClass"
      />
      <input
        placeholder="패스워드를 입력해 주세요."
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyPress}
        className="InputClass"
      />
      <button className="login_btn" onClick={handleLogin}>
        로그인
      </button>

      <div className="GoRegis">
        <Link to="/register" className="span">
          회원가입
        </Link>
        &nbsp; | &nbsp;
        <Link to="/findId" className="span">
          아이디 찾기
        </Link>
        &nbsp; | &nbsp;
        <Link to="/resetpw" className="span">
          비밀번호 재설정
        </Link>
      </div>

      <CustomModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        header={"알림"}
      >
        <div>{modalContent}</div>
      </CustomModal>
    </div>
  );
};

export default Login;
