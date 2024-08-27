import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  mail_delete,
  mail_download,
  mail_important,
  mail_important_active,
  mail_setting,
  mail_spam,
  mail_write,
  mail_attachment,
  mail_triangle,
  mail_cancle,
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
import { CheckEmail } from "../../services/email/EmailService";

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
  const [selectedMails, setSelectedMails] = useState<{ [key: number]: boolean }>({});

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
        setMails(originalMails.filter((mail) => mail.folder !== 'junk'));
        break;
      case "중요 메일":
        setMails(originalMails.filter((mail) => mail.folder === 'starred'));
        break;
      case "받은 메일함":
        setMails(originalMails.filter((mail) => mail.folder === 'inbox'));
        break;
      case "보낸 메일함":
        setMails(originalMails.filter((mail) => mail.folder === 'sent'));
        break;
      case "안 읽은 메일":
        setMails(originalMails.filter((mail) => mail.folder === 'unread'));
        break;
      case "임시 보관함":
        setMails(originalMails.filter((mail) => mail.folder === 'drafts'));
        break;
      case "스팸 메일함":
        setMails(originalMails.filter((mail) => mail.folder === 'junk'));
        break;
      default:
        setMails(originalMails);
    }
  }, [selectdMenuOption, originalMails]);

  const filteredMails = mails.filter((mail) =>
    mail.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderMailContent = (mail: any) => {
    return { __html: mail.body };
  };

  const totalPages = Math.ceil(filteredMails.length / postPerPage);

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
  const handleMailFixed = (mailId: number) => {
    setMails((prevMails) =>
      prevMails.map((mail) =>
        mail.id === mailId ? { ...mail, important: !mail.important } : mail
      )
    );
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

  const toggleMailSelection = (mailId: number) => {
    setSelectedMails((prevSelectedMails) => ({
      ...prevSelectedMails,
      [mailId]: !prevSelectedMails[mailId],
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
  }
  

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
                .slice((page - 1) * postPerPage, page * postPerPage)
                .map((mail) => (
                  <>
                    <tr key={mail.Id} className="board_content">
                      <td>
                        <label className="custom-checkbox">
                          <input
                            type="checkbox"
                            checked={allSelected ? allSelected : selectedMails[mail.Id] || false}
                            onChange={() => toggleMailSelection(mail.Id)}
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
                          <div onClick={() => handleMailFixed(mail.Id)}>
                            <img src={mail.important ? mail_important_active : mail_important} alt="mail_important" />
                          </div>
                          {mail.attachment?.length > 0 ? <img src={mail_attachment} alt="attachment" /> : <div className="Blank"></div>}
                        </div>
                        <span>[{mail.folder === 'inbox' ? '받은 메일함' : mail.folder === 'sent' ? '보낸 메일함' : mail.folder === 'starred' ? '중요 메일함' : mail.folder === 'unread' ? '안 읽은 메일' : mail.folder === 'drafts' ? '임시 보관함' : mail.folder === 'junk' ? '스팸 메일함' : ''}]</span>
                        {mail.folder === 'drafts' ? 
                          <div onClick={() => navigate('/writeMail', { state: { mail }})}>
                            {mail?.subject}--{mail?.Id}
                          </div>
                        :
                          <div className={`${clickedMails[mail.Id] ? "" : "clicked"}`} onClick={() => toggleMailContent(mail.Id)}>
                            {mail?.subject}--{mail?.Id}
                            <img src={mail_triangle} alt="mail_triangle" />
                          </div>
                        }
                      </td>
                      <td>{mail.folder === 'inbox' ? null : mail.folder === 'sent' ? <div>1/3 읽음</div> : null}</td>
                      <td>
                        {mail.folder === 'inbox' ? null : mail.folder === 'sent' ? <div>발송 취소</div> : mail.folder === 'reserved' ? <div>예약 취소</div> : null}
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
                                <div className="image-container" onMouseEnter={() => handleHover("delete")} onMouseLeave={() => handleHover("")} onClick={handleSendCancle}>
                                  <img src={mail_delete} alt="mail_delete" />
                                  {hoverState === "delete" && <div className="tooltip">메일 삭제</div>}
                                </div>
                              </span>
                            )}
                            {mail.folder === 'sent' && (
                              <span className="button_wrap">
                                <div className="image-container" onMouseEnter={() => handleHover("cancle")} onMouseLeave={() => handleHover("")} onClick={handleSendCancle}>
                                  <img src={mail_cancle} alt="mail_cancle" />
                                  {hoverState === "cancle" && <div className="tooltip">발송취소</div>}
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
                                {mail.attachment?.length > 0 ? 
                                  <div className="DownFile" onClick={toggleDownFile}>
                                    {isDownFileVisible ?
                                      <img src={Down_Arrow} className="rotate_Arrow" alt="Down_Arrow" />
                                      :
                                      <img src={Down_Arrow} alt="Down_Arrow" />
                                    }
                                    <span>{`첨부파일 ${mail.attachment.length}`}</span>
                                    <img src={mail_download} alt="mail_download" />

                                    {isDownFileVisible && (
                                      <div className="DownFile_list">
                                        {mail.attachment?.map((file: string, index: number) => (
                                          <div key={index}>{file}</div>
                                        ))}
                                      </div>  
                                    )}
                                  </div>
                                  :
                                  <></>
                                }
                              </div>
                              <div>
                                <div>받는 사람 :</div>
                                <div>{mail.receiver}</div>
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
                                <button className="white_button" onClick={() => navigate('/writeMail')}>전달</button>
                                <button className="primary_button" onClick={() => navigate('/writeMail')}>답장</button>
                              </div>
                            ) : (
                              <div className="mail_detail_content_bottom">
                                <button className="white_button" onClick={() => navigate('/writeMail')}>전달</button>
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
        <div className="body-container">
          선택한 메일이 스팸 메일함으로 이동하였습니다.<br/>
          수신 차단 하시겠습니까?
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
