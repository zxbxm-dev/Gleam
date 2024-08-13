import React from 'react';
import {
    HrLine,
    GraySearchIcon,
    UserManagementIcon
} from "../../assets/images/index";

interface HeaderProps {
  selectedPerson: any;
  setChatRoomPeopleManagement: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ selectedPerson, setChatRoomPeopleManagement }) => {
  return (
    <div className="Message-header">
      <div>
        <span>
          {selectedPerson.team || selectedPerson.department} {selectedPerson.username}
        </span>
        {selectedPerson.position && <img src={HrLine} alt="Horizontal Line" />}
        <span>{selectedPerson.position}</span>
      </div>
      <div className="UpperIconBar">
        <img src={GraySearchIcon} className="SearchIcon" alt="GraySearchIcon" />
        {selectedPerson && selectedPerson.username !== "통합 알림" && (
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
