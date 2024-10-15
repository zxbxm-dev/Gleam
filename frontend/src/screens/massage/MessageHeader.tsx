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
  toggleSection: (section: 'search' | 'peopleManagement') => void;
}

const Header: React.FC<HeaderProps> = ({ selectedPerson, toggleSection }) => {
  const selectedRoomId = useRecoilValue(selectedRoomIdState);

  return (
    <div className="Message-header">
      {selectedRoomId.roomId !== -2 ?
        <div>
          <div>
            {selectedPerson.team || selectedPerson.department} {selectedPerson.username}
          </div>
          {selectedPerson.position && <img src={HrLine} alt="Horizontal Line" />}
          <span>{selectedPerson.position}</span>
        </div>
        :
        <div>
          {/* 통합 알림 */}
        </div>
      }
      <div className="UpperIconBar">
        <img
          src={GraySearchIcon}
          className="SearchIcon"
          alt="GraySearchIcon"
          onClick={() => toggleSection('search')}
        />
        {selectedPerson && selectedRoomId.roomId !== -2 && (
          <img
            src={UserManagementIcon}
            className="UserManagementIcon"
            alt="UserManagementIcon"
            onClick={() => toggleSection('peopleManagement')}
          />
        )}
      </div>
    </div>
  );
};

export default Header;
