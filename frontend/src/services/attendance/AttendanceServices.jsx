import api from "../../api/auth";

// 연차관리

// 연차관리 데이터 조회
const CheckAnnual = () => {
  return api.get("/checkAnnual");
}

// 연차관리 데이터 수정
const EditAnnual = (annual_id) => {
  return api.put(`/editAnnual/${annual_id}`);
}




// 출근부

// 출근부 데이터 조회
const CheckAttendance = () => {
  return api.get("/checkAttendance");
}

// 출근부 데이터 작성
const WriteAttendance = (formData) => {
  return api.post("/writeAttendance", formData);
}

// 출근부 데이터 수정
const EditAttendance = (attend_id) => {
  return api.put(`/editAttendance/${attend_id}`)
}


export { CheckAnnual, EditAnnual, CheckAttendance, WriteAttendance, EditAttendance };