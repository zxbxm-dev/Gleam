import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import CustomModal from "../../components/modal/CustomModal";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { writeCalen } from "../../services/calender/calender";
import { SelectArrow } from "../../assets/images/index";
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';
import { isSidebarVisibleState } from '../../recoil/atoms';
import { CheckCalen, DeleteCalen, EditCalen } from "../../services/calender/calender";

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
};


const Calendar = () => {
  const user = useRecoilValue(userState);
  const [isAddeventModalOpen, setAddEventModalOPen] = useState(false);
  const [iseventModalOpen, setEventModalOPen] = useState(false);
  const [isEditeventModalOpen, setEditEventModalOPen] = useState(false);
  const [isDeleteeventModalOpen, setDeleteEventModalOPen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [tabHeights, setTabHeights] = useState({ 0: '41px', 1: '35px' });
  const [tabMargins, setTabMargins] = useState({ 0: '6px', 1: '6px' });
  const calendarRef1 = useRef<FullCalendar>(null);
  const calendarRef2 = useRef<FullCalendar>(null);
  const [key, setKey] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#ABF0FF");
  const [selectOpen, setSelectOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useRecoilState(isSidebarVisibleState);
  const [calendar, setCalendar] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
  }, [activeTab, isSidebarVisible]);

  const handleTitleChange = (event: any) => {
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
      setSelectedColor('#ABF0FF');
    }
  };

  const handleMemoChange = (event: any) => {
    setMemo(event.target.value);
  };

  const handleAddEvent = () => {
    if (!startDate || !endDate) {
      console.error("Start date or end date is null.");
      return;
    }

    const isoStartDate = startDate.toISOString().substring(0, 10);
    const isoEndDate = endDate.toISOString().substring(0, 10);

    const eventData = {
      userID: user.userID,
      name: user.username,
      company: user.company,
      department: user.department,
      team: user.team,
      title: title,
      startDate: isoStartDate,
      endDate: isoEndDate,
      dateType: title.split(' ')[1],
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
    });

    console.log("Selected Event ID:", info.event.id);
    setEventModalOPen(true);
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) {
      console.error("No event selected for deletion.");
      return;
    }

    const userID = user.userID;
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
    setEventModalOPen(false);
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

    setEventModalOPen(false);
    setEditEventModalOPen(true);
  };

  const handleCalenEdit = () => {
    if (!selectedEvent) {
      console.error("수정할 이벤트가 선택되지 않았습니다.");
      return;
    }

    const eventData = {
      userID: user.userID,
      startDate: startDate,
      endDate: endDate,
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
        onClose={() => setAddEventModalOPen(false)}
        header={'일정 등록하기'}
        footer1={'등록'}
        footer1Class="back-green-btn"
        onFooter1Click={handleAddEvent}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => setAddEventModalOPen(false)}
        height="300px"
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
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="content-right">
              <input className="textinput" type="text" placeholder='ex) OOO 반차' onChange={handleTitleChange} />
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
        isOpen={iseventModalOpen}
        onClose={() => setEventModalOPen(false)}
        header={'일정 확인'}
        footer1={'삭제'}
        footer1Class="red_button"
        onFooter1Click={handleDeleteEventModal}
        footer2={'수정'}
        footer2Class="white_button"
        onFooter2Click={handleEditEvent}
        footer3={'취소'}
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
        onClose={() => setEditEventModalOPen(false)}
        header={'일정 수정하기'}
        footer1={'등록'}
        footer1Class="back-green-btn"
        onFooter1Click={handleCalenEdit}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => setEditEventModalOPen(false)}
        height="300px"
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
