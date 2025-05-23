import api from "../../api/auth";

//일정 추가
const writeCalen = (formData) => {
    return api.post("/writecalender", formData);
};

//일정 전체 목록 조회
const CheckCalen = () => {
    return api.get("/checkCalender");
};

//일정 수정
const EditCalen = (eventData, event_id) => {
    return api.put(`/editCalender/${event_id}`, { data: eventData });
}

//일정 삭제
const DeleteCalen = (eventData, event_id) => {
    return api.delete(`/deleteCalender/${event_id}`, { data: eventData });
}

export { writeCalen, CheckCalen, EditCalen, DeleteCalen };
