import React from 'react';
import { Popover, PopoverTrigger, Portal, PopoverContent } from "@chakra-ui/react";
import {
    XIcon,
    MessageMenu,
    UserIcon_dark
} from "../../assets/images/index";

interface PeopleManagementProps {
  chatRoomPeopleManagement: boolean;
  setChatRoomPeopleManagement: React.Dispatch<React.SetStateAction<boolean>>;
}

const PeopleManagement: React.FC<PeopleManagementProps> = ({ chatRoomPeopleManagement, setChatRoomPeopleManagement }) => {
 
    const DummyPeoples = [
        {
          userId: "qw506799b",
          username: "박세준",
          usermail: "qw123456789@four-chains.com",
          phoneNumber: "01012345678",
          company: "",
          department: "",
          team: "",
          position: "대표이사",
          spot: "대표이사",
          question1: "1",
          question2: "1",
          attachment: "http://localhost:3001/uploads/제목 없음.png",
          Sign: "http://localhost:3001/uploads/images.jpg",
          status: "approved",
          entering: "2024-07-28T00:00:00.000Z",
          leavedate: null,
          createdAt: "2024-07-28T10:46:16.000Z",
          updatedAt: "2024-07-31T10:46:48.000Z",
          isAdmin: true,
        },
        {
          userId: "qwe1234c",
          username: "테스트1",
          usermail: "qwe1234@four-chains.com",
          phoneNumber: "0101234324",
          company: "본사",
          department: "개발부",
          team: "개발 1팀",
          position: "사원",
          spot: "사원",
          question1: "1",
          question2: "1",
          attachment: null,
          Sign: null,
          status: "approved",
          entering: "2024-07-29T00:00:00.000Z",
          leavedate: null,
          createdAt: "2024-07-29T11:29:54.000Z",
          updatedAt: "2024-07-29T11:29:54.000Z",
          isAdmin: false,
        },
        {
          userId: "qwe12345d",
          username: "테스트2",
          usermail: "qwewq4e2@four-chains.com",
          phoneNumber: "01012344444",
          company: "본사",
          department: "개발부",
          team: "개발 1팀",
          position: "사원",
          spot: "사원",
          question1: "1",
          question2: "1",
          attachment: null,
          Sign: null,
          status: "approved",
          entering: "2024-07-29T00:00:00.000Z",
          leavedate: null,
          createdAt: "2024-07-29T11:30:34.000Z",
          updatedAt: "2024-07-29T11:30:34.000Z",
          isAdmin: false,
        },
      ];

    if (!chatRoomPeopleManagement) return null;

    return (
      <div className="PeopleManagementCon">
        <div className="Management-header">
          <span>인원 관리</span>
          <img
            src={XIcon}
            alt="XIcon"
            onClick={() => setChatRoomPeopleManagement(false)}
          />
        </div>
        <div className="AddPerson-tab">+ 인원 추가하기</div>
        <div className="ChatRoom-Members">
          {DummyPeoples.map((onePerson, index) => (
            <Popover key={index} placement="left-start">
              <div className="OneMember">
                <div className="AttachWithName">
                  <img
                    src={UserIcon_dark}
                    alt="UserIcon_dark"
                    className="AttachIcon"
                  />
                  <span>{onePerson.team} {onePerson.username}</span>
                  {onePerson.isAdmin && <div className="AdminIcon">admin</div>}
                </div>
                <PopoverTrigger>
                  <img
                    src={MessageMenu}
                    alt="MenuIcon"
                    className="OptionIcon"
                  />
                </PopoverTrigger>
                <Portal>
                  <PopoverContent
                    className="PersonSide_popover Management"
                    _focus={{ boxShadow: "none" }}
                  >
                    <div className="Message-OnClick-Menu">
                      <div className="OutOfChat">내보내기</div>
                      <div className="ChangeAdmin">관리자 변경</div>
                    </div>
                  </PopoverContent>
                </Portal>
              </div>
            </Popover>
          ))}
        </div>
      </div>
    );
};

export default PeopleManagement;
