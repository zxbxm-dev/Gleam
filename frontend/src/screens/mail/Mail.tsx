import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  mail_delete,
  mail_download,
  mail_preview,
  mail_attachment_del,
  mail_attachment_hwp,
  mail_attachment_word,
  mail_attachment_xlsx,
  mail_attachment_pdf,
  mail_attachment_ppt,
  mail_attachment_txt,
  mail_attachment_jpg,
  mail_attachment_png,
  mail_attachment_gif,
  mail_attachment_svg,
  mail_attachment_zip,
  mail_attachment_mp3,
  mail_attachment_mp4,
  mail_attachment_avi,
  mail_important,
  mail_important_active,
  mail_setting,
  mail_spam,
  mail_spam_disable,
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
import { CheckEmail, DeleteEmail, ReadEmail, cancleQueueEmail, StarringEmail, JunkEmail } from "../../services/email/EmailService";
import { AddJunkList, RemoveJunkList } from "../../services/email/EmailService";

const Mail = () => {
  let navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [page, setPage] = useState<number>(1);
  const [postPerPage, setPostPerPage] = useState<number>(11);
  const [settingVisible, setSettingVisible] = useState(true);
  const [hoverState, setHoverState] = useState<string>("");
  const [isRecipientHover, setIsRecipientHover] = useState(false);
  const [isDownFileVisible, setIsDownFilevisible] = useState(false);

  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSpamModalOpen, setSpamModalOpen] = useState(false);
  const [isUnSpamModalOpen, setUnSpamModalOpen] = useState(false);
  const [isSpamListChecked, setIsSpamListChecked] = useState(false);
  const [isReadMailListModalOpen, setIsReadMailListOpen] = useState(false);
  const [isSentCancleModalOpen, setIsSentCancleOpen] = useState(false);
  const [isReserveCancleModalOpen, setIsReserveCancleOpen] = useState(false);
  const [isMobileCardModal, setIsMobileCardModal] = useState(false);
  const [isSpamSettingModal, setIsSpamSettingModal] = useState(false);

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [selectdMenuOption, setSelectedMenuOption] = useState('전체 메일');
  const [dueDateIsOpen, setDuedDateIsOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("보낸 사람");
  const [selectdDueDateOption, setSelectedDueDateOption] = useState('전체');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [mailContentVisibility, setMailContentVisibility] = useState<{ [key: number]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [originalMails, setOriginalMails] = useState<any[]>([]);
  const [mails, setMails] = useState<any[]>([]);
  const [clickedMails, setClickedMails] = useState<{ [key: number]: boolean }>({});
  const [allSelected, setAllSelected] = useState(false);
  const [selectedMails, setSelectedMails] = useState<{ [key: number]: { messageId: any; selected: boolean; sender: any; } }>({});

  const [isInactiveSendMail, setIsInActiveSendMail] = useState<Record<number, boolean>>({});
  const [visibleAttachments, setVisibleAttachments] = useState(3);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const getIconForMimeType = (mimetype: string) => {
    switch (mimetype) {
      case "text/plain":
        return mail_attachment_txt;
      case "image/jpeg":
      case "image/jpg":
        return mail_attachment_jpg;
      case "image/png":
        return mail_attachment_png;
      case "image/gif":
        return mail_attachment_gif;
      case "image/svg+xml":
        return mail_attachment_svg;
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return mail_attachment_xlsx;
      case "application/pdf":
        return mail_attachment_pdf;
      case "application/vnd.ms-powerpoint":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return mail_attachment_ppt;
      case "application/msword":
      case "application/haansoftdocx":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return mail_attachment_word;
      case "application/haansoftpptx":
        return mail_attachment_ppt;
      case "application/haansofthwp":
        return mail_attachment_hwp;
      case "application/zip":
        return mail_attachment_zip;
      case "audio/mpeg":
        return mail_attachment_mp3;
      case "video/mp4":
        return mail_attachment_mp4;
      case "video/x-msvideo":
      case "video/avi":
        return mail_attachment_avi;
      default:
        return;
    }
  };

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
        setHeaderTitle("보낸 사람");
        setPage(1);
        break;
      case "중요 메일":
        setMails(originalMails?.filter((mail) => mail.star === 'starred'));
        setHeaderTitle("보낸 사람");
        setPage(1);
        break;
      case "받은 메일함":
        setMails(originalMails?.filter((mail) => mail.folder === 'inbox'));
        setHeaderTitle("보낸 사람");
        setPage(1);
        break;
      case "보낸 메일함":
        setMails(originalMails?.filter((mail) => mail.folder === 'sent'));
        setHeaderTitle("받은 사람");
        setPage(1);
        break;
      case "안 읽은 메일":
        setMails(originalMails?.filter((mail) => mail.read === 'unread'));
        setHeaderTitle("보낸 사람");
        setPage(1);
        break;
      case "임시 보관함":
        setMails(originalMails?.filter((mail) => mail.folder === 'drafts'));
        setHeaderTitle("보낸 사람");
        setPage(1);
        break;
      case "스팸 메일함":
        setMails(originalMails?.filter((mail) => mail.folder === 'junk'));
        setHeaderTitle("보낸 사람");
        setPage(1);
        break;
      default:
        setMails(originalMails);
        setHeaderTitle("보낸 사람");
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
    if (isExpanded) {
      setVisibleAttachments(3);
    } else {
      setVisibleAttachments(mail.attachments.length);
    }
    setIsExpanded(!isExpanded);
  };

  const handleMouseEnter = (mailId: any) => {
    setIsInActiveSendMail((prev: any) => ({ ...prev, [mailId]: true }));
  };

  const handleMouseLeave = (mailId: any) => {
    setIsInActiveSendMail((prev: any) => ({ ...prev, [mailId]: false }));
  };

  const handlePreviewClick = (file: any) => {
    const blob = new Blob([new Uint8Array(file.fileData.data)], { type: file.mimetype });
    const url = URL.createObjectURL(blob);
  
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  
    const width = isMobile ? 650 : 700; // 모바일은 650x450, 데스크탑은 700x500
    const height = isMobile ? 450 : 500;
  
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
  
    const newWindow = window.open('', '', `width=${width},height=${height},top=${top},left=${left}`);
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <style>
              body { margin: 0; padding: 0; }
              iframe { width: 100%; height: 100%; border: none; }
            </style>
          </head>
          <body>
            <iframe src="${url}"></iframe>
          </body>
        </html>
      `);
    }
  };
  
  const handleMultipleDownload = async (attachments: any) => {
    for (const file of attachments) {
      if (file?.fileData && file?.mimetype) {
          const blob = new Blob([new Uint8Array(file.fileData.data)], { type: file.mimetype });
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.download = file.fileName;
          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          URL.revokeObjectURL(url);
      }
    }
  };



  const handleDownloadClick = (file: any) => {
    const blob = new Blob([new Uint8Array(file.fileData.data)], { type: file.mimetype });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = file.fileName; // 파일명 설정
    document.body.appendChild(link);
    link.click();
  
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  

  // 메일 세부내용 열기
  const toggleMailContent = (mailId: number) => {
    setIsDownFilevisible(false);
    setIsExpanded(false);
    setVisibleAttachments(3);
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
  
  // 메일 읽음 처리
  const handleReadEmail = (mailId: number) => {
    const formData = {
      Id: mailId,
    }

    ReadEmail(formData)
    .then((response) => {
      console.log('메일 읽음 처리 성공', response);
      refetchEmail();
    })
    .catch((error) => {
      console.log('메일 읽음 처리 실패', error);
    })
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

  const handleJunkEmail = (mailId: number) => {    
    JunkEmail(mailId)
    .then((response) => {
      console.log('스팸 메일 등록 성공', response);
      refetchEmail();
    })
    .catch((error) => {
      console.log('스팸 메일 등록 실패', error);
    })
  };

  const toggleAllCheckboxes = () => {
    if (allSelected) {
      setSelectedMails({});
    } else {
      const currentPageMails = filteredMails.slice((page - 1) * postPerPage, page * postPerPage);
      const newSelectedMails = currentPageMails.reduce((acc, mail) => {
        if (mail.Id) {
          acc[mail.Id] = {
            messageId: mail.messageId,
            selected: true,
            sender: mail.sender,
          };
        } else {
          console.error("Mail object is missing id:", mail);
        }
        return acc;
      }, {});
      setSelectedMails(newSelectedMails);
    }
    setAllSelected(!allSelected);
  };

  const toggleMailSelection = (mailId: number, messageId: any, sender: any) => {
    setSelectedMails(prevSelectedMails => ({
      ...prevSelectedMails,
      [mailId]: {
        messageId,
        selected: !prevSelectedMails[mailId]?.selected,
        sender,
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
        const { sender } = selectedMails[mailId];
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

  // 체크박스 스팸 처리
  const handleJunkCheckboxEmail = (selectedMails: any) => {
    Object.keys(selectedMails).forEach(async (mailId) => {
      if (selectedMails[mailId]?.selected) {
        const { sender } = selectedMails[mailId];
        
        try {
          // isSpamListChecked가 true일 때만 handleAddJunkList 호출
          if (isSpamListChecked) {
            await handleAddJunkList(sender);
            
          }
          
          // JunkEmail 호출
          const response = await JunkEmail(mailId);
          setSpamModalOpen(false);
          setIsSpamListChecked(false);
          setSelectedMails({});
          refetchEmail();
          console.log('선택된 이메일 스팸 성공', response);
        } catch (error) {
          console.log('선택된 이메일 스팸 실패', error);
        }
      }
    });
  };

  const handleDisalbeJunkCheckboxEmail = (selectedMails: any) => {
    Object.keys(selectedMails).forEach(async (mailId) => {
      if (selectedMails[mailId]?.selected) {
        const { sender } = selectedMails[mailId];
        
        try {
          // isSpamListChecked가 true일 때만 handleAddJunkList 호출
          if (isSpamListChecked) {
            await handleRemoveJunkList(sender);
          }
          
          // JunkEmail 호출
          const response = await JunkEmail(mailId);
          setUnSpamModalOpen(false);
          setIsSpamListChecked(false);
          setSelectedMails({});
          refetchEmail();
          console.log('선택된 이메일 스팸 성공', response);
        } catch (error) {
          console.log('선택된 이메일 스팸 실패', error);
        }
      }
    });
  };
  
  // 예약 메일 삭제
  const handleDeleteQueueEmail = (mailId: any) => {
    cancleQueueEmail(mailId)
    .then(response => {
      console.log('예약 이메일 삭제 성공', response);
      refetchEmail();
    })
    .catch(error => {
      console.log('예약 이메일 삭제 실패', error);
    })
  };

  // 스팸 등록 
  const handleAddJunkList = async (sender: any) => {
    const formData = new FormData();
    formData.append('createdBy', user?.userID);
    formData.append('junkId', sender);
    formData.append('registerAt', new Date().toISOString());

    try {
      const response = await AddJunkList(formData);
      console.log('스팸 이메일 등록 성공', response);
    } catch (error) {
      console.log('스팸 이메일 등록 실패', error);
    }
  };

  // 스팸 해제
  const handleRemoveJunkList = async (junkId: any) => {
    try {
      const response = await RemoveJunkList(junkId, user?.userID);
      console.log('스팸 이메일 해제 성공', response);
    } catch (error) {
      console.log('스팸 이메일 해제 실패', error);
    }
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
            <div
              className={`image-container ${Object.keys(selectedMails).length > 0 ? '' : 'disabled'}`}
              onMouseEnter={() => handleHover("delete")}
              onMouseLeave={() => handleHover("")}
              onClick={() => {
                if (Object.keys(selectedMails).length > 0) {
                  setDeleteModalOpen(true);
                }
              }}
            >
              <img src={mail_delete} alt="mail_delete" />
              {hoverState === "delete" && <div className="tooltip">메일 삭제</div>}
            </div>
            {selectdMenuOption === '스팸 메일함' ?
              <div
                className={`image-container ${Object.keys(selectedMails).length > 0 ? '' : 'disabled'}`}
                onMouseEnter={() => handleHover("spam")}
                onMouseLeave={() => handleHover("")}
                onClick={() => {
                  if (Object.keys(selectedMails).length > 0) {
                    setUnSpamModalOpen(true);
                  }
                }}
              >
                <img src={mail_spam_disable} alt="mail_spam_disable" />
                {hoverState === "spam" && <div className="tooltip">스팸 해제</div>}
              </div>
            :
            <div
              className={`image-container ${Object.keys(selectedMails).length > 0 ? '' : 'disabled'}`}
              onMouseEnter={() => handleHover("spam")}
              onMouseLeave={() => handleHover("")}
              onClick={() => {
                if (Object.keys(selectedMails).length > 0) {
                  setSpamModalOpen(true);
                }
              }}
            >
                <img src={mail_spam} alt="mail_spam" />
                {hoverState === "spam" && <div className="tooltip">스팸 차단</div>}
              </div>
            }
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
                <th>{headerTitle}</th>
                <th>제목</th>
                <th></th>
                <th></th>
                <th>날짜</th>
              </tr>
            </thead>
            <tbody className="board_container">
              {filteredMails
                ?.slice((page - 1) * postPerPage, page * postPerPage)
                .map((mail: any) => (
                  <React.Fragment key={mail.Id}>
                    <tr key={mail.Id} className="board_content">
                      <td>
                        <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={allSelected ? allSelected : selectedMails[mail.Id]?.selected || false}
                          onChange={() => toggleMailSelection(mail.Id, mail.messageId, mail.sender)}
                        />
                        <span></span>
                        </label>
                      </td>
                      {selectdMenuOption === '보낸 메일함' ?
                        <td>
                          {mail.receiver}
                        </td>
                      :
                        <td>
                          {mail.sender?.match(/"([^"]+)"/) // 따옴표 안에 있는 부분이 있는지 확인
                            ? mail.sender.match(/"([^"]+)"/)[1] // 있으면 그 부분을 표시
                            : mail.sender.match(/<([^>]+)>/) // 없으면 이메일 주소만 추출
                            ? mail.sender.match(/<([^>]+)>/)[1] // 이메일 주소만 표시
                            : mail.sender // 그냥 메일 주소만 있는 경우 그대로 표시
                          }
                        </td>
                      }
                      <td>
                        <div>
                          <div onClick={() => handleMailStarring(mail.Id, mail.star)}>
                            <img src={mail.star ? mail_important_active : mail_important} alt="mail_important" />
                          </div>
                          {mail.hasAttachments ? <img src={mail_attachment} alt="attachment" /> : <div className="Blank"></div>}
                        </div>
                        <span>[{mail.folder === 'inbox' ? '받은 메일함' : mail.folder === 'sent' ? '보낸 메일함' : mail.folder === 'starred' ? '중요 메일함' : mail.folder === 'unread' ? '안 읽은 메일' : mail.folder === 'drafts' ? '임시 보관함' : mail.folder === 'junk' ? '스팸 메일함' : mail.folder === 'queue' ? '예약 메일함' : ''}]</span>
                        {mail.folder === 'drafts' ? 
                          <div onClick={() => navigate('/writeMail', { state: { mail, status: 'DRAFTS' }})}>
                            {mail?.subject}
                          </div>
                        :
                          <div className={mail.read === 'read' ? "" : "clicked"} onClick={() => {toggleMailContent(mail.Id); handleReadEmail(mail.Id)}}>
                            {mail?.subject}
                            <img src={mail_triangle} alt="mail_triangle" />
                          </div>
                        }
                      </td>
                      <td>{mail.folder === 'inbox' ? null : mail.folder === 'sent' ? <div onClick={() => setIsReadMailListOpen(true)}></div> : null}</td>
                      <td>
                        {/* {mail.folder === 'inbox' ? null : mail.folder === 'sent' ? 
                          <div className="sent_cancle_inactive" onMouseEnter={() => handleMouseEnter(mail.Id)} onMouseLeave={() => handleMouseLeave(mail.Id)} onClick={() => setIsSentCancleOpen(true)}>
                            발송 취소
                            {isInactiveSendMail[mail.Id] && (
                              <div className="sent_cancle_inactive_tooltip">
                                <div>발송 취소 불가</div>
                                <div>수신자 1명 이상 메일을 읽었을 경우</div>
                                <div>발송 취소 불가</div>
                              </div>
                            )}
                          </div> 
                          : mail.folder === 'queue' ? <div className="sent_cancle_active" onClick={() => {setIsReserveCancleOpen(true); setSelectedMailId(mail.Id);}}>예약 취소</div> : null} */}
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
                              {mail?.folder === 'queue' && <span className="mail_reservation">예약</span>}
                              <span>{mail?.subject}</span>
                            </span>
                            {mail.folder === 'inbox' && (
                              <span className="button_wrap">
                                <div className="image-container" onMouseEnter={() => handleHover("spam")} onMouseLeave={() => handleHover("")} onClick={() => handleJunkEmail(mail.Id)}>
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
                                    <img src={mail_download} alt="mail_download" onClick={() => handleMultipleDownload(mail?.attachments)}/>

                                    {isDownFileVisible && (
                                      <div className="DownFile_list">
                                        <div className="DownFile_list_content">
                                          {mail.attachments?.slice(0, visibleAttachments).map((file: any, index: number) => (
                                            <div key={index} className="DownFile_list_object">
                                              <div className="DownFile_list_object_filename">{file?.fileName}</div>
                                              <div className="DownFile_list_object_btn">
                                                <div>{(file?.fileSize / 1024).toFixed(0)}KB</div>
                                                <img src={mail_preview} alt="mail_preview" onClick={() => handlePreviewClick(file)}/>
                                                <img src={getIconForMimeType(file?.mimetype)} alt="mail_attachment_hwp" />
                                                <img src={mail_download} alt="mail_download" onClick={() => handleDownloadClick(file)}/>
                                                {/* <img src={mail_attachment_del} alt="mail_attachment_del" /> */}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                        {mail.attachments?.length > 3 && 
                                          <div className="DownFile_list_more" onClick={() => showAllAttachments(mail)}>
                                            {isExpanded ? "접기" : "+ 더 보기"}
                                          </div>
                                        }
                                      </div>
                                    )}
                                  </div>
                                  :
                                  <></>
                                }
                              </div>
                              <div>
                                <div>받는 사람 :</div>
                                <div>{Array.isArray(mail.receiver) ? mail.receiver?.slice(0, 5).join(', ') : [mail.receiver?.replace(/[\[\]"]+/g, '')]}</div>
                                <div
                                  className="recipient_hover"
                                  onMouseEnter={() => setIsRecipientHover(true)}
                                  onMouseLeave={() => setIsRecipientHover(false)}
                                >
                                  {Array.isArray(mail.receiver) 
                                  ? (mail.receiver.length - 5 > 0 ? ` 외 ${mail.receiver.length - 5}명` : '')
                                  : ""}
                                </div>
                                {
                                  isRecipientHover && (
                                    <div
                                      className="recipient_list"
                                    >
                                    {Array.isArray(mail.receiver) ? mail.receiver?.join(', ') : [mail.receiver?.replace(/[\[\]"]+/g, '')]}
                                  </div>
                                  )
                                }
                              </div>
                            </div>

                            <div className="mail_detail_content_middle">
                              {mail?.folder === 'junk' && 
                                <div style={{color: '#FF0000'}}>이 메일은 받은메일함에서 스팸 차단한 메일입니다.</div>
                              }
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
                  </React.Fragment>
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
        footer1={"차단"}
        headerTextColor="White"
        onFooter1Click={() => {handleJunkCheckboxEmail(selectedMails)}}
        footer1Class="back-green-btn"
        footer2={"취소"}
        footer2Class="red-btn"
        onFooter2Click={() => setSpamModalOpen(false)}
        height="200px"
      >
        <div className="spam_container">
          <div>스팸 차단된 메일은 스팸 메일함으로 이동됩니다.</div>
          <div className="spam_check">
            <input
              type="checkbox"
              id="spam-check"
              checked={isSpamListChecked}
              onChange={(e) => setIsSpamListChecked(e.target.checked)}
            />
            <label htmlFor="spam-check">해당 메일 주소 수신 차단하기</label>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isUnSpamModalOpen}
        onClose={() => setUnSpamModalOpen(false)}
        header={"알림"}
        footer1={"해제"}
        headerTextColor="White"
        onFooter1Click={() => {handleDisalbeJunkCheckboxEmail(selectedMails)}}
        footer1Class="back-green-btn"
        footer2={"취소"}
        footer2Class="red-btn"
        onFooter2Click={() => setUnSpamModalOpen(false)}
        height="250px"
      >
        <div className="spam_container">
          <div>스팸 해제된 메일은 받은 메일함으로 이동되며 <br/>
          해당 메일 주소를 수신 허용할 수 있습니다.
          </div>
          <div className="spam_check">
            <input
              type="checkbox"
              id="spam-check"
              checked={isSpamListChecked}
              onChange={(e) => setIsSpamListChecked(e.target.checked)}
            />
            <label htmlFor="spam-check">해당 메일 주소 수신 허용하기</label>
          </div>
        </div>
      </CustomModal>
      
      <CustomModal
        isOpen={isReadMailListModalOpen}
        onClose={() => setIsReadMailListOpen(false)}
        header={"수신 확인"}
        height="240px"
      >
        <div className="body-container custom_scroll">
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
        onFooter1Click={() => {setIsReserveCancleOpen(false); handleDeleteQueueEmail(selectedMailId);}}
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
