import React, { useState, useEffect, useMemo } from 'react';
import { Link } from "react-router-dom";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../recoil/atoms';

import { useQuery } from 'react-query';
import { CheckAnnual } from '../../../services/attendance/AttendanceServices';

type Member = [string, number, number, number, string[], string, string, string, string];
type MemberRD = [string, number, number, number, string[], string, string, string, string];
type TeamOrderType = {
  [key: string]: string[];
};

const AnnualManage = () => {
  const user = useRecoilValue(userState);
  const [editMode, setEditMode] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedScreen, setSelectedScreen] = useState('R&D');
  const [members, setMembers] = useState<Member[]>([]);
  const [membersRD, setMembersRD] = useState<Member[]>([]);
  const [rowsData, setRowsData] = useState<any[]>([]);
  const [rowsDataRD, setRowsDataRD] = useState<any[]>([]);

  const handleScreenChange = () => {
    setSelectedScreen(selectedScreen === 'R&D' ? '본사' : 'R&D');
  };

  const handleYearChange = (event: any) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const handleAvailableChange = (member: any, index: any, event: any) => {
    const newMembers = [...member];
    newMembers[index][1] = event.target.value;
    if (selectedScreen === 'R&D') {
      setMembers(newMembers)
    } else {
      setMembersRD(newMembers)
    }
  };

  const isRetiredBeforeToday = (retirementDate: any) => {
    const formattedRetirementDate = retirementDate.replace(/-/g, '');
    const formattedToday = today.replace(/-/g, '');
  
    return formattedRetirementDate !== '' && formattedRetirementDate < formattedToday;
  };

  const handleRetirementChange = (member: any, index: any, event: any) => {
    const newMembers = [...member];
    newMembers[index][6] = event.target.value;
    
    if (selectedScreen === 'R&D') {
      setMembers(newMembers)
    } else {
      setMembersRD(newMembers)
    }
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
        pdf.save('연차관리.pdf');
        window.location.reload();
      });
    } else {
      console.error('Element not found');
    }
  };

  // 연차관리 데이터 조회
  const fetchAnnual = async () => {
    try {
      const response = await CheckAnnual();
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  };

  useQuery("annual", fetchAnnual, {
    onSuccess: (data) => console.log(data),
    onError: (error) => {
      console.log(error)
    }
  });

  const initialMembers: Member[] = useMemo(() => [
    ['권상원', 0, 2, 13.0, ['04.17A', '04.18H'], '2099-01-01', '', '블록체인 사업부', ''],
    ['진유빈', 0, 1, 14.0, ['04.20A'], '2099-01-01', '', '개발부', ''],
    ['장현지', 0, 0, 15.0, [''], '2099-01-01', '', '개발부', '개발 1팀'],
    ['구민석', 0, 0, 15.0, [''], '2099-01-01', '', '개발부', '개발 1팀'],
    ['박세준', 0, 0, 15.0, [''], '2099-01-01', '', '개발부', '개발 1팀'],
    ['변도일', 0, 0, 15.0, [''], '2099-01-01', '', '개발부', '개발 2팀'],
    ['이로운', 0, 0, 15.0, [''], '2099-01-01', '', '개발부', '개발 2팀'],
    ['김현지', 0, 0, 15.0, [''], '2099-01-01', '', '마케팅부', ''],
    ['서주희', 0, 0, 15.0, [''], '2099-01-01', '', '마케팅부', '디자인팀'],
    ['전아름', 0, 0, 15.0, [''], '2099-01-01', '', '마케팅부', '기획팀'],
    ['함다슬', 0, 0, 15.0, [''], '2099-01-01', '', '마케팅부', '기획팀'],
    ['전규미', 0, 0, 15.0, [''], '2099-01-01', '', '마케팅부', '기획팀'],
    ['김효은', 0, 0, 15.0, [''], '2099-01-01', '', '관리부', '관리팀'],
    ['우현지', 0, 0, 15.0, [''], '2099-01-01', '', '관리부', '관리팀'],
    ['염승희', 0, 0, 15.0, [''], '2099-01-01', '', '관리부', '관리팀'],
    ['김태희', 0, 0, 15.0, [''], '2099-01-01', '', '관리부', '지원팀'],
  ], []);

  const initialMembersRD: MemberRD[] = useMemo(() => [
    ['심민지', 0, 2, 13.0, ['04.17A', '04.18H'], '2099-01-01', '', '알고리즘 연구실', 'AI 연구팀'],
    ['임지현', 0, 1, 14.0, ['04.20A'], '2099-01-01', '', '알고리즘 연구실', 'AI 연구팀'],
    ['김희진', 0, 0, 15.0, [''], '2099-01-01', '', '알고리즘 연구실', 'AI 연구팀'],
    ['윤민지', 0, 0, 15.0, [''], '2099-01-01', '', '동형분석 연구실', '동형분석 연구팀'],
    ['이채영', 0, 0, 15.0, [''], '2099-01-01', '', '동형분석 연구실', '동형분석 연구팀'],
    ['박소연', 0, 0, 15.0, [''], '2099-01-01', '', '블록체인 연구실', 'AI 개발팀'],
    ['김경현', 0, 0, 15.0, [''], '2099-01-01', '', '블록체인 연구실', 'AI 개발팀'],
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
      const deptAIndex = departmentOrder.indexOf(a[7]);
      const deptBIndex = departmentOrder.indexOf(b[7]);

      if (deptAIndex < deptBIndex) return -1;
      if (deptAIndex > deptBIndex) return 1;

      const teamAIndex = teamOrder[a[7]].indexOf(a[8]);
      const teamBIndex = teamOrder[b[7]].indexOf(b[8]);

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
      const dept = member[7];
      const team = member[8];
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
      const deptAIndex = departmentOrder.indexOf(a[7]);
      const deptBIndex = departmentOrder.indexOf(b[7]);

      if (deptAIndex < deptBIndex) return -1;
      if (deptAIndex > deptBIndex) return 1;

      const nameA = a[8];
      const nameB = b[8];
      return nameA.localeCompare(nameB);
    });

    setMembersRD(sortedMembers);
  }, [initialMembers]);

  useEffect(() => {
    const groupedData = membersRD.reduce((acc, member) => {
      const dept = member[7];
      const team = member[8];
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
  


  const CountDivs = () => {
    const countTotal = ["성명", "입사일", "퇴사일", "사용가능", "사용", "잔여"]
    const totalRows = [];
    const tableRows = [];

    totalRows.push(
      <>
        <tr className="countName_annual">
          <td className="total_annual">{countTotal[0]}</td>
        </tr>
        <tr className="countDate_annual">
          <td className="total_annual">{countTotal[1]}</td>
        </tr>
        <tr className="countDate_annual">
          <td className="total_annual">{countTotal[2]}</td>
        </tr>
        <tr className="countTotal_annual">
          <td className="total_annual">{countTotal[3]}</td>
        </tr>
        <tr className="countTotal_annual">
          <td className="total_annual">{countTotal[4]}</td>
        </tr>
        <tr className="countTotal_annual_last">
          <td className="total_annual">{countTotal[5]}</td>
        </tr>
      </>
    )


    for (let k = 0; k < 30; k++) {
      tableRows.push(
        <tr className="countTotal_annual" key={`${k}`}>
          <td className="total_annual" style={{backgroundColor: '#FFF5DC'}}>{k + 1}</td>
        </tr>
      )
    }
    return (
      <table className="CountTable">
        <tbody>
          {totalRows}
          {tableRows}
        </tbody>
      </table>
    );
  }

  const TableHeader = () => (
    <tr>
      <td className="TopS_no">NO.</td>
      <td className="TopS_annual" colSpan={2}>부서</td>
    </tr>
  );


  const generateDivs = (member: any) => {
    const nameRows = [];
    const countfirstRows = [];
    const countsecondRows = [];
    const countthirdRows = [];
    const totalRows = [];
    const datefirstRows = [];
    const datesecondRows = [];

    
    for (let i = 0; i < 1; i++) {
      const rowCells = [];
      for (let j = 0; j < member.length; j++) {
        const isRetired = isRetiredBeforeToday(members[j][6]);

        rowCells.push(
          <tr
            className="conta_three_annual"
            key={`${i}-${j}`}
          >
            <td className='conta_name_annual' style={{ textDecoration: isRetired ? 'line-through' : 'none' }}> {member[j][0]} </td>
          </tr>
        );
      }
      nameRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    for (let i = 0; i < 1; i++) {
      const rowCells = [];
      for (let j = 0; j < member.length; j++) {

        rowCells.push(
          <tr
            className="conta_three_annual"
            key={`${i}-${j}`}
          >
            <td className='conta_annual'> 
              <input 
                type="text"
                value={member[j][1]}
                onChange={(event) => handleAvailableChange(member, j, event)}
                disabled={!editMode}
              /> 
            </td>
          </tr>
        );
      }
      countfirstRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    for (let i = 0; i < 1; i++) {
      const rowCells = [];
      for (let j = 0; j < member.length; j++) {

        rowCells.push(
          <tr
            className="conta_three_annual"
            key={`${i}-${j}`}
          >
            <td className='conta_annual'> {member[j][2]} </td>
          </tr>
        );
      }
      countsecondRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    for (let i = 0; i < 1; i++) {
      const rowCells = [];
      for (let j = 0; j < member.length; j++) {

        rowCells.push(
          <tr
            className="conta_three_last_annual"
            key={`${i}-${j}`}
          >
            <td className='conta_annual'> {member[j][3]} </td>
          </tr>
        );
      }
      countthirdRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    for (let i = 0; i < 30; i++) {
      const rowCells = [];

      for (let j = 0; j < member.length; j++) {
        const eventDates = member[j][4]; // 해당 멤버의 이벤트 날짜 배열
        const eventDate = eventDates && eventDates[i] ? eventDates[i] : '';
        const eventType = eventDate.slice(-1);

        const color = eventType === 'A' ? '#323232' : eventType === 'H' ? ' #929292' : '';

        rowCells.push(
          <tr
            className="conta_three_annual"
            key={`${i}-${j}`}
          >
            <td className='conta_annual' style={{ color }}> {eventDate.slice(0, -1)} </td>
          </tr>
        );
      }
      totalRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    for (let i = 0; i < 1; i++) {
      const rowCells = [];
      for (let j = 0; j < member.length; j++) {

        rowCells.push(
          <tr
            className="conta_three_annual"
            key={`${i}-${j}`}
          >
            <td className='conta_date_annual'> {member[j][5]} </td>
          </tr>
        );
      }
      datefirstRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }

    for (let i = 0; i < 1; i++) {
      const rowCells = [];
      for (let j = 0; j < member.length; j++) {

        rowCells.push(
          <tr
            className="conta_three_annual"
            key={`${i}-${j}`}
          >
            <td className='conta_date_annual'> 
              <input 
                type="text"
                value={member[j][6]}
                onChange={(event) => handleRetirementChange(member, j, event)}
                disabled={!editMode}
              /> 
            </td>
          </tr>
        );
      }
      datesecondRows.push(<td className="sconta" key={i}>{rowCells}</td>);
    }
    
    return (
      <table className="table">
        <tbody>
          {nameRows}
          {datefirstRows}
          {datesecondRows}
          {countfirstRows}
          {countsecondRows}
          {countthirdRows}
          {totalRows}
        </tbody>
      </table>
    );
  };

  console.log(rowsData)
  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">근태관리</div>
        <div className="main_header">＞</div>
        <Link to={"/annual-manage"} className="sub_header">연차관리</Link>
      </div>
      <div className='anuual_header_right'>
        <select
          name="yearSelect"
          id="yearSelect"
          className='anuual_year_select'
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
        </select>
        {editMode ? 
          <button
          className='second_button'
          onClick={() => setEditMode(!editMode)}
          >
            등록
          </button>
          :
          <button
          className='white_button'
          onClick={() => setEditMode(!editMode)}
          >
            수정
          </button>
        }
        <button className='white_button' onClick={exportToPDF}>다운로드</button>
        {user.username === '이정훈' ? (
          selectedScreen === 'R&D' ? (
            <button className='second_button' onClick={handleScreenChange}>
              R&D 센터
            </button>
          ) : (
            <button className='second_button' onClick={handleScreenChange}>
              본사
            </button>
          )
        ) : null}
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="container_anuual" id="table-to-xls">
            {selectedScreen === '본사' ? (
              <div className="Excel_annual_RD">
                <table className="Explan_annual_RD">
                  <div>
                    <thead>
                      <TableHeader />  
                    </thead> 
                    <tbody>
                      {rowsDataRD.map((row, index) => (
                          <tr key={index}>
                            <td>{index+1}</td>
                            {row.deptRowSpan > 0 && <td rowSpan={row.deptRowSpan}>{row.member[7]}</td>}
                            {row.teamRowSpan > 0 && <td rowSpan={row.teamRowSpan}>{row.member[8]}</td>}
                          </tr>))}
                    </tbody>
                  </div>
                </table>
                <div>
                  {CountDivs()}
                  {generateDivs(membersRD)}
                </div>
              </div>
              
            ) : (
              <div className="Excel_annual">
                <table className="Explan_annual">
                  <tbody>
                    <div>
                      <thead>
                        <TableHeader />  
                      </thead> 
                      <tbody>
                        {rowsData.map((row, index) => (
                          <tr key={index}>
                            <td>{index+1}</td>
                            {row.deptRowSpan > 0 && <td rowSpan={row.deptRowSpan}>{row.member[7]}</td>}
                            {row.teamRowSpan > 0 && <td rowSpan={row.teamRowSpan}>{row.member[8]}</td>}
                          </tr>))}
                      </tbody>
                    </div>
                  </tbody>
                </table>
                <div>
                  {CountDivs()}
                  {generateDivs(members)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>  
      
    </div>
  );
};

export default AnnualManage;