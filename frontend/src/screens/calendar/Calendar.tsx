import "./Calendar.scss";
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

const Calendar = () => {
  const [isAddeventModalOpen, setAddEventModalOPen] = useState(false);
  const [iseventModalOpen, setEventModalOPen] = useState(false);
  const [isEditeventModalOpen, setEditEventModalOPen] = useState(false);
  const [isDeleteeventModalOpen, setDeleteEventModalOPen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const calendarRef1 = useRef<FullCalendar>(null);
  const calendarRef2 = useRef<FullCalendar>(null);
  const [key, setKey] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#ABF0FF");
  const [selectOpen, setSelectOpen] = useState(false);

  const events1 = [
    { title: '본사 연차', start: new Date('2024-05-17'), end: new Date('2024-05-18'), backgroundColor: '#ABF0FF', borderColor: '#ABF0FF', textColor: '#000' },
    { title: '본사 출장', start: new Date('2024-05-17'), end: new Date('2024-05-17'), backgroundColor: '#B1C3FF', borderColor: '#B1C3FF', textColor: '#000' },
    { title: '본사 외근', start: new Date('2024-05-17'), end: new Date('2024-05-17'), backgroundColor: '#D6CDC2', borderColor: '#D6CDC2', textColor: '#000' },
  ];

  const events2 = [
    { title: 'R&D 연차', start: new Date('2024-05-17'), end: new Date('2024-05-18'), backgroundColor: '#ABF0FF', borderColor: '#ABF0FF', textColor: '#000' },
  ];

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
      title: title,
      startDate: isoStartDate,
      endDate: isoEndDate,
      memo: memo,
      backgroundColor: selectedColor,
    };

    writeCalen(eventData)
      .then(response => {
        console.log("Event added successfully:", response);
      })
      .catch(error => {
        console.error('Error adding event:', error);
      });

    setAddEventModalOPen(false);
  };

  const handleDeleteEvent = () => {
    setDeleteEventModalOPen(false);
    setEventModalOPen(false);
  }

  const handleEditEvent = () => {
    setEventModalOPen(false);
    setEditEventModalOPen(true);
  }

  const handleDeleteEventModal = () => {
    setDeleteEventModalOPen(true)
  }

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [activeTab]);

  const SelectOptions = (color: string) => {
    setSelectedColor(color);
  };

  const SelectOpen = () => {
    setSelectOpen(!selectOpen)
  }
  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/calendar"} className="sub_header">휴가관리</Link>
      </div>

      <div className="content_container">
        <Tabs variant='enclosed' onChange={(index) => setActiveTab(index)}>
          <TabList>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>본사</Tab>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>R&D 연구센터</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <div className="calendar_container">
                <FullCalendar
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
                  locale='kr'
                  fixedWeekCount={false}
                  events={events1}
                  eventContent={(arg) => <div>{arg.event.title.replace('오전 12시 ', '')}</div>}
                  dayMaxEventRows={true}
                  eventDisplay="block"
                  eventClick={() => setEventModalOPen(true)}
                  moreLinkText='개 일정 더보기'
                />
              </div>
            </TabPanel>

            <TabPanel>
              <div className="calendar_container">
                <FullCalendar
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
                  locale='kr'
                  fixedWeekCount={false}
                  events={events2}
                  eventContent={(arg) => <div>{arg.event.title.replace('오전 12시 ', '')}</div>}
                  dayMaxEventRows={true}
                  eventDisplay="block"
                  eventClick={() => setEventModalOPen(true)}
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
                <img src={SelectArrow} alt="SelectArrow"/>
                <div style={{ backgroundColor: selectedColor }}>&nbsp;</div>
              </div>
              {selectOpen?(
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
              <textarea className="textareainput" placeholder='내용을 입력해주세요.' onChange={handleMemoChange}/>
            </div>
          </div>
        </div>
      </CustomModal>  

      <CustomModal
        isOpen={iseventModalOpen}
        onClose={() => setEventModalOPen(false)} 
        header={'일정 확인'}
        footer1={'삭제'}
        footer1Class="red-btn"
        onFooter1Click={handleDeleteEventModal}
        footer2={'수정'}
        footer2Class="green-btn"
        onFooter2Click={handleEditEvent}
        footer3={'취소'}
        footer3Class="gray-btn"
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
                OOO 출장
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-left content-center">
              기간
            </div>
            <div className="content-right">
              <div className="content-date">
                <span>2000년 00월 00일</span>
                <span>-</span>
                <span>2000년 00월 00일</span>
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-left">
              메모
            </div>
            <div className="content-right">
              <div className="content-memo">
                2일간 해외로 출장 예정입니다.
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
        onFooter1Click={handleAddEvent}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => setEditEventModalOPen(false)}
        height="300px"
      >
        <div className="body-container">
          <div className="body-content">
            <div className="Select">
              <div className="SelectHeader" onClick={SelectOpen}>
                <img src={SelectArrow} alt="SelectArrow"/>
                <div style={{ backgroundColor: selectedColor }}>&nbsp;</div>
              </div>
              {selectOpen?(
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
              <textarea className="textareainput" placeholder='내용을 입력해주세요.' onChange={handleMemoChange}/>
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
