import api from "../../api/auth";

// 내 문서 목록 조회
const getMyReports = (params) => {
  const queryString = `?username=${params.username}&userID=${params.userID}`;
  return api.get("/getMyReports" + queryString);
};

// 결재할 문서 목록 조회
const getDocumentsToApprove = (params) => {
  return api.get("/getDocumentsToApprove", { params });
};

// 결재 진행 중인 문서 목록 조회
const getDocumentsInProgress = (params) => {
  return api.get("/getDocumentsInProgress", { params });
};

// 반려된 문서 목록 조회
const getRejectedDocuments = (params) => {
  return api.get("/getRejectedDocuments", { params });
};

// 재확인 문서 목록 조회
const getRecheckDocuments = (params) => {
  return api.get("/getRecheckDocuments", { params });
};

// 결재 완료된 문서 목록 조회
const getApprovedDocuments = (params) => {
  return api.get("/getApprovedDocuments", { params });
};

// 보고서 의견 작성하기
const WriteApprovalOp = (report_id, formData) => {
  return api.post(`/writeApprovalOp/${report_id}`, formData);
};

// 보고서 반려 작성하기
const WriteApproval = (report_id, formData) => {
  return api.post(`/writeApproval/${report_id}`, formData);
};

// 보고서 반려 요청하기
const RequestReject = (report_id, formData) => {
  return api.patch(`/requestReject/${report_id}`, formData);
};

// 보고서 취소 요청하기
const RequestCancleDocument = (report_id, formData) => {
  return api.patch(`/requestCancle/${report_id}`, formData);
};

// 결재하기
const HandleApproval = (report_id, formData) => {
  return api.post(`/handleApproval/${report_id}`, formData);
};

// 보고서 상세 조회
const CheckReport = (report_id) => {
  return api.get(`/checkReport/${report_id}`, {
    responseType: "blob",
    headers: {
      "Content-Type": "application/pdf",
    },
  });
};

// 의견내용 반려 내용 조회
const getReportOpinion = (report_id) => {
  return api.get(`/getReportOpinions/${report_id}`);
};

// 보고서 삭제
const DeleteReport = (report_id) => {
  return api.delete(`/deleteReport/${report_id}`);
};

export {
  getMyReports,
  getDocumentsToApprove,
  getDocumentsInProgress,
  getRejectedDocuments,
  getApprovedDocuments,
  HandleApproval,
  WriteApprovalOp,
  WriteApproval,
  CheckReport,
  DeleteReport,
  getReportOpinion,
  getRecheckDocuments,
  RequestReject,
  RequestCancleDocument,
};
