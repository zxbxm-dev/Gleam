import api from "../../api/auth";

//사내규정 작성
const WriteRegul = (formData) => {
    return api.post("/writeRegul", formData);
};

// 사내규정 전체 목록 조회
const CheckRegul = () => {
    return api.get("/checkRegul");
};

// 사내규정 상세 게시글 불러오기
const DetailTableRegul = (Regul_id) => {
    return api.get(`/detailRegul/${Regul_id}`);
};

//사내규정 수정
const EditRegul = (data, formData) => {
    return api.put("/editRegul", formData);
};

//사내규정 삭제
const DeleteRegul = (Regul_id) => {
    return api.delete(`/deleteRegul/${Regul_id}`, Regul_id);
};

export { WriteRegul, CheckRegul, DetailTableRegul, EditRegul, DeleteRegul };
