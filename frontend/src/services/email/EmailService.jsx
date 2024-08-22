import api from "../../api/auth";

// 메일 전송
const SendMail = (formData) => {
  return api.post("/sendEmail", formData);
}

// 메일 조회
const CheckEmail = (userId) => {
  return api.get(`checkEmail/${userId}`)
}

// 예약 취소


// 메일 삭제


// 메일 임시 저장

export { SendMail, CheckEmail };