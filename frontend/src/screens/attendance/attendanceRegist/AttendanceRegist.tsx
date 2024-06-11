import React, { useState, useEffect, useMemo } from "react";
import "./AttendanceRegist.scss";
import { Link } from "react-router-dom";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import CustomModal from "../../../components/modal/CustomModal";
import { Tooltip } from '@chakra-ui/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import AttendSkeleton from "./AttendSkeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../recoil/atoms';

import { useQuery } from "react-query";
import { CheckAttendance, WriteAttendance } from "../../../services/attendance/AttendanceServices";

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

type Member = [string, string, string];
type TeamOrderType = {
  [key: string]: string[];
};

const AttendanceRegist = () => {
  const user = useRecoilValue(userState);
  const [isLoading, setIsLoading] = useState(true);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isAddAttend, setAddAttend] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState('R&D');
  const [members, setMembers] = useState<Member[]>([]);
  const [membersRD, setMembersRD] = useState<Member[]>([]);
  const [rowsData, setRowsData] = useState<any[]>([]);
  const [rowsDataRD, setRowsDataRD] = useState<any[]>([]);
  // 모달 창 입력값
  const { register, handleSubmit, reset } = useForm();

  const initialMembers: Member[] = useMemo(() => [
    ['권상원', '블록체인 사업부', ''],
    ['김도환', '블록체인 사업부', '블록체인 1팀'],
    ['권준우', '블록체인 사업부', '블록체인 1팀'],
    ['진유빈', '개발부', ''],
    ['장현지', '개발부', '개발 1팀'],
    ['구민석', '개발부', '개발 1팀'],
    ['박세준', '개발부', '개발 1팀'],
    ['변도일', '개발부', '개발 2팀'],
    ['이로운', '개발부', '개발 2팀'],
    ['김현지', '마케팅부', ''],
    ['서주희', '마케팅부', '디자인팀'],
    ['전아름', '마케팅부', '기획팀'],
    ['함다슬', '마케팅부', '기획팀'],
    ['전규미', '마케팅부', '기획팀'],
    ['김효은', '관리부', '관리팀'],
    ['우현지', '관리부', '관리팀'],
    ['염승희', '관리부', '관리팀'],
    ['김태희', '관리부', '지원팀'],
    ['이주범', '관리부', '지원팀'],
  ], []);

  const initialMembersRD: Member[] = useMemo(() => [
    ['심민지', '알고리즘 연구실', 'AI 연구팀'],
    ['임지현', '알고리즘 연구실', 'AI 연구팀'],
    ['김희진', '알고리즘 연구실', 'AI 연구팀'],
    ['윤민지', '동형분석 연구실', '동형분석 연구팀'],
    ['이채영', '동형분석 연구실', '동형분석 연구팀'],
    ['박소연', '블록체인 연구실', 'AI 개발팀'],
    ['김경현', '블록체인 연구실', 'AI 개발팀'],
  ], []);
  
  useEffect(() => {
    const departmentOrder = ['블록체인 사업부', '개발부', '마케팅부', '관리부'];
    const teamOrder: TeamOrderType = {
      '블록체인 사업부': ['블록체인 1팀'],
      '개발부': ['개발 1팀', '개발 2팀'],
      '마케팅부': ['디자인팀', '기획팀'],
      '관리부': ['관리팀', '지원팀'],
    };

    const sortedMembers = [...initialMembers].sort((a, b) => {
      const deptAIndex = departmentOrder.indexOf(a[1]);
      const deptBIndex = departmentOrder.indexOf(b[1]);

      if (deptAIndex < deptBIndex) return -1;
      if (deptAIndex > deptBIndex) return 1;

      const teamAIndex = teamOrder[a[1]].indexOf(a[2]);
      const teamBIndex = teamOrder[b[1]].indexOf(b[2]);

      if (teamAIndex < teamBIndex) return -1;
      if (teamAIndex > teamBIndex) return 1;

      const nameA = a[0];
      const nameB = b[0];
      return nameA.localeCompare(nameB);
    });

    setMembers(sortedMembers);
  }, [initialMembers]);

  useEffect(() => {
    const groupedData = members.reduce((acc, member) => {
      const dept = member[1];
      const team = member[2];
      if (!acc[dept]) {
        acc[dept] = { rowSpan: 0, teams: {} };
      }
      acc[dept].rowSpan += 1;
      if (!acc[dept].teams[team]) {
        acc[dept].teams[team] = { rowSpan: 0, members: [] };
      }
      acc[dept].teams[team].rowSpan += 1;
      acc[dept].teams[team].members.push(member);
      return acc;
    }, {} as Record<string, { rowSpan: number; teams: Record<string, { rowSpan: number; members: Member[] }> }>);

    const rows: any[] = [];
    Object.keys(groupedData).forEach(dept => {
      const deptData = groupedData[dept];
      Object.keys(deptData.teams).forEach((team, teamIndex) => {
        const teamData = deptData.teams[team];
        teamData.members.forEach((member, memberIndex) => {
          rows.push({
            member,
            deptRowSpan: teamIndex === 0 && memberIndex === 0 ? deptData.rowSpan : 0,
            teamRowSpan: memberIndex === 0 ? teamData.rowSpan : 0
          });
        });
      });
    });
    setRowsData(rows);
  }, [members]);

  useEffect(() => {
    const departmentOrder = ['알고리즘 연구실', '동형분석 연구실', '블록체인 연구실'];

    const sortedMembers = [...initialMembersRD].sort((a, b) => {
      const deptAIndex = departmentOrder.indexOf(a[1]);
      const deptBIndex = departmentOrder.indexOf(b[1]);

      if (deptAIndex < deptBIndex) return -1;
      if (deptAIndex > deptBIndex) return 1;

      const nameA = a[2];
      const nameB = b[2];
      return nameA.localeCompare(nameB);
    });

    setMembersRD(sortedMembers);
  }, [initialMembersRD]);

  useEffect(() => {
    const groupedData = membersRD.reduce((acc, member) => {
      const dept = member[1];
      const team = member[2];
      if (!acc[dept]) {
        acc[dept] = { rowSpan: 0, teams: {} };
      }
      acc[dept].rowSpan += 1;
      if (!acc[dept].teams[team]) {
        acc[dept].teams[team] = { rowSpan: 0, members: [] };
      }
      acc[dept].teams[team].rowSpan += 1;
      acc[dept].teams[team].members.push(member);
      return acc;
    }, {} as Record<string, { rowSpan: number; teams: Record<string, { rowSpan: number; members: Member[] }> }>);

    const rows: any[] = [];
    Object.keys(groupedData).forEach(dept => {
      const deptData = groupedData[dept];
      Object.keys(deptData.teams).forEach((team, teamIndex) => {
        const teamData = deptData.teams[team];
        teamData.members.forEach((member, memberIndex) => {
          rows.push({
            member,
            deptRowSpan: teamIndex === 0 && memberIndex === 0 ? deptData.rowSpan : 0,
            teamRowSpan: memberIndex === 0 ? teamData.rowSpan : 0
          });
        });
      });
    });
    setRowsDataRD(rows);
  }, [membersRD]);
 
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
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgWidth = 297; // A4 크기에서 이미지 너비
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
  const startMonthIndex = Math.max(currentMonthIndex - 1, 1);
  // 시작 월부터 끝 월 정보
  const selectedMonths = [];
  for (let monthIndex = startMonthIndex; monthIndex <= endMonthIndex; monthIndex++) {
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

  // 출근부 데이터 조회
  const fetchAttentRegist = async () => {
    try {
      const response = await CheckAttendance();
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  };

  useQuery("attendregist", fetchAttentRegist, {
    onSuccess: (data) => console.log(data),
    onError: (error) => {
      console.log(error)
    }
  });


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

    const countWorkingDay = new Array(members.length).fill(0); // 근무일수 집계
    const countDayoff = new Array(members.length).fill(0); // 연차 집계
    const countHalfDayOff = new Array(members.length).fill(0); // 반차 집계
    const countRemoteWork = new Array(members.length).fill(0); // 재택 집계
    const countLateWork = new Array(members.length).fill(0); // 지각 집계
    const TotalLateWork = new Array(members.length).fill(0); // 지각총분 집계

    for (let i = 0; i < numberOfDaysInMonth; i++) {
      const rowCells = [];
      const date = i + 1;
      for (let j = 0; j < members.length; j++) {
        const personIndex = j;
        const dayOfWeekIndex = new Date(year, month - 1, date).getDay();
        const backgroundColor = dayOfWeekIndex === 0 || dayOfWeekIndex === 6 ? '#E9E9E9' : 'inherit';
        const pointerEvents = dayOfWeekIndex === 0 || dayOfWeekIndex === 6 ? 'none' : 'auto';

        let personData = ['', '', ['', '', '']];

        for (const data of attendanceData) {
          if (data[1] === `${year}-${month}-${date}` && data[0] === members[personIndex][0]) {
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

      for (let j = 0; j < members.length; j++) {
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

    const countWorkingDay = new Array(membersRD.length).fill(0); // 근무일수 집계
    const countDayoff = new Array(membersRD.length).fill(0); // 연차 집계
    const countHalfDayOff = new Array(membersRD.length).fill(0); // 반차 집계
    const countRemoteWork = new Array(membersRD.length).fill(0); // 재택 집계
    const countLateWork = new Array(membersRD.length).fill(0); // 지각 집계
    const TotalLateWork = new Array(membersRD.length).fill(0); // 지각총분 집계

    for (let i = 0; i < numberOfDaysInMonth; i++) {
      const rowCells = [];
      const date = i + 1;
      for (let j = 0; j < membersRD.length; j++) {
        const personIndex = j;
        const dayOfWeekIndex = new Date(year, month - 1, date).getDay();
        const backgroundColor = dayOfWeekIndex === 0 || dayOfWeekIndex === 6 ? '#E9E9E9' : 'inherit';
        const pointerEvents = dayOfWeekIndex === 0 || dayOfWeekIndex === 6 ? 'none' : 'auto';

        let personData = ['', '', ['', '', '']];

        for (const data of attendanceData) {
          if (data[1] === `${year}-${month}-${date}` && data[0] === membersRD[personIndex][0]) {
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

      for (let j = 0; j < membersRD.length; j++) {
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
    const name = members[personIndex][0];
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
    const name = membersRD[personIndex][0];
    setSelectedDateInfo({
      name: name,
      year: year,
      month: month,
      date: date,
      dayOfWeek: dayOfWeek
    });
  };


  // 출근부 데이터 작성
  const onSubmit = (data: any) => {
    setAddAttend(false);

    const formData = {
      name: selectedDateInfo.name,
      date: `${selectedDateInfo.year}-${selectedDateInfo.month}-${selectedDateInfo.date}`,
      data: [data.startTime, data.endTime, data.otherValue],
    }

    console.log(formData)
    WriteAttendance(formData)
      .then(response => {
        console.log('출근부 데이터 전송 성공')
      })
      .catch(error => {
        console.log('출근부 데이터 전송 실패')
      })
    
    reset();
  }
  console.log(rowsData)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

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
          {user.username === '이정훈' ? (
            selectedScreen === 'R&D' ? (
              <button className='rnd_company_button' onClick={handleScreenChange}>
                R&D 센터
              </button>
            ) : (
              <button className='head_company_button' onClick={handleScreenChange}>
                본사
              </button>
            )
          ) : null}
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
                    {isLoading ? (
                      <>
                        <AttendSkeleton />
                    </>
                    ) : (
                      <>
                        <table className="Explan">
                          <thead>
                            <tr>
                              <td className="TopS" colSpan={2}>부서</td>
                              <td className="TopS">성명</td>
                            </tr> 
                          </thead> 
                          <tbody>
                            {rowsData.map((row, index) => (
                              <tr key={index}>
                                {row.deptRowSpan > 0 && <td rowSpan={row.deptRowSpan}>{row.member[1]}</td>}
                                {row.teamRowSpan > 0 && <td rowSpan={row.teamRowSpan}>{row.member[2]}</td>}
                                {row.deptRowSpan > 0 && row.teamRowSpan > 0 ? 
                                  <td>{row.member[0]}</td> 
                                  : 
                                  <td>{row.member[0]}</td>}
                              </tr>))}
                          </tbody>
                        </table>
                        <div>
                          {DateDivs(monthData.numberOfDaysInMonth, monthData.firstDayOfWeek)}
                          {generateDivs(monthData.numberOfDaysInMonth, selectedYear, monthData.month, virtualData)}
                        </div>
                      </>
                    )}
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
                      <thead>
                        <tr>
                          <td className="TopS" colSpan={2}>부서</td>
                          <td className="TopS">성명</td>
                        </tr> 
                      </thead> 
                      <tbody>
                        {rowsDataRD.map((row, index) => (
                          <tr key={index}>
                            {row.deptRowSpan > 0 && <td rowSpan={row.deptRowSpan}>{row.member[1]}</td>}
                            {row.teamRowSpan > 0 && <td rowSpan={row.teamRowSpan}>{row.member[2]}</td>}
                            {row.deptRowSpan > 0 && row.teamRowSpan > 0 ? 
                              <td>{row.member[0]}</td> 
                              : 
                              <td>{row.member[0]}</td>}
                          </tr>))}
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
        onClose={() => {setAddAttend(false); reset();}} 
        header={`${selectedDateInfo.year}.${selectedDateInfo.month}.${selectedDateInfo.date}  ${selectedDateInfo.name}`}
        footer1={'등록'}
        footer1Class="back-green-btn"
        onFooter1Click={handleSubmit(onSubmit)}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => {setAddAttend(false); reset();}}
        height="230px"
      >
        <div className="modal_container">
          <div className="modal_input">
            <div className="input_title">출근시간</div>
            <input className="input_text" type="text" placeholder="00:00" {...register('startTime')}/>
          </div>
          <div className="modal_input">
            <div className="input_title">퇴근시간</div>
            <input className="input_text" type="text" placeholder="00:00" {...register('endTime')}/>
          </div>
          <div className="modal_input">
            <div className="input_title">기타 값</div>
            <select className="input_select" {...register('otherValue')}>
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