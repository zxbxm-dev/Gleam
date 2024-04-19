import React, { useState } from "react";
import "./AttendanceRegist.scss";
import { Link } from "react-router-dom";
import { Select } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'

const AttendanceRegist = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDateInfo, setSelectedDateInfo] = useState<{
    name: string | null;
    year: number | null;
    month: number | null;
    date: number | null;
    dayOfWeek: string | null;
  }>({
    name: null,
    year: null,
    month: null,
    date: null,
    dayOfWeek: null
  });


  // 전체 연도의 정보
  const yearData = [];

  // 1월 ~ 12월 정보
  for (let month = 0; month < 12; month++) {
    const currentYear = selectedYear;

    // 월별 날짜 계산
    const firstDayOfMonth = new Date(currentYear, month, 1);
    const lastDayOfMonth = new Date(currentYear, month + 1, 0);

    // 월 일수 계산
    const numberOfDaysInMonth = lastDayOfMonth.getDate();

    // 첫 날 요일 계산
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // 월 정보 저장
    yearData.push({
      month: month + 1,
      numberOfDaysInMonth,
      firstDayOfWeek
    });
  }

  const DateDivs = (numberOfDaysInMonth: number, firstDayOfWeek: number) => {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const tableRows = [];
    for (let j = 0; j < numberOfDaysInMonth; j++) {
      const dayOfWeek = daysOfWeek[(firstDayOfWeek + j) % 7];
      tableRows.push(
        <tr className="dateconta" key={`${j}`}>
          <td className="date">{j + 1}일<br/>{dayOfWeek}요일</td>
        </tr>
      );
    }
    return (
      <table className="dateTable">
        <tbody>
          {tableRows}
        </tbody>
      </table>
    );
  };


  const generateDivs = (numberOfDaysInMonth: number, year: number, month: number) => {
    const tableRows = [];
    for (let i = 0; i < numberOfDaysInMonth; i++) {
      const rowCells = [];
      const date = i + 1;
      for (let j = 0; j < 18; j++) {
        const personIndex = j;
          rowCells.push(
            <tr
            className="conta_three"
            onClick={() => handleDivClick(date, year, month, personIndex)}
            key={`${i}-${j}`} 
              >
              <td className='conta'> &nbsp; </td>
              <td className='conta'> &nbsp; </td>
              <td className='conta'> &nbsp; </td>
            </tr>
          );
       
      }
      tableRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }
    return (
      <table className="table">
        <tbody>
          {tableRows}
        </tbody>
      </table>
    );
  };
  

  const months = [
    { name: '1월', key: 'january' },
    { name: '2월', key: 'february' },
    { name: '3월', key: 'march' },
    { name: '4월', key: 'april' },
    { name: '5월', key: 'may' },
    { name: '6월', key: 'june' },
    { name: '7월', key: 'july' },
    { name: '8월', key: 'august' },
    { name: '9월', key: 'september' },
    { name: '10월', key: 'october' },
    { name: '11월', key: 'november' },
    { name: '12월', key: 'december' },
  ];

  const names = [
    '권상원', '김도환', '권준우', '진유빈', '장현지', '권채림', '구민석', '변도일',
    '이로운', '김현지', '서주희', '전아름', '함다슬', '김효은', '우현지', '염승희',
    '김태희', '이주범'
  ];

  // 년도 변경
  const handleYearChange = (event: any) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const handleDivClick = (date: number, year: number, month: number, personIndex: number) => {
    onOpen();
    const dayOfWeekNames = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeekIndex = new Date(year, month - 1, date).getDay(); // 0(일요일)부터 시작하는 요일 인덱스
    const dayOfWeek = dayOfWeekNames[dayOfWeekIndex];
    const name = names[personIndex];
    setSelectedDateInfo({
      name: name,
      year: year,
      month: month,
      date: date,
      dayOfWeek: dayOfWeek
    });
  };


  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">근태관리</div>
        <div className="main_header">＞</div>
        <Link to={"/attendance-regist"} className="sub_header">출근부</Link>
        <Select width='120px' value={selectedYear} onChange={handleYearChange} position='absolute' top='5px' right='20px' bg='#EEEEEE'>
          <option value={2022}>2022년</option>
          <option value={2023}>2023년</option>
          <option value={2024}>2024년</option>
        </Select>
      </div>
      
      <div className="content_container">
        <Tabs variant='enclosed'>
          <TabList>
            {yearData.map(monthData => (
              <Tab key={monthData.month} _selected={{bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)'}} width='10%' bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>{months[monthData.month - 1].name}</Tab>
            ))}
          </TabList>

          <TabPanels bg='white' height='790px' border='1px solid #DEDEDE' borderBottomRadius='10px'>
            {yearData.map(monthData => (
              <TabPanel key={monthData.month} className="container_attendance">
                <div className="Excel">
                  <table className="Explan">
                    <tbody>
                      <tr>
                        <td className="TopS" colSpan={2}>부서</td>
                        <td className="TopS">성명</td>
                      </tr>
                      <tr>
                        <td rowSpan={3}>블록체인<br/>사업부</td>
                        <td rowSpan={3}>블록체인<br/>1팀</td>
                        <td>권상원</td>
                      </tr>
                      <tr>
                        <td>김도환</td>
                      </tr>
                      <tr>
                        <td>권준우</td>
                      </tr>
                      <tr>
                        <td rowSpan={6}>개발부</td>
                        <td rowSpan={4}>개발 1팀</td>
                        <td>진유빈</td>
                      </tr>
                      <tr>
                        <td>장현지</td>
                      </tr>
                      <tr>
                        <td>권채림</td>
                      </tr>
                      <tr>
                        <td>구민석</td>
                      </tr>
                      <tr>
                        <td rowSpan={2}>개발 2팀</td>
                        <td>변도일</td>
                      </tr>
                      <tr>
                        <td>이로운</td>
                      </tr>
                      <tr>
                        <td rowSpan={4}>마케팅부</td>
                        <td rowSpan={2}>디자인팀</td>
                        <td>김현지</td>
                      </tr>
                      <tr>
                        <td>서주희</td>
                      </tr>
                      <tr>
                        <td rowSpan={2}>기획팀</td>
                        <td>전아름</td>
                      </tr>
                      <tr>
                        <td>함다슬</td>
                      </tr>
                      <tr>
                        <td rowSpan={5}>관리부</td>
                        <td rowSpan={3}>관리팀</td>
                        <td>김효은</td>
                      </tr>
                      <tr>
                        <td>우현지</td>
                      </tr>
                      <tr>
                        <td>염승희</td>
                      </tr>
                      <tr>
                        <td rowSpan={2}>지원팀</td>
                        <td>김태희</td>
                      </tr>
                      <tr>
                        <td>이주범</td>
                      </tr>
                    
                    </tbody>
                  </table>
                  <div>
                    {DateDivs(monthData.numberOfDaysInMonth, monthData.firstDayOfWeek)}
                    {generateDivs(monthData.numberOfDaysInMonth, selectedYear, monthData.month)}
                  </div>
                </div>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </div>  
      <Modal isOpen={isOpen} onClose={onClose} size='lg'>
        <ModalOverlay />
        <ModalContent height='400px' bg='#D9D9D9'>
          <ModalHeader>
            <span>{selectedDateInfo.year}.</span>
            <span>{selectedDateInfo.month}.</span>
            <span>{selectedDateInfo.date}.</span>
            <span>{selectedDateInfo.dayOfWeek}</span>
            <span>{selectedDateInfo.name}</span>

          </ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize='30px' className="modal_content">
            <div className="modal_input">
              <div>출근시간 :</div>
              <Input htmlSize={4} width='auto' borderColor='black'/>
            </div>
            <div className="modal_input">
              <div>퇴근시간 :</div>
              <Input htmlSize={4} width='auto' borderColor='black'/>
            </div>
            <div className="modal_input">
              <div>기타 값 :</div>
              <Select width='200px' value={selectedYear} onChange={handleYearChange} borderColor='black'>
                <option value=''>반차</option>
                <option value=''>당일반차</option> 
                <option value=''>연차</option>
                <option value=''>재택</option>
                <option value=''>서울출근</option>
                <option value=''>입사</option>
              </Select>
            </div>
          </ModalBody>

          <ModalFooter gap='10px'>
            <button className="add_button">등록</button>
            <button className="cancle_button">취소</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AttendanceRegist;