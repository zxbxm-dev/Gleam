import React, { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, Portal, PopoverContent } from "@chakra-ui/react";
import {
  XIcon,
  MessageMenu,
  UserIcon_dark,
  RoomAdmin
} from "../../assets/images/index";
import { NewChatModalstate } from '../../recoil/atoms';
import { useRecoilState } from 'recoil';
import { Person } from '../../components/sidebar/MemberSidebar';
import { PersonData } from '../../services/person/PersonServices';

interface PeopleManagementProps {
  chatRoomPeopleManagement: boolean;
  setChatRoomPeopleManagement: React.Dispatch<React.SetStateAction<boolean>>;
}

const PeopleManagement: React.FC<PeopleManagementProps> = ({ chatRoomPeopleManagement, setChatRoomPeopleManagement }) => {
  const [openchatModal, setOpenchatModal] = useRecoilState(NewChatModalstate);
  const [ChatModalOpenState] = useRecoilState(NewChatModalstate);
  const [personData, setPersonData] = useState<Person[] | null>(null);
  const [chatModalUser, setChatModalUser] = useState<{ name: string; isHost: boolean; attachment: string | null }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PersonData();
        const approvedUser = response.data.filter((item: any) => item.status === 'approved');
        const sortedData = approvedUser.sort((a: Person, b: Person) => new Date(a.entering).getTime() - new Date(b.entering).getTime());
        setPersonData(sortedData);
        
        const userIds = Array.isArray(ChatModalOpenState.joinUser) ? ChatModalOpenState.joinUser : [ChatModalOpenState.joinUser];

        const filteredData = sortedData.filter((person: Person) => userIds.includes(person.userId));
        
        const userTeams = filteredData.map((person: Person) => person.team ? person.team : person.department);
        const userNames = filteredData.map((person: Person) => person.username);
        const userAttachments = filteredData.map((person: Person) => person.attachment);
        
        const dataTeamDept = userTeams;

        const updatedUsers = dataTeamDept.map((data: any, index: any) => {
          const userName = userNames[index];
          const userId = filteredData[index].userId;
          const isHost = userId === ChatModalOpenState.hostId;
          const attachment = userAttachments[index];
          return { name: `${data} ${userName}`, isHost, attachment };
        });

        setChatModalUser(updatedUsers);
        
      } catch (err) {
        console.error("Error fetching person data:", err);
      }
    };

    fetchData();
  }, [ChatModalOpenState.joinUser, ChatModalOpenState.hostId]);

  if (!chatRoomPeopleManagement) return null;

  const openModal = () => {
    setOpenchatModal((prevState) => ({
      ...prevState,
      openState: true,
    }));
  };

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
      <div
        className="AddPerson-tab"
        onClick={() => openModal()}
      >+ 인원 추가하기</div>
      <div className="ChatRoom-Members">
        {chatModalUser.map((user, index) => (
          <Popover key={index} placement="left-start">
            <div className="OneMember">
              <div className="AttachWithName">
                <img
                  src={user.attachment?user.attachment:UserIcon_dark}
                  alt="UserIcon_dark"
                  className="AttachIcon"
                />
                <div className='RommUserData'>
                  {user.name}
                  {user.isHost && <img src={RoomAdmin} alt="Admin Icon" />}
                </div>
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
