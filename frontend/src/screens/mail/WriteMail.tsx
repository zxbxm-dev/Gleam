import { useState } from "react";
import {
  White_Arrow,
} from "../../assets/images/index";

const WriteMail = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [selectdMenuOption, setSelectedMenuOption] = useState('전체 메일');

  const toggleDropdown = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedMenuOption(option);
    setMenuIsOpen(false);
  };

  const menuOptions = [
    '전체 메일',
    '중요 메일',
    '받은 메일함',
    '보낸 메일함',
    '안 읽은 메일',
    '임시 보관함',
    '스팸 메일함',
  ];

  return(
    <div className="content">
      <div className="write_mail_container">
        <div className="write_mail_header">
          <div className="mail_header_left">
            <button className="send_button">보내기</button>
            <button className="basic_button">임시 저장</button>
            <button className="basic_button">발송 예약</button>
          </div>

          <div className="mail_header_right">
            <div className="select_box">
                <div className="selected_option" onClick={toggleDropdown}>
                  <span>{selectdMenuOption}</span>
                  <img src={White_Arrow} alt="White_Arrow" />
                </div>
                {menuIsOpen && (
                  <ul className="dropdown_menu">
                    {menuOptions.map((option: string) => (
                      <li key={option} onClick={() => handleOptionSelect(option)}>
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
          </div>
        </div>

        <div className="write_mail_content">
          <div className="write_mail_content_top">
            <div className="write_form">
              <div>받는사람</div>
              <input type="text"/>
            </div>
            <div className="write_form">
              <div>참조</div>
              <input type="text"/>
            </div>
            <div className="write_form">
              <div>제목</div>
              <input type="text"/>
            </div>
            <div className="write_form">
              <div>파일 첨부</div>
              <input type="text"/>
            </div>
          </div>

          <div className="write_mail_content_bottom">
            메일 작성란
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteMail;