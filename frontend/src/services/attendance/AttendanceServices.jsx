import api from "../../api/auth";

// 출근부 데이터 전송
const AttendRegist = (formData) => {
  return api.post("/AttendRegist", formData);
}

export { AttendRegist };