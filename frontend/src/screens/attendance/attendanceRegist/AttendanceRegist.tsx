import React, { useState, useEffect } from "react";
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
import { useLocation } from 'react-router-dom';

import { useQuery, useQueryClient } from "react-query";
import { CheckAttendance, WriteAttendance, EditAttendance } from "../../../services/attendance/AttendanceServices";
import { PersonData } from '../../../services/person/PersonServices';

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

type Member = [string, string, string, string];
type TeamOrderType = {
  [key: string]: string[];
};
type ProcessedAttendance = [string, string, [string, string, string]];

const AttendanceRegist = () => {
  const user = useRecoilValue(userState);
  const location = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState((new Date().getMonth() + 1) % 3);
  const [tabHeights, setTabHeights] = useState<Record<number, string>>({0: '41px', 1: '35px', 2: '35px'});
  const [tabMargins, setTabMargins] = useState<Record<number, string>>({0: '6px', 1: '6px', 2: '6px'});
  const [isLoading, setIsLoading] = useState(true);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isAddAttend, setAddAttend] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState('R&D');
  const [members, setMembers] = useState<Member[]>([]);
  const [membersRD, setMembersRD] = useState<Member[]>([]);
  const [rowsData, setRowsData] = useState<any[]>([]);
  const [rowsDataRD, setRowsDataRD] = useState<any[]>([]);
  const [HO_Data, setHO_Data] = useState<ProcessedAttendance[]>([]);
  const [clickIdx, setClickIdx] = useState<number | null>(null);
  const [explanHeight, setExplanHeight] = useState<number>(0);
  const [explanRDHeight, setExplanRDHeight] = useState<number>(0);
  // 모달 창 입력값
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (activeTab === 0) {
      setTabHeights({0: '41px', 1: '35px', 2: '35px'});
      setTabMargins({0: '0px', 1: '6px', 2: '6px'});
    } else if (activeTab === 1){
      setTabHeights({0: '35px', 1: '41px', 2: '35px'});
      setTabMargins({0: '6px', 1: '0px', 2: '6px'});
    } else {
      setTabHeights({0: '35px', 1: '35px', 2: '41px'});
      setTabMargins({0: '6px', 1: '6px', 2: '0px'});
    }
  }, [activeTab]);

  const fetchUser = async () => {
    try {
      const response = await PersonData();
      const userMap = new Map();
      response.data.forEach((user: any) => {
        userMap.set(user.username, user.userId);
      });
      return {
        users: response.data,
        userMap
      };
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  };

  useQuery("Users", fetchUser, {
    onSuccess: (data) => {
      const HO_Data = data.users.filter((item: any) => item.company === "본사").map((user: any) => [
        user.username, user.department, user.team || '', user.entering
      ]);

      const RnD_Data = data.users.filter((item: any) => item.company === "R&D").map((user: any) => [
        user.username, user.department, user.team || '', user.entering
      ]);

      setMembers(HO_Data);
      setMembersRD(RnD_Data);
    },
    onError: (error) => {
      console.error(error);
    }
  });
  
  useEffect(() => {
    const departmentOrder = ['개발부', '마케팅부', '관리부'];
    const teamOrder: TeamOrderType = {
      '개발부': ['개발 1팀', '개발 2팀'],
      '마케팅부': ['디자인팀', '기획팀'],
      '관리부': ['관리팀', '지원팀'],
    };

    const sortedMembers = [...members].sort((a, b) => {
      const deptAIndex = departmentOrder.indexOf(a[1]);
      const deptBIndex = departmentOrder.indexOf(b[1]);

      if (deptAIndex < deptBIndex) return -1;
      if (deptAIndex > deptBIndex) return 1;

      const teamAIndex = teamOrder[a[1]].indexOf(a[2]);
      const teamBIndex = teamOrder[a[1]].indexOf(b[2]);

      if (teamAIndex < teamBIndex) return -1;
      if (teamAIndex > teamBIndex) return 1;

      const enteringDateA = new Date(a[3]);
      const enteringDateB = new Date(b[3]);

      if (enteringDateA < enteringDateB) return -1;
      if (enteringDateA > enteringDateB) return 1;

      const nameA = a[0];
      const nameB = b[0];
      return nameA.localeCompare(nameB);
    });

    if (JSON.stringify(members) !== JSON.stringify(sortedMembers)) {
      setMembers(sortedMembers);
    }
  }, [members]);

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

    const sortedMembers = [...membersRD].sort((a, b) => {
      const deptAIndex = departmentOrder.indexOf(a[1]);
      const deptBIndex = departmentOrder.indexOf(b[1]);

      if (deptAIndex < deptBIndex) return -1;
      if (deptAIndex > deptBIndex) return 1;

      const enteringDateA = new Date(a[3]);
      const enteringDateB = new Date(b[3]);

      if (enteringDateA < enteringDateB) return -1;
      if (enteringDateA > enteringDateB) return 1;

      const nameA = a[0];
      const nameB = b[0];
      return nameA.localeCompare(nameB);
    });

    if (JSON.stringify(membersRD) !== JSON.stringify(sortedMembers)) {
      setMembersRD(sortedMembers);
    }
  }, [membersRD]);

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

  useEffect(() => {
    const height = 40 + 92.2 * members.length;
    const heightRD = 40 + 92.3 * membersRD.length;
    setExplanHeight(height);
    setExplanRDHeight(heightRD);
  }, [members, membersRD]);
 
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const handleFileSubmit = async (event: any) => {
    console.log('보낸 파일', attachment)
    event.preventDefault();

    if (!attachment) {
      alert('선택된 파일이 없습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('handleFileSubmit', attachment);

    try {
      const response = await WriteAttendance(formData);
      setAttachment(null);
      queryClient.invalidateQueries("attendregist");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }

  };

  const handleScreenChange = () => {
    setSelectedScreen(selectedScreen === 'R&D' ? '본사' : 'R&D');
  };

  const exportToPDF = () => {
    const activePanel = document.querySelector(`#panel-${activeTab}`) as HTMLElement | null;
    if (activePanel) {
      activePanel.style.height = activePanel.scrollHeight + 'px';
      activePanel.style.width = activePanel.scrollWidth + 'px';
      html2canvas(activePanel).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgWidth = 297; // A4 크기에서 이미지 너비
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // 이미지의 원래 높이에 따른 비율에 따라 조정
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('출근부.pdf');
      });
    } else {
      console.error('Active panel not found');
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };

  // 데이터를 원하는 형식으로 변환하는 함수
  const transformData = (data: any) => {
    return data.map((item: any) => [
      item.username,
      formatDate(item.Date),
      item.DataList,
      item.id
    ]);
  };

  useQuery("attendregist", fetchAttentRegist, {
    onSuccess: (data) => {
      const result = transformData(data);
      setHO_Data(result);
    },
    onError: (error) => {
      console.log(error);
    }
  });
  

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
            if (personData[2][0] > '14:01') {
              countLateWork[j]++
    
              const attendTime = new Date(`2000-01-01T${personData[2][0]}`);
    
              const standardTime = new Date(`2000-01-01T14:01`);
              const lateMinutes = attendTime > standardTime ? (attendTime.getHours() - 14) * 60 + attendTime.getMinutes() : 0;
    
              TotalLateWork[j] += lateMinutes;
            }
            itemBackgroundColor = '#FFB800';
            break;
          case '오후반차':
            countHalfDayOff[j]++;
            if (personData[2][0] > '10:01') {
              countLateWork[j]++
    
              const attendTime = new Date(`2000-01-01T${personData[2][0]}`);
    
              const standardTime = new Date(`2000-01-01T10:01`);
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
            if (personData[2][0] > '10:01') {
              countLateWork[j]++
    
              const attendTime = new Date(`2000-01-01T${personData[2][0]}`);
    
              const standardTime = new Date(`2000-01-01T10:01`);
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
          case '경조사':
            itemBackgroundColor = '#FF4747';
            break;
          case '워크숍':
            itemBackgroundColor = '#FF4747';
            break;
          case '출장':
            itemBackgroundColor = '#FF4747';
            break;
          case '지문X':
            itemBackgroundColor = '#EF0AD8';
            break;
          case '기타':
            itemBackgroundColor = '#EF0AD8';
            break;
          default:
            if (personData[2][0] > '10:01') {
              countLateWork[j]++
    
              const attendTime = new Date(`2000-01-01T${personData[2][0]}`);
    
              const standardTime = new Date(`2000-01-01T10:01`);
              const lateMinutes = attendTime > standardTime ? (attendTime.getHours() - 10) * 60 + attendTime.getMinutes() : 0;
    
              TotalLateWork[j] += lateMinutes;
            }
            itemBackgroundColor = '#000000';
            break;
        }

        // 토요일 또는 일요일이 아닌 경우
        if (dayOfWeekIndex !== 0 && dayOfWeekIndex !== 6) {
          const startTime = personData[2][0] || '';
          const endTime = personData[2][1] || '';
          rowCells.push(
            <Tooltip label={`${month}월 ${date}일`}>
              <tr
                className="conta_three"
                onClick={() => handleDivClick(date, year, month, personIndex, personData[3])}
                key={`${i}-${j}`}
              >
                <td className='conta'>{startTime.slice(0, 5)} </td>
                <td className='conta_border'>{endTime.slice(0, 5)} </td>
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
          const startTime = personData[2][0] || '';
          const endTime = personData[2][1] || '';
          rowCells.push(
            <Tooltip label={`${month}월 ${date}일`}>
              <tr
                className="conta_three"
                onClick={() => handleDivClickRD(date, year, month, personIndex)}
                key={`${i}-${j}`}
              >
                <td className='conta'>{startTime.slice(0, 5)} </td>
                <td className='conta_border'>{endTime.slice(0, 5)} </td>
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

  const handleDivClick = (date: number, year: number, month: number, personIndex: number, dbindex: any) => {
    setAddAttend(true);
    setClickIdx(dbindex);
    const dayOfWeekNames = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeekIndex = new Date(year, month - 1, date).getDay(); // 0(일요일)부터 시작하는 요일 인덱스
    const dayOfWeek = dayOfWeekNames[dayOfWeekIndex];
    const name = members[personIndex][0];
    const personData = HO_Data.find(data => data[0] === name && data[1] === `${year}-${month}-${date}`);
    
    if (personData) {
      setValue('startTime', personData[2][0]);
      setValue('endTime', personData[2][1]);
      setValue('otherValue', personData[2][2]);
    } else {
      reset(); // 새로운 데이터를 입력할 때는 초기화
    }
  
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


  // 출근부 데이터 수정
const onSubmit = (data: any) => {
  setAddAttend(false);

  const formatDateString = (dateString: any) => {
    const [year, month, day] = dateString.split('-').map(Number);
    
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
  
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const originalDate = formatDateString(`${selectedDateInfo.year}-${selectedDateInfo.month}-${selectedDateInfo.date}`);
  const formData = {
    username: selectedDateInfo.name,
    Date: originalDate,
    data: [data.startTime, data.endTime, data.otherValue],
  };

  EditAttendance(clickIdx, formData)
    .then(response => {
      console.log("출근부 데이터 수정 성공", response);
      queryClient.invalidateQueries("attendregist");
    })
    .catch(error => {
      console.log("출근부 데이터 수정 실패", error);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10);

    return () => {clearTimeout(timer); setIsLoading(true)};
  }, [location.pathname]);

  return (
    <div className="content">
      <div className="content_container">
        <div className='attend_header_right'>
          <button className='white_button' onClick={exportToPDF}>다운로드</button>
          {attachment ? (
            <button className='primary_button' onClick={handleFileSubmit}>등록</button>
          ) : (
            <button className='primary_button'>
                <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                  업로드
                  <input
                    id="fileInput"
                    type="file"
                    name="handleFileSubmit"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </label>
            </button>
          )}
          {user.username === '이정훈' ? (
            selectedScreen === 'R&D' ? (
              <button className='primary_button' onClick={handleScreenChange}>
                R&D 센터
              </button>
            ) : (
              <button className='primary_button' onClick={handleScreenChange}>
                본사
              </button>
            )
          ) : null}
        </div>

        {user.company === '본사' || selectedScreen !== 'R&D' ? (
          <Tabs variant='enclosed' index={activeTab} onChange={(index) => setActiveTab(index)}>
            <TabList>
              {yearData.map((monthData, index) => (
                <Tab className="TabKey" key={monthData.month} _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#EEEEEE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[index]} marginTop={tabMargins[index]}>{months[monthData.month - 1].name}</Tab>
              ))}
            </TabList>

            <TabPanels bg='white' border='1px solid #DEDEDE' borderBottomRadius='10px' className="attend_tab_container">
              {yearData.map((monthData, index) => (
                <TabPanel id={`panel-${index}`} key={monthData.month} className="container_attendance">
                  <div className="Excel" id={`panel-${index}`}>
                    {isLoading ? (
                      <>
                        <AttendSkeleton />
                    </>
                    ) : (
                      <>
                        <table className="Explan" style={{ height: `${explanHeight}px` }}>
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
                          {generateDivs(monthData.numberOfDaysInMonth, selectedYear, monthData.month, HO_Data)}
                        </div>
                      </>
                    )}
                  </div>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        ) : (
          <Tabs variant='enclosed' index={activeTab} onChange={(index) => setActiveTab(index)}>
            <TabList>
              {yearData.map((monthData, index) => (
                <Tab className="TabKey" key={monthData.month} _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#EEEEEE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[index]} marginTop={tabMargins[index]}>{months[monthData.month - 1].name}</Tab>
              ))}
            </TabList>

            <TabPanels bg='white' border='1px solid #DEDEDE' borderBottomRadius='10px' className="attend_tab_container">
              {yearData.map((monthData, index) => (
                <TabPanel id={`panel-${index}`} key={monthData.month} className="container_attendance">
                  <div className="Excel_RD" id={`panel-${index}`}>
                    <table className="Explan_RD" style={{ height: `${explanRDHeight}px` }}>
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
                      {generateDivsRD(monthData.numberOfDaysInMonth, selectedYear, monthData.month, HO_Data)}
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
              <option value='경조사' style={{ color: '#FF4747' }}>경조사</option>
              <option value='워크숍' style={{ color: '#FF4747' }}>워크숍</option>
              <option value='출장' style={{ color: '#FF4747' }}>출장</option>
              <option value='지문X' style={{ color: '#EF0AD8' }}>지문X</option>
              <option value='기타' style={{ color: '#EF0AD8' }}>기타</option>
            </select>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default AttendanceRegist;