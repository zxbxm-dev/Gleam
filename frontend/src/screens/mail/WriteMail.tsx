import React , { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  White_Arrow,
  ModalCloseBtn,
  mail_add_receiver,
  mail_add_receiver_hover,
} from "../../assets/images/index";
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';
import { PersonData } from '../../services/person/PersonServices';
import { SendMail, DraftEmail } from "../../services/email/EmailService";
import { useQuery } from 'react-query';
import { isNull } from "mathjs";


const WriteMail = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const user = useRecoilValue(userState);
  const { mail, status } = location.state || {};
  const [persondata, setPersonData] = useState<any[]>([]);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [selectdMenuOption, setSelectedMenuOption] = useState('메일 작성');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [referrers, setReferrers] = useState<string[]>([]);
  const [mailTitle, setMailTitle] = useState<string>('');
  const editorRef = React.useRef<any>(null);
  const [mailContent, setMailContent] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [inputReferrerValue, setInputReferrerValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isClicked, setIsClicked] = useState(false);

  const reservationRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const year = startDate ? startDate.getFullYear() : null;
  const month = startDate ? startDate.getMonth() + 1 : null;
  const date = startDate ? startDate.getDate() : null;
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [minuteDropdownOpen, setMinuteDropdownOpen] = useState(false);
  const [selectedMinute, setSelectedMinute] = useState('');
  const [isAddReceiver, setIsAddReceiver] = useState(false);
  const generateTimeOptions = () => {
    const timeOptions = [];
    for (let hour = 0; hour <= 24; hour++) {
      if (hour === 24) {
        timeOptions.push('24시');
      } else {
        timeOptions.push(`${hour.toString().padStart(2, '0')}시`);
      }
    }
    return timeOptions;
  };
  
  const timeOptions = generateTimeOptions();
  const minuteOptions = ['00분', '30분'];

  const resetForm = () => {
    setRecipients([]);
    setReferrers([]);
    setMailTitle('');
    setAttachments([]);
    setMailContent('');
  }

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

  const handleSendEmail = async () => {
    if(status === "DRAFTS") {
      const formData = new FormData();
      formData.append('Id', mail?.Id);
      formData.append('userId', user.userID);
      formData.append('messageId', user.userID + new Date());
      formData.append('sender', user.usermail);
      recipients.forEach((recipient, index) => {
        formData.append(`receiver`, recipient);
      });
      
      referrers.forEach((referrer, index) => {
        formData.append(`referrer`, referrer);
      });
      formData.append('subject', mailTitle);
      formData.append('body', mailContent);
      formData.append('sendAt', new Date().toISOString());
      attachments.forEach((file) => {
        formData.append('attachment', file); 
      });
      formData.append('receiveAt', new Date().toISOString());
      formData.append('signature', String(false));
      formData.append('folder', mail?.folder);

      try {
        const response = await SendMail(formData);
        console.log('이메일 전송 성공', response);
        resetForm();
        navigate('/mail');
      } catch (error) {
        console.log('이메일 전송 실패',error)
      }

    } else {
      const hour = selectedTime.replace('시', '').trim();
      const minute = selectedMinute.replace('분', '').trim();

      const formattedMonth = String(month).padStart(2, '0');
      const formattedDate = String(date).padStart(2, '0');
      const formattedHour = String(hour).padStart(2, '0');
      const formattedMinute = String(minute).padStart(2, '0');
      const formattedQueueDate = `${year}-${formattedMonth}-${formattedDate} ${formattedHour}:${formattedMinute}:00`;
      
      const formData = new FormData();
      formData.append('userId', user.userID);
      formData.append('messageId', user.userID + new Date());
      formData.append('sender', user.usermail);
      recipients.forEach((recipient, index) => {
        formData.append(`receiver`, recipient);
      });
      
      referrers.forEach((referrer, index) => {
        formData.append(`referrer`, referrer);
      });
      formData.append('subject', mailTitle);
      formData.append('body', mailContent);
      formData.append('sendAt', new Date().toISOString());
      attachments.forEach((file) => {
        formData.append('attachment', file); 
      });
      formData.append('receiveAt', new Date().toISOString());
      formData.append('queueDate', formattedQueueDate);
      formData.append('signature', String(false));

      try {
        console.log('FormData:', Array.from(formData.entries()));
        const response = await SendMail(formData);
        console.log('이메일 전송 성공', response);
        resetForm();
        navigate('/mail');
      } catch (error) {
        console.log('이메일 전송 실패',error)
      }
    }
  };

  const handleDraftEmail = async () => {
    const formData = new FormData();
      formData.append('userId', user.userID);
      formData.append('messageId', user.userID + new Date());
      formData.append('sender', user.usermail);
      recipients.forEach((recipient, index) => {
        formData.append(`receiver`, recipient);
      });
      
      referrers.forEach((referrer, index) => {
        formData.append(`referrer`, referrer);
      });
      formData.append('subject', mailTitle);
      formData.append('body', mailContent);
      formData.append('sendAt', new Date().toISOString());
      attachments.forEach((file) => {
        formData.append('attachment', file); 
      });
      formData.append('receiveAt', new Date().toISOString());
      formData.append('signature', String(false));

    try {
      const response = await DraftEmail(formData);
      console.log('이메일 임시저장 성공', response);
      resetForm();
      navigate('/mail');
    } catch (error) {
      console.log('이메일 임시저장 실패',error)
    }
  };

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
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
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
      if (inputReferrerValue.trim()) {
        setReferrers([...referrers, inputReferrerValue.trim()]);
        setInputReferrerValue('');
      }
    }
  };

  const handleBlurRecipients = () => {
    if (inputValue.trim()) {
      setRecipients([...recipients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleBlurReferrer = () => {
    if (inputReferrerValue.trim()) {
      setReferrers([...referrers, inputReferrerValue.trim()]);
      setInputReferrerValue('');
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setAttachments(prevFiles => [...prevFiles, ...newFiles]);
    }
  };
  

  const handleRemoveFile = (fileName: string, e: React.MouseEvent) => {
    e.preventDefault();
    setAttachments(attachments.filter((file) => file.name !== fileName));
  };

  const handleMailContent = () => {
    const htmlContent = editorRef.current.getInstance().getHTML();
    setMailContent(htmlContent);
  }

  const formatDate = (sendAt: any) => {
    const date = new Date(sendAt);
  
    // 날짜 형식 지정 (예: 2024-06-13)
    const datePart = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    });
  
    // 시간 형식 지정 (예: 03:37:34)
    const timePart = date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  
    // 타임존 (GMT+09:00) 부분 추가
    const timeZone = 'GMT+09:00'; // 고정된 시간대를 사용
  
    return `${datePart} ${timePart} (${timeZone})`;
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
  
  useEffect(() => {
    if (status === 'DRAFTS') {
      setRecipients(Array.isArray(mail?.receiver) ? mail?.receiver : []);
      setReferrers(Array.isArray(mail?.referrer) ? mail?.referrer : []);
      setMailTitle(mail?.subject);
    
      if (editorRef.current && mail?.body) {
        editorRef.current.getInstance().setHTML(mail.body);
      }
    } else if (status === 'FW') {
      setMailTitle('FW: ' + mail?.subject);

      if (editorRef.current && mail?.body) {
        editorRef.current.getInstance().setHTML(mail.body);
      }
    } else if (status === 'RE') {
      setRecipients([mail?.sender]);
      setMailTitle('RE: ' + mail?.subject);

      if (editorRef.current) {
        const customContent = `
          <div>-----Original Message-----</div>
          <div>From: &lt; ${mail?.sender} &gt;</div>
          <div>To: &lt; ${user?.usermail} &gt;</div>
          <div>Cc: ${Array.isArray(mail?.referrer) ? mail?.referrer : []}</div>
          <div>Sent: ${formatDate(mail?.sendAt)}</div>
          <div>Subject : ${mail?.subject}</div>
          <br/>
          <div>${mail?.body}</div>
        `;

        editorRef.current.getInstance().setHTML(customContent);
      }
    }
  }, [mail, status, user]);

  return(
    <div className="content">
      <div className="write_mail_container">
        <div className="write_mail_header">
          <div className="mail_header_left">
            <button className="send_button" onClick={handleSendEmail}>보내기</button>
            <button className="basic_button" onClick={handleDraftEmail}>임시 저장</button>
            <button className="basic_button" onClick={toggleReservation}>
              발송 예약
              {year && <span> &nbsp;&nbsp;&nbsp; {year}.</span>}
              {month && <span> {month}.</span>}
              {date && <span> {date}</span>}
              {selectedTime && <span> &nbsp; {selectedTime?.slice(0,2)} :&nbsp;</span>}
              {selectedMinute && <span> {selectedMinute?.slice(0,2)} </span>}
              {year && month && date && selectedTime && selectedMinute && (
                <img src={ModalCloseBtn} alt="ModalCloseBtn" onClick={() => {setStartDate(null); setSelectedTime(''); setSelectedMinute(''); }}/>
              )}
              
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
                      {selectedTime || '00시'}
                      <img src={White_Arrow} alt="White_Arrow" />
                      {timeDropdownOpen && (
                        <ul className="time_dropdown">
                          {timeOptions?.map(option => (
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
                    <div className="mail_reservation_content_time" onClick={() => setMinuteDropdownOpen(!minuteDropdownOpen)} ref={minuteRef}>
                      {selectedMinute || '00분'}
                      <img src={White_Arrow} alt="White_Arrow" />
                      {minuteDropdownOpen && (
                        <ul className="time_dropdown">
                          {minuteOptions?.map(option => (
                            <li key={option} onClick={() => {
                              setSelectedMinute(option);
                              setMinuteDropdownOpen(false);
                            }}>
                              {option}
                            </li>
                          ))}
                        </ul>
                      )}
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
                    {menuOptions?.map((option: string) => (
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
              <div className={`input_recipients marginleft ${isClicked ? 'clicked' : ''}`} onClick={handleClick} onMouseLeave={() => setIsClicked(false)}>
                {recipients?.map((email, index) => (
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
                  onBlur={handleBlurRecipients}
                  ref={inputRef}
                />
                {inputValue && (
                  <ul className="autocomplete_dropdown">
                    {filteredEmails?.map(person => (
                      <li key={person.usermail} onClick={() => handleAutoCompleteClick(person.usermail)}>
                        {person.usermail} - {person.team ? person.team : person.department} {person.username}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="add_receiver" onMouseEnter={() => setIsAddReceiver(true)} onMouseLeave={() => setIsAddReceiver(false)}>
                {isAddReceiver ? 
                  <img src={mail_add_receiver_hover} alt="mail_add_receiver_hover" />
                  :
                  <img src={mail_add_receiver} alt="mail_add_receiver" />
                }
              </div>
            </div>
            <div className="write_form">
              <div>참조</div>
              <div className={`input_recipients ${isClicked ? 'clicked' : ''}`} onClick={handleClick} onMouseLeave={() => setIsClicked(false)}>
                {referrers?.map((email, index) => (
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
                  onBlur={handleBlurReferrer}
                  ref={inputRef}
                />
                {inputReferrerValue && (
                  <ul className="autocomplete_dropdown">
                    {filteredReferrerEmails?.map(person => (
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
                  onChange={handleFileChange}
                  multiple
                  style={{ display: 'none' }}
                />
                {attachments.length > 0 ? (
                  <div className="attachment_list">
                    {attachments?.map((file, index) => (
                      <div key={index} className="attachment_item">
                        <button onClick={(e) => handleRemoveFile(file.name, e)}>×</button>
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <span>파일 첨부하기 +</span>
                    <span>클릭 후 파일 선택이나 드래그로 파일 첨부 가능합니다.</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="write_mail_content_bottom">
            <Editor
              ref={editorRef}
              initialValue={mailContent ? mailContent : ' '}
              height={window.innerWidth >= 1600 ? '43vh' : '35vh'}
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
              onChange={handleMailContent}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteMail;