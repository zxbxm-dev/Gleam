import React , { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useBlocker } from "react-router-dom";
import {
  White_Arrow,
  ModalCloseBtn,
  mail_add_receiver,
  FourchainsLogo,
} from "../../assets/images/index";
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomModal from "../../components/modal/CustomModal";
import { useRecoilValue, useRecoilState } from 'recoil';
import { userState } from '../../recoil/atoms';
import { NewChatModalstate } from '../../recoil/atoms';
import AddReceiver from "./AddReceiver";
import { PersonData } from '../../services/person/PersonServices';
import { SendMail, DraftEmail } from "../../services/email/EmailService";
import { useQuery } from 'react-query';

export interface Person {
  userId: string;
  username: string;
  position: string;
  department: string;
  team: string;
  phoneNumber?: string;
  usermail?: string;
  entering: Date;
  attachment: string;
  company: string;
}

interface CustomFile extends File {
  fileName?: string;
}

const WriteMail = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const user = useRecoilValue(userState);

  const [isExitWritePageModalOpen, setExitWritePageModalOpen] = useState(false);

  const [openchatModal, setOpenchatModal] = useRecoilState(NewChatModalstate);
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
  const [attachments, setAttachments] = useState<CustomFile[]>([]);
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
  
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInvalidEmail, setHasInvalidEmail] = useState(false);


  const blocker = useBlocker(
    ({currentLocation, nextLocation}) =>
      (inputValue !== '' || inputReferrerValue !== '' || recipients.length !== 0 || referrers.length !== 0 || mailTitle !== '' || attachments.length !== 0 || mailContent !== '') &&
      currentLocation.pathname !== nextLocation.pathname
  );

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

  const groupByDepartmentAndTeam = (data: Person[]) => {
    const grouped: {
      [company: string]: { [department: string]: { [team: string]: Person[] } };
    } = {};

    data.forEach((person) => {
      if (!grouped[person.company]) {
        grouped[person.company] = {};
      }
      if (!grouped[person.company][person.department]) {
        grouped[person.company][person.department] = {};
      }
      if (!grouped[person.company][person.department][person.team]) {
        grouped[person.company][person.department][person.team] = [];
      }
      grouped[person.company][person.department][person.team].push(person);
    });

    return grouped;
  };

  const groupedData = persondata ? groupByDepartmentAndTeam(persondata) : {};

  const filterDataBySearchQuery = (data: {
    [company: string]: { [department: string]: { [team: string]: Person[] } };
  }) => {
    if (!searchQuery) return data;
    const filtered: {
      [company: string]: { [department: string]: { [team: string]: Person[] } };
    } = {};

    Object.keys(data).forEach((companyName) => {
      Object.keys(data[companyName]).forEach((departmentName) => {
        Object.keys(data[companyName][departmentName]).forEach((teamName) => {
          const filteredPersons = data[companyName][departmentName][
            teamName
          ].filter(
            (person) =>
              person.username.includes(searchQuery) ||
              person.department.includes(searchQuery) ||
              person.team.includes(searchQuery)
          );
          if (filteredPersons.length > 0) {
            if (!filtered[companyName]) {
              filtered[companyName] = {};
            }
            if (!filtered[companyName][departmentName]) {
              filtered[companyName][departmentName] = {};
            }
            filtered[companyName][departmentName][teamName] = filteredPersons;
          }
        });
      });
    });

    return filtered;
  };

  const filteredData = filterDataBySearchQuery(groupedData);

  const handleSendEmail = async () => {
    setIsLoading(true);
    setIsSavingDraft(true);
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
      } finally {
        setIsSavingDraft(true);
        setIsLoading(false);
      }

    } else {
      const hour = selectedTime.replace('시', '').trim();
      const minute = selectedMinute.replace('분', '').trim();

      const formattedMonth = String(month).padStart(2, '0');
      const formattedDate = String(date).padStart(2, '0');
      const formattedHour = String(hour).padStart(2, '0');
      const formattedMinute = String(minute).padStart(2, '0');
      
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
      if (year && month && date && selectedTime && selectedMinute) {
        const formattedQueueDate = `${year}-${formattedMonth}-${formattedDate} ${formattedHour}:${formattedMinute}:00`;
        formData.append('queueDate', formattedQueueDate);
      }
      formData.append('signature', String(false));

      try {
        console.log('FormData:', Array.from(formData.entries()));
        const response = await SendMail(formData);
        console.log('이메일 전송 성공', response);
        resetForm();
        navigate('/mail');
      } catch (error) {
        console.log('이메일 전송 실패',error)
      } finally {
        setIsSavingDraft(true);
        setIsLoading(false);
      }
    }
  };

  const handleDraftEmail = async () => {
    setIsSavingDraft(true);
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

    try {
      const response = await DraftEmail(formData);
      console.log('이메일 임시저장 성공', response);
      resetForm();
      navigate('/mail');
    } catch (error) {
      console.log('이메일 임시저장 실패',error)
    } finally {
      setIsSavingDraft(true);
    }
  };

  const openModal = () => {
    setOpenchatModal((prevState) => ({
      ...prevState,
      openState: true,
    }));
  };

  const handleConfirm = (selectedUsers: Person[]) => {
    const emails = selectedUsers
    .map(user => user.usermail)
    .filter((email): email is string => email !== undefined);

    // recipients 상태를 업데이트
    setRecipients(emails);
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

    if (option !== '메일 작성') {
      navigate('/mail');
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

  const handleMouseLeaveOn = (e: any) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setRecipients([...recipients, inputValue.trim()]);
      setInputValue('');
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

  const handleReferrerMouseLeaveOn = () => {
    if (inputReferrerValue.trim()) {
      setReferrers([...referrers, inputReferrerValue.trim()]);
      setInputReferrerValue('');
    }
  }

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
  
  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
  
    if (droppedFiles.length > 0) {
      const newAttachments: CustomFile[] = Array.from(droppedFiles).map(file => {
        return Object.assign(file, { fileName: file.name }) as CustomFile; 
      });
  
      setAttachments(prevAttachments => [...prevAttachments, ...newAttachments]);
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
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
    const handleAttachments = async () => {
      if (mail?.attachments) {
        const filePromises = mail.attachments.map(async (attachment: any) => {
          if (attachment instanceof File) {
            return attachment; // 이미 File 객체면 그대로 반환
          }
  
          // 파일 URL을 사용해 File 객체로 변환
          const response = await fetch(attachment.url);
          const blob = await response.blob();
          return new File([blob], attachment.fileName || attachment.name, { type: blob.type });
        });
  
        const files = await Promise.all(filePromises);
        setAttachments(files); // File[] 타입으로 상태 업데이트
      } else {
        setAttachments([]);
      }
    };

    if (status === 'DRAFTS') {
      setRecipients(mail?.receiver === ' ' ? [] : mail?.receiver ? (Array.isArray(mail?.receiver) ? [...mail.receiver] : [mail.receiver]) : []);
      setReferrers(mail?.referrer ? (Array.isArray(mail?.referrer) ? [...mail.referrer] : [mail.referrer]) : []);
      setMailTitle(mail?.subject);
      
       handleAttachments();
    
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

  useEffect(() => {
    if (user?.MobileCard === '사용 함') {
      if (editorRef.current) {
        const customContent = `
          <br/>
          <br/>
          <br/>
          <br/>
          <span><img src="${FourchainsLogo}" alt="FourchainsLogo"/></span>
          <div><span style='font-size: 11px; font-weight: bold'>${user?.username}</span> <span style='font-size: 10px; color: #494949'>${user?.team ? user?.team : user?.department ? user?.department : '포체인스'} / ${user?.position}</span></div>
          <div><span style='font-size: 11px; font-weight: bold'>Tel</span> <span style='font-size: 10px; color: #494949'>+82 ${user?.phoneNumber}</span></div>
          <div><span style='font-size: 11px; font-weight: bold'>Mobile</span> <span style='font-size: 10px; color: #494949'>+82 ${user?.phoneNumber}</span></div>
          <div><span style='font-size: 11px; font-weight: bold'>Email</span> <span style='font-size: 10px; color: #494949'>${user?.usermail}</span></div>
          <div><span style='font-size: 10px; color: #494949'>경기 고양시 일산서구 킨텍스로 217-59 오피스동 703호</span></div>
        `;
  
        editorRef.current.getInstance().setHTML(customContent);
      }
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const confirmationMessage = '변경사항이 저장되지 않을 수 있습니다.';

      event.preventDefault();
      return confirmationMessage;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  },[]);

  useEffect(() => {
    if (blocker.state === 'blocked' && !isSavingDraft) {
      setExitWritePageModalOpen(true);
    } else if (blocker.state === 'blocked' && isSavingDraft) {
      navigate('/mail');
    }
  }, [blocker.state, isSavingDraft]);

  useEffect(() => {
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const anyInvalidEmail = recipients.some(email => !isValidEmail(email));
    setHasInvalidEmail(anyInvalidEmail);
  }, [recipients]);

  
  return(
    <div className="content">
      <div className="write_mail_container">
        <div className="write_mail_header">
          <div className="mail_header_left">
            {isLoading ? <button className="send_button">전송 중...</button> : hasInvalidEmail ? <button className="disabled_send_button">보내기</button> : <button className="send_button" onClick={handleSendEmail}>보내기</button>}
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
              <div className="write_form_title">받는사람</div>
              <div className={`input_recipients marginleft ${isClicked ? 'clicked' : ''}`} onClick={handleClick} onMouseLeave={() => setIsClicked(false)}>
                {recipients?.map((email, index) => {
                  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                  return (
                    <div className={isValidEmail ? "recipient" : "notrecipient"} key={index}>
                      {email}
                      <span className="remove" onClick={() => handleRecipientRemove(email)}>×</span>
                    </div>
                  );
                })}
                <input
                  id="recipient_input_element"
                  className="write_form_input"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  onBlur={handleMouseLeaveOn}
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
              <div className="add_receiver">
                <img src={mail_add_receiver} onClick={openModal} alt="mail_add_receiver" />
                <AddReceiver filteredData={filteredData} onConfirm={handleConfirm}/>
              </div>
            </div>
            <div className="write_form">
              <div className="write_form_title">참조</div>
              <div className={`input_recipients ${isClicked ? 'clicked' : ''}`} onClick={handleClick} onMouseLeave={() => setIsClicked(false)}>
                {referrers?.map((email, index) => (
                  <div className="recipient" key={index}>
                    {email}
                    <span className="remove" onClick={() => handleReferrerRemove(email)}>×</span>
                  </div>
                ))}
                <input
                  id="recipient_input_element"
                  className="write_form_input"
                  type="text"
                  value={inputReferrerValue}
                  onChange={handleInputReferrerChange}
                  onKeyDown={handleReferrerInputKeyDown}
                  onBlur={handleReferrerMouseLeaveOn}
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
              <div className="write_form_title">제목</div>
              <input className="write_form_input" type="text" value={mailTitle} onChange={(e) => setMailTitle(e.target.value)}/>
            </div>
            <div className="attach_form" onDrop={handleFileDrop} onDragOver={handleDragOver}>
              <div>파일 첨부</div>
              <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', gap: '5px' }} >
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  style={{ display: 'none' }}
                />
                {attachments?.length !== 0 ? (
                  <div className="attachment_list">
                    {attachments?.map((file, index) => (
                      <div key={index} className="attachment_item">
                        <button onClick={(e) => handleRemoveFile(file.name, e)}>×</button>
                        <span>{file.name ? file.name : file.fileName}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="label_drop_container">
                    <span>파일 첨부하기 +</span>
                    <span>클릭 후 파일 선택이나 드래그로 파일 첨부 가능합니다.</span>
                  </div>
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

      {blocker.state === 'blocked' && (
        <CustomModal
          isOpen={isExitWritePageModalOpen}
          onClose={() => setExitWritePageModalOpen(false)}
          header={"알림"}
          headerTextColor="White"
          footer1={"나가기"}
          onFooter1Click={() => {setExitWritePageModalOpen(false); blocker.proceed()}}
          footer1Class="back-green-btn"
          footer2={"취소"}
          footer2Class="red-btn"
          onFooter2Click={() => {setExitWritePageModalOpen(false); blocker.reset()}}
        >
          <div>이 페이지를 벗어나면 변경된 내용은</div>
          <div>저장되지 않습니다.</div>
        </CustomModal>
      )}
    </div>
  );
};

export default WriteMail;