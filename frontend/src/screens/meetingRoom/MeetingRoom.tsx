import "../calendar/Calendar.scss";
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
import { useRecoilState } from 'recoil';
import { isSidebarVisibleState } from '../../recoil/atoms';
import { CheckCalen, DeleteCalen } from "../../services/calender/calender";

interface Event {
    title: string;
    startDate: string;
    endDate: string;
}

const MeetingRoom = () => {
    const [isAddeventModalOpen, setAddEventModalOPen] = useState(false);
    const [iseventModalOpen, setEventModalOPen] = useState(false);
    const [isEditeventModalOpen, setEditEventModalOPen] = useState(false);
    const [isDeleteeventModalOpen, setDeleteEventModalOPen] = useState(false);
    const [ischeckPeopleModalOpen, setcheckPeopleModalOPen] = useState(false);
    const [isMeetingModalOpen, setMeetingModalOPen] = useState(false);
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
    const [isSidebarVisible, setIsSidebarVisible] = useRecoilState(isSidebarVisibleState);
    const [calender, setCalender] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [location, setLocation] = useState(""); // 선택된 장소 상태
    const [company, setCompany] = useState(""); // 선택된 회사 상태
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState("");
    const [isTwoOpen, setIsTwoOpen] = useState(false);
    const [selectedTwoTime, setSelectedTwoTime] = useState("");

    const toggleSelect = () => {
        setIsOpen(!isOpen);
    };

    const handleTimeSelect = (time: any) => {
        setSelectedTime(time);
        setIsOpen(false);
    };

    const toggleTwoSelect = () => {
        setIsTwoOpen(!isTwoOpen);
    };

    const handleTwoTimeSelect = (time: any) => {
        setSelectedTwoTime(time);
        setIsTwoOpen(false);
    };


    const handleCompanyChange = (e: any) => {
        const selectedCompany = e.target.value;
        setCompany(selectedCompany);
        setLocation("");
    };

    const handleLocationChange = (e: any) => {
        const selectedLocation = e.target.value;
        setLocation(selectedLocation);
    };

    useEffect(() => {
        setKey(prevKey => prevKey + 1);
    }, [activeTab, isSidebarVisible]);

    useEffect(() => {
        const fetchCalender = async () => {
            try {
                const response = await CheckCalen();
                setCalender(response.data);
            } catch (error) {
                console.error("Error fetching calender:", error);
            }
        };

        fetchCalender();
    }, []);

    const events1 = [
        { title: '개발1팀 회의', start: new Date('2024-06-12'), end: new Date('2024-06-12'), backgroundColor: '#ABF0FF', borderColor: '#ABF0FF', textColor: '#000' },
        { title: '본사 출장', start: new Date('2024-05-17'), end: new Date('2024-05-17'), backgroundColor: '#B1C3FF', borderColor: '#B1C3FF', textColor: '#000' },
        { title: '본사 외근', start: new Date('2024-05-17'), end: new Date('2024-05-17'), backgroundColor: '#D6CDC2', borderColor: '#D6CDC2', textColor: '#000' },
    ];

    // const handleTitleChange = (event: any) => {
    //     setTitle(event.target.value);
    //     const value = event.target.value.toLowerCase();
    //     if (value.includes('반차')) {
    //         setSelectedColor('#ABF0FF');
    //     } else if (value.includes('연차')) {
    //         setSelectedColor('#7AE1A9');
    //     } else if (value.includes('외근')) {
    //         setSelectedColor('#D6CDC2');
    //     } else if (value.includes('워크숍')) {
    //         setSelectedColor('#FFD8B5');
    //     } else if (value.includes('출장')) {
    //         setSelectedColor('#B1C2FF');
    //     } else {
    //         setSelectedColor('#ABF0FF');
    //     }
    // };

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

    const handleEventClick = (info: any) => {
        setSelectedEvent({
            title: info.event.title,
            startDate: info.event.start.toISOString().substring(0, 10),
            endDate: info.event.end ? info.event.end.toISOString().substring(0, 10) : info.event.start.toISOString().substring(0, 10),
        });
        setEventModalOPen(true);
    };

    const handleDeleteEvent = () => {
        if (!selectedEvent) {
            console.error("No event selected for deletion.");
            return;
        }
        DeleteCalen(selectedEvent)
            .then(response => {
                console.log("Event deleted successfully:", response);
            })
            .catch(error => {
                console.error("Error deleting event:", error);
            });

        setDeleteEventModalOPen(false);
        setEventModalOPen(false);
    };


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
                <Link to={"/meetingroom"} className="sub_header">회의실 관리</Link>
            </div>

            <div className="content_container">
                <Tabs variant='enclosed' onChange={(index) => setActiveTab(index)}>
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
                                            text: '예약 추가　+',
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
                header={'회의실 예약하기'}
                footer1={'등록'}
                footer1Class="back-green-btn"
                onFooter1Click={handleAddEvent}
                footer2={'취소'}
                footer2Class="gray-btn"
                onFooter2Click={() => setAddEventModalOPen(false)}
                height="430px"
            >
                <div className="body-container">
                    <input className="TextInputCon" type="text" placeholder="제목을 입력해 주세요." />
                    <div className="AddPeople">
                        <span className="span">참여인원</span>
                        <input className="AddInputCon" type="text" placeholder="인원을 입력해 주세요." />
                    </div>
                    <div className="AddPeople">
                        <span className="span">시간</span>
                        <div className="Date">
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText={new Date().toLocaleDateString('ko-KR')}
                                dateFormat="yyyy-MM-dd"
                                className="datepicker"
                                popperPlacement="top"
                            />
                            <div className="timeoption" onClick={toggleSelect}>
                                {selectedTime || '00:00'}

                                {isOpen && (
                                    <div className="options">
                                        {[...Array(16)].map((_, index) => {
                                            const hour = 10 + Math.floor(index / 2);
                                            const minute = (index % 2) * 30;
                                            if (hour === 17 && minute > 0) return null;
                                            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                                            return (
                                                <div key={index} className="optionselect" onClick={() => handleTimeSelect(time)}>
                                                    {time}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                        </div>
                        <span className="timespan">~</span>
                        <div className="Date">
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
                                popperPlacement="top"
                            />
                            <div className="timeoption" onClick={toggleTwoSelect}>
                                {selectedTwoTime || '00:00'}

                                {isTwoOpen && (
                                    <div className="options">
                                        {[...Array(16)].map((_, index) => {
                                            const hour = 10 + Math.floor(index / 2);
                                            const minute = (index % 2) * 30;
                                            if (hour === 17 && minute > 0) return null;
                                            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                                            return (
                                                <div key={index} className="optionselect" onClick={() => handleTwoTimeSelect(time)}>
                                                    {time}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="AddPeoples">
                        <span className="span">장소</span>
                        <div className="MeetingRoom">
                            <select className="SelectRoom" value={location} onChange={handleLocationChange}>
                                <option value="">회의실 선택</option>
                                {company === "본사" && (
                                    <>
                                        <option value="미팅룸">미팅룸</option>
                                        <option value="라운지">라운지</option>
                                    </>
                                )}
                                {company === "R&D" && <option value="연구총괄실">연구총괄실</option>}
                            </select>

                            <fieldset className="Field" onChange={handleCompanyChange}>
                                <label>
                                    <input type="radio" name="company" value="R&D" />
                                    <span>R&D</span>
                                </label>

                                <label>
                                    <input type="radio" name="company" value="본사" />
                                    <span>본사</span>
                                </label>
                            </fieldset>
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
                        <div className="content-right">
                            <div className="content-type">
                                업무 회의
                            </div>
                        </div>
                    </div>
                    <div className="body-content">
                        <div className="content-left content-center">
                            시간
                        </div>
                        <div className="content-right">
                            <div className="content-date">
                                <span>00월 00일 오후 13:30</span>
                                <span>-</span>
                                <span>00월 00일 오후 15:30</span>
                            </div>
                        </div>
                    </div>
                    <div className="body-content">
                        <div className="content-left content-center">
                            참여인원
                        </div>
                        <div className="content-right">
                            <div className="content-memo">
                                개발팀 장현지, 개발팀 구민석
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
                height="430px"
            >
                <div className="body-container">
                    <input className="TextInputCon" type="text" placeholder="제목을 입력해 주세요." />
                    <div className="AddPeople">
                        <span className="span">참여인원</span>
                        <input className="AddInputCon" type="text" placeholder="인원을 입력해 주세요." />
                    </div>
                    <div className="AddPeople">
                        <span className="span">시간</span>
                        <div className="Date">
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText={new Date().toLocaleDateString('ko-KR')}
                                dateFormat="yyyy-MM-dd"
                                className="datepicker"
                                popperPlacement="top"
                            />
                            <div className="timeoption" onClick={toggleSelect}>
                                {selectedTime || '00:00'}

                                {isOpen && (
                                    <div className="options">
                                        {[...Array(16)].map((_, index) => {
                                            const hour = 10 + Math.floor(index / 2);
                                            const minute = (index % 2) * 30;
                                            if (hour === 17 && minute > 0) return null;
                                            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                                            return (
                                                <div key={index} className="optionselect" onClick={() => handleTimeSelect(time)}>
                                                    {time}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                        </div>
                        <span className="timespan">~</span>
                        <div className="Date">
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
                                popperPlacement="top"
                            />
                            <div className="timeoption" onClick={toggleTwoSelect}>
                                {selectedTwoTime || '00:00'}

                                {isTwoOpen && (
                                    <div className="options">
                                        {[...Array(16)].map((_, index) => {
                                            const hour = 10 + Math.floor(index / 2);
                                            const minute = (index % 2) * 30;
                                            if (hour === 17 && minute > 0) return null;
                                            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                                            return (
                                                <div key={index} className="optionselect" onClick={() => handleTwoTimeSelect(time)}>
                                                    {time}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="AddPeoples">
                        <span className="span">장소</span>
                        <div className="MeetingRoom">
                            <select className="SelectRoom" value={location} onChange={handleLocationChange}>
                                <option value="">회의실 선택</option>
                                {company === "본사" && (
                                    <>
                                        <option value="미팅룸">미팅룸</option>
                                        <option value="라운지">라운지</option>
                                    </>
                                )}
                                {company === "R&D" && <option value="연구총괄실">연구총괄실</option>}
                            </select>

                            <fieldset className="Field" onChange={handleCompanyChange}>
                                <label>
                                    <input type="radio" name="company" value="R&D" />
                                    <span>R&D</span>
                                </label>

                                <label>
                                    <input type="radio" name="company" value="본사" />
                                    <span>본사</span>
                                </label>
                            </fieldset>
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
            <CustomModal
                isOpen={ischeckPeopleModalOpen}
                onClose={() => setcheckPeopleModalOPen(false)}
                header={'알림'}
                footer1={'진행'}
                footer1Class="red-btn"
                footer2={'취소'}
                footer2Class="gray-btn"
                onFooter2Click={() => setcheckPeopleModalOPen(false)}
            >
                <div>
                    선택하신 사용자 중 다른 일정이 예약되어 있는 분이 계십니다.<br />
                    그래도 등록을 진행하시겠습니까?
                </div>
            </CustomModal>
            <CustomModal
                isOpen={isMeetingModalOpen}
                onClose={() => setMeetingModalOPen(false)}
                header={'알림'}
                footer1={'확인'}
                footer1Class="gray-btn"
                onFooter1Click={() => setMeetingModalOPen(false)}
            >
                <div>
                    선택하신 시간대의 해당 장소는<br />
                    이미 예약되어 있습니다.
                </div>
            </CustomModal>
        </div>
    );
};

export default MeetingRoom;
