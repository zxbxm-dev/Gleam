import { 
  mail_calendar, 
  mail_delete, 
  mail_download, 
  mail_important, 
  mail_important_active, 
  mail_setting, 
  mail_spam, 
  mail_write,
  White_Arrow } from "../../assets/images/index";

const Mail = () => {
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
            <div className="setting_box">
              <img src={White_Arrow} alt="White_Arrow" className="Arrow_left"/>
              <img src={mail_setting} alt="mail_setting" />
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