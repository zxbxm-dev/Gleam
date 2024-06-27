import api from "../../api/auth";

// 내 문서 목록 조회
const getMyReports = (params) => {
  return api.get("/getMyReports", { params });
};

// 결재할 문서 목록 조회
const getDocumentsToApprove = (params) => {
  return api.get("/getDocumentsToApprove", { params });
}

// 결재 진행 중인 문서 목록 조회
const getDocumentsInProgress = (params) => {
  return api.get("/getDocumentsInProgress", { params });
}

// 반려된 문서 목록 조회
const getRejectedDocuments = (params) => {
  return api.get("/getRejectedDocuments", { params });
}

// 결재 완료된 문서 목록 조회
const getApprovedDocuments = (params) => {
  return api.get("/getApprovedDocuments", { params });
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


export { getMyReports, getDocumentsToApprove, getDocumentsInProgress, getRejectedDocuments, getApprovedDocuments, WriteApproval, CheckReport, DeleteReport };