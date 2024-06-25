import api from "../../api/auth";

// 채용공고 조회
const CheckEmploy = () => {
  return api.get("/checkEmploy");
}

// 채용공고 작성
const WriteEmploy = (formData) => {
  return api.post("/writeEmploy", formData);
};

// 채용공고 수정
const EditEmploy = async (employ_id, formData) => {
  try {
    const response = await api.put(`editEmploy/${employ_id}`, formData);
    return response.data
  } catch (error) {
    throw new Error(`채용공고 수정에 실패했습니다. : ${error}`)
  }
}

// 채용공고 삭제
const DeleteEmploy = (employ_id) => {
  return api.delete(`deleteEmploy/${employ_id}`);
}

export { CheckEmploy, WriteEmploy, EditEmploy, DeleteEmploy };