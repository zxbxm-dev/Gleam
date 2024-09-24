import React, { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, Portal, PopoverContent } from "@chakra-ui/react";
import {
  XIcon,
  MessageMenu,
  UserIcon_dark,
  RoomAdmin
} from "../../assets/images/index";
import { NewChatModalstate, userState, selectedRoomIdState } from '../../recoil/atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Person } from '../../components/sidebar/MemberSidebar';
import { PersonData } from '../../services/person/PersonServices';
import { changeAdminApi } from '../../services/message/MessageApi';
import io from 'socket.io-client';

interface PeopleManagementProps {
  chatRoomPeopleManagement: boolean;
  setChatRoomPeopleManagement: React.Dispatch<React.SetStateAction<boolean>>;
}

const PeopleManagement: React.FC<PeopleManagementProps> = ({ chatRoomPeopleManagement, setChatRoomPeopleManagement }) => {
  const [openchatModal, setOpenchatModal] = useRecoilState(NewChatModalstate);
  const [ChatModalOpenState] = useRecoilState(NewChatModalstate);
  const [personData, setPersonData] = useState<Person[] | null>(null);
  const [chatModalUser, setChatModalUser] = useState<{ id: string; name: string; isHost: boolean; attachment: string | null }[]>([]);
  const user = useRecoilValue(userState);
  const selectedRoomId = useRecoilValue(selectedRoomIdState);

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
          return { id: userId, name: `${data} ${userName}`, isHost, attachment };
        });

        setChatModalUser(updatedUsers);

      } catch (err) {
        console.error("Error fetching person data:", err);
      }
    };

    fetchData();
  }, [ChatModalOpenState.joinUser, ChatModalOpenState.hostId]);

  const changeAdmin = async (newAdminId: string) => {
    try {
      const roomId = selectedRoomId.roomId;
      const currentAdminId = ChatModalOpenState.hostId;

      await changeAdminApi(roomId, newAdminId, currentAdminId);

    } catch (error) {
      console.error("Error changing admin:", error);
    }
  };

  if (!chatRoomPeopleManagement) return null;

  const openModal = () => {
    setOpenchatModal((prevState) => ({
      ...prevState,
      openState: true,
    }));
  };

  //채팅방 내보내기
  const handleResignRoom = (roomId: number, resignId: string) => {
    const socket = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    socket.emit("resignroom", { roomId, resignId });
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
        {chatModalUser.map((joinuser, index) => (
          <Popover
            key={index}
            placement="left-start"
            closeOnBlur={true}
            closeOnEsc={true}
          >
            {({ onClose }) => (
              <div className="OneMember">
                <div className="AttachWithName">
                  <img
                    src={joinuser.attachment ? joinuser.attachment : UserIcon_dark}
                    alt="UserIcon_dark"
                    className="AttachIcon"
                  />
                  <div className='RommUserData'>
                    {joinuser.name}
                    {joinuser.isHost && <img src={RoomAdmin} alt="Admin Icon" />}
                  </div>
                </div>
                {ChatModalOpenState.hostId === user.userID &&
                  <>
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
                          <div
                            className="ChangeAdmin"
                            onClick={() => {
                              changeAdmin(joinuser.id);
                              onClose();
                            }}
                          >
                            관리자 변경
                          </div>
                        </div>
                        <div className="Message-OnClick-Menu">
                          <div
                            className="ChangeAdmin"
                            onClick={() => {
                              onClose();
                              handleResignRoom(selectedRoomId.roomId, joinuser.id);
                            }}
                          >
                            내보내기
                          </div>
                        </div>
                      </PopoverContent>
                    </Portal>
                  </>
                }
              </div>
            )}
          </Popover>
        ))}
      </div>
    </div>
  );
};

export default PeopleManagement;
