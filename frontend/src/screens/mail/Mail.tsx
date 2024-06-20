import { 
  mail_calendar, 
  mail_delete, 
  mail_download, 
  mail_important, 
  mail_important_active, 
  mail_setting, 
  mail_spam, 
  mail_write,
  White_Arrow,
  SearchIcon
 } from "../../assets/images/index";
import { useState } from "react";

const Mail = () => {
  const [settingVisible, setSettingVisible] = useState(false);

  const toggleSetting = () => {
    setSettingVisible(!settingVisible);
  };


  return (
    <div className="content">
      <div className="mail_container">
        <div className="mail_header">
          <div className="mail_header_left">
            <label className="custom-checkbox">
              <input type="checkbox" id="check1" />
              <span></span>
            </label>
            <img src={mail_delete} alt="mail_delete" />
            <img src={mail_spam} alt="mail_spam" />
            <img src={mail_write} alt="mail_write" />
          </div>

          <div className="mail_header_right">
            <div className={`setting_box ${settingVisible ? 'visible' : ''}`} onClick={toggleSetting}>
              {settingVisible ? (
                <>
                  <img src={mail_setting} alt="mail_setting" />
                  <img src={White_Arrow} alt="White_Arrow" className="Arrow_right"/>
                </>
              ) : (
                <>
                  <img src={White_Arrow} alt="White_Arrow" className="Arrow_left"/>
                  <img src={mail_setting} alt="mail_setting" />
                </>
              )}
            </div>
            <div className={`addtional_setting ${settingVisible ? 'visible' : ''}`}>
              <div className="input-wrapper">
                <img src={SearchIcon} alt="SearchIcon" className="search-icon" />
                <input
                  type="search"
                  className="input_form"
                  placeholder="검색어를 입력해 주세요."
                />
              </div>
              <button className={`spam_button`}>스팸 설정</button>
              <button className={`card_button`}>모바일 명함</button>
              <div className="select_duedate_box">
                <span>기간</span>
                <img src={White_Arrow} alt="White_Arrow" />
              </div>
            </div>
            <div className="select_box">
              <span>전체 메일</span>
              <img src={White_Arrow} alt="White_Arrow" />
            </div>
          </div>
        </div>
        <div className="mail_content">

        </div>

      </div>
    </div>
  );
};

export default Mail;