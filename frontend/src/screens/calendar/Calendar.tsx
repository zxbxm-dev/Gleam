import "./Calendar.scss";
import { Link } from "react-router-dom";

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


const Calendar = () => {
  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: isAddModalClose } = useDisclosure();
  const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onClose: onViewModalClose } = useDisclosure();

  const events = [
    { title: '구민석 반차', start: new Date('2024-4-17'), backgroundColor: '#ABF0FF', borderColor: '#ABF0FF' , textColor: '#000'},
    { title: '구민석 연차', start: new Date('2024-4-17'), backgroundColor: '#7AE1A9', borderColor: '#7AE1A9' , textColor: '#000'},
    { title: '구민석 외근', start: new Date('2024-4-17'), backgroundColor: '#D6CDC2', borderColor: '#D6CDC2' , textColor: '#000'},
    { title: '구민석 워크숍', start: new Date('2024-4-17'), backgroundColor: '#FFD8B5', borderColor: '#FFD8B5' , textColor: '#000'},
    { title: '구민석 출장', start: new Date('2024-4-17'), backgroundColor: '#B1C3FF', borderColor: '#B1C3FF' , textColor: '#000'},
  	{ title: '구민석 연차', start: new Date('2024-4-18'), backgroundColor: '#7AE1A9', borderColor: '#7AE1A9' , textColor: '#000'},
  	{ title: '구민석 연차', start: new Date('2024-4-18'), backgroundColor: '#7AE1A9', borderColor: '#7AE1A9' , textColor: '#000'},
  	{ title: '구민석 연차', start: new Date('2024-4-18'), backgroundColor: '#7AE1A9', borderColor: '#7AE1A9' , textColor: '#000'},
  	{ title: '구민석 연차', start: new Date('2024-4-18'), backgroundColor: '#7AE1A9', borderColor: '#7AE1A9' , textColor: '#000'},
  ]

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
            customButtons={{
              Addschedule: {
                text: '일정 추가　+',
                click: function() {
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
          <ModalHeader height='6vh' color='white' bg='#746E58' border='0' fontFamily= 'var(--font-family-Noto-B)' borderTopRadius='10px'>일정 등록하기</ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDirection='column' gap='15px' fontFamily='var(--font-family-Noto-M)'>
            <div style={{display: 'flex', gap: '10px'}}>
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
                <Input size='sm' width='22vw' placeholder='ex) OOO 반차' />
              </div>
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <div style={{width: '4vw', textAlign: 'right'}}>
                기간
              </div>
              <div>

              </div>
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <div style={{width: '4vw', textAlign: 'right'}}>
                메모
              </div>
              <div>
                <Textarea placeholder='내용을 입력해주세요.' size='sm' width='22vw' height='15vh' fontFamily='var(--font-family-Noto-R)'/>
              </div>
            </div>
          </ModalBody>
          <ModalFooter gap='10px' display='flex' justifyContent='center'>
            <button className="add_button">등록</button>
            <button className="cancle_button">취소</button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      <Modal isOpen={isViewModalOpen} onClose={onViewModalClose} size='xl' isCentered={true}>
        <ModalOverlay />
        <ModalContent height='400px' borderRadius='10px'>
          <ModalHeader height='55px' color='white' bg='#746E58' border='0' fontFamily= 'var(--font-family-Noto-B)' borderTopRadius='10px'>일정 확인</ModalHeader>
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