import api from "../../api/auth";

// 인사정보관리 조회
const CheckHrInfo = (params) => {
  const queryString = `?username=${params.username}&TabData=${params.TabData}`;
  return api.get(`/checkHrInfo` + queryString, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/pdf',
    }
  });
}

// 인사정보관리 제출
const WriteHrInfo = (formData) => {
  return api.post(`/writeHrInfo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 인사정보관리 수정
const EditHrInfo = (formData) => {
  return api.put(`/editHrInfo/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}



// 인사이동 조희
const CheckAppointment = () => {
  return api.get(`/checkAppointment`);
}

// 인사이동 등록
const writeAppointment = (formData) => {
  return api.post(`/writeAppointment`, formData);
}

// 인사이동 수정
const EditAppointment = (appoint_id, formData) => {
  return api.put(`/editAppointment/${appoint_id}`, formData);
}

// 인사이동 삭제
const DeleteAppointment = (appoint_id) => {
  return api.delete(`/deleteAppointment/${appoint_id}`);
}

export { CheckHrInfo, WriteHrInfo, EditHrInfo, CheckAppointment, writeAppointment, EditAppointment, DeleteAppointment };