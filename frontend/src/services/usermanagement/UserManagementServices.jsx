import api from "../../api/auth";

// 회윈관리 조회
const CheckUserManagement = () => {
  return api.get("/checkUserManagement");
}

// 회원가입 승인 요청 승인
const ApproveUserManagement = (user_id) => {
  return api.post(`/approveUserManagement/${user_id}`);
}

// 회원가입 승인 요청 거부
const DeleteUserManagement = (user_id) => {
  return api.delete(`/deleteUserManagement/${user_id}`);
}

//회원 탈퇴 요청
const EditChainLinker = (username) => {
  return api.post(`/editchainlinker`, { username });
}


export {
  CheckUserManagement,
  ApproveUserManagement,
  DeleteUserManagement,
  EditChainLinker,
};