import React, { useState, useRef, useEffect, useMemo } from "react";
import { Right_Arrow, White_Arrow } from "../../assets/images/index";
import { Event } from "./MeetingRoom";
import { userState } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

interface IncludeMeProps {
    NotFilterEvent: Event[];
}

const IncludeMeSlide: React.FC<IncludeMeProps> = ({ NotFilterEvent }) => {
    const [slideVisible, setSlideVisible] = useState(true);
    const user = useRecoilValue(userState);
    const [visibleSlides, setVisibleSlides] = useState<{ [key: string]: boolean }>({});
    const [slideHeights, setSlideHeights] = useState<{ [key: string]: number }>({});
    const slideRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const toggleSlide = () => {
        setSlideVisible(prev => !prev);
    };

    const Filtername = useMemo(() => {
        if (user.team && user.department) return `${user.team} ${user.username}`;
        if (user.department) return `${user.department} ${user.username}`;
        return user.username;
    }, [user]);

    const todayString = useMemo(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, []);

    const filteredEvents = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return NotFilterEvent.filter(event => {
            const [day, month, year] = event.startDate.split('-');
            const eventDate = new Date(`20${year}-${month}-${day}`);
            return eventDate >= today && event.meetpeople.some(person => person.includes(Filtername));
        }).reduce<{ [key: string]: Event[] }>((acc, event) => {
            const [day, month, year] = event.startDate.split('-');
            const formattedDate = `20${year}-${month}-${day}`;
            acc[formattedDate] = acc[formattedDate] || [];
            acc[formattedDate].push(event);
            return acc;
        }, {});
    }, [NotFilterEvent, Filtername]);

    const sortedEventsByDate = useMemo(() => {
        return Object.keys(filteredEvents)
            .sort()
            .reduce((acc, date) => {
                acc[date] = filteredEvents[date].sort((a, b) => {
                    const startTimeA = a.startTime.split(':').map(Number);
                    const startTimeB = b.startTime.split(':').map(Number);
                    return startTimeA[0] - startTimeB[0] || startTimeA[1] - startTimeB[1];
                });
                return acc;
            }, {} as { [key: string]: Event[] });
    }, [filteredEvents]);

    const toggleDateSlide = (date: string) => {
        setVisibleSlides(prev => ({
            ...prev,
            [date]: !prev[date],
        }));
    };

    useEffect(() => {
        const newSlideHeights: { [key: string]: number } = {};
        Object.keys(slideRef.current).forEach(date => {
            if (slideRef.current[date]) {
                newSlideHeights[date] = slideRef.current[date]?.scrollHeight || 0;
            }
        });
        setSlideHeights(newSlideHeights);
    }, [sortedEventsByDate]);

    //날짜 설정
    const formatDateString = (dateString: string): string => {
        const dateParts = dateString.split('-');
        if (dateParts.length !== 3) return '유효하지 않은 날짜';

        const year = parseInt(dateParts[0], 10) < 100 ? parseInt(dateParts[0], 10) + 2000 : parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const day = parseInt(dateParts[2], 10);
        const date = new Date(year, month, day);

        if (isNaN(date.getTime())) return '유효하지 않은 날짜';

        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const fullDate = date.toLocaleDateString('ko-KR', options);
        const weekdayOptions: Intl.DateTimeFormatOptions = { weekday: 'short' };
        const weekday = date.toLocaleDateString('ko-KR', weekdayOptions);

        return `${fullDate} (${weekday})`;
    };

    //시간설정
    const formatTime = (timeString: string): string => {
        const timeParts = timeString.split(':');
        if (timeParts.length < 2) return '유효하지 않은 시간';
        return `${timeParts[0]}:${timeParts[1]}`;
    };

    return (
        <div className="project_slide_container">
            <div className={`project_slide ${slideVisible ? 'visible' : ''}`} onClick={toggleSlide}>
                <span className="additional_content_title">내 회의실 일정</span>
                <img src={White_Arrow} alt="White Arrow" className={slideVisible ? "img_rotate" : ""} />
            </div>

            <div className={`additional_content ${slideVisible ? 'visible' : ''}`} style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                {Object.keys(sortedEventsByDate).length > 0 ? (
                    Object.keys(sortedEventsByDate).map(date => (
                        <div key={date} className="project_content">
                            <div className="project_name_container" onClick={() => toggleDateSlide(date)}>
                                <div className="name_left">
                                    <img src={Right_Arrow} alt="toggle" className={visibleSlides[date] ? "img_rotate" : ""} />
                                    <span className="project_name">{formatDateString(date)}</span>
                                </div>
                                {date === todayString && (
                                    <div className="name_right">
                                        <div className="project_state">
                                            <span>Today</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div
                                className={`date_content ${visibleSlides[date] ? "visible" : ""}`}
                                ref={el => (slideRef.current[date] = el)}
                                style={{
                                    height: visibleSlides[date] ? `${slideHeights[date]}px` : '0px',
                                    opacity: visibleSlides[date] ? 1 : 0,
                                    transition: 'height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                                }}
                            >
                                {sortedEventsByDate[date].map(event => {
                                    const [day, month, year] = event.endDate.split('-');
                                    const eventDate = new Date(`20${year}-${month}-${day}`);
                                    const isPastEvent = eventDate < new Date();

                                    return (
                                        <div className={isPastEvent ? "previous_content" : "project_content"} key={event.title}>
                                            <div className={isPastEvent ? "previous_content_name" : "project_content_container"}>
                                                <div>
                                                    <span className="project_content_div_title_medium">{event.title}</span>
                                                </div>
                                                <div>
                                                    <span className="project_content_div_title">시간</span> &nbsp;
                                                    <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                                                </div>
                                                <div>
                                                    <span className="project_content_div_title">장소</span> &nbsp;
                                                    <span>{event.place}</span>
                                                </div>
                                                <div>
                                                    <span className="project_content_div_title">인원</span> &nbsp;
                                                    <span>{event.meetpeople.join(', ')}</span>
                                                </div>
                                                {event.memo && (
                                                    <div>
                                                        <span className="project_content_div_title">메모</span> &nbsp;
                                                        <span>{event.memo}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>일정이 없습니다.</div>
                )}
            </div>
        </div>
    );
};

export default IncludeMeSlide;
