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

// 출근부 데이터 수정 (attend_id 값이 있을때는 /editAttendance/${attend_id} 라우터로, attend_id 값이 없을때는 /editAttendance)
const EditAttendance = (attend_id, formData) => {
  if (attend_id && attend_id !== 'undefined') {
    return api.put(`/editAttendance/${attend_id}`, formData);
  } else {
    return api.post(`/editAttendance`, formData);
  }
};


export { CheckAnnual, EditAnnual, CheckAttendance, WriteAttendance, EditAttendance };