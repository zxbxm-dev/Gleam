import api from "../../api/auth";

// 인사평가 조회
const CheckPerform = () => {
  return api.get("/checkPerform");
}

// 인사평가 제출
const WritePerform = (formData) => {
  return api.post("/writePerform", formData);
};

// 인사평가 삭제
const DeletePerform = async (perform_id) => {
  return api.delete(`/deletePerform/${perform_id}`)
}

export { CheckPerform, WritePerform, DeletePerform };