import "./Calendar.scss";
import { Link } from "react-router-dom";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'


const Calendar = () => {

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/calendar"} className="sub_header">휴가관리</Link>
      </div>
      
      <div className="content_container">
        <div className="calendar_container">
          <FullCalendar
            plugins={[ dayGridPlugin ]}
            initialView="dayGridMonth"
            height="100%"
            headerToolbar={{
              start: 'prev title next',
              center: '',
              end: '',
            }} // 달력 상단 헤더
            dayHeaderFormat={{
              weekday: 'long'
            }} // 요일 포맷 변경
            titleFormat={(date) => {
              const year = date.date.year;
              const month = date.date.month + 1;
              return `${year}년 ${month}월`;
            }} // 헤더 년월 포맷 변경
            dayCellContent={(info)=> {
              var number = document.createElement("a");
              number.classList.add("fc-daygrid-day-number");
              number.innerHTML = info.dayNumberText.replace("일","");
              if(info.view.type === "dayGridMonth") {
                return {
                  html: number.outerHTML
                };
              }
              return {
                domNodes: []
              };
            }} // 날짜에 '일' 제거
            locale='kr' // 한국어
            fixedWeekCount={false} // 5주 표기
          />
        </div>  
      </div>  
    </div>
  );
};

export default Calendar;