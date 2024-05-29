import api from "../../api/auth";

//활동관리 작성
const WriteActiv = (formData) => {
    return api.post("/writeActivity", formData);
};

// 활동관리 전체 목록 조회
const CheckActivity = () => {
    return api.get("/checkActivity");
};

// 활동관리 상세 게시글 불러오기
const DetailTableActivity = (Activity_id) => {
    return api.get(`/detailActivity/${Activity_id}`);
};

//활동관리 수정
const EditActivity = (data, formData) => {
    return api.put("/editActivity", formData);
};

//활동관리 삭제
const DeleteActivity = (Activity_id) => {
    return api.delete(`/deleteActivity/${Activity_id}`, Activity_id);
};

export { WriteActiv, CheckActivity, DetailTableActivity, EditActivity, DeleteActivity };
