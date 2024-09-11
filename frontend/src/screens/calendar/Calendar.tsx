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
  userID: string;
};

type User = {
  userId: string;
  username: string;
  usermail: string;
  company: string;
  department: string;
  team: string;
};


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
    if (activeTab === 0) {
      setTabHeights({ 0: '41px', 1: '35px' });
      setTabMargins({ 0: '0px', 1: '6px' });
    } else {
      setTabHeights({ 0: '35px', 1: '41px' });
      setTabMargins({ 0: '6px', 1: '0px' });
    }
  }, [activeTab]);

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
      setSelectedColor('#ABF0FF');
    } else if (value.includes('연차')) {
      setSelectedColor('#7AE1A9');
    } else if (value.includes('외근')) {
      setSelectedColor('#D6CDC2');
    } else if (value.includes('워크숍')) {
      setSelectedColor('#FFD8B5');
    } else if (value.includes('출장')) {
      setSelectedColor('#B1C2FF');
    } else {
      setSelectedColor('#B5B5B5');
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
      userID: addEventUser?.userId || finduser?.userId,
      name: addEventUser?.username || finduser?.username,
      company: addEventUser?.company || finduser?.company,
      department: addEventUser?.department || finduser?.department,
      team: addEventUser?.team || finduser?.team,
      title: title,
      startDate: isoStartDate,
      endDate: isoEndDate,
      dateType: title.split(' ').pop() || "",
      memo: memo,
      year: isoEndDate.substring(0, 4),
      backgroundColor: selectedColor,
    };

    console.log(eventData)

    writeCalen(eventData)
      .then(response => {
        console.log("Event added successfully:", response);
        fetchCalendar();
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
      userID: info.event.extendedProps.userID || "",
    });

    if (user.username === info.event.title.split(' ')[0] || user.team === '관리팀') {
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
      backgroundColor:selectedColor,
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
      title: event.title,
      start: event.startDate,
      end: event.endDate,
      backgroundColor: event.backgroundColor,
      memo: event.memo,
    }));
  };

  const events1 = transformEvents(calendar.filter(event => event.company === '본사'));
  const events2 = transformEvents(calendar.filter(event => event.company === 'R&D'));

  const holidays = [
    { date: '2024-01-01', name: '새해 첫날' },
    { date: '2024-02-09', name: '설날 연휴' },
    { date: '2024-02-10', name: '설날' },
    { date: '2024-02-11', name: '설날 연휴' },
    { date: '2024-02-12', name: '대체공휴일(설날)' },
    { date: '2024-03-01', name: '삼일절' },
    { date: '2024-04-10', name: '22대 국회의원선거' },
    { date: '2024-05-05', name: '어린이날' },
    { date: '2024-05-06', name: '대체공휴일(어린이날)' },
    { date: '2024-05-15', name: '부처님 오신 날' },
    { date: '2024-06-06', name: '현충일' },
    { date: '2024-08-15', name: '광복절' },
    { date: '2024-09-16', name: '추석 연휴' },
    { date: '2024-09-17', name: '추석' },
    { date: '2024-09-18', name: '추석 연휴' },
    { date: '2024-10-01', name: '임시공휴일' },
    { date: '2024-10-03', name: '개천절' },
    { date: '2024-10-09', name: '한글날' },
    { date: '2024-12-25', name: '성탄절' },
  ];

  const dayCellContent = (info: any) => {
    var number = document.createElement("span");
    number.classList.add("fc-daygrid-day-number-content");
    number.innerHTML = info.dayNumberText.replace("일", "");

    const dateStr = info.date.toLocaleDateString('en-CA');

    const holiday = holidays.find(
      (holiday) => holiday.date === dateStr
    );

    var container = document.createElement("div");
    container.style.display = 'flex';
    container.style.alignItems = 'center';

    if (holiday) {
      var holidayName = document.createElement("span");
      holidayName.innerHTML = holiday.name;
      holidayName.style.color = 'red';
      holidayName.style.width = '100%';
      holidayName.style.textAlign = 'right';
      number.style.color = 'red';

      container.appendChild(number);
      container.appendChild(holidayName);
    } else {
      container.appendChild(number);
    }

    return { domNodes: [container] };
  };

  return (
    <div className="content" style={{ padding: '0px 20px' }}>
      <div className="content_container">
        <Tabs variant='enclosed' onChange={(index) => setActiveTab(index)}>
          <TabList>
            <Tab _selected={{ bg: '#FFFFFF' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[0]} marginTop={tabMargins[0]}>본사</Tab>
            <Tab _selected={{ bg: '#FFFFFF' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[1]} marginTop={tabMargins[1]}>R&D 연구센터</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <div className="calendar_container">
                <FullCalendar
                  key={key}
                  ref={calendarRef1}
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  dayCellContent={dayCellContent}
                  height="100%"
                  customButtons={{
                    Addschedule: {
                      text: '일정 추가　+',
                      click: function () {
                        setAddEventModalOPen(true);
                      },
                    },
                  }}
                  headerToolbar={{
                    start: 'prev title next',
                    center: '',
                    end: 'Addschedule',
                  }}
                  dayHeaderFormat={{ weekday: 'long' }}
                  titleFormat={(date) => `${date.date.year}년 ${date.date.month + 1}월`}
                  buttonText={{ today: '오늘' }}
                  locale='kr'
                  fixedWeekCount={false}
                  events={events1}
                  eventContent={(arg) => <div>{arg.event.title.replace('오전 12시 ', '')}</div>}
                  dayMaxEventRows={true}
                  eventDisplay="block"
                  eventClick={handleEventClick}
                  moreLinkText='개 일정 더보기'
                />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="calendar_container">
                <FullCalendar
                  key={key}
                  ref={calendarRef2}
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
                  }}
                  headerToolbar={{
                    start: 'prev title next',
                    center: '',
                    end: 'Addschedule',
                  }}
                  dayHeaderFormat={{ weekday: 'long' }}
                  titleFormat={(date) => `${date.date.year}년 ${date.date.month + 1}월`}
                  dayCellContent={(info) => {
                    var number = document.createElement("a");
                    number.classList.add("fc-daygrid-day-number");
                    number.innerHTML = info.dayNumberText.replace("일", "");
                    if (info.view.type === "dayGridMonth") {
                      return { html: number.outerHTML };
                    }
                    return { domNodes: [] };
                  }}
                  buttonText={{ today: '오늘' }}
                  locale='kr'
                  fixedWeekCount={false}
                  events={events2}
                  eventContent={(arg) => <div>{arg.event.title.replace('오전 12시 ', '')}</div>}
                  dayMaxEventRows={true}
                  eventDisplay="block"
                  eventClick={handleEventClick}
                  moreLinkText='개 일정 더보기'
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      <CustomModal
        isOpen={isAddeventModalOpen}
        onClose={() => { setAddEventModalOPen(false); resetForm();}}
        header={'일정 등록하기'}
        footer1={'등록'}
        footer1Class="back-green-btn"
        onFooter1Click={handleAddEvent}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => { setAddEventModalOPen(false); resetForm();}}
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
                  <div className="Option" onClick={() => SelectOptions('#ABF0FF')}>
                    <span>반차</span>
                    <div style={{ backgroundColor: '#ABF0FF' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#7AE1A9')}>
                    <span>연차</span>
                    <div style={{ backgroundColor: '#7AE1A9' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#D6CDC2')}>
                    <span>외근</span>
                    <div style={{ backgroundColor: '#D6CDC2' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#FFD8B5')}>
                    <span>워크숍</span>
                    <div style={{ backgroundColor: '#FFD8B5' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#B1C2FF')}>
                    <span>출장</span>
                    <div style={{ backgroundColor: '#B1C2FF' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#B5B5B5')}>
                    <span>기타</span>
                    <div style={{ backgroundColor: '#B5B5B5' }}>&nbsp;</div>
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
        header={'일정 확인'}
        footer1={'삭제'}
        footer1Class="red_button"
        onFooter1Click={handleDeleteEventModal}
        footer2={'수정'}
        footer2Class="white_button"
        onFooter2Click={handleEditEvent}
        footer3={'확인'}
        footer3Class="cancle_button"
        onFooter3Click={() => setControlEventModalOPen(false)}
        width="360px"
        height="300px"
      >
        <div className="body-container">
          <div className="body-content">
            <div className="content-left">
              타입
            </div>
            <div className="content-right">
              <div className="content-type">
                {selectedEvent?.title}
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-left content-center">
              기간
            </div>
            <div className="content-right">
              <div className="content-date">
                <span> {selectedEvent?.startDate}</span>
                <span>-</span>
                <span> {selectedEvent?.endDate}</span>
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-left">
              메모
            </div>
            <div className="content-right">
              <div className="content-memo">
                {selectedEvent?.memo}
              </div>
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={iseventModalOpen}
        onClose={() => setEventModalOPen(false)}
        header={'일정 확인'}
        footer3={'확인'}
        footer3Class="cancle_button"
        onFooter3Click={() => setEventModalOPen(false)}
        width="360px"
        height="300px"
      >
        <div className="body-container">
          <div className="body-content">
            <div className="content-left">
              타입
            </div>
            <div className="content-right">
              <div className="content-type">
                {selectedEvent?.title}
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-left content-center">
              기간
            </div>
            <div className="content-right">
              <div className="content-date">
                <span> {selectedEvent?.startDate}</span>
                <span>-</span>
                <span> {selectedEvent?.endDate}</span>
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-left">
              메모
            </div>
            <div className="content-right">
              <div className="content-memo">
                {selectedEvent?.memo}
              </div>
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isEditeventModalOpen}
        onClose={() => { setEditEventModalOPen(false); resetForm();}}
        header={'일정 수정하기'}
        footer1={'등록'}
        footer1Class="back-green-btn"
        onFooter1Click={handleCalenEdit}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => { setEditEventModalOPen(false); resetForm();}}
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
                  <div className="Option" onClick={() => SelectOptions('#ABF0FF')}>
                    <span>반차</span>
                    <div style={{ backgroundColor: '#ABF0FF' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#7AE1A9')}>
                    <span>연차</span>
                    <div style={{ backgroundColor: '#7AE1A9' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#D6CDC2')}>
                    <span>외근</span>
                    <div style={{ backgroundColor: '#D6CDC2' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#FFD8B5')}>
                    <span>워크숍</span>
                    <div style={{ backgroundColor: '#FFD8B5' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#B1C2FF')}>
                    <span>출장</span>
                    <div style={{ backgroundColor: '#B1C2FF' }}>&nbsp;</div>
                  </div>
                  <div className="Option" onClick={() => SelectOptions('#B5B5B5')}>
                    <span>기타</span>
                    <div style={{ backgroundColor: '#B5B5B5' }}>&nbsp;</div>
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
