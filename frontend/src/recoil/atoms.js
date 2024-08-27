import { atom } from "recoil";

export const isSidebarVisibleState = atom({
  key: "isSidebarVisibleState",
  default: true, // 기본값: 사이드바가 보이는 상태
});

export const isHrSidebarVisibleState = atom({
  key: "isHrSidebarVisibleState",
  default: false, // 기본값: HR사이드바가 안 보이는 상태
});

const getUserStateFromLocalStorage = () => {
  const userStateString = localStorage.getItem("userState");
  return userStateString
    ? JSON.parse(userStateString)
    : {
        id: "",
        username: "",
        userId: "",
        usermail: "",
        phoneNumber: "",
        company: "",
        department: "",
        team: "",
        position: "",
        spot: "",
        question1: "",
        question2: "",
        entering: "",
        attachment: "",
        Sign: "",
      };
};

export const userState = atom({
  key: "userState",
  default: getUserStateFromLocalStorage(),
});

export const isSelectMemberState = atom({
  key: "isSelectMember",
  default: ["", "", "", "", ""],
});

const latestChat = JSON.parse(localStorage.getItem("latestChat"));

export const selectedPersonState = atom({
  key: "selectedPersonState",
  default: {
    username: latestChat ? latestChat.username : "통합 알림",
    team: latestChat ? latestChat.team : "",
    department: latestChat ? latestChat.department : "",
    position: latestChat ? latestChat.position : "",
    userId: latestChat ? latestChat.userId : "",
  },
});

export const selectedRoomIdState = atom({
  key: 'selectedRoomIdState',
  default: -2,
});

/**
 * @typedef {"접속됨" | "접속안됨" | "자리비움"} UserState
 */

/**
 * @type {import('recoil').RecoilState<{ state: UserState }>}
 */
export const userStateMessage = atom({
  key: 'userStateMessage',
  default: {
    state: ""
  },
});
