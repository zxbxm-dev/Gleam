import api from "../../api/auth";

const WriteEmployment = (formData) => {
  return api.post("/writeEmploy", formData);
};

const EditEmployment = async (id, formData) => {
  try {
    const response = await api.put(`editEmploy/${id}`, formData);
    return response.data
  } catch (error) {
    throw new Error(`채용공고 수정에 실패했습니다. : ${error}`)
  }
}

const DeleteEmployment = (id) => {
  return api.delete(`deleteEmploy/${id}`);
}

export { WriteEmployment, EditEmployment, DeleteEmployment };