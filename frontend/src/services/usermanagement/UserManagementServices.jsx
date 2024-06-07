import api from "../../api/auth";

// 회윈관리 조회
const CheckUserManagement = () => {
  return api.get("/checkUserManagement");
}

// 회원가입 승인 요청 승인
const ApproveUserManagement = (userID) => {
  return api.post(`/approveUserManagement/${userID}`);
}

// 회원가입 승인 요청 거부
const DeleteUserManagement = (userID) => {
  return api.delete(`/deleteUserManagement/${userID}`);
}

//회원 탈퇴 요청
const EditChainLinker = (userID) => {
  return api.post(`/editchainlinker`, { userID });
}


export {
  CheckUserManagement,
  ApproveUserManagement,
  DeleteUserManagement,
  EditChainLinker,
};