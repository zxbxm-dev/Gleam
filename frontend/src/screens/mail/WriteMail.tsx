import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  White_Arrow,
} from "../../assets/images/index";
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PersonData } from '../../services/person/PersonServices';
import { useQuery } from 'react-query';
import { isNull } from "mathjs";


const WriteMail = () => {
  let navigate = useNavigate();
  const [persondata, setPersonData] = useState<any[]>([]);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [selectdMenuOption, setSelectedMenuOption] = useState('메일 작성');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [referrers, setReferrers] = useState<string[]>([]);
  const [mailTitle, setMailTitle] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [inputReferrerValue, setInputReferrerValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isClicked, setIsClicked] = useState(false);

  const reservationRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('16시');
  const timeOptions = ['16시', '17시', '18시'];


  const fetchUser = async () => {
    try {
      const response = await PersonData();
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  };

  useQuery("person", fetchUser, {
    onSuccess: (data) => {
      setPersonData(data);
    },
    onError: (error) => {
      console.log(error);
    }
  })

  const toggleDropdown = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const toggleReservation = () => {
    setIsReservationOpen(!isReservationOpen);
  }

  const handleOptionSelect = (option: string) => {
    setSelectedMenuOption(option);
    setMenuIsOpen(false);

    if (option === '전체 메일') {
      if (isNull(recipients) || isNull(referrers) || isNull(mailTitle)) {
        window.alert('작성된 사항은 저장되지 않습니다.');
        navigate('/mail');
      } else {
        console.log('아무거도없음')
        navigate('/mail');
      }
    }
  };

  const menuOptions = [
    '전체 메일',
    '중요 메일',
    '받은 메일함',
    '보낸 메일함',
    '안 읽은 메일',
    '임시 보관함',
    '스팸 메일함',
    '메일 작성'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputReferrerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputReferrerValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        setRecipients([...recipients, inputValue.trim()]);
        setInputValue('');
      }
    }
  };

  const handleReferrerInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        setReferrers([...referrers, inputValue.trim()]);
        setInputReferrerValue('');
      }
    }
  };

  const handleRecipientRemove = (email: string) => {
    setRecipients(recipients.filter(recipient => recipient !== email));
  };

  const handleReferrerRemove = (email: string) => {
    setReferrers(referrers.filter(referrer => referrer !== email));
  };

  const handleAutoCompleteClick = (email: string) => {
    setRecipients([...recipients, email]);
    setInputValue('');
  };

  const handleReferrerAutoCompleteClick = (email: string) => {
    setReferrers([...referrers, email]);
    setInputReferrerValue('');
  };

  const filteredEmails = persondata.filter(person => {
    const inputLowerCase = inputValue.toLowerCase();
    if (person.team) {
      return (
        person.username.toLowerCase().includes(inputLowerCase) ||
        person.usermail.toLowerCase().includes(inputLowerCase) ||
        person.team.toLowerCase().includes(inputLowerCase)
      )
    } else {
      return (
        person.username.toLowerCase().includes(inputLowerCase) ||
        person.usermail.toLowerCase().includes(inputLowerCase) ||
        person.department.toLowerCase().includes(inputLowerCase)
      )
    }
  });

  const filteredReferrerEmails = persondata.filter(person => {
    const inputLowerCase = inputReferrerValue.toLowerCase();
    if (person.team) {
      return (
        person.username.toLowerCase().includes(inputLowerCase) ||
        person.usermail.toLowerCase().includes(inputLowerCase) ||
        person.team.toLowerCase().includes(inputLowerCase)
      )
    } else {
      return (
        person.username.toLowerCase().includes(inputLowerCase) ||
        person.usermail.toLowerCase().includes(inputLowerCase) ||
        person.department.toLowerCase().includes(inputLowerCase)
      )
    }
  });

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reservationRef.current && !reservationRef.current.contains(event.target as Node)) {
        setIsReservationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [reservationRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
        setTimeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [timeRef]);

  return(
    <div className="content">
      <div className="write_mail_container">
        <div className="write_mail_header">
          <div className="mail_header_left">
            <button className="send_button">보내기</button>
            <button className="basic_button" onClick={() => navigate('/mail')}>임시 저장</button>
            <button className="basic_button" onClick={toggleReservation}>
              발송 예약
              {isReservationOpen && (
                <div className="mail_reservation_container" onClick={(e) => e.stopPropagation()} ref={reservationRef}>
                  <div className="mail_reservation_title">예약 시간</div>
                  <div className="mail_reservation_content">
                    <div className="mail_reservation_content_date">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        placeholderText={new Date().toLocaleDateString('ko-KR')}
                        dateFormat="yyyy.MM.dd"
                        className="datepicker"
                        popperPlacement="top"
                      />
                    </div>
                    <div className="mail_reservation_content_time" onClick={() => setTimeDropdownOpen(!timeDropdownOpen)} ref={timeRef}>
                      {selectedTime}
                      <img src={White_Arrow} alt="White_Arrow" />
                      {timeDropdownOpen && (
                        <ul className="time_dropdown">
                          {timeOptions.map(option => (
                            <li key={option} onClick={() => {
                              setSelectedTime(option);
                              setTimeDropdownOpen(false);
                            }}>
                              {option}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="mail_reservation_content_time">
                      30분
                      <img src={White_Arrow} alt="White_Arrow" />
                    </div>
                  </div>
                  <div className="mail_reservation_footer">입력된 시간으로 메일 발송되니, 정확히 확인 부탁드립니다.</div>
                </div>
              )}
            </button>
            
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
              <div className={`input_recipients ${isClicked ? 'clicked' : ''}`} onClick={handleClick} onMouseLeave={() => setIsClicked(false)}>
                {recipients.map((email, index) => (
                  <div className="recipient" key={index}>
                    {email}
                    <span className="remove" onClick={() => handleRecipientRemove(email)}>×</span>
                  </div>
                ))}
                <input
                  id="recipient_input_element"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  ref={inputRef}
                />
                {inputValue && (
                  <ul className="autocomplete_dropdown">
                    {filteredEmails.map(person => (
                      <li key={person.usermail} onClick={() => handleAutoCompleteClick(person.usermail)}>
                        {person.usermail} - {person.team ? person.team : person.department} {person.username}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="write_form">
              <div>참조</div>
              <div className={`input_recipients ${isClicked ? 'clicked' : ''}`} onClick={handleClick} onMouseLeave={() => setIsClicked(false)}>
                {referrers.map((email, index) => (
                  <div className="recipient" key={index}>
                    {email}
                    <span className="remove" onClick={() => handleReferrerRemove(email)}>×</span>
                  </div>
                ))}
                <input
                  id="recipient_input_element"
                  type="text"
                  value={inputReferrerValue}
                  onChange={handleInputReferrerChange}
                  onKeyDown={handleReferrerInputKeyDown}
                  ref={inputRef}
                />
                {inputReferrerValue && (
                  <ul className="autocomplete_dropdown">
                    {filteredReferrerEmails.map(person => (
                      <li key={person.usermail} onClick={() => handleReferrerAutoCompleteClick(person.usermail)}>
                        {person.usermail} - {person.team ? person.team : person.department} {person.username}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="write_form">
              <div>제목</div>
              <input type="text" value={mailTitle} onChange={(e) => setMailTitle(e.target.value)}/>
            </div>
            <div className="attach_form">
              <div>파일 첨부</div>
              <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', gap: '5px' }}>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                />
                <span>파일 첨부하기 +</span>
                <span>클릭 후 파일선택이나 드래그로 파일 첨부 가능합니다.</span>
              </label>
            </div>
          </div>

          <div className="write_mail_content_bottom">
            <Editor
              initialValue={" "}
              height={window.innerWidth >= 1600 ? '45vh' : '35vh'}
              initialEditType="wysiwyg"
              useCommandShortcut={false}
              hideModeSwitch={true}
              plugins={[colorSyntax]}
              language="ko-KR"
              toolbarItems={[
                ['heading', 'bold', 'italic', 'strike'],
                ['hr', 'quote'],
                ['ul', 'ol', 'task', 'indent', 'outdent'],
                ['image', 'link'],
                ['scrollSync'],                    
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteMail;