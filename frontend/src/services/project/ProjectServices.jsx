import api from "../../api/auth";

// 메인 프로젝트 추가
const addMainProject = (formData) => {
  return api.post("/addProject", formData);
}

// 서브 프로젝트 추가
const addSubProject = (mainprojectindex, formData) => {
  return api.post(`/addProject/${mainprojectindex}`, formData);
}

// 프로젝트 일정 조회
const CheckProject = () => {
  return api.get("/checkProject");
}

// 메인 프로젝트 수정
const EditMainProject = (mainprojectindex, pjtData) => {
  return api.put(`/editProject/${mainprojectindex}`, { data: pjtData });
}

// 서브 프로젝트 수정
const EditSubProject = (mainprojectindex, subprojectindex, pjtData) => {
  return api.put(`/editProject/${mainprojectindex}/${subprojectindex}`, { data: pjtData });
}

// 메인 프로젝트 삭제
const DeleteMainProject = (mainprojectindex) => {
  return api.put(`/deleteProject/${mainprojectindex}`);
}

// 서브 프로젝트 삭제
const DeleteSubProject = (mainprojectindex, subprojectindex) => {
  return api.put(`/deleteProject/${mainprojectindex}/${subprojectindex}`);
}

export { addMainProject, addSubProject, CheckProject, EditMainProject, EditSubProject, DeleteMainProject, DeleteSubProject };