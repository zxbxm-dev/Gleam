import api from "../../api/auth";

// 메일 전송
const SendMail = (formData) => {
  return api.post("/sendEmail", formData);
}

// 메일 조회
const CheckEmail = (userId) => {
  return api.get(`checkEmail/${userId}`);
}

// 예약 취소
const CancleReserveEmail = (mailId) => {
  return api.delete(`/cancleReserveEmail/${mailId}`);
}

// 메일 삭제
const DeleteEmail = (mailId, messageId) => {
  return api.delete(`/deleteEmail/${mailId}/${messageId}`);
}


// 메일 임시 저장
const DraftEmail = (formData) => {
  return api.post("/draftEmail", formData);
}

export { SendMail, CheckEmail, CancleReserveEmail, DeleteEmail, DraftEmail };