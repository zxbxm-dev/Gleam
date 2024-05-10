import { atom } from 'recoil';


export const isSidebarVisibleState = atom({
  key: 'isSidebarVisibleState',
  default: true, // 기본값: 사이드바가 보이는 상태
});

export const isHrSidebarVisibleState = atom({
  key: 'isHrSidebarVisibleState',
  default: false, // 기본값: HR사이드바가 안 보이는 상태
});

export const userState = atom({
  key: 'userState',
  default: {id: '', pw: '', name: '', department: '', team: '', position: '', company: ''},
});

export const isSelectMemberState = atom({
  key: 'isSelectMember',
  default: ['', '', '', ''],
});