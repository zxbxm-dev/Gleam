import api from "../../api/auth";

//관리 문서 종류 추가
const AddDocuments = (userID, formData) => {
    return api.post(`/addDocument/${userID}`, formData);
};

// 관리 문서 조회
const GetDocuments = (userID) => {
    return api.get(`/getAllDocument/${userID}`);
}

export { AddDocuments, GetDocuments };