import api from "../../api/auth";

// 운영비 관리 조회
const CheckOperating = () => {
  return api.get("/checkOperating");
}

// 운영비 관리 작성
const WriteOperating = (formData) => {
  return api.post("/writeOperating", formData);
}

export { CheckOperating, WriteOperating };