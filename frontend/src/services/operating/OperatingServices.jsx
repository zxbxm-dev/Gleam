import api from "../../api/auth";

// 운영비 관리 데이터 전송
const OperatingServices = (formData) => {
  return api.post("/postOperData", formData);
}

export { OperatingServices };