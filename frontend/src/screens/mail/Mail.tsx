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

const Mail = () => {
  let navigate = useNavigate();
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

  useEffect(() => {
    const initialMails = [
      { id: 1, title: "2024년 5월 급여명세서 보내드립니다.", content: "메일입니다.1", sender: "개발1팀 구민석", recipient: ['개발부 진유빈', '개발부 진유빈', '개발부 진유빈', '개발부 진유빈', '개발부 진유빈', '개발부 진유빈'], attachment: ["업무설정1.pdf","업무설정2.pdf","업무설정3.pdf"], mailType: "받은 메일함", reservation: true, important: true, spam: false, date: "24.12.30 15:20" },
      { id: 2, title: "홈페이지 조직도 관련 안내", content: "메일입니다.2", sender: "개발부 진유빈", recipient: ['개발부 진유빈', '개발1팀 구민석', '개발부 진유빈', '개발1팀 구민석', '개발부 진유빈', '개발1팀 구민석', '개발부 진유빈', '개발1팀 구민석'], attachment: ["업무설정2.pdf"], mailType: "받은 메일함", reservation: true, important: true, spam: false, date: "24.12.30 15:20" },
      { id: 3, title: "개발 1팀 업무 설정 보고", content: "메일입니다.3", sender: "개발부 진유빈", recipient: ["개발부 진유빈"], attachment: [], mailType: "받은 메일함", reservation: false, important: false, spam: false, date: "24.12.30 15:20" },
      { id: 4, title: "개발 1팀 업무 설정 보고", content: "메일입니다.4", sender: "개발부 진유빈", recipient: ["개발부 진유빈"], attachment: ["업무설정4.pdf"], mailType: "받은 메일함", reservation: false, important: true, spam: false, date: "24.12.30 15:20" },
      { id: 5, title: "개발 1팀 업무 설정 보고", content: "메일입니다.5", sender: "개발부 진유빈", recipient: ["개발부 진유빈"], attachment: ["업무설정5.pdf"], mailType: "받은 메일함", reservation: false, important: true, spam: false, date: "24.12.30 15:20" },
      { id: 6, title: "개발 1팀 업무 설정 보고", content: "메일입니다.6", sender: "개발부 진유빈", recipient: ["개발부 진유빈"], attachment: ["업무설정6.pdf"], mailType: "받은 메일함", reservation: false, important: false, spam: false, date: "24.12.30 15:20" },
      { id: 7, title: "개발 1팀 업무 설정 보고", content: "메일입니다.7", sender: "개발부 진유빈", recipient: ["개발부 진유빈"], attachment: ["업무설정7.pdf"], mailType: "받은 메일함", reservation: false, important: true, spam: false, date: "24.12.30 15:20" },
      { id: 8, title: "개발 1팀 업무 설정 보고", content: "메일입니다.8", sender: "개발부 진유빈", recipient: ["개발부 진유빈"], attachment: ["업무설정8.pdf"], mailType: "받은 메일함", reservation: false, important: false, spam: false, date: "24.12.30 15:20" },
      { id: 9, title: "2024년 5월 급여명세서 보내드립니다.", content: "메일입니다.9", sender: "개발1팀 구민석", recipient: ["개발부 진유빈"], attachment: ["업무설정9.pdf"], mailType: "보낸 메일함", reservation: false, important: true, spam: false, date: "24.12.30 15:20" },
      { id: 10, title: "2024년 5월 급여명세서 보내드립니다.", content: "메일입니다.10", sender: "개발1팀 구민석", recipient: ["개발부 진유빈"], attachment: ["업무설정10.pdf"], mailType: "보낸 메일함", reservation: false, important: false, spam: false, date: "24.12.30 15:20" },
      { id: 11, title: "2024년 5월 급여명세서 보내드립니다.", content: "메일입니다.11", sender: "개발1팀 구민석", recipient: ["개발부 진유빈"], attachment: ["업무설정11.pdf"], mailType: "보낸 메일함", reservation: false, important: true, spam: false, date: "24.12.30 15:20" },
      { id: 12, title: "2024년 5월 급여명세서 보내드립니다.", content: "메일입니다.12", sender: "개발1팀 구민석", recipient: ["개발부 진유빈"], attachment: [], mailType: "보낸 메일함", reservation: false, important: true, spam: false, date: "24.12.30 15:20" },
      { id: 13, title: "스팸 메일입니다", content: "스팸메일입니다.13", sender: "개발1팀 구민석", recipient: ["개발1팀 구민석"], attachment: "", mailType: ["받은 메일함"], reservation: false, important: true, spam: true, date: "24.12.30 15:20" },
      { id: 14, title: "2024년 5월 급여명세서 보내드립니다.", content: "메일입니다.12", sender: "개발1팀 구민석", recipient: ["개발부 진유빈"], attachment: [], mailType: "보낸 메일함", reservation: false, important: true, spam: false, date: "24.12.30 15:20" },
      { id: 15, title: "2024년 5월 급여명세서 보내드립니다.", content: "메일입니다.12", sender: "개발1팀 구민석", recipient: ["개발부 진유빈"], attachment: [], mailType: "보낸 메일함", reservation: false, important: true, spam: false, date: "24.12.30 15:20" },
      { id: 16, title: "2024년 5월 급여명세서 보내드립니다.", content: "메일입니다.12", sender: "개발1팀 구민석", recipient: ["개발부 진유빈"], attachment: [], mailType: "보낸 메일함", reservation: false, important: true, spam: false, date: "24.12.30 15:20" },
      { id: 17, title: "2024년 5월 급여명세서 보내드립니다.", content: "메일입니다.12", sender: "개발1팀 구민석", recipient: ["개발부 진유빈"], attachment: [], mailType: "보낸 메일함", reservation: false, important: true, spam: false, date: "24.12.30 15:20" },
      { id: 18, title: "2024년 5월 급여명세서 보내드립니다.", content: "메일입니다.12", sender: "개발1팀 구민석", recipient: ["개발부 진유빈"], attachment: [], mailType: "보낸 메일함", reservation: false, important: true, spam: false, date: "24.12.30 15:20" },
      { id: 19, title: "2024년 5월 급여명세서 보내드립니다.", content: "메일입니다.12", sender: "개발1팀 구민석", recipient: ["개발부 진유빈"], attachment: [], mailType: "보낸 메일함", reservation: false, important: true, spam: false, date: "24.12.30 15:20" },
      { id: 20, title: "2024년 5월 급여명세서 보내드립니다.", content: "메일입니다.12", sender: "개발1팀 구민석", recipient: ["개발부 진유빈"], attachment: [], mailType: "보낸 메일함", reservation: false, important: true, spam: false, date: "24.12.30 15:20" },
    ];
    switch (selectdMenuOption) {
      case "전체 메일":
        return (
          setMails(initialMails.filter((mail) => (mail.spam === false)))
        )
      case "중요 메일":
        return (
          setMails(initialMails.filter((mail) => (mail.important === true && mail.spam === false)))
        )
      case "받은 메일함":
        return (
          setMails(initialMails.filter((mail) => (mail.mailType === '받은 메일함' && mail.spam === false)))
        )
      case "보낸 메일함":
        return (
          setMails(initialMails.filter((mail) => (mail.mailType === '보낸 메일함' && mail.spam === false)))
        )
      case "안 읽은 메일":
        return (
          // 안 읽은 메일 처리 (Clicked 타입 boolean 으로 설정)
          setMails(initialMails)
        )
      case "임시 보관함":
        return (
          // 임시 보관메일 처리
          setMails(initialMails)
        )
      case "스팸 메일함":
        return (
          setMails(initialMails.filter((mail) => mail.spam === true))
        )
    }
  }, [selectdMenuOption]);

  const filteredMails = mails.filter((mail) =>
    mail.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderMailContent = (mail: any) => {
    return { __html: mail.content };
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
                    <tr key={mail.id} className="board_content">
                      <td>
                        <label className="custom-checkbox">
                          <input
                            type="checkbox"
                            checked={allSelected ? allSelected : selectedMails[mail.id] || false}
                            onChange={() => toggleMailSelection(mail.id)}
                          />
                          <span></span>
                        </label>
                      </td>
                      <td>{mail.sender}</td>
                      <td>
                        <div>
                          <div onClick={() => handleMailFixed(mail.id)}>
                            <img src={mail.important ? mail_important_active : mail_important} alt="mail_important" />
                          </div>
                          {mail.attachment.length > 0 ? <img src={mail_attachment} alt="attachment" /> : <div className="Blank"></div>}
                        </div>
                        <span>[{mail.mailType}]</span>
                        <div className={`${clickedMails[mail.id] ? "" : "clicked"}`} onClick={() => toggleMailContent(mail.id)}>
                          {mail.title}
                          <img src={mail_triangle} alt="mail_triangle" />
                        </div>
                      </td>
                      <td>1/3 읽음</td>
                      <td><div>발송 취소</div></td>
                      <td>{mail.date}</td>
                    </tr>

                    <tr className={`mail_detail_overlay ${mailContentVisibility[mail.id] ? 'visible' : ''}`}>
                      <td colSpan={6}>
                        <div className={`mail_detail_wrapper ${mailContentVisibility[mail.id] ? 'visible' : ''}`}>
                          <div className="mail_detail_header">
                            <span>
                              {mail.reservation && <span className="mail_reservation">예약</span>}
                              <span>{mail.title}</span>
                            </span>
                            {mail.mailType === '받은 메일함' && (
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
                            {mail.mailType === '보낸 메일함' && (
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
                                  <div>{mail.sender}</div>
                                  <span>{mail.date}</span>
                                </div>
                                {mail.attachment.length > 0 ? 
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
                                <div>{(mail.recipient?.slice(0, 5)).join(', ')}</div>
                                <div
                                  className="recipient_hover"
                                  onMouseEnter={() => setIsRecipientHover(true)}
                                  onMouseLeave={() => setIsRecipientHover(false)}
                                >
                                  {mail.recipient.length - 5 > 0 && `외 ${mail.recipient.length - 5}명`}
                                </div>
                                {
                                  isRecipientHover && (
                                    <div
                                      className="recipient_list"
                                    >
                                    {mail.recipient.join(', ')}
                                  </div>
                                  )
                                }
                              </div>
                            </div>

                            <div className="mail_detail_content_middle">
                              <div dangerouslySetInnerHTML={renderMailContent(mail)}>
                              </div>
                            </div>

                            {mail.mailType === '받은 메일함' ? (
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
