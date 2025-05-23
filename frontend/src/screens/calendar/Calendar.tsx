import { useState, useEffect, useRef } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import CustomModal from "../../components/modal/CustomModal";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { writeCalen } from "../../services/calender/calender";
import { SelectArrow } from "../../assets/images/index";
import { CheckCalen, DeleteCalen, EditCalen } from "../../services/calender/calender";
import { PersonData } from '../../services/person/PersonServices';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';
import { CheckAnnual } from '../../services/attendance/AttendanceServices';
import { AnnualData } from "../attendance/annualManage/AnnualManage";

type Event = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  backgroundColor: string;
  company: string;
  department: string;
  team: string;
  dateType: string;
  memo: string;
  year: string;
  userId: string;
};

type User = {
  userId: string;
  username: string;
  usermail: string;
  company: string;
  department: string;
  team: string;
};

interface GoogleCalendarEvent {
  start: {
    date?: string;
    dateTime?: string;
  };
  summary: string;
}

interface Holiday {
  title: string;
  start: string;
  end?: string;
  color?: string;
}

const Calendar = () => {
  const user = useRecoilValue(userState);
  const [persondata, setPersonData] = useState<any[]>([]);
  const [isAddeventModalOpen, setAddEventModalOPen] = useState(false);
  const [isControleventModalOpen, setControlEventModalOPen] = useState(false);
  const [iseventModalOpen, setEventModalOPen] = useState(false);
  const [isEditeventModalOpen, setEditEventModalOPen] = useState(false);
  const [isDeleteeventModalOpen, setDeleteEventModalOPen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [userDropdown, setuserDropdown] = useState(false);
  const [addEventUser, setAddEventUser] = useState<User | null>(null);
  const [memo, setMemo] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [tabHeights, setTabHeights] = useState({ 0: '41px', 1: '35px' });
  const [tabMargins, setTabMargins] = useState({ 0: '6px', 1: '6px' });
  const calendarRef1 = useRef<FullCalendar>(null);
  const calendarRef2 = useRef<FullCalendar>(null);
  const [key, setKey] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#ABF0FF");
  const [selectOpen, setSelectOpen] = useState(false);
  const [calendar, setCalendar] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [annualData, setAnnualData] = useState<AnnualData[]>([]);
  const [active, setActive] = useState(true);
  
  
  const fetchAnnual = async () => {
    try {
      const response = await CheckAnnual();
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  };

  const { refetch: refetchAnnual } = useQuery("annual", fetchAnnual, {
    onSuccess: (data) => {
      const filteredData = data.filter(
        (item: any) =>
          (item.dateType === "연차" || item.dateType === "반차") &&
          item.userId === user.userID &&
          item.year === String(new Date().getFullYear())
      );
      setAnnualData(filteredData);
    },
    onError: (error) => {
      console.error(error);
    },
  });

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

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [activeTab]);

  const resetForm = () => {
    setTitle('');
    setMemo('');
    setStartDate(null);
    setEndDate(null);
    setAddEventUser(null);
  }

  const handleTitleChange = (event: any) => {
    setuserDropdown(true);
    setTitle(event.target.value);
    const value = event.target.value.toLowerCase();
    if (value.includes('반차')) {
      setSelectedColor('#CEF0FF');
    } else if (value.includes('연차')) {
      setSelectedColor('#BDF1BF');
    } else if (value.includes('외근')) {
      setSelectedColor('#FFFFB0');
    } else if (value.includes('워크숍')) {
      setSelectedColor('#FFDEC9');
    } else if (value.includes('출장')) {
      setSelectedColor('#CFD7F4');
    } else {
      setSelectedColor('#ECD0FF');
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (title.trim()) {
        setTitle(title);
      }
    }
  };

  const handleAutoCompleteClick = (person: any) => {
    setAddEventUser(person);
    setTitle(person.username);
    setuserDropdown(false);
  };

  const filteredName = persondata.filter(person =>
    person.username.toLowerCase().includes(title.toLowerCase())
  );

  const handleMemoChange = (event: any) => {
    setMemo(event.target.value);
  };

  const handleAddEvent = () => {
    if (!startDate || !endDate) {
      console.error("Start date or end date is null.");
      return;
    }
    
    const getLocalISODateString = (date: Date) => {
      const offset = date.getTimezoneOffset();
      const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
      return adjustedDate.toISOString().substring(0, 10);
    };

    const finduser = persondata.find(person => person.username === title.split(' ')[0])
    const isoStartDate = getLocalISODateString(startDate);
    const isoEndDate = getLocalISODateString(endDate);

    
    const eventData = {
      userID: addEventUser?.userId || finduser?.userId || user?.userID,
      name: addEventUser?.username || finduser?.username || user?.username,
      company: addEventUser?.company ?? finduser?.company ?? (active ? '본사' : 'R&D'),
      department: addEventUser?.department || finduser?.department || user?.department,
      team: addEventUser?.team || finduser?.team || user?.team,
      title: title,
      startDate: isoStartDate,
      endDate: isoEndDate,
      dateType: title.split(' ').pop() || "",
      memo: memo,
      year: isoEndDate.substring(0, 4),
      backgroundColor: selectedColor,
    };

    writeCalen(eventData)
      .then(response => {
        console.log("Event added successfully:", response);
        fetchCalendar();
        refetchAnnual();
      })
      .catch(error => {
        console.error('Error adding event:', error);
      });

    resetForm();
    setAddEventModalOPen(false);
  };

  const fetchCalendar = async () => {
    try {
      const response = await CheckCalen();
      setCalendar(response.data);

    } catch (error) {
      console.error("Error fetching calendar:", error);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  const handleEventClick = (info: any) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      startDate: info.event.start.toISOString().substring(0, 10),
      endDate: info.event.end ? info.event.end.toISOString().substring(0, 10) : info.event.start.toISOString().substring(0, 10),
      backgroundColor: info.event.backgroundColor,
      company: info.event.extendedProps.company || "",
      department: info.event.extendedProps.department || "",
      team: info.event.extendedProps.team || "",
      dateType: info.event.extendedProps.dateType || "",
      memo: info.event.extendedProps.memo || "",
      year: info.event.start.toISOString().substring(0, 4),
      userId: info.event.extendedProps.userId || "",
    });

    if (user.username === info.event.title.split(' ')[0] || user.team === '관리팀' || user.userID === info.event.extendedProps.userId) {
      setControlEventModalOPen(true);
    } else {
      setEventModalOPen(true);
    }
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) {
      console.error("No event selected for deletion.");
      return;
    }
    const finduser = persondata.find(person => person.username === selectedEvent.title.split(' ')[0])
    const userID = finduser.userId;
    const startDate = new Date(selectedEvent.startDate);
    const endDate = new Date(selectedEvent.endDate);

    const data = {
      event: {
        id: selectedEvent.id,
        title: selectedEvent.title,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        backgroundColor: selectedEvent.backgroundColor,
        company: selectedEvent.company,
        department: selectedEvent.department,
        team: selectedEvent.team,
        dateType: selectedEvent.dateType,
        memo: selectedEvent.memo,
        year: selectedEvent.year,
      },
      userID: userID
    };

    const event_id = selectedEvent?.id;

    DeleteCalen(data, event_id)
      .then(response => {
        console.log("Event deleted successfully:", response);
        fetchCalendar();
      })
      .catch(error => {
        console.error("Error deleting event:", error);
      });

    setDeleteEventModalOPen(false);
    setControlEventModalOPen(false);
  };

  const handleEditEvent = () => {
    if (!selectedEvent) {
      console.error("수정할 이벤트가 선택되지 않았습니다.");
      return;
    }
    setStartDate(new Date(selectedEvent.startDate));
    setEndDate(new Date(selectedEvent.endDate));
    setTitle(selectedEvent.title);
    setMemo(selectedEvent.memo);
    setSelectedColor(selectedEvent.backgroundColor);

    setControlEventModalOPen(false);
    setEditEventModalOPen(true);
  };

  const handleCalenEdit = () => {
    if (!selectedEvent) {
      console.error("수정할 이벤트가 선택되지 않았습니다.");
      return;
    }

    const finduser = persondata.find(person => person.username === selectedEvent.title.split(' ')[0])
    const userID = finduser.userId;

    const eventData = {
      userID: userID,
      startDate: startDate,
      endDate: endDate,
      backgroundColor: selectedColor,
      dateType: title.split(' ').pop() || "",
      title,
      memo
    };

    const event_id = selectedEvent?.id;

    EditCalen(eventData, event_id)
      .then(() => {
        setEditEventModalOPen(false);
        fetchCalendar();
      })
      .catch((error) => {
        console.error("이벤트 수정에 실패했습니다:", error);
      });

    resetForm();
  };


  const handleDeleteEventModal = () => {
    setDeleteEventModalOPen(true);
  }

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [activeTab]);

  const SelectOptions = (color: string) => {
    setSelectedColor(color);
  };

  const SelectOpen = () => {
    setSelectOpen(!selectOpen);
  }

  const transformEvents = (calendarData: Event[]) => {
    return calendarData.map(event => ({
      id: event.id,
      userId: event.userId,
      title: event.title,
      start: event.startDate,
      end: event.endDate,
      backgroundColor: event.backgroundColor,
      memo: event.memo,
    }));
  };

  const events1 = transformEvents(calendar.filter(event => event.company === '본사'));
  const events2 = transformEvents(calendar.filter(event => event.company === 'R&D'));

  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    const fetchGoogleHolidays = async () => {
      const apiKey = "AIzaSyBB-X6Uc-1EnRlFTXs36cKK6gAQ0VAPpC0";
      const calendarId = 'ko.south_korea.official%23holiday%40group.v.calendar.google.com';
      const timeMin = new Date('2020-01-01').toISOString();
      const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const holidays = data.items.map((item: GoogleCalendarEvent) => ({
          title: item.summary,
          start: item.start.date,
          allDay: true,
          color: 'red',
        }));
        setHolidays(holidays);
      } catch (error) {
        console.error("Error fetching Google Calendar holidays:", error);
      }
    };

    fetchGoogleHolidays();
  }, []);


  const dayCellContent = (arg: any) => {
    const date = new Date(arg.date.getFullYear(), arg.date.getMonth(), arg.date.getDate());
    const formattedDateStr = date.toISOString().split('T')[0];
    const holiday = holidays.find(holiday => {
      const holidayDate = new Date(holiday.start);
      holidayDate.setHours(0, 0, 0, 0);
      const holidayDateStr = holidayDate.toISOString().split('T')[0];
      return holidayDateStr === formattedDateStr;
    });

    return (
      <div className="day-cell-content">
        <div className={`date-text ${holiday ? 'holiday-date' : ''}`}>{date.getDate()}</div>
        {holiday && <div className="holiday-title">{holiday.title}</div>}
      </div>
    );
  };

  const annualInfoText = '';

  useEffect(() => {
    const button = document.querySelector('.fc-annualInfo-button');
    if (button) {
      button.innerHTML = `잔여 연차 <span style="color: #009544;"> ${annualData.length > 0 ? String(annualData[annualData.length - 1].extraDate).padStart(2, '0') : '0'}</sapn><span style="color: #000000;">/${annualData[annualData.length - 1]?.availableDate || 0}</sapn>`;
    }
  }, [annualData]);

  useEffect(() => {
    const tabListButtons = document.querySelectorAll('.fc-tabList-button');
    const RDListButtons = document.querySelectorAll('.fc-RDList-button');

    tabListButtons.forEach(button => {
        const btn = button as HTMLElement;
        if (active) {
            btn.style.backgroundColor = '#45C552';
            btn.style.color = '#fff';
            btn.style.border = '1px solid #fff';
        } else {
          btn.style.backgroundColor = '#fff';
          btn.style.color = '#45C552';
          btn.style.border = '1px solid #45C552';
        }
    });

    RDListButtons.forEach(button => {
      const btn = button as HTMLElement;
      if (active === false) {
          btn.style.backgroundColor = '#45C552';
          btn.style.color = '#fff';
          btn.style.border = '1px solid #fff';
      } else {
        btn.style.backgroundColor = '#fff';
        btn.style.color = '#45C552';
        btn.style.border = '1px solid #45C552';
      }
    });
  }, [active, annualData, calendar]);
  console.log('연차 관리', annualData)
  return (
    <div className="content">
      <div className="content_container">
          <div className="calendar_container">
            <FullCalendar
              key={key}
              ref={calendarRef1}
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              height="100%"
              customButtons={{
                Addschedule: {
                  text: '일정 추가　+',
                  click: function () {
                    setAddEventModalOPen(true);
                  },
                },
                tabList: {
                  text: '본사',
                  click: () => {
                    setActive(true);
                  },
                },

                RDList: {
                  text: 'R&D연구센터',
                  click: () => {
                    setActive(false);
                  },
                },
                annualInfo: {
                  text: annualInfoText,
                },
              }}
              headerToolbar={{
                start: 'tabList,RDList',
                center: 'prev title next',
                end: 'annualInfo,Addschedule',
              }}
              dayHeaderFormat={{ weekday: 'long' }}
              titleFormat={(date) => `${date.date.year}년 ${date.date.month + 1}월`}
              buttonText={{ today: '오늘' }}
              locale='kr'
              fixedWeekCount={false}
              events={active===true?[...events1]:events2}
              eventContent={(arg) => <div>{arg.event.title.replace('오전 12시 ', '')}</div>}
              dayMaxEventRows={true}
              eventDisplay="block"
              eventClick={handleEventClick}
              moreLinkText='개 일정 더보기'
              dayCellContent={dayCellContent}
            />
          </div>
      </div>

      <CustomModal
        isOpen={isAddeventModalOpen}
        onClose={() => { setAddEventModalOPen(false); resetForm(); }}
        header={'일정 등록하기'}
        headerTextColor="White"
        footer1={'등록'}
        footer1Class="back-green-btn"
        onFooter1Click={handleAddEvent}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => { 
          setAddEventModalOPen(false); 
          resetForm(); 
        }}
        height="auto"
      >
        <div className="body-container">
          <div className="body-content">
            <div className="Select">
              <div className="SelectHeader" onClick={SelectOpen}>
                <img src={SelectArrow} alt="SelectArrow" />
                <div style={{ backgroundColor: selectedColor }}>&nbsp;</div>
              </div>
              {selectOpen ? (
                <div className="SelectContent">
                  <div className="Option" onClick={() => SelectOptions('#CEF0FF')}>
                    <span>반차</span>
                    <div style={{ backgroundColor: '#CEF0FF' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#BDF1BF')}>
                    <span>연차</span>
                    <div style={{ backgroundColor: '#BDF1BF' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#FFFFB0')}>
                    <span>외근</span>
                    <div style={{ backgroundColor: '#FFFFB0' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#FFDEC9')}>
                    <span>워크숍</span>
                    <div style={{ backgroundColor: '#FFDEC9' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#CFD7F4')}>
                    <span>출장</span>
                    <div style={{ backgroundColor: '#CFD7F4' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#ECD0FF')}>
                    <span>기타</span>
                    <div style={{ backgroundColor: '#ECD0FF' }}>&nbsp;</div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="content-right">
              <div className="event_title_input">
                <input
                  className="textinput"
                  type="text"
                  placeholder='ex) OOO 반차'
                  onChange={handleTitleChange}
                  onKeyDown={handleInputKeyDown}
                  value={title}
                  ref={inputRef}
                />
                {title && userDropdown && (
                  <ul className="userlist_dropdown">
                    {filteredName.map(person => (
                      <li key={person.name} onClick={() => handleAutoCompleteClick(person)}>
                        {person.username} - {person.department} {person.team}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-left content-center">
              기간
            </div>
            <div className="content-right">
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText={new Date().toLocaleDateString('ko-KR')}
                dateFormat="yyyy-MM-dd"
                className="datepicker"
              />
              <span>~</span>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText={new Date().toLocaleDateString('ko-KR')}
                dateFormat="yyyy-MM-dd"
                className="datepicker"
              />
            </div>
          </div>
          <div className="body-content">
            <div className="content-left">
              메모
            </div>
            <div className="content-right">
              <textarea className="textareainput" placeholder='내용을 입력해주세요.' onChange={handleMemoChange} />
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isControleventModalOpen}
        onClose={() => setControlEventModalOPen(false)}
        header={'휴가'}
        headerTextColor="White"
        footer1={'삭제'}
        footer1Class="red_button"
        onFooter1Click={handleDeleteEventModal}
        footer2={'수정'}
        footer2Class="white_button"
        onFooter2Click={handleEditEvent}
        footer3={'확인'}
        footer3Class="cancle_button"
        onFooter3Click={() => setControlEventModalOPen(false)}
        width="350px"
        height="310px"
      >
        <div className="body-container">
          <div className="body-content">
            <div className="content-right">
              <div className="content-type">
                {selectedEvent?.title}
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-right">
              <div className="content-date">
                <div className="content-date-name">
                  기간
                </div>
                <div>
                  <span> {selectedEvent?.startDate}</span>
                  <span> -</span>
                  <span> {selectedEvent?.endDate}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-right">
              <div className="content-memo-container">
                <div className="content-memo-text">
                  메모
                </div>
                <div className="content-memo">
                  <textarea className="textareainput" value={selectedEvent?.memo} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={iseventModalOpen}
        onClose={() => setEventModalOPen(false)}
        header={'휴가'}
        headerTextColor="White"
        footer3={'확인'}
        footer3Class="cancle_button"
        onFooter3Click={() => setEventModalOPen(false)}
        width="350px"
        height="310px"

      >
        <div className="body-container">
          <div className="body-content">
            <div className="content-right">
              <div className="content-type">
                {selectedEvent?.title}
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-right">
              <div className="content-date">
                <div className="content-date-name">
                  기간
                </div>
                <div>
                  <span> {selectedEvent?.startDate}</span>
                  <span> -</span>
                  <span> {selectedEvent?.endDate}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-right">
              <div className="content-memo-container">
                <div className="content-memo-text">
                  메모
                </div>
                <div className="content-memo">
                  <textarea className="textareainput" value={selectedEvent?.memo} readOnly />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isEditeventModalOpen}
        onClose={() => { setEditEventModalOPen(false); resetForm(); }}
        header={'일정 수정하기'}
        footer1={'등록'}
        footer1Class="back-green-btn"
        onFooter1Click={handleCalenEdit}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => { setEditEventModalOPen(false); resetForm(); }}
        height="320px"
      >
        <div className="body-container">
          <div className="body-content">
            <div className="Select">
              <div className="SelectHeader" onClick={SelectOpen}>
                <img src={SelectArrow} alt="SelectArrow" />
                <div style={{ backgroundColor: selectedColor }}>&nbsp;</div>
              </div>
              {selectOpen ? (
                <div className="SelectContent">
                  <div className="Option" onClick={() => SelectOptions('#CEF0FF')}>
                    <span>반차</span>
                    <div style={{ backgroundColor: '#CEF0FF' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#BDF1BF')}>
                    <span>연차</span>
                    <div style={{ backgroundColor: '#BDF1BF' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#FFFFB0')}>
                    <span>외근</span>
                    <div style={{ backgroundColor: '#FFFFB0' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#FFDEC9')}>
                    <span>워크숍</span>
                    <div style={{ backgroundColor: '#FFDEC9' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#CFD7F4')}>
                    <span>출장</span>
                    <div style={{ backgroundColor: '#CFD7F4' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#ECD0FF')}>
                    <span>기타</span>
                    <div style={{ backgroundColor: '#ECD0FF' }}>&nbsp;</div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="content-right">
              <input className="textinput" value={title} type="text" placeholder='ex) OOO 반차' onChange={handleTitleChange} />
            </div>
          </div>
          <div className="body-content">
            <div className="content-left content-center">
              기간
            </div>
            <div className="content-right">
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText={new Date().toLocaleDateString('ko-KR')}
                dateFormat="yyyy-MM-dd"
                className="datepicker"
              />
              <span>~</span>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText={new Date().toLocaleDateString('ko-KR')}
                dateFormat="yyyy-MM-dd"
                className="datepicker"
              />
            </div>
          </div>
          <div className="body-content">
            <div className="content-left">
              메모
            </div>
            <div className="content-right">
              <textarea className="textareainput" value={memo} placeholder='내용을 입력해주세요.' onChange={handleMemoChange} />
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isDeleteeventModalOpen}
        onClose={() => setDeleteEventModalOPen(false)}
        header={'알림'}
        footer1={'삭제'}
        footer1Class="red-btn"
        onFooter1Click={handleDeleteEvent}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => setDeleteEventModalOPen(false)}
      >
        <div>
          삭제하시겠습니까?
        </div>
      </CustomModal>
    </div>
  );
};

export default Calendar;
