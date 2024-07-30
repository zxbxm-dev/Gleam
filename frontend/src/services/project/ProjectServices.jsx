import api from "../../api/auth";

// 메인 프로젝트 추가
const addMainProject = (formData) => {
  return api.post("/addProject", formData);
}

// 서브 프로젝트 추가
const addSubProject = (mainprojectIndex, formData) => {
  return api.post(`/addProject/${mainprojectIndex}`, formData);
}

// 프로젝트 일정 조회
const CheckProject = () => {
  return api.get("/checkProject");
}

// 메인 프로젝트 수정
const EditMainProject = (mainprojectIndex, pjtData) => {
  return api.patch(`/editProject/${mainprojectIndex}`, { data: pjtData });
}

// 서브 프로젝트 수정
const EditSubProject = (mainprojectIndex, subprojectIndex, pjtData) => {
  return api.patch(`/editProject/${mainprojectIndex}/${subprojectIndex}`, { data: pjtData });
}

// 메인 프로젝트 삭제
const DeleteMainProject = (mainprojectIndex) => {
  return api.delete(`/deleteProject/${mainprojectIndex}`);
}

// 서브 프로젝트 삭제
const DeleteSubProject = (mainprojectIndex, subprojectIndex) => {
  return api.delete(`/deleteProject/${mainprojectIndex}/${subprojectIndex}`);
}

export { addMainProject, addSubProject, CheckProject, EditMainProject, EditSubProject, DeleteMainProject, DeleteSubProject };