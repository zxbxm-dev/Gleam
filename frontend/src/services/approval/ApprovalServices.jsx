import api from "../../api/auth";

// 보고서 결재 목록 조회
const CheckApproval = () => {
  return api.get("/checkApproval");
}

// 보고서 결재 의견, 반려 작성
const WriteApproval = (report_id, formData) => {
  return api.post(`/writeApproval/${report_id}`, formData);
}

// 보고서 상세 조회
const CheckReport = (report_id) => {
  return api.get(`/checkReport/${report_id}`);
}

// 보고서 삭제
const DeleteReport = (report_id) => {
  return api.delete(`/deleteReport/${report_id}`);
}


export { CheckApproval, WriteApproval, CheckReport, DeleteReport };