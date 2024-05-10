import api from "../../api/auth";

//회원가입 데이터 전송
const RegisterServices = (formData) => {
    return api.post("/postResData", formData);
};


//아이디 찾기 데이터 전송
const FindIDServices = (formData) => {
    return api.post("/postFindID", formData);
};

//비밀번호 재설정 데이터 전송
const ResetPwServices = (formData) => {
    return api.post("/postresetpw", formData);
};

export { RegisterServices, FindIDServices, ResetPwServices };