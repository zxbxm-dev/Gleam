import api from "../../api/auth";

// 공지사항 작성
const WriteAnnounce = (formData) => {
    return api.post("/writeAnno", formData);
};

// 공지사항 전체 목록 조회
const CheckAnnounce = () => {
    return api.get("/checkAnno");
};

// 공지사항 상세 게시글 불러오기
const DetailTableAnnounce = (Anno_id) => {
    return api.get(`/detailAnno/${Anno_id}`);
};

//공지사항 수정
const EditAnno = (data, formData) => {
    return api.post("/editAnno", formData);
};

export { WriteAnnounce, CheckAnnounce, DetailTableAnnounce, EditAnno };