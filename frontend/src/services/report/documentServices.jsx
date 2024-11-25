import api from "../../api/auth";

//관리 문서 종류 추가
const AddDocuments = (formData) => {
    return api.post("/addDocument", formData);
};


export { AddDocuments };
