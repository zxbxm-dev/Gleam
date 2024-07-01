import api from "../../api/auth";

// 인사평가 조회
const CheckPerform = () => {
  return api.get("/checkPerform");
}

// 인사평가 제출
const WritePerform = (formData) => {
  return api.post("/writePerform", formData , {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 인사평가 상세조회
const DetailPerform = (perform_id) => {
  return api.get(`/detailPerform/${perform_id}`, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/pdf',
    }
  })
}

// 인사평가 삭제
const DeletePerform = async (perform_id) => {
  return api.delete(`/deletePerform/${perform_id}`)
}

export { CheckPerform, WritePerform, DetailPerform, DeletePerform };