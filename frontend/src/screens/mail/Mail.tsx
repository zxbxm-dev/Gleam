import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  mail_delete,
  mail_download,
  mail_preview,
  mail_attachment_del,
  mail_attachment_hwp,
  mail_important,
  mail_important_active,
  mail_setting,
  mail_spam,
  mail_write,
  mail_attachment,
  mail_triangle,
  mail_calendar,
  White_Arrow,
  SearchIcon,
  Down_Arrow,
} from "../../assets/images/index";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomModal from "../../components/modal/CustomModal";
import BlockMail from "./BlockMail";
import MobileCard from "./MobileCard";
import Pagenation from "./Pagenation";
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';
import { useQuery } from 'react-query';
import { CheckEmail, DeleteEmail, StarringEmail } from "../../services/email/EmailService";

const Mail = () => {
  let navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [page, setPage] = useState<number>(1);
  const [postPerPage, setPostPerPage] = useState<number>(11);
  const [settingVisible, setSettingVisible] = useState(true);
  const [hoverState, setHoverState] = useState<string>("");
  const [isRecipientHover, setIsRecipientHover] = useState(false);
  const [isDownFileVisible, setIsDownFilevisible] = useState(false);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSpamModalOpen, setSpamModalOpen] = useState(false);
  const [isReadMailListModalOpen, setIsReadMailListOpen] = useState(false);
  const [isSentCancleModalOpen, setIsSentCancleOpen] = useState(false);
  const [isReserveCancleModalOpen, setIsReserveCancleOpen] = useState(false);
  const [isMobileCardModal, setIsMobileCardModal] = useState(false);
  const [isSpamSettingModal, setIsSpamSettingModal] = useState(false);

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [selectdMenuOption, setSelectedMenuOption] = useState('전체 메일');
  const [dueDateIsOpen, setDuedDateIsOpen] = useState(false);
  const [selectdDueDateOption, setSelectedDueDateOption] = useState('전체');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [mailContentVisibility, setMailContentVisibility] = useState<{ [key: number]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [originalMails, setOriginalMails] = useState<any[]>([]);
  const [mails, setMails] = useState<any[]>([]);
  const [clickedMails, setClickedMails] = useState<{ [key: number]: boolean }>({});
  const [allSelected, setAllSelected] = useState(false);
  const [selectedMails, setSelectedMails] = useState<{ [key: number]: { messageId: any; selected: boolean } }>({});

  const [visibleAttachments, setVisibleAttachments] = useState(3);

  const itemsPerPage = 10;

  const menuOptions = [
    '전체 메일',
    '중요 메일',
    '받은 메일함',
    '보낸 메일함',
    '안 읽은 메일',
    '임시 보관함',
    '스팸 메일함',
  ];

  const handleDateChange = (date: Date, isStart: boolean) => {
    if (isStart) {
      setStartDate(date);
      if (date && endDate) {
        setSelectedDueDateOption(`${date.toLocaleDateString('ko-KR')} ~ ${endDate.toLocaleDateString('ko-KR')}`);
      } else {
        setSelectedDueDateOption(date ? date.toLocaleDateString('ko-KR') : '전체');
      }
    } else {
      setEndDate(date);
      if (startDate && date) {
        setSelectedDueDateOption(`${startDate.toLocaleDateString('ko-KR')} ~ ${date.toLocaleDateString('ko-KR')}`);
      } else {
        setSelectedDueDateOption(date ? date.toLocaleDateString('ko-KR') : '전체');
      }
    }
  };

  const dueDateOptions = [
    '전체',
    '최근 1주일',
    '최근 1개월',
    '최근 1년',
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1600) {
        setPostPerPage(15); // Desktop
      } else if (window.innerWidth >= 992) {
        setPostPerPage(12); // Laptop
      } else {
        setPostPerPage(12);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchEmail = async () => {
    try {
      const response = await CheckEmail(user.userID);
      return response.data;
    } catch (error) {
      console.log('Failed to fetch Email data');
    };
  };

  const { refetch : refetchEmail } = useQuery("Email", fetchEmail, {
    enabled: false,
    onSuccess: (data) => {
      const reversedEmails = data?.emails.reverse();
      setOriginalMails(reversedEmails);
      setMails(reversedEmails);
    },
    onError: (error) => {
      console.log(error);
    }
  });

  useEffect(() => {
    // 페이지 첫 렌더링 시 전체 메일 데이터를 가져옴
    refetchEmail();
  }, []);

  useEffect(() => {
    switch (selectdMenuOption) {
      case "전체 메일":
        setMails(originalMails?.filter((mail) => mail.folder !== 'junk'));
        setPage(1);
        break;
      case "중요 메일":
        setMails(originalMails?.filter((mail) => mail.star === 'starred'));
        setPage(1);
        break;
      case "받은 메일함":
        setMails(originalMails?.filter((mail) => mail.folder === 'inbox'));
        setPage(1);
        break;
      case "보낸 메일함":
        setMails(originalMails?.filter((mail) => mail.folder === 'sent'));
        setPage(1);
        break;
      case "안 읽은 메일":
        setMails(originalMails?.filter((mail) => mail.folder === 'unread'));
        setPage(1);
        break;
      case "임시 보관함":
        setMails(originalMails?.filter((mail) => mail.folder === 'drafts'));
        setPage(1);
        break;
      case "스팸 메일함":
        setMails(originalMails?.filter((mail) => mail.folder === 'junk'));
        setPage(1);
        break;
      default:
        setMails(originalMails);
        setPage(1);
    }
  }, [selectdMenuOption, originalMails]);

  const getStartOfPeriod = (period: string) => {
    const now = new Date();
    switch (period) {
      case "최근 1주일":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);
        return startOfWeek;
      case "최근 1개월":
        const startOfMonth = new Date(now);
        startOfMonth.setMonth(now.getMonth() - 1);
        return startOfMonth;
      case "최근 1년":
        const startOfYear = new Date(now);
        startOfYear.setFullYear(now.getFullYear() - 1);
        return startOfYear;
      default:
        return null;
    }
  };

  useEffect(() => {
    let filteredMails = originalMails;
    const now = new Date();

    switch (selectdDueDateOption) {
      case "전체":
        // No filtering
        break;
      case "최근 1주일":
      case "최근 1개월":
      case "최근 1년":
        const startDate = getStartOfPeriod(selectdDueDateOption);
        if (startDate) {
          filteredMails = originalMails.filter(mail => {
            const mailDate = new Date(mail.receiveAt);
            return mailDate >= startDate && mailDate <= now;
          });
        }
        break;
      default:
        break;
    }

    setMails(filteredMails);
  }, [selectdDueDateOption, originalMails]);

  useEffect(() => {
    let filteredMails = originalMails;

    if (startDate && endDate) {
      filteredMails = originalMails.filter(mail => {
        const mailDate = new Date(mail?.receiveAt);
        return mailDate >= startDate && mailDate <= endDate;
      });
    } else if (startDate) {
      filteredMails = originalMails.filter(mail => {
        const mailDate = new Date(mail?.receiveAt);
        return mailDate >= startDate;
      });
    } else if (endDate) {
      filteredMails = originalMails.filter(mail => {
        const mailDate = new Date(mail?.receiveAt);
        return mailDate <= endDate;
      });
    }

    setMails(filteredMails);
  }, [startDate, endDate, originalMails]);
  
  const filteredMails = mails?.filter((mail) =>
    mail.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderMailContent = (mail: any) => {
    return { __html: mail.body };
  };

  const totalPages = Math.ceil(filteredMails?.length / postPerPage);

  const toggleDropdown = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const toggleDownFile = () => {
    setIsDownFilevisible(!isDownFileVisible);
  }

  const handleOptionSelect = (option: string) => {
    setSelectedMenuOption(option);
    setMenuIsOpen(false);
  };

  const toggleDueDate = () => {
    setDuedDateIsOpen(!dueDateIsOpen);
  }

  const handleDueDateSelect = (option: string) => {
    setSelectedDueDateOption(option);
    setDuedDateIsOpen(false);
  }

  const toggleSetting = () => {
    setSettingVisible(!settingVisible);
  };

  const handleHover = (imageName: string) => {
    setHoverState(imageName);
  };

  const showAllAttachments = (mail: any) => {
    setVisibleAttachments(mail.attachments.length);
  };

  // 메일 세부내용 열기
  const toggleMailContent = (mailId: number) => {
    setIsDownFilevisible(false);
    const newVisibility = Object.fromEntries(
      Object.keys(mailContentVisibility).map((key) => [key, false])
    );

    setMailContentVisibility((prevVisibility) => ({
      ...newVisibility,
      [mailId]: !prevVisibility[mailId],
    }));

    setClickedMails((prevClickedMails) => ({
      ...prevClickedMails,
      [mailId]: true,
    }));
  };

  // 중요 메일
  const handleMailStarring = (mailId: number, star: string) => {
    const formData = {
      Id: mailId,
      star: star,
    }
    
    StarringEmail(formData)
    .then((response) => {
      console.log('중요 메일 등록 성공', response);
      refetchEmail();
    })
    .catch((error) => {
      console.log('중요 메일 등록 실패', error);
    })
  };

  const toggleAllCheckboxes = () => {
    if (allSelected) {
      setSelectedMails({});
    } else {
      const newSelectedMails = filteredMails.reduce((acc, mail) => {
        acc[mail.id] = true;
        return acc;
      }, {});
      setSelectedMails(newSelectedMails);
    }
    setAllSelected(!allSelected);
  };


  // 메일 발송 취소
  const handleSendCancle = () => {
    window.alert("발송을 취소하면 수신자의 메일함에서 메일이 삭제됩니다.\n발송을 취소하시겠습니까?")
  }

  const toggleMailSelection = (mailId: number, messageId: any) => {
    setSelectedMails(prevSelectedMails => ({
      ...prevSelectedMails,
      [mailId]: {
        messageId,
        selected: !prevSelectedMails[mailId]?.selected
      }
    }));
  };
  

  function formatDate(dateString: string) {
    if (!dateString) return '';
  
    const date = new Date(dateString);
  
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}.${month}.${day} ${hour}:${minute}`;
  };
  
  // 메일 삭제
  const handleDeleteEmail = (mailId: any, messageId: any) => {
    DeleteEmail(mailId, messageId)
    .then(response => {
      console.log('이메일 삭제 성공', response);
      refetchEmail();
    })
    .catch(error => {
      console.log('이메일 삭제 실패', error);
    })
  };

  // 체크박스 메일 삭제
  const handleDeleteCheckboxEmail = (selectedMails: any) => {
    Object.keys(selectedMails).forEach(mailId => {
      if (selectedMails[mailId]?.selected) {
        const { messageId } = selectedMails[mailId];
        DeleteEmail(mailId, messageId)
          .then(response => {
            console.log('선택된 이메일 삭제 성공', response);
            setDeleteModalOpen(false);
            setSelectedMails({});
            refetchEmail();
          })
          .catch(error => {
            console.log('선택된 이메일 삭제 실패', error);
          });
      }
    });
  };
  
  console.log('불러온메일', mails)
  return (
    <div className="content">
      <div className="mail_container">
        <div className="mail_header">
          <div className="mail_header_left">
            <label className="custom-checkbox">
              <input type="checkbox" id="check1" checked={allSelected} onChange={toggleAllCheckboxes} />
              <span></span>
            </label>
            <div className="image-container" onMouseEnter={() => handleHover("delete")} onMouseLeave={() => handleHover("")} onClick={() => setDeleteModalOpen(true)}>
              <img src={mail_delete} alt="mail_delete" />
              {hoverState === "delete" && <div className="tooltip">메일 삭제</div>}
            </div>
            <div className="image-container" onMouseEnter={() => handleHover("spam")} onMouseLeave={() => handleHover("")} onClick={() => setSpamModalOpen(true)}>
              <img src={mail_spam} alt="mail_spam" />
              {hoverState === "spam" && <div className="tooltip">스팸 차단</div>}
            </div>
            <div className="image-container" onMouseEnter={() => handleHover("write")} onMouseLeave={() => handleHover("")} onClick={() => { navigate("/writeMail") }}>
              <img src={mail_write} alt="mail_write" />
              {hoverState === "write" && <div className="tooltip">메일 작성</div>}
            </div>
          </div>

          <div className="mail_header_right">
            <div className={`setting_box ${settingVisible ? 'visible' : ''}`} onClick={toggleSetting}>
              {settingVisible ? (
                <>
                  <img src={mail_setting} alt="mail_setting" />
                  <img src={White_Arrow} alt="White_Arrow" className="Arrow_right" />
                </>
              ) : (
                <>
                  <img src={White_Arrow} alt="White_Arrow" className="Arrow_left" />
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className={`card_button`} onClick={() => setIsSpamSettingModal(true)}>스팸 설정</button>
              <button className={`card_button`} onClick={() => setIsMobileCardModal(true)}>모바일 명함</button>
              <div className="select_duedate_box">
                <div className="selected_option" onClick={toggleDueDate}>
                  <span>기간 : {selectdDueDateOption}</span>
                  <img src={White_Arrow} alt="White_Arrow" />
                </div>
                {dueDateIsOpen && (
                  <ul className="dropdown_menu">
                    {dueDateOptions.map((option: any) => (
                      <li key={option} onClick={() => handleDueDateSelect(option)}>
                        {option}
                      </li>
                    ))}
                    <li onClick={(e) => e.stopPropagation()}>
                      <div className="due_Date" onClick={(e) => e.stopPropagation()}>
                        <img src={mail_calendar} alt="mail_calendar" />
                        <DatePicker
                          selected={startDate}
                          onChange={(date: Date) => handleDateChange(date, true)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          placeholderText={new Date().toLocaleDateString('ko-KR')}
                          dateFormat="yyyy-MM-dd"
                          className="datepicker"
                          popperPlacement="top"
                        />
                        <span>~</span>
                        <img src={mail_calendar} alt="mail_calendar" />
                        <DatePicker
                          selected={endDate}
                          onChange={(date: Date) => handleDateChange(date, false)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                          placeholderText={new Date().toLocaleDateString('ko-KR')}
                          dateFormat="yyyy-MM-dd"
                          className="datepicker"
                          popperPlacement="top"
                        />
                      </div>
                    </li>
                  </ul>
                )}
              </div>
            </div>
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

        <div className="mail_content">
          <table className="mail_board_list">
            <colgroup>
              <col width="3%" />
              <col width="15%" />
              <col width="62.5%" />
              <col width="5%" />
              <col width="4.5%" />
              <col width="8%" />
            </colgroup>
            <thead>
              <tr className="board_header">
                <th></th>
                <th>보낸 사람</th>
                <th>제목</th>
                <th></th>
                <th></th>
                <th>날짜</th>
              </tr>
            </thead>
            <tbody className="board_container">
              {filteredMails
                ?.slice((page - 1) * postPerPage, page * postPerPage)
                .map((mail) => (
                  <>
                    <tr key={mail.Id} className="board_content">
                      <td>
                        <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={allSelected ? allSelected : selectedMails[mail.Id]?.selected || false}
                          onChange={() => toggleMailSelection(mail.Id, mail.messageId)}
                        />
                        <span></span>
                        </label>
                      </td>
                      <td>
                        {mail.sender?.match(/"([^"]+)"/) // 따옴표 안에 있는 부분이 있는지 확인
                          ? mail.sender.match(/"([^"]+)"/)[1] // 있으면 그 부분을 표시
                          : mail.sender.match(/<([^>]+)>/) // 없으면 이메일 주소만 추출
                          ? mail.sender.match(/<([^>]+)>/)[1] // 이메일 주소만 표시
                          : mail.sender // 그냥 메일 주소만 있는 경우 그대로 표시
                        }
                      </td>
                      <td>
                        <div>
                          <div onClick={() => handleMailStarring(mail.Id, mail.star)}>
                            <img src={mail.star ? mail_important_active : mail_important} alt="mail_important" />
                          </div>
                          {mail.hasAttachments ? <img src={mail_attachment} alt="attachment" /> : <div className="Blank"></div>}
                        </div>
                        <span>[{mail.folder === 'inbox' ? '받은 메일함' : mail.folder === 'sent' ? '보낸 메일함' : mail.folder === 'starred' ? '중요 메일함' : mail.folder === 'unread' ? '안 읽은 메일' : mail.folder === 'drafts' ? '임시 보관함' : mail.folder === 'junk' ? '스팸 메일함' : ''}]</span>
                        {mail.folder === 'drafts' ? 
                          <div onClick={() => navigate('/writeMail', { state: { mail, status: 'DRAFTS' }})}>
                            {mail?.subject}--{mail?.Id}
                          </div>
                        :
                          <div className={`${clickedMails[mail.Id] ? "" : "clicked"}`} onClick={() => toggleMailContent(mail.Id)}>
                            {mail?.subject}--{mail?.Id}
                            <img src={mail_triangle} alt="mail_triangle" />
                          </div>
                        }
                      </td>
                      <td>{mail.folder === 'inbox' ? null : mail.folder === 'sent' ? <div onClick={() => setIsReadMailListOpen(true)}>1/3 읽음</div> : null}</td>
                      <td>
                        {mail.folder === 'inbox' ? null : mail.folder === 'sent' ? <div className="sent_cancle_active" onClick={() => setIsSentCancleOpen(true)}>발송 취소</div> : mail.folder === 'reserved' ? <div onClick={() => setIsReserveCancleOpen(true)}>예약 취소</div> : null}
                      </td>
                      <td>
                        {formatDate(mail.folder === 'inbox' ? mail.receiveAt : mail.sendAt)}
                      </td>
                    </tr>

                    <tr className={`mail_detail_overlay ${mailContentVisibility[mail.Id] ? 'visible' : ''}`}>
                      <td colSpan={6}>
                        <div className={`mail_detail_wrapper ${mailContentVisibility[mail.Id] ? 'visible' : ''}`}>
                          <div className="mail_detail_header">
                            <span>
                              {mail.reservation && <span className="mail_reservation">예약</span>}
                              <span>{mail?.subject}</span>
                            </span>
                            {mail.folder === 'inbox' && (
                              <span className="button_wrap">
                                <div className="image-container" onMouseEnter={() => handleHover("spam")} onMouseLeave={() => handleHover("")} onClick={handleSendCancle}>
                                  <img src={mail_spam} alt="mail_spam" />
                                  {hoverState === "spam" && <div className="tooltip">스팸 차단</div>}
                                </div>
                                <div className="image-container" onMouseEnter={() => handleHover("delete")} onMouseLeave={() => handleHover("")} onClick={() => handleDeleteEmail(mail.Id, mail.messageId)}>
                                  <img src={mail_delete} alt="mail_delete" />
                                  {hoverState === "delete" && <div className="tooltip">메일 삭제</div>}
                                </div>
                              </span>
                            )}
                          </div>
                          <div className="mail_detail_content">
                            <div className="mail_detail_content_top">
                              <div>
                                <div>
                                  <div>
                                    {mail.sender?.match(/"([^"]+)"/) // 따옴표 안에 있는 부분이 있는지 확인
                                    ? mail.sender.match(/"([^"]+)"/)[1] // 있으면 그 부분을 표시
                                    : mail.sender.match(/<([^>]+)>/) // 없으면 이메일 주소만 추출
                                    ? mail.sender.match(/<([^>]+)>/)[1] // 이메일 주소만 표시
                                    : mail.sender // 그냥 메일 주소만 있는 경우 그대로 표시
                                    }
                                  </div>
                                  <span>{formatDate(mail.folder === 'inbox' ? mail.receiveAt : mail.sendAt)}</span>
                                </div>
                                {mail.hasAttachments > 0 ? 
                                  <div className="DownFile">
                                    {isDownFileVisible ?
                                      <img src={Down_Arrow} className="rotate_Arrow" alt="Down_Arrow" onClick={toggleDownFile} />
                                      :
                                      <img src={Down_Arrow} alt="Down_Arrow" onClick={toggleDownFile} />
                                    }
                                    <span>첨부파일</span><span className="DownFile_count">{mail.attachments?.length}</span>
                                    <img src={mail_download} alt="mail_download" />

                                    {isDownFileVisible && (
                                      <div className="DownFile_list">
                                        <div className="DownFile_list_content">
                                          {mail.attachments?.slice(0, visibleAttachments).map((file: any, index: number) => (
                                            <div key={index} className="DownFile_list_object">
                                              <div className="DownFile_list_object_filename">{file.fileName}</div>
                                              <div className="DownFile_list_object_btn">
                                                <div>3KB</div>
                                                <img src={mail_preview} alt="mail_preview" />
                                                <img src={mail_attachment_hwp} alt="mail_attachment_hwp" />
                                                <img src={mail_download} alt="mail_download" />
                                                <img src={mail_attachment_del} alt="mail_attachment_del" />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                        {mail.attachments.length > 3 && visibleAttachments === 3 && (
                                          <div className="DownFile_list_more" onClick={() => showAllAttachments(mail)}>
                                            + 더 보기
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  :
                                  <></>
                                }
                              </div>
                              <div>
                                <div>받는 사람 :</div>
                                <div>{Array.isArray(mail.receiver) ? mail.receiver?.join(', ') : [mail.receiver?.replace(/[\[\]"]+/g, '')]}</div>
                                <div
                                  className="recipient_hover"
                                  onMouseEnter={() => setIsRecipientHover(true)}
                                  onMouseLeave={() => setIsRecipientHover(false)}
                                >
                                  {mail.recipient?.length - 5 > 0 && `외 ${mail.recipient?.length - 5}명`}
                                </div>
                                {
                                  isRecipientHover && (
                                    <div
                                      className="recipient_list"
                                    >
                                    {mail.recipient?.join(', ')}
                                  </div>
                                  )
                                }
                              </div>
                            </div>

                            <div className="mail_detail_content_middle">
                              <div dangerouslySetInnerHTML={renderMailContent(mail)}>
                              </div>
                            </div>

                            {mail.folder === 'inbox' ? (
                              <div className="mail_detail_content_bottom">
                                <button className="white_button" onClick={() => navigate('/writeMail', { state: { mail, status: 'FW' }})}>전달</button>
                                <button className="primary_button" onClick={() => navigate('/writeMail', { state: { mail, status: 'RE' }})}>답장</button>
                              </div>
                            ) : (
                              <div className="mail_detail_content_bottom">
                                <button className="white_button" onClick={() => navigate('/writeMail', { state: { mail, status: 'FW' }})}>전달</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        header={"알림"}
        footer1={"삭제"}
        footer1Class="red-btn"
        onFooter1Click={() => {handleDeleteCheckboxEmail(selectedMails)}}
        footer2={"취소"}
        footer2Class="gray-btn"
        onFooter2Click={() => setDeleteModalOpen(false)}
      >
        <div>삭제하시겠습니까?</div>
      </CustomModal>

      <CustomModal
        isOpen={isSpamModalOpen}
        onClose={() => setSpamModalOpen(false)}
        header={"알림"}
        footer1={"예"}
        onFooter1Click={() => setSpamModalOpen(false)}
        footer1Class="green-btn"
        footer2={"아니오"}
        footer2Class="red-btn"
        onFooter2Click={() => setSpamModalOpen(false)}
      >
        <div>선택한 메일이 스팸 메일함으로 이동하였습니다.</div>
        <div>수신 차단 하시겠습니까?</div>
      </CustomModal>
      
      <CustomModal
        isOpen={isReadMailListModalOpen}
        onClose={() => setIsReadMailListOpen(false)}
        header={"수신 확인"}
        height="240px"
      >
        <div className="body-container">
          <div className="mail_read_list_header">
            <div>수신인</div>
            <div>열람 상태</div>
          </div>
          <div className="mail_read_list_content">
            <div className="mail_read_list_user">
              <div className="mail_read_list_user_name">개발1팀 구민석</div>
              <div className="mail_read_list_user_status">읽지 않음</div>
            </div>
            <div className="mail_read_list_user">
              <div className="mail_read_list_user_name">개발1팀 구민석</div>
              <div className="mail_read_list_user_status">읽지 않음</div>
            </div>
            <div className="mail_read_list_user">
              <div className="mail_read_list_user_name">개발1팀 구민석</div>
              <div className="mail_read_list_user_status">읽지 않음</div>
            </div>
            <div className="mail_read_list_user">
              <div className="mail_read_list_user_name">개발1팀 구민석</div>
              <div className="mail_read_list_user_status">읽지 않음</div>
            </div>
            <div className="mail_read_list_user">
              <div className="mail_read_list_user_name">개발1팀 구민석</div>
              <div className="mail_read_list_user_status">읽지 않음</div>
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isSentCancleModalOpen}
        onClose={() => setIsSentCancleOpen(false)}
        header={"알림"}
        footer1={"확인"}
        onFooter1Click={() => setIsSentCancleOpen(false)}
        footer1Class="back-green-btn"
        footer2={"취소"}
        footer2Class="gray-btn"
        onFooter2Click={() => setIsSentCancleOpen(false)}
        height="220px"
      >
        <div>발송을 취소하면</div>
        <div>수신자의 메일함에서 메일이 삭제됩니다.</div>
        <div>발송을 취소하시겠습니까?</div>
      </CustomModal>

      <CustomModal
        isOpen={isReserveCancleModalOpen}
        onClose={() => setIsReserveCancleOpen(false)}
        header={"알림"}
        footer1={"확인"}
        onFooter1Click={() => setIsReserveCancleOpen(false)}
        footer1Class="back-green-btn"
        footer2={"취소"}
        footer2Class="gray-btn"
        onFooter2Click={() => setIsReserveCancleOpen(false)}
      >
        <div>
          본 메일의 예약 발송을 취소하시겠습니까?
        </div>
      </CustomModal>

      <Pagenation
        setPage={setPage}
        filteredMails={filteredMails}
        itemsPerPage={itemsPerPage}
        page={page}
        totalPages={totalPages}
      />

      <BlockMail
        isSpamSettingModal={isSpamSettingModal}
        setIsSpamSettingModal={setIsSpamSettingModal}
      />

      <MobileCard
        isMobileCardModal={isMobileCardModal}
        setIsMobileCardModal={setIsMobileCardModal}
      />
    </div>
  );
};

export default Mail;
