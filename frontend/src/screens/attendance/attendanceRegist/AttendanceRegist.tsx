import React, { useState } from "react";
import "./AttendanceRegist.scss";
import { Link } from "react-router-dom";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import CustomModal from "../../../components/modal/CustomModal";
import { Tooltip } from '@chakra-ui/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { AttendRegist } from "../../../services/attendance/AttendanceServices";

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
  '이로운', '김현지', '서주희', '전아름', '함다슬', '전규미', '김효은', '우현지', '염승희',
  '김태희', '이주범'
];

const namesRD = [
  '심민지', '임지현', '김희진', '윤민지', '이채영', '박소연', '김경현'
]

const AttendanceRegist = () => {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isAddAttend, setAddAttend] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState('R&D');

  // 모달 창 입력값
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [otherValue, setOtherValue] = useState('');

  const handleStartTimeChange = (e: any) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e: any) => {
    setEndTime(e.target.value);
  };

  const handleOtherValueChange = (e: any) => {
    setOtherValue(e.target.value);
  };



  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
    console.log(attachment);
};

  const handleScreenChange = () => {
    setSelectedScreen(selectedScreen === 'R&D' ? '본사' : 'R&D');
  };

  const exportToPDF = () => {
    const element = document.getElementById('table-to-xls');
    if (element) {
      element.style.height = element.scrollHeight + 'px';
      element.style.width = element.scrollWidth + 'px';
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 크기에서 이미지 너비
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // 이미지의 원래 높이에 따른 비율에 따라 조정
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('출근부.pdf');
        window.location.reload();
      });
    } else {
      console.error('Element not found');
    }
  };

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

  const currentMonthIndex = new Date().getMonth(); // 현재 월 인덱스
  
  // 시작 월과 끝 월 계산
  const endMonthIndex = Math.min(currentMonthIndex + 1, 11); // 현재 월에서 1개월 후
  
  // 시작 월부터 끝 월 정보
  const selectedMonths = [];
  for (let monthIndex = currentMonthIndex; monthIndex <= endMonthIndex; monthIndex++) {
    selectedMonths.push(months[monthIndex]);
  }
  
  // 선택된 월에 대한 yearData 생성
  const selectedYear = new Date().getFullYear();
  const yearData = selectedMonths.map(month => {
    const currentYear = selectedYear;
    const monthIndex = months.findIndex(item => item === month);
    
  // 월별 날짜 계산
  const firstDayOfMonth = new Date(currentYear, monthIndex, 1);
  const lastDayOfMonth = new Date(currentYear, monthIndex + 1, 0);

  // 월 일수 계산
  const numberOfDaysInMonth = lastDayOfMonth.getDate();

  // 첫 날 요일 계산
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // 월 정보 저장
  return {
    month: monthIndex + 1,
    numberOfDaysInMonth,
    firstDayOfWeek
    };
  });

  const DateDivs = (numberOfDaysInMonth: number, firstDayOfWeek: number) => {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const tableRows = [];
    const countTotal = ["근무일수", "휴가일수", "반차일수", "재택", "지각", "지각총분"]
    const totalRows = [];

    for (let j = 0; j < numberOfDaysInMonth; j++) {
      const dayOfWeek = daysOfWeek[(firstDayOfWeek + j) % 7];
      const backgroundColor = dayOfWeek === '토' || dayOfWeek === '일' ? '#E9E9E9' : 'inherit';
      tableRows.push(
        <tr className="dateconta" key={`${j}`} style={{ backgroundColor: backgroundColor }}>
          <td className="date">{j + 1}<br />{dayOfWeek}</td>
        </tr>
      );
    }

    for (let k = 0; k < 6; k++) {
      let backgroundColor = 'inherit'; // 기본 배경색은 inherit로 설정

      // k 값에 따라 배경색을 다르게 설정
      switch (k) {
        case 4:
          backgroundColor = '#D1E4FF';
          break;
        case 5:
          backgroundColor = '#FFD3D3';
          break;
        default:
          backgroundColor = '#ffffff'; // 기본 배경색은 #E9E9E9로 설정
          break;
      }

      totalRows.push(
        <tr className="countTotal" key={`${k}`} style={{ backgroundColor: backgroundColor }}>
          <td className="total">{countTotal[k]}</td>
        </tr>
      )
    }

    return (
      <table className="dateTable">
        <tbody>
          {tableRows}
          {totalRows}
        </tbody>
      </table>
    );
  };

  const virtualData = [
    ['권상원', '2024-4-1', ['14:00', '17:00', '오전반차']],
    ['권상원', '2024-4-2', ['10:00', '17:00', '연차']],
    ['권상원', '2024-4-3', ['10:00', '17:00', '재택']],
    ['권상원', '2024-4-4', ['10:05', '14:00', '오후반차']],
    ['권상원', '2024-4-5', ['10:30', '17:00', '']],
    ['권상원', '2024-4-8', ['10:10', '17:00', '']],
    ['권상원', '2024-4-9', ['11:20', '17:00', '']],
    ['김도환', '2024-4-1', ['10:30', '17:00', '연차']],
    ['권준우', '2024-4-4', ['10:00', '17:00', '당일반차']],
    ['진유빈', '2024-4-5', ['10:00', '17:00', '재택']],
    ['권상원', '2024-5-1', ['10:00', '17:00', '오전반차']],
    ['김도환', '2024-5-1', ['10:30', '17:00', '연차']],
    ['권준우', '2024-5-2', ['10:00', '17:00', '당일반차']],
    ['진유빈', '2024-5-2', ['10:00', '17:00', '재택']],
    ['권상원', '2024-5-3', ['10:00', '17:00', '오후반차']],
    ['김도환', '2024-5-3', ['10:30', '17:00', '연차']],
    ['권준우', '2024-5-3', ['10:00', '17:00', '당일반차']],
    ['진유빈', '2024-5-3', ['10:00', '17:00', '재택']],
  ];

  const generateDivs = (numberOfDaysInMonth: number, year: number, month: number, attendanceData: any[]) => {
    const tableRows = [];
    const totalRows = [];

    const countWorkingDay = new Array(names.length).fill(0); // 근무일수 집계
    const countDayoff = new Array(names.length).fill(0); // 연차 집계
    const countHalfDayOff = new Array(names.length).fill(0); // 반차 집계
    const countRemoteWork = new Array(names.length).fill(0); // 재택 집계
    const countLateWork = new Array(names.length).fill(0); // 지각 집계
    const TotalLateWork = new Array(names.length).fill(0); // 지각총분 집계

    for (let i = 0; i < numberOfDaysInMonth; i++) {
      const rowCells = [];
      const date = i + 1;
      for (let j = 0; j < names.length; j++) {
        const personIndex = j;
        const dayOfWeekIndex = new Date(year, month - 1, date).getDay();
        const backgroundColor = dayOfWeekIndex === 0 || dayOfWeekIndex === 6 ? '#E9E9E9' : 'inherit';
        const pointerEvents = dayOfWeekIndex === 0 || dayOfWeekIndex === 6 ? 'none' : 'auto';

        let personData = ['', '', ['', '', '']];

        for (const data of attendanceData) {
          if (data[1] === `${year}-${month}-${date}` && data[0] === names[personIndex]) {
            personData = data;
            break;
          }
        }
        

        if (personData[2][0]) {
          countWorkingDay[j]++;
        }

        let itemBackgroundColor = '#000000';

        switch (personData[2][2]) {
          case '오전반차':
            countHalfDayOff[j]++;
            if (personData[2][0] > '14:00') {
              countLateWork[j]++
    
              const attendTime = new Date(`2000-01-01T${personData[2][0]}`);
    
              const standardTime = new Date(`2000-01-01T14:00`);
              const lateMinutes = attendTime > standardTime ? (attendTime.getHours() - 14) * 60 + attendTime.getMinutes() : 0;
    
              TotalLateWork[j] += lateMinutes;
            }
            itemBackgroundColor = '#FFB800';
            break;
          case '오후반차':
            countHalfDayOff[j]++;
            if (personData[2][0] > '10:00') {
              countLateWork[j]++
    
              const attendTime = new Date(`2000-01-01T${personData[2][0]}`);
    
              const standardTime = new Date(`2000-01-01T10:00`);
              const lateMinutes = attendTime > standardTime ? (attendTime.getHours() - 10) * 60 + attendTime.getMinutes() : 0;
    
              TotalLateWork[j] += lateMinutes;
            }
            itemBackgroundColor = '#FFB800';
            break;
          case '당일반차':
            countHalfDayOff[j]++;
            itemBackgroundColor = '#5162FF';
            break;
          case '연차':
            countDayoff[j]++;
            itemBackgroundColor = '#0D994D';
            break;
          case '재택':
            countRemoteWork[j]++;
            if (personData[2][0] > '10:00') {
              countLateWork[j]++
    
              const attendTime = new Date(`2000-01-01T${personData[2][0]}`);
    
              const standardTime = new Date(`2000-01-01T10:00`);
              const lateMinutes = attendTime > standardTime ? (attendTime.getHours() - 10) * 60 + attendTime.getMinutes() : 0;
    
              TotalLateWork[j] += lateMinutes;
            }
            itemBackgroundColor = '#7000C9';
            break;
          case '서울출근':
            itemBackgroundColor = '#3DC6C6';
            break;
          case '입사':
            itemBackgroundColor = '#FF4747';
            break;
          case '지문X':
            itemBackgroundColor = '#EF0AD8';
            break;
          default:
            if (personData[2][0] > '10:00') {
              countLateWork[j]++
    
              const attendTime = new Date(`2000-01-01T${personData[2][0]}`);
    
              const standardTime = new Date(`2000-01-01T10:00`);
              const lateMinutes = attendTime > standardTime ? (attendTime.getHours() - 10) * 60 + attendTime.getMinutes() : 0;
    
              TotalLateWork[j] += lateMinutes;
            }
            itemBackgroundColor = '#000000';
            break;
        }

        // 토요일 또는 일요일이 아닌 경우
        if (dayOfWeekIndex !== 0 && dayOfWeekIndex !== 6) {
          rowCells.push(
            <Tooltip label={`${month}월 ${date}일`}>
              <tr
                className="conta_three"
                onClick={() => handleDivClick(date, year, month, personIndex)}
                key={`${i}-${j}`}
              >
                <td className='conta'>{personData[2][0]} </td>
                <td className='conta_border'>{personData[2][1]} </td>
                <td className='conta' style={{ color: itemBackgroundColor }}>{personData[2][2]} </td>
              </tr>
            </Tooltip>
          );
        } else {
          // 토요일과 일요일에는 빈 셀
          rowCells.push(
            <tr
              className="conta_three"
              key={`${i}-${j}`}
              style={{ backgroundColor: backgroundColor, pointerEvents: pointerEvents }}
            >
              <td className='conta'> &nbsp; </td>
              <td className='conta_border'> &nbsp; </td>
              <td className='conta'> &nbsp; </td>
            </tr>
          );
        }
      }
      tableRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    for (let i = 0; i < 6; i++) {
      const rowCells = [];

      let backgroundColor = 'inherit'; // 기본 배경색은 inherit로 설정

      // k 값에 따라 배경색을 다르게 설정
      switch (i) {
        case 4:
          backgroundColor = '#D1E4FF';
          break;
        case 5:
          backgroundColor = '#FFD3D3';
          break;
        default:
          backgroundColor = '#ffffff'; // 기본 배경색은 #E9E9E9로 설정
          break;
      }

      for (let j = 0; j < names.length; j++) {
        if (i === 0) {
          rowCells.push(
            <tr
              className="conta_three"
              key={`${i}-${j}`}
              style={{ backgroundColor: backgroundColor }}
            >
              <td className='conta_merge'>
                {countWorkingDay[j]}
              </td>
            </tr>
          );
        } else if (i === 1) {
          rowCells.push(
            <tr
              className="conta_three"
              key={`${i}-${j}`}
              style={{ backgroundColor: backgroundColor }}
            >
              <td className='conta_merge'>
                {countDayoff[j]}
              </td>
            </tr>
          );
        } else if (i === 2) {
          rowCells.push(
            <tr
              className="conta_three"
              key={`${i}-${j}`}
              style={{ backgroundColor: backgroundColor }}
            >
              <td className='conta_merge'>
                {countHalfDayOff[j]}
              </td>
            </tr>
          );
        } else if (i === 3) {
          rowCells.push(
            <tr
              className="conta_three"
              key={`${i}-${j}`}
              style={{ backgroundColor: backgroundColor }}
            >
              <td className='conta_merge'>
                {countRemoteWork[j]}
              </td>
            </tr>
          );
        } else if (i === 4) {
          rowCells.push(
            <tr
              className="conta_three"
              key={`${i}-${j}`}
              style={{ backgroundColor: backgroundColor }}
            >
              <td className='conta_merge'>
                {countLateWork[j]}
              </td>
            </tr>
          );
        } else {
          rowCells.push(
            <tr
              className="conta_three"
              key={`${i}-${j}`}
              style={{ backgroundColor: backgroundColor }}
            >
              <td className='conta_merge'>
                {TotalLateWork[j]}
              </td>
            </tr>
          );
        }
      }
      totalRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    return (
      <table className="table">
        <tbody>
          {tableRows}
          {totalRows}
        </tbody>
      </table>
    );
  };

  const generateDivsRD = (numberOfDaysInMonth: number, year: number, month: number, attendanceData: any[]) => {
    const tableRows = [];
    const totalRows = [];

    const countWorkingDay = new Array(names.length).fill(0); // 근무일수 집계
    const countDayoff = new Array(names.length).fill(0); // 연차 집계
    const countHalfDayOff = new Array(names.length).fill(0); // 반차 집계
    const countRemoteWork = new Array(names.length).fill(0); // 재택 집계
    const countLateWork = new Array(names.length).fill(0); // 지각 집계
    const TotalLateWork = new Array(names.length).fill(0); // 지각총분 집계

    for (let i = 0; i < numberOfDaysInMonth; i++) {
      const rowCells = [];
      const date = i + 1;
      for (let j = 0; j < namesRD.length; j++) {
        const personIndex = j;
        const dayOfWeekIndex = new Date(year, month - 1, date).getDay();
        const backgroundColor = dayOfWeekIndex === 0 || dayOfWeekIndex === 6 ? '#E9E9E9' : 'inherit';
        const pointerEvents = dayOfWeekIndex === 0 || dayOfWeekIndex === 6 ? 'none' : 'auto';

        let personData = ['', '', ['', '', '']];

        for (const data of attendanceData) {
          if (data[1] === `${year}-${month}-${date}` && data[0] === namesRD[personIndex]) {
            personData = data;
            break;
          }
        }
        

        if (personData[2][0]) {
          countWorkingDay[j]++;
        }

        let itemBackgroundColor = '#000000';

        switch (personData[2][2]) {
          case '오전반차':
            countHalfDayOff[j]++;
            if (personData[2][0] > '14:00') {
              countLateWork[j]++
    
              const attendTime = new Date(`2000-01-01T${personData[2][0]}`);
    
              const standardTime = new Date(`2000-01-01T14:00`);
              const lateMinutes = attendTime > standardTime ? (attendTime.getHours() - 14) * 60 + attendTime.getMinutes() : 0;
    
              TotalLateWork[j] += lateMinutes;
            }
            itemBackgroundColor = '#FFB800';
            break;
          case '오후반차':
            countHalfDayOff[j]++;
            if (personData[2][0] > '10:00') {
              countLateWork[j]++
    
              const attendTime = new Date(`2000-01-01T${personData[2][0]}`);
    
              const standardTime = new Date(`2000-01-01T10:00`);
              const lateMinutes = attendTime > standardTime ? (attendTime.getHours() - 10) * 60 + attendTime.getMinutes() : 0;
    
              TotalLateWork[j] += lateMinutes;
            }
            itemBackgroundColor = '#FFB800';
            break;
          case '당일반차':
            countHalfDayOff[j]++;
            itemBackgroundColor = '#5162FF';
            break;
          case '연차':
            countDayoff[j]++;
            itemBackgroundColor = '#0D994D';
            break;
          case '재택':
            countRemoteWork[j]++;
            if (personData[2][0] > '10:00') {
              countLateWork[j]++
    
              const attendTime = new Date(`2000-01-01T${personData[2][0]}`);
    
              const standardTime = new Date(`2000-01-01T10:00`);
              const lateMinutes = attendTime > standardTime ? (attendTime.getHours() - 10) * 60 + attendTime.getMinutes() : 0;
    
              TotalLateWork[j] += lateMinutes;
            }
            itemBackgroundColor = '#7000C9';
            break;
          case '서울출근':
            itemBackgroundColor = '#3DC6C6';
            break;
          case '입사':
            itemBackgroundColor = '#FF4747';
            break;
          case '지문X':
            itemBackgroundColor = '#EF0AD8';
            break;
          default:
            if (personData[2][0] > '10:00') {
              countLateWork[j]++
    
              const attendTime = new Date(`2000-01-01T${personData[2][0]}`);
    
              const standardTime = new Date(`2000-01-01T10:00`);
              const lateMinutes = attendTime > standardTime ? (attendTime.getHours() - 10) * 60 + attendTime.getMinutes() : 0;
    
              TotalLateWork[j] += lateMinutes;
            }
            itemBackgroundColor = '#000000';
            break;
        }

        // 토요일 또는 일요일이 아닌 경우
        if (dayOfWeekIndex !== 0 && dayOfWeekIndex !== 6) {
          rowCells.push(
            <Tooltip label={`${month}월 ${date}일`}>
              <tr
                className="conta_three"
                onClick={() => handleDivClickRD(date, year, month, personIndex)}
                key={`${i}-${j}`}
              >
                <td className='conta'>{personData[2][0]} </td>
                <td className='conta_border'>{personData[2][1]} </td>
                <td className='conta' style={{ color: itemBackgroundColor }}>{personData[2][2]} </td>
              </tr>
            </Tooltip>
          );
        } else {
          // 토요일과 일요일에는 빈 셀
          rowCells.push(
            <tr
              className="conta_three"
              key={`${i}-${j}`}
              style={{ backgroundColor: backgroundColor, pointerEvents: pointerEvents }}
            >
              <td className='conta'> &nbsp; </td>
              <td className='conta_border'> &nbsp; </td>
              <td className='conta'> &nbsp; </td>
            </tr>
          );
        }
      }
      tableRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    for (let i = 0; i < 6; i++) {
      const rowCells = [];

      let backgroundColor = 'inherit'; // 기본 배경색은 inherit로 설정

      // k 값에 따라 배경색을 다르게 설정
      switch (i) {
        case 4:
          backgroundColor = '#D1E4FF';
          break;
        case 5:
          backgroundColor = '#FFD3D3';
          break;
        default:
          backgroundColor = '#ffffff'; // 기본 배경색은 #E9E9E9로 설정
          break;
      }

      for (let j = 0; j < namesRD.length; j++) {
        if (i === 0) {
          rowCells.push(
            <tr
              className="conta_three"
              key={`${i}-${j}`}
              style={{ backgroundColor: backgroundColor }}
            >
              <td className='conta_merge'>
                {countWorkingDay[j]}
              </td>
            </tr>
          );
        } else if (i === 1) {
          rowCells.push(
            <tr
              className="conta_three"
              key={`${i}-${j}`}
              style={{ backgroundColor: backgroundColor }}
            >
              <td className='conta_merge'>
                {countDayoff[j]}
              </td>
            </tr>
          );
        } else if (i === 2) {
          rowCells.push(
            <tr
              className="conta_three"
              key={`${i}-${j}`}
              style={{ backgroundColor: backgroundColor }}
            >
              <td className='conta_merge'>
                {countHalfDayOff[j]}
              </td>
            </tr>
          );
        } else if (i === 3) {
          rowCells.push(
            <tr
              className="conta_three"
              key={`${i}-${j}`}
              style={{ backgroundColor: backgroundColor }}
            >
              <td className='conta_merge'>
                {countRemoteWork[j]}
              </td>
            </tr>
          );
        } else if (i === 4) {
          rowCells.push(
            <tr
              className="conta_three"
              key={`${i}-${j}`}
              style={{ backgroundColor: backgroundColor }}
            >
              <td className='conta_merge'>
                {countLateWork[j]}
              </td>
            </tr>
          );
        } else {
          rowCells.push(
            <tr
              className="conta_three"
              key={`${i}-${j}`}
              style={{ backgroundColor: backgroundColor }}
            >
              <td className='conta_merge'>
                {TotalLateWork[j]}
              </td>
            </tr>
          );
        }
      }
      totalRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    return (
      <table className="table">
        <tbody>
          {tableRows}
          {totalRows}
        </tbody>
      </table>
    );
  };

  const handleDivClick = (date: number, year: number, month: number, personIndex: number) => {
    setAddAttend(true);
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

  const handleDivClickRD = (date: number, year: number, month: number, personIndex: number) => {
    setAddAttend(true);
    const dayOfWeekNames = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeekIndex = new Date(year, month - 1, date).getDay(); // 0(일요일)부터 시작하는 요일 인덱스
    const dayOfWeek = dayOfWeekNames[dayOfWeekIndex];
    const name = namesRD[personIndex];
    setSelectedDateInfo({
      name: name,
      year: year,
      month: month,
      date: date,
      dayOfWeek: dayOfWeek
    });
  };


  // 출근부 데이터 전송 - 모달
  const handleSubmit = () => {
    setAddAttend(false);

    const formData = {
      name: selectedDateInfo.name,
      date: `${selectedDateInfo.year}-${selectedDateInfo.month}-${selectedDateInfo.date}`,
      data: [startTime, endTime, otherValue],
    }

    console.log(formData)
    AttendRegist(formData)
      .then(response => {
        console.log('출근부 데이터 전송 성공')
      })
      .catch(error => {
        console.log('출근부 데이터 전송 실패')
      })
    
    setStartTime('');
    setEndTime('');
    setOtherValue('');
  }

  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">근태관리</div>
        <div className="main_header">＞</div>
        <Link to={"/attendance-regist"} className="sub_header">출근부</Link>
      </div>

      <div className="content_container">
        <div className='attend_header_right'>
          <button className='attend_download_button' onClick={exportToPDF}>다운로드</button>
          <button className='attend_upload_button'>
            <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
              업로드
              <input
                id="fileInput"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </label>
          </button>
          {selectedScreen === 'R&D' ? (
            <button className='rnd_company_button' onClick={handleScreenChange}>
              R&D 센터
            </button>
          ) : (
            <button className='head_company_button' onClick={handleScreenChange}>
              본사
            </button>
          )}
        </div>

        {selectedScreen === 'R&D' ? (
          <Tabs variant='enclosed'>
            <TabList>
              {yearData.map(monthData => (
                <Tab className="TabKey" key={monthData.month} _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#EEEEEE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' >{months[monthData.month - 1].name}</Tab>
              ))}
            </TabList>

            <TabPanels bg='white' border='1px solid #DEDEDE' borderBottomRadius='10px' className="tab_container">
              {yearData.map(monthData => (
                <TabPanel key={monthData.month} className="container_attendance">
                  <div className="Excel" id="table-to-xls">
                    <table className="Explan">
                      <tbody>
                        <tr>
                          <td className="TopS" colSpan={2}>부서</td>
                          <td className="TopS">성명</td>
                        </tr>
                        <tr>
                          <td rowSpan={3}>블록체인<br />사업부</td>
                          <td rowSpan={3}>블록체인<br />1팀</td>
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
                          <td rowSpan={5}>마케팅부</td>
                          <td rowSpan={2}>디자인팀</td>
                          <td>김현지</td>
                        </tr>
                        <tr>
                          <td>서주희</td>
                        </tr>
                        <tr>
                          <td rowSpan={3}>기획팀</td>
                          <td>전아름</td>
                        </tr>
                        <tr>
                          <td>함다슬</td>
                        </tr>
                        <tr>
                          <td>전규미</td>
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
                      {generateDivs(monthData.numberOfDaysInMonth, selectedYear, monthData.month, virtualData)}
                    </div>
                  </div>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        ) : (
          <Tabs variant='enclosed'>
            <TabList>
              {yearData.map(monthData => (
                <Tab className="TabKey" key={monthData.month} _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#EEEEEE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' >{months[monthData.month - 1].name}</Tab>
              ))}
            </TabList>

            <TabPanels bg='white' border='1px solid #DEDEDE' borderBottomRadius='10px' className="tab_container">
              {yearData.map(monthData => (
                <TabPanel key={monthData.month} className="container_attendance">
                  <div className="Excel_RD" id="table-to-xls">
                    <table className="Explan_RD">
                      <tbody>
                        <tr>
                          <td className="TopS" colSpan={2}>부서</td>
                          <td className="TopS">성명</td>
                        </tr>
                        <tr>
                          <td rowSpan={3}>알고리즘<br />연구실</td>
                          <td rowSpan={3}>AI<br />연구팀</td>
                          <td>심민지</td>
                        </tr>
                        <tr>
                          <td>임지현</td>
                        </tr>
                        <tr>
                          <td>김희진</td>
                        </tr>
                        <tr>
                          <td rowSpan={2}>동형분석<br />연구실</td>
                          <td rowSpan={2}>동형분석<br />연구팀</td>
                          <td>윤민지</td>
                        </tr>
                        <tr>
                          <td>이채영</td>
                        </tr>
                        <tr>
                          <td rowSpan={2}>블록체인<br />연구실</td>
                          <td rowSpan={2}>AI<br />개발팀</td>
                          <td>박소연</td>
                        </tr>
                        <tr>
                          <td>김경현</td>
                        </tr>
                      </tbody>
                    </table>
                    <div>
                      {DateDivs(monthData.numberOfDaysInMonth, monthData.firstDayOfWeek)}
                      {generateDivsRD(monthData.numberOfDaysInMonth, selectedYear, monthData.month, virtualData)}
                    </div>
                  </div>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        )}
        
      </div>
      <CustomModal
        isOpen={isAddAttend}
        onClose={() => setAddAttend(false)} 
        header={`${selectedDateInfo.year}.${selectedDateInfo.month}.${selectedDateInfo.date}  ${selectedDateInfo.name}`}
        footer1={'등록'}
        footer1Class="back-green-btn"
        onFooter1Click={handleSubmit}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => {setAddAttend(false); setStartTime(''); setEndTime(''); setOtherValue('');}}
        height="230px"
      >
        <div className="modal_container">
          <div className="modal_input">
            <div className="input_title">출근시간</div>
            <input className="input_text" type="text" placeholder="00:00" value={startTime} onChange={handleStartTimeChange}/>
          </div>
          <div className="modal_input">
            <div className="input_title">퇴근시간</div>
            <input className="input_text" type="text" placeholder="00:00" value={endTime} onChange={handleEndTimeChange}/>
          </div>
          <div className="modal_input">
            <div className="input_title">기타 값</div>
            <select className="input_select" value={otherValue} onChange={handleOtherValueChange}>
              <option value=''>선택안함(비워두기)</option>
              <option value='오전반차' style={{ color: '#FFB800' }}>오전반차</option>
              <option value='오후반차' style={{ color: '#FFB800' }}>오후반차</option>
              <option value='무급휴가' style={{ color: '#5162FF' }}>무급휴가</option> 
              <option value='연차' style={{ color: '#0D994D' }}>연차</option>
              <option value='재택' style={{ color: '#7000C9' }}>재택</option>
              <option value='서울출근' style={{ color: '#3DC6C6' }}>서울출근</option>
              <option value='입사' style={{ color: '#FF4747' }}>입사</option>
              <option value='지문X' style={{ color: '#EF0AD8' }}>지문X</option>
            </select>
          </div>
        </div>
      </CustomModal>

      
    </div>
  );
};

export default AttendanceRegist;