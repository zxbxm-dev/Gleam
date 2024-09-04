import api from "../../api/auth";

// 메일 전송
const SendMail = (formData) => {
  return api.post("/sendEmail", formData , {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 메일 조회
const CheckEmail = (userId) => {
  return api.get(`checkEmail/${userId}`);
}

// 예약 취소
const cancleQueueEmail = (Id) => {
  return api.delete(`/cancleQueueEmail/${Id}`);
}

// 메일 삭제
const DeleteEmail = (mailId, messageId) => {
  return api.delete(`/deleteEmail/${mailId}/${messageId}`);
}

// 메일 임시 저장
const DraftEmail = (formData) => {
  return api.post("/draftEmail", formData);
}

// 중요 메일 등록
const StarringEmail = (formData) => {
  return api.put("/starringEmail", formData);
}

// 스팸 메일 등록
const JunkEmail = (formData) => {
  return api.put("/registerJunk", formData);
}

// 스팸 유저 등록
const AddJunkList = (formData) => {
  return api.post("/addJunkList", formData);
}

export { SendMail, CheckEmail, cancleQueueEmail, DeleteEmail, DraftEmail, StarringEmail, JunkEmail, AddJunkList };