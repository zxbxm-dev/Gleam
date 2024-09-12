import api from "../../api/auth";

// 메일 전송
const SendMail = (formData) => {
  return api.post("/sendEmail", formData , {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 메일 조회
const CheckEmail = (userId) => {
  return api.get(`checkEmail/${userId}`);
};

// 예약 취소
const cancleQueueEmail = (Id) => {
  return api.delete(`/cancleQueueEmail/${Id}`);
};

// 메일 삭제
const DeleteEmail = (mailId, messageId) => {
  return api.delete(`/deleteEmail/${mailId}/${messageId}`);
};

const ReadEmail = (formData) => {
  return api.put("/readEmail", formData);
};

// 메일 임시 저장
const DraftEmail = (formData) => {
  return api.post("/draftEmail", formData , {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 중요 메일 등록
const StarringEmail = (formData) => {
  return api.put("/starringEmail", formData);
};

// 스팸 메일 등록
const JunkEmail = (Id) => {
  return api.put(`/registerJunk/${Id}`);
};

// 스팸 유저 등록
const AddJunkList = (formData) => {
  return api.post("/addJunkList", formData);
};

// 스팸 유저 확인
const CheckJunkList = (params) => {
  const queryString = `?userId=${params.userId}`;
  return api.get("/getJunkList" + queryString);
};

// 스팸 유저 삭제
const RemoveJunkList = (junkId, userId) => {
  return api.delete(`/removeJunklist/${junkId}`, {
    data: { userId }
  });
};

export { SendMail, CheckEmail, cancleQueueEmail, DeleteEmail, ReadEmail, DraftEmail, StarringEmail, JunkEmail, AddJunkList, CheckJunkList, RemoveJunkList };