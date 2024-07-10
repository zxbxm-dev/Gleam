import api from "../../api/auth";

// 연차관리

// 연차관리 데이터 조회
const CheckAnnual = () => {
  return api.get("/checkAnnual");
}

// 연차관리 데이터 수정
const EditAnnual = (formData) => {
  return api.put("/editAnnual", formData);
}




// 출근부

// 출근부 데이터 조회
const CheckAttendance = () => {
  return api.get("/checkAttendance");
}

// 출근부 데이터 작성
const WriteAttendance = (formData) => {
  return api.post("/writeAttendance", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 출근부 데이터 수정
const EditAttendance = (attend_id, formData) => {
  return api.put(`/editAttendance/${attend_id}`, formData);
}


export { CheckAnnual, EditAnnual, CheckAttendance, WriteAttendance, EditAttendance };