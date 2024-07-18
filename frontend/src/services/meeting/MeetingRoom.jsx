import api from "../../api/auth";

//회의 추가
const writeMeeting = (formData) => {
    return api.post("/addMeeting", formData);
};

//회의 전체 목록 조회
const CheckMeeting = () => {
    return api.get("/checkMeeting");
};

//회의실 수정
const EditMeeting = (eventData, Meeting_id) => {
    return api.put(`/editMeeting/${Meeting_id}`, { data: eventData });
}

//회의실 삭제
const DeleteMeeting = (eventData, Meeting_id) => {
    return api.delete(`/deleteMeeting/${Meeting_id}`, { data: eventData });
}

export { writeMeeting, CheckMeeting, EditMeeting, DeleteMeeting };
