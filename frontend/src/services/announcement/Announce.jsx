import api from "../../api/auth";

// 공지사항 작성
const WriteAnnounce = (formData) => {
    return api.post("/writeAnno", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// 공지사항 전체 목록 조회
const CheckAnnounce = () => {
    return api.get("/checkAnno");
};

// 공지사항 상세 게시글 불러오기
const DetailTableAnnounce = (Anno_id) => {
    return api.get(`/detailAnno/${Anno_id}`);
};

// 조회수 증가
const incrementViewCount = (Anno_id) => {
    return api.put(`/incrementViewCount/${Anno_id}`)
}

// 게시글 고정
const PinnedAnnouncement = (Anno_id) => {
    return api.put(`/pinnedAnnouncement/${Anno_id}`)
}

//공지사항 수정
const EditAnno = (data, formData,Anno_id) => {
    return api.put(`/editAnno/${Anno_id}`, formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

//공지사항 삭제
const DeleteAnno = (Anno_id) => {
    return api.delete(`/deleteAnno/${Anno_id}`, Anno_id);
};

export { WriteAnnounce, CheckAnnounce, DetailTableAnnounce, incrementViewCount, PinnedAnnouncement, EditAnno, DeleteAnno };