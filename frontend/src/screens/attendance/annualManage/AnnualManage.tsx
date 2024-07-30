import { useState, useEffect, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../recoil/atoms';
import CustomModal from "../../../components/modal/CustomModal";
import { useQueryClient, useQuery } from 'react-query';
import { CheckAnnual, EditAnnual } from '../../../services/attendance/AttendanceServices';
import { PersonData } from '../../../services/person/PersonServices';

type Member = [string, number, number, number, string[], string, string, string, string];
type TeamOrderType = {
  [key: string]: string[];
};

interface AnnualData {
  username: string;
  availableDate: number;
  usedDate : number;
  extraDate: number;
  startDate?: string;
  dateType?: string;
}

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

const fetchAnnual = async () => { // 모든 휴가 관리 데이터 가져오기
  try {
    const response = await CheckAnnual();
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

const formatDate = (date: Date, dateType: string) => {
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const suffix = dateType === '연차' ? 'A' : 'H';
  return `${month}.${day}${suffix}`;
};

const formatEnteringDate = (date: string) => {
  const d = new Date(date);
  const year = d.getFullYear().toString();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const sortDates = (dates: string[]) => {
  return dates.sort((a, b) => {
    const dateA = new Date(a.slice(0, -1)); 
    const dateB = new Date(b.slice(0, -1)); 
    return dateA.getTime() - dateB.getTime(); 
  });
};


const useAnnualData = () => {
  const [annualData, setAnnualData] = useState([]);
  const [HO_Data, setHO_Data] = useState([]);
  const [RnD_Data, setRnD_Data] = useState([]);
  const [userMap, setUserMap] = useState(new Map());


  useQuery("Users", fetchUser, {
    onSuccess: (data) => {
      const HO_Data = data.users
        .filter((item: any) => item.company === "본사")

      const RnD_Data = data.users
        .filter((item: any) => item.company === "R&D")

      setHO_Data(HO_Data);
      setRnD_Data(RnD_Data);
      setUserMap(data.userMap);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  useQuery("annual", fetchAnnual, {
    onSuccess: (data) => {
      const filteredData = data.filter((item: any) => item.dateType === '연차' || item.dateType === '반차');
      setAnnualData(filteredData);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const getDateRange = (startDate: string, endDate: string, dateType: string) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const finalDate = new Date(endDate);
  
    while (currentDate <= finalDate) {
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
      const suffix = dateType === '연차' ? 'A' : 'H';
      dates.push(`${month}.${day}${suffix}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  };

  const processedHOData = useMemo(() => {
    const result = HO_Data.map((user: any) => {
      const userAnnualData: AnnualData[] = annualData.filter((annual: any) => annual.username === user.username);
      let formattedDates: string[] = [];
      
      userAnnualData.forEach((annual: any) => {
        if (annual.startDate && annual.endDate) {
          formattedDates = formattedDates.concat(getDateRange(annual.startDate, annual.endDate, annual.dateType));
        } else if (annual.startDate) {
          formattedDates.push(formatDate(annual.startDate, annual.dateType));
        }
      });
      
      const sortedDates = sortDates(formattedDates);

      return [
        user.username || '',
        userAnnualData[0]?.availableDate || 0,
        userAnnualData[0]?.usedDate || 0,
        userAnnualData[0]?.extraDate || 0,
        sortedDates.length ? sortedDates : [''],
        user.entering ? formatEnteringDate(user.entering) : '',
        user.leavedate ? formatEnteringDate(user.leavedate) : '',
        user.department || '',
        user.team || ''
      ];
    });
    return result;
  }, [HO_Data, annualData]);

  const processedRndData = useMemo(() => {
    const result = RnD_Data.map((user: any) => {
      const userAnnualData: AnnualData[] = annualData.filter((annual: any) => annual.username === user.username);
      let formattedDates: string[] = [];

      userAnnualData.forEach((annual: any) => {
        if (annual.startDate && annual.endDate) {
          formattedDates = formattedDates.concat(getDateRange(annual.startDate, annual.endDate, annual.dateType));
        } else if (annual.startDate) {
          formattedDates.push(formatDate(annual.startDate, annual.dateType));
        }
      });

      const sortedDates = sortDates(formattedDates);

      return [
        user.username || '',
        userAnnualData[0]?.availableDate || 0,
        userAnnualData[0]?.usedDate || 0,
        userAnnualData[0]?.extraDate || 0,
        sortedDates.length ? sortedDates : [''],
        user.entering ? formatEnteringDate(user.entering) : '',
        user.leavedate ? formatEnteringDate(user.leavedate) : '',
        user.department || '',
        user.team || ''
      ];
    });
    return result;
  }, [RnD_Data, annualData]);

  return { HO_Data: processedHOData, RnD_Data: processedRndData, userMap };
};


const AnnualManage = () => {
  const user = useRecoilValue(userState);
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedScreen, setSelectedScreen] = useState('R&D');
  const [members, setMembers] = useState<Member[]>([]);
  const [membersRD, setMembersRD] = useState<Member[]>([]);
  const [rowsData, setRowsData] = useState<any[]>([]);
  const [rowsDataRD, setRowsDataRD] = useState<any[]>([]);
  const { HO_Data, RnD_Data, userMap } = useAnnualData();
  const [changeData, setChangeData] = useState<any[]>([]); 

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
      setMembers(newMembers);
    } else {
      setMembersRD(newMembers);
    }
  
    const updatedChangeData = newMembers
      .filter((m) => m[1] !== 0)
      .map((m) => ({
        userID:  userMap.get(m[0]),
        username: m[0],
        availableDate: m[1]
      }));
  
    setChangeData(updatedChangeData);
  };

  const handleSubmit = () => {
    setEditMode(!editMode);
    EditAnnual(changeData)
      .then(response => {
        console.log("연차관리 데이터 전송 성공", response);
        setEditModalOpen(true);
        queryClient.invalidateQueries("annual");
      })
      .catch(error => {
        console.log("연차관리 데이터 전송 오류", error);
      })
    
  }

  const isRetiredBeforeToday = (retirementDate: any) => {
    const formattedRetirementDate = retirementDate.replace(/-/g, '');
    const formattedToday = today.replace(/-/g, '');
  
    return formattedRetirementDate !== '' && formattedRetirementDate <= formattedToday;
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

  useEffect(() => {
    const departmentOrder = ['개발부', '마케팅부', '관리부'];
    const teamOrder: TeamOrderType = {
      '개발부': ['개발 1팀', '개발 2팀'],
      '마케팅부': ['디자인팀', '기획팀'],
      '관리부': ['관리팀', '지원팀'],
    };
  
    const sortedMembers: Member[] = [...HO_Data].map((member) => {
      if (member.length === 9) {
        return member as Member;
      } else {
        return [
          member[0] || '',
          member[1] || 0,
          member[2] || 0,
          member[3] || 0,
          member[4] || [],
          member[5] || '',
          member[6] || '',
          member[7] || '',
          member[8] || ''
        ] as Member;
      }
    }).sort((a, b) => {
      const deptAIndex = departmentOrder.indexOf(a[7]);
      const deptBIndex = departmentOrder.indexOf(b[7]);
    
      if (deptAIndex < deptBIndex) return -1;
      if (deptAIndex > deptBIndex) return 1;
    
      const teamAIndex = teamOrder[a[7]].indexOf(a[8]);
      const teamBIndex = teamOrder[b[7]].indexOf(b[8]);
    
      if (teamAIndex < teamBIndex) return -1;
      if (teamAIndex > teamBIndex) return 1;
    
      const enteringDateA = new Date(a[5]);
      const enteringDateB = new Date(b[5]);
    
      if (enteringDateA < enteringDateB) return -1;
      if (enteringDateA > enteringDateB) return 1;
    
      const nameA = a[0];
      const nameB = b[0];
      return nameA.localeCompare(nameB);
    });
    
    setMembers(sortedMembers);
    }, [HO_Data]);
  
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
  
    const sortedMembers: Member[] = [...RnD_Data].map((member) => {
      if (member.length === 9) {
        return member as Member;
      } else {
        return [
          member[0] || '',
          member[1] || 0,
          member[2] || 0,
          member[3] || 0,
          member[4] || [],
          member[5] || '',
          member[6] || '',
          member[7] || '',
          member[8] || ''
        ] as Member;
      }
    }).sort((a, b) => {
      const deptAIndex = departmentOrder.indexOf(a[7]);
      const deptBIndex = departmentOrder.indexOf(b[7]);
  
      if (deptAIndex < deptBIndex) return -1;
      if (deptAIndex > deptBIndex) return 1;
  
      const enteringDateA = new Date(a[5]);
      const enteringDateB = new Date(b[5]);
  
      if (enteringDateA < enteringDateB) return -1;
      if (enteringDateA > enteringDateB) return 1;
  
      const nameA = a[0];
      const nameB = b[0];
      return nameA.localeCompare(nameB);
    });
  
    setMembersRD(sortedMembers);
  }, [RnD_Data]);

  useEffect(() => {
    const groupedData = membersRD.reduce((acc, member) => {
      const dept = member[7];
      const team = member[8];
      if (!acc[dept]) {
        acc[dept] = { rowSpan: 0, teams: {} };
      }
      acc[dept].rowSpan += 1;
      if (!acc[dept].teams[team]) {
        acc[dept].teams[team] = { rowSpan: 0, membersRD: [] };
      }
      acc[dept].teams[team].rowSpan += 1;
      acc[dept].teams[team].membersRD.push(member);
      return acc;
    }, {} as Record<string, { rowSpan: number; teams: Record<string, { rowSpan: number; membersRD: Member[] }> }>);

    const rows: any[] = [];
    Object.keys(groupedData).forEach(dept => {
      const deptData = groupedData[dept];
      Object.keys(deptData.teams).forEach((team, teamIndex) => {
        const teamData = deptData.teams[team];
        teamData.membersRD.forEach((member, memberIndex) => {
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
        const isRetired = isRetiredBeforeToday(member[j][6]);

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
            <td className='conta_date_annual'> {member[j][6]} </td>
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

  console.log(user.company)
  return (
    <div className="content">
      <div className='anuual_header_right'>
        <select
          name="yearSelect"
          id="yearSelect"
          className='anuual_year_select'
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value={2024}>2024</option>
          {/* <option value={2023}>2023</option> */}
        </select>
        {editMode ? 
          <button
          className='primary_button'
          onClick={handleSubmit}
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
      
      <div className="content_container">
          <div className="container_anuual" id="table-to-xls">
            {selectedScreen === '본사' || user.company === 'R&D' ? (
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
      <CustomModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        header={'알림'}
        footer1={'확인'}
        footer1Class="gray-btn"
        onFooter1Click={() => setEditModalOpen(false)}
      >
        <div>
          수정이 완료되었습니다.
        </div>
      </CustomModal>
    </div>
  );
};

export default AnnualManage;