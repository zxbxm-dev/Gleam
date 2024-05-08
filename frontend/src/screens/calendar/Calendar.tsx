import "./Calendar.scss";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Select, Textarea, Input } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { writeCalen } from "../../services/calender/calender";

const Calendar = () => {
  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: isAddModalClose } = useDisclosure();
  const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onClose: onViewModalClose } = useDisclosure();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [title, setTitle] = useState("");
const [memo, setMemo] = useState("")

  const events = [
    { title: '구민석 연차', start: new Date('2024-05-17'), end: new Date('2024-05-18'), backgroundColor: '#ABF0FF', borderColor: '#ABF0FF', textColor: '#000' },
    // { title: '구민석 반차', start: new Date('2024-5-17'), backgroundColor: '#7AE1A9', borderColor: '#7AE1A9' , textColor: '#000'},
    // { title: '구민석 외근', start: new Date('2024-5-17'), backgroundColor: '#D6CDC2', borderColor: '#D6CDC2', textColor: '#000' },
    // { title: '구민석 워크숍', start: new Date('2024-5-17'), backgroundColor: '#FFD8B5', borderColor: '#FFD8B5', textColor: '#000' },
    // { title: '구민석 출장', start: new Date('2024-5-17'), backgroundColor: '#B1C3FF', borderColor: '#B1C3FF', textColor: '#000' },
    // { title: '구민석 연차', start: new Date('2024-4-18'), backgroundColor: '#7AE1A9', borderColor: '#7AE1A9', textColor: '#000' },
    // { title: '구민석 연차', start: new Date('2024-4-18'), backgroundColor: '#7AE1A9', borderColor: '#7AE1A9', textColor: '#000' },
    // { title: '구민석 연차', start: new Date('2024-4-18'), backgroundColor: '#7AE1A9', borderColor: '#7AE1A9', textColor: '#000' },
    // { title: '구민석 연차', start: new Date('2024-4-18'), backgroundColor: '#7AE1A9', borderColor: '#7AE1A9', textColor: '#000' },
  ]

  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
  };

  const handleMemoChange = (event: any) => {
    setMemo(event.target.value);
  };
  const handleAddEvent = () => {
    if (!startDate || !endDate) {
      console.error("Start date or end date is null.");
      return;
    }
  
    // 날짜 부분만 추출
    const isoStartDate = startDate.toISOString().substring(0, 10);
    const isoEndDate = endDate.toISOString().substring(0, 10);
    
    const eventData = {
      title: title,
      startDate: isoStartDate,
      endDate: isoEndDate,
      memo: memo
    };
    
    writeCalen(eventData)
      .then(response => {
        console.log("Event added successfully:", response);
      })
      .catch(error => {
        console.error('Error adding event:', error);
      });
  
    isAddModalClose();
  };
  
  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/calendar"} className="sub_header">휴가관리</Link>
      </div>

      <div className="content_container">
        <div className="calendar_container">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            height="100%"
            customButtons={{
              Addschedule: {
                text: '일정 추가　+',
                click: function () {
                  onAddModalOpen();
                },
              },
            }}
            headerToolbar={{
              start: 'prev title next',
              center: '',
              end: 'Addschedule',
            }} // 달력 상단 헤더
            dayHeaderFormat={{
              weekday: 'long'
            }} // 요일 포맷 변경
            titleFormat={(date) => {
              const year = date.date.year;
              const month = date.date.month + 1;
              return `${year}년 ${month}월`;
            }} // 헤더 년월 포맷 변경
            dayCellContent={(info) => {
              var number = document.createElement("a");
              number.classList.add("fc-daygrid-day-number");
              number.innerHTML = info.dayNumberText.replace("일", "");
              if (info.view.type === "dayGridMonth") {
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
            events={events}
            eventContent={(arg) => {
              return (
                <>
                  <div>{arg.event.title.replace('오전 12시 ', '')}</div>
                </>

              );
            }}
            dayMaxEventRows={true}
            eventDisplay="block"
            eventClick={onViewModalOpen}
            moreLinkText='개 일정 더보기'
          />
        </div>
      </div>
      <Modal isOpen={isAddModalOpen} onClose={isAddModalClose} size='xl' isCentered={true}>
        <ModalOverlay />
        <ModalContent height='40vh' borderRadius='10px'>
          <ModalHeader height='6vh' color='white' bg='#746E58' border='0' fontFamily='var(--font-family-Noto-B)' borderTopRadius='10px'>일정 등록하기</ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDirection='column' gap='15px' fontFamily='var(--font-family-Noto-M)'>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div>
                <Select size='sm' width='4vw' borderRadius='5px' fontFamily='var(--font-family-Noto-M)'>
                  <option value='반차' style={{ color: '#FFB800' }}>반차</option>
                  <option value='연차' style={{ color: '#0D994D' }}>연차</option>
                  <option value='외근' style={{ color: '#7000C9' }}>외근</option>
                  <option value='워크숍' style={{ color: '#3DC6C6' }}>워크숍</option>
                  <option value='출장' style={{ color: '#FF4747' }}>출장</option>
                </Select>
              </div>
              <div>
                <Input size='sm' width='22vw' placeholder='ex) OOO 반차' onChange={handleTitleChange} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '4vw', textAlign: 'right' }}>
                기간
              </div>
              <div style={{display:'flex', width:'80%'}}>
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                  dateFormat="yyyy-MM-dd"
                />
                <span style={{ margin: '0 5px' }}>~</span>
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="End Date"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '4vw', textAlign: 'right' }}>
                메모
              </div>
              <div>
                <Textarea placeholder='내용을 입력해주세요.' size='sm' width='22vw' height='15vh' fontFamily='var(--font-family-Noto-R)' onChange={handleMemoChange} />
              </div>
            </div>
          </ModalBody>
          <ModalFooter gap='10px' display='flex' justifyContent='center'>
            <button className="add_button" onClick={handleAddEvent}>등록</button>
            <button className="cancle_button">취소</button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      <Modal isOpen={isViewModalOpen} onClose={onViewModalClose} size='xl' isCentered={true}>
        <ModalOverlay />
        <ModalContent height='400px' borderRadius='10px'>
          <ModalHeader height='55px' color='white' bg='#746E58' border='0' fontFamily='var(--font-family-Noto-B)' borderTopRadius='10px'>일정 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              제목
            </div>
            <div>
              기간
            </div>
            <div>
              메모
            </div>
          </ModalBody>
          <ModalFooter gap='10px' display='flex' justifyContent='center'>
            <button className="cancle_button">취소</button>
            <button className="cancle_button">삭제</button>
            <button className="cancle_button">수정</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Calendar;