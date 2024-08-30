import React from 'react';
import {
  HrLine,
  GraySearchIcon,
  UserManagementIcon,
} from "../../assets/images/index";
import { selectedRoomIdState } from '../../recoil/atoms';
import { useRecoilValue } from 'recoil';

interface HeaderProps {
  selectedPerson: any;
  setChatRoomPeopleManagement: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ selectedPerson, setChatRoomPeopleManagement, setShowSearch }) => {
  const selectedRoomId = useRecoilValue(selectedRoomIdState);

  return (
    <div className="Message-header">
      {selectedRoomId !== -2 ?
        <div>
          <div>
            {selectedPerson.team || selectedPerson.department} {selectedPerson.username}
          </div>
          {selectedPerson.position && <img src={HrLine} alt="Horizontal Line" />}
          <span>{selectedPerson.position}</span>
        </div>
        :
        <div>
          통합 알림
        </div>
      }
      <div className="UpperIconBar">
        <img
          src={GraySearchIcon}
          className="SearchIcon"
          alt="GraySearchIcon"
          onClick={() => setShowSearch(true)}
        />
        {selectedPerson && selectedRoomId !== -2 && (
          <img
            src={UserManagementIcon}
            className="UserManagementIcon"
            alt="UserManagementIcon"
            onClick={() => setChatRoomPeopleManagement(prev => !prev)}
          />
        )}
      </div>
    </div>
  );
};

export default Header;
