import api from "../../api/auth";

//관리 문서 종류 추가
const AddDocuments = (userID, formData) => {
  return api.post(`/addDocument/${userID}`, formData);
};

// 관리 문서 조회
const GetDocuments = (userID) => {
  return api.get(`/getAllDocument/${userID}`);
};

//문서 번호 수정
const EditDocuments = async (selectedDocId, updateData) => {
  return api.put(`/updatedocuments/${selectedDocId}`, updateData);
};

//관리팀 - 문서수정
const ManagerEditDocuments = async (updateData) => {
  return api.patch(`/editDocument`, updateData);
};

//관리팀 - 문서삭제
const DeleteDocument = async (data) => {
  const { documentId, docType, docTitle } = data;
  return api.delete(`/deleteDocument/${documentId}`);
};

export {
  AddDocuments,
  GetDocuments,
  EditDocuments,
  ManagerEditDocuments,
  DeleteDocument,
};
