export { default as PageNotFound } from "./error/PageNotFound";

export { default as Login } from "./login/Login";
export { default as FindID } from "./login/FindID";
export { default as Register } from "./login/Register";
export { default as ResetPw } from "./login/ResetPw";
export { default as EditRegis } from "./login/EditRegis";

// 조직문화
export { default as Announcement } from "./orgculture/announcement/Announcement";
export { default as WriteAnnounce } from "./orgculture/announcement/WriteAnnounce";
export { default as DetailAnnounce } from "./orgculture/announcement/DetailAnnounce";

export { default as OrgChart } from "./orgculture/orgChart/OrgChart";

export { default as Regulations } from "./orgculture/regulations/Regulations";
export { default as WriteRegulation } from "./orgculture/regulations/WriteRegulation";
export { default as DetailRegulation } from "./orgculture/regulations/DetailRegulation";

// 휴가 관리
export { default as Calendar } from "./calendar/Calendar";

// 보고서
export { default as Report } from "./report/Report";
export { default as WriteReport } from "./report/WriteReport";

// 보고서 결재
export { default as Approval } from "./approval/Approval";
export { default as DetailApproval } from "./approval/DetailApproval";
export { default as DetailDocument } from "./approval/DetailDocument";

// 채용 공고
export { default as Employment } from "./employment/Employment";

// 인사 평가
export { default as SubmitPerform } from "./performance/submitPerform/SubmitPerform"
export { default as DetailSubmit } from "./performance/submitPerform/DetailSubmit"
export { default as ManagePerform } from "./performance/managePerform/ManagePerform"

// 인사 정보 관리
export { default as HumanResource } from "./humanResource/HumanResource";

// 근태 관리
export { default as AnnualManage } from "./attendance/annualManage/AnnualManage";
export { default as AttendanceRegist } from "./attendance/attendanceRegist/AttendanceRegist";

// 운영비 관리
export { default as Operating } from "./operating/Operating";

// 회원 관리
export { default as UserManagement } from "./usermanagement/UserManagement";