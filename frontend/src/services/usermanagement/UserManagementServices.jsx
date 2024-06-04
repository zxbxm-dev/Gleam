import api from "../../api/auth";

// 회윈관리 조회
const CheckUserManagement = () => {
  return api.get("/checkUserManagement");
}

// 회원관리 승인
const ApproveUserManagement = (user_id) => {
  return api.post(`/approveUserManagement/${user_id}`);
}

// 회원관리 삭제
const DeleteUserManagement = (user_id) => {
  return api.delete(`/deleteUserManagement/${user_id}`);
}

//회원 탈퇴 요청
const EditChainLinker = () => {
  return api.delete(`/editchainlinker`);
}


export {
  CheckUserManagement,
  ApproveUserManagement,
  DeleteUserManagement,
  EditChainLinker,
};