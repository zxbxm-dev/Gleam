import api from "../../api/auth";

//회원가입 데이터 전송
const RegisterServices = (formData) => {
    return api.post("/postResData", formData);
};

//중복확인 데이터 전송
const CheckID = (UserID) => {
    return api.post('/RescheckID', {
        userID: UserID
    });
}

//회원가입 수정 데이터 전송
const RegisterEditServices = (formData) => {
    return api.post("/postResEditData", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

//아이디 찾기 데이터 전송
const FindIDServices = (formData) => {
    return api.post("/postFindID", formData);
};

//비밀번호 재설정 데이터 전송
const ResetPwServices = (formData) => {
    return api.post("/postresetpw", formData);
};

export { RegisterServices,RegisterEditServices, FindIDServices, ResetPwServices, CheckID };