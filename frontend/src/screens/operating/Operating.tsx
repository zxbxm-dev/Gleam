import React, { useState, useEffect } from 'react';
import { evaluate } from "mathjs";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { useQuery } from 'react-query';
import { CheckOperating, WriteOperating } from '../../services/operating/OperatingServices';

type TeamType = 'common811' | 'common812' | 'common813' | 'common814' | 'common815' | 'common818' | 'common819' | "management" | "support" | "devOne" | "devTwo" | "design" | "planning";

type Expense = {
  id: number;
  team: string;
  accountCode: string;
  accountName: string;
  cost: number;
  note: string;
  Percent: string;
  createdAt: string;
  updatedAt: string;
  year: number;
};

const Operating = () => {
  const [editMode, setEditMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [dropdownTeam, setDropdownTeam] = useState<TeamType>();
  const [reserveFund, setReserveFund] = useState<number>(0);
  const [customInputValue, setCustomInputValue] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [percentage, setPercentage] = useState('');

  const distributeExpenses = (expenses: Expense[]) => {
    const teams: { [key: string]: string[][] } = {
      common811: [['', '', '', '']],
      common812: [['', '', '', '']],
      common813: [['', '', '', '']],
      common814: [['', '', '', '']],
      common815: [['', '', '', '']],
      common818: [['', '', '', '']],
      common819: [['', '', '', '']],
      management: [['', '', '', '']],
      support: [['', '', '', '']],
      devOne: [['', '', '', '']],
      devTwo: [['', '', '', '']],
      design: [['', '', '', '']],
      planning: [['', '', '', '']]
    };

    expenses.forEach((expense) => {
      const { team, accountCode, accountName, cost, note, Percent } = expense;
      setPercentage(Percent);
      if (teams[team]) {
        if (teams[team][0][0] === '' && teams[team][0][1] === '' && teams[team][0][2] === '' && teams[team][0][3] === '') {
          teams[team] = [];
        }
        teams[team].push([accountCode, accountName, cost.toLocaleString(), note]);
      }
    });

    setCommon811Team(teams.common811);
    setCommon812Team(teams.common812);
    setCommon813Team(teams.common813);
    setCommon814Team(teams.common814);
    setCommon815Team(teams.common815);
    setCommon818Team(teams.common818);
    setCommon819Team(teams.common819);
    setManagementTeam(teams.management);
    setSupportTeam(teams.support);
    setDevOneTeam(teams.devOne);
    setDevTwoTeam(teams.devTwo);
    setDesignTeam(teams.design);
    setPlanningTeam(teams.planning);
  };

  // 운영비 관리 조회
  const fetchOperating = async () => {
    try {
      const response = await CheckOperating();
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  }

  const { refetch } = useQuery("operating", fetchOperating, {
    enabled: false,
    onSuccess: (data) => {
      distributeExpenses(data);
    },
    onError: (error) => {
      console.log(error);
    }
  });

  useEffect(() => {
    refetch();
  }, [])

  
  const exportToPDF = () => {
    const element = document.getElementById('table-to-xls');
    if (element) {
      element.style.height = element.scrollHeight + 'px';
      element.style.width = element.scrollWidth + 'px';
  
      html2canvas(element, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pageWidth = 297;
        const pageHeight = 210;
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        let position = 0;
        const offset = 0;
  
        // 이미지가 A4 페이지 높이보다 클 경우 여러 페이지로 나누어 저장
        while (position < imgHeight) {
          // 두 번째 페이지부터 offset 적용
          const yOffset = position === 0 ? 0 : -position - offset;
          pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
  
          position += pageHeight;
  
          if (position < imgHeight) {
            pdf.addPage();
          }
        }
  
        pdf.save('운영비 관리.pdf');
        window.location.reload();
      });
    } else {
      console.error('Element not found');
    }
  };

  const handleYearChange = (event: any) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const handleCustomInputChange = (value: string) => {
    setCustomInputValue(value);
  };

  const handleRightClick = (event: any, team: TeamType) => {
    event.preventDefault();
    setDropdownTeam(team);
    setDropdownOpen(true);
    setDropdownPosition({ x: event.pageX, y: event.pageY });
  };

  const accountCode: { [key: string]: string } = {
    '' : '',
    81101 : '비품-사무용가구',
    81102 : '비품-업무용비품',
    81190 : '비품-기타',
    81201 : '소모품비-전산소모품비',
    81202 : '소모품비-사무용품대',
    81290 : '소모품비-기타',
    81301 : '복리후생비-도시락,간식비',
    81302 : '복리후생비-야유회비',
    81303 : '복리후생비-프로젝트회의비',
    81304 : '복리후생비-회식비',
    81305 : '복리후생비-자기개발비',
    81390 : '복리후생비-기타',
    81401 : '여비교통비-교통비',
    81402 : '여비교통비-주차비',
    81403 : '여비교통비-건물주차비',
    81404 : '여비교통비-국내출장비',
    81490 : '여비교통비-기타',
    81501 : '통신비-우편비',
    81502 : '통신비-운송비',
    81590 : '통신비-기타',
    81801 : '도서인쇄비-도서대금',
    81802 : '도서인쇄비-인쇄/복사비',
    81803 : '도서인쇄비-제본비',
    81804 : '도서인쇄비-명함인쇄대금',
    81890 : '도서인쇄비-기타',
    81901 : '지급수수료-증명서발급수수료',
    81902 : '지급수수료-도메인등록수수료',
    81990 : '지급수수료-기타',
    82001 : '임차료-장소대관료',
    89000 : '잡비',
  }

  const [common811Team, setCommon811Team] = useState<string[][]>([['', '', '', '']]);
  const [common812Team, setCommon812Team] = useState<string[][]>([['', '', '', '']]);
  const [common813Team, setCommon813Team] = useState<string[][]>([['', '', '', '']]);
  const [common814Team, setCommon814Team] = useState<string[][]>([['', '', '', '']]);
  const [common815Team, setCommon815Team] = useState<string[][]>([['', '', '', '']]);
  const [common818Team, setCommon818Team] = useState<string[][]>([['', '', '', '']]);
  const [common819Team, setCommon819Team] = useState<string[][]>([['', '', '', '']]);
  const [managementTeam, setManagementTeam] = useState<string[][]>([['', '', '', '']]);
  const [supportTeam, setSupportTeam] = useState<string[][]>([['', '', '', '']]);
  const [devOneTeam, setDevOneTeam] = useState<string[][]>([['', '', '', '']]);
  const [devTwoTeam, setDevTwoTeam] = useState<string[][]>([['', '', '', '']]);
  const [designTeam, setDesignTeam] = useState<string[][]>([['', '', '', '']]);
  const [planningTeam, setPlanningTeam] = useState<string[][]>([['', '', '', '']]);
  
  const [common811Cost, setCommon811Cost] = useState<number>(0);
  const [common812Cost, setCommon812Cost] = useState<number>(0);
  const [common813Cost, setCommon813Cost] = useState<number>(0);
  const [common814Cost, setCommon814Cost] = useState<number>(0);
  const [common815Cost, setCommon815Cost] = useState<number>(0);
  const [common818Cost, setCommon818Cost] = useState<number>(0);
  const [common819Cost, setCommon819Cost] = useState<number>(0);
  const [managementCost, setManagementCost] = useState<number>(0);
  const [supportCost, setSupportCost] = useState<number>(0);
  const [devOneCost, setDevOneCost] = useState<number>(0);
  const [devTwoCost, setDevTwoCost] = useState<number>(0);
  const [designCost, setDesignCost] = useState<number>(0);
  const [planningCost, setPlanningnCost] = useState<number>(0);

  const calculateCost = (teamData: string[][]) => {
    return teamData.reduce((acc: number, item: string[]) => {
      const cost = parseInt(item[2].replace(/,/g, '')) || 0;
      return acc + cost;
    }, 0);
  };

  useEffect(() => {
    setCommon811Cost(calculateCost(common811Team));
    setCommon812Cost(calculateCost(common812Team));
    setCommon813Cost(calculateCost(common813Team));
    setCommon814Cost(calculateCost(common814Team));
    setCommon815Cost(calculateCost(common815Team));
    setCommon818Cost(calculateCost(common818Team));
    setCommon819Cost(calculateCost(common819Team));
    setManagementCost(calculateCost(managementTeam));
    setSupportCost(calculateCost(supportTeam));
    setDevOneCost(calculateCost(devOneTeam));
    setDevTwoCost(calculateCost(devTwoTeam));
    setDesignCost(calculateCost(designTeam));
    setPlanningnCost(calculateCost(planningTeam));
  }, [common811Team, common812Team, common813Team, common814Team, common815Team, common818Team, common819Team, managementTeam, supportTeam, devOneTeam, devTwoTeam, designTeam, planningTeam]);

  const addRow = (team: 'common811' | 'common812' | 'common813' | 'common814' | 'common815' | 'common818' | 'common819' | 'management' | 'support' | 'devOne' | 'devTwo' | 'design' | 'planning') => {
    let newTeam: string[][];

    if (team === 'common811') {
      newTeam = [...common811Team, ['', '', '', '']];
      setCommon811Team(newTeam);
    } else if (team === 'common812') {
      newTeam = [...common812Team, ['', '', '', '']];
      setCommon812Team(newTeam);
    } else if (team === 'common813') {
      newTeam = [...common813Team, ['', '', '', '']];
      setCommon813Team(newTeam);
    } else if (team === 'common814') {
      newTeam = [...common814Team, ['', '', '', '']];
      setCommon814Team(newTeam);
    } else if (team === 'common815') {
      newTeam = [...common815Team, ['', '', '', '']];
      setCommon815Team(newTeam);
    } else if (team === 'common818') {
      newTeam = [...common818Team, ['', '', '', '']];
      setCommon818Team(newTeam);
    } else if (team === 'common819') {
      newTeam = [...common819Team, ['', '', '', '']];
      setCommon819Team(newTeam);
    } else if (team === 'management') {
      newTeam = [...managementTeam, ['', '', '', '']];
      setManagementTeam(newTeam);
    } else if (team === 'support') {
      newTeam = [...supportTeam, ['', '', '', '']];
      setSupportTeam(newTeam);
    } else if (team === 'devOne') {
      newTeam = [...devOneTeam, ['', '', '', '']];
      setDevOneTeam(newTeam);
    } else if (team === 'devTwo') {
      newTeam = [...devTwoTeam, ['', '', '', '']];
      setDevTwoTeam(newTeam);
    } else if (team === 'design') {
      newTeam = [...designTeam, ['', '', '', '']];
      setDesignTeam(newTeam);
    } else {
      newTeam = [...planningTeam, ['', '', '', '']];
      setPlanningTeam(newTeam);
    }
    setDropdownOpen(false);
  };

  const removeRow = (team: 'common811' | 'common812' | 'common813' | 'common814' | 'common815' | 'common818' | 'common819' | 'management' | 'support' | 'devOne' | 'devTwo' | 'design' | 'planning') => {
    switch (team) {
      case 'common811':
        setCommon811Team(prevTeam => {
          if (prevTeam.length > 1) {
            const newTeam = [...prevTeam];
            newTeam.pop();
            return newTeam;
          }
          return prevTeam;
        });
        break;
      case 'common812':
        setCommon812Team(prevTeam => {
          if (prevTeam.length > 1) {
            const newTeam = [...prevTeam];
            newTeam.pop();
            return newTeam;
          }
          return prevTeam;
        });
        break;
      case 'common813':
        setCommon813Team(prevTeam => {
          if (prevTeam.length > 1) {
            const newTeam = [...prevTeam];
            newTeam.pop();
            return newTeam;
          }
          return prevTeam;
        });
        break;
      case 'common814':
        setCommon814Team(prevTeam => {
          if (prevTeam.length > 1) {
            const newTeam = [...prevTeam];
            newTeam.pop();
            return newTeam;
          }
          return prevTeam;
        });
        break;
      case 'common815':
        setCommon815Team(prevTeam => {
          if (prevTeam.length > 1) {
            const newTeam = [...prevTeam];
            newTeam.pop();
            return newTeam;
          }
          return prevTeam;
        });
        break;
      case 'common818':
        setCommon818Team(prevTeam => {
          if (prevTeam.length > 1) {
            const newTeam = [...prevTeam];
            newTeam.pop();
            return newTeam;
          }
          return prevTeam;
        });
        break;
      case 'common819':
        setCommon819Team(prevTeam => {
          if (prevTeam.length > 1) {
            const newTeam = [...prevTeam];
            newTeam.pop();
            return newTeam;
          }
          return prevTeam;
        });
        break;
      case 'management':
        setManagementTeam(prevTeam => {
          if (prevTeam.length > 1) {
            const newTeam = [...prevTeam];
            newTeam.pop();
            return newTeam;
          }
          return prevTeam;
        });
        break;
      case 'support':
        setSupportTeam(prevTeam => {
          if (prevTeam.length > 1) {
            const newTeam = [...prevTeam];
            newTeam.pop();
            return newTeam;
          }
          return prevTeam;
        });
        break;
      case 'devOne':
        setDevOneTeam(prevTeam => {
          if (prevTeam.length > 1) {
            const newTeam = [...prevTeam];
            newTeam.pop();
            return newTeam;
          }
          return prevTeam;
        });
        break;
      case 'devTwo':
        setDevTwoTeam(prevTeam => {
          if (prevTeam.length > 1) {
            const newTeam = [...prevTeam];
            newTeam.pop();
            return newTeam;
          }
          return prevTeam;
        });
        break;
      case 'design':
        setDesignTeam(prevTeam => {
          if (prevTeam.length > 1) {
            const newTeam = [...prevTeam];
            newTeam.pop();
            return newTeam;
          }
          return prevTeam;
        });
        break;
      case 'planning':
        setPlanningTeam(prevTeam => {
          if (prevTeam.length > 1) {
            const newTeam = [...prevTeam];
            newTeam.pop();
            return newTeam;
          }
          return prevTeam;
        });
        break;
      default:
        break;
    }
    setDropdownOpen(false);
  };
  
  const setTeamState = <T extends string[][]>(
    teamStateSetter: React.Dispatch<React.SetStateAction<T>>,
    teamName: string,
    index: number,
    column: number,
    value: string
  ) => {
    teamStateSetter((prevState: T) => {
      if (column === 0) {
        const accountEntries = Object.entries(accountCode);
        const selectedAccountEntry = accountEntries.find(([code]) => code === value);
        if (selectedAccountEntry) {
          return prevState.map((team, i) => {
            if (i === index) {
              return [value, selectedAccountEntry[1], ...team.slice(column + 2)];
            }
            return team;
          }) as T;
        }
      } else if (column === 2) {
        return prevState.map((team, i) => {
          if (i === index) {
            return [...team.slice(0, column), value, ...team.slice(column + 1)];
          }
          return team;
        }) as T;
      } else {
        return prevState.map((team, i) => {
          if (i === index) {
            return [...team.slice(0, column), value, ...team.slice(column + 1)];
          }
          return team;
        }) as T;
      }
      return prevState.map((team, i) => {
        if (i === index) {
          return [...team.slice(0, column), value, ...team.slice(column + 1)];
        }
        return team;
      }) as T;
    });
  };
  
  
  const handleInputChange = (team: string, index: number, column: number, value: string) => {
    switch (team) {
      case 'common811':
        setTeamState(setCommon811Team, team, index, column, value);
        break;
      case 'common812':
        setTeamState(setCommon812Team, team, index, column, value);
        break;
      case 'common813':
        setTeamState(setCommon813Team, team, index, column, value);
        break;
      case 'common814':
        setTeamState(setCommon814Team, team, index, column, value);
        break;
      case 'common815':
        setTeamState(setCommon815Team, team, index, column, value);
        break;
      case 'common818':
        setTeamState(setCommon818Team, team, index, column, value);
        break;
      case 'common819':
        setTeamState(setCommon819Team, team, index, column, value);
        break;
      case 'management':
        setTeamState(setManagementTeam, team, index, column, value);
        break;
      case 'support':
        setTeamState(setSupportTeam, team, index, column, value);
        break;
      case 'devOne':
        setTeamState(setDevOneTeam, team, index, column, value);
        break;
      case 'devTwo':
        setTeamState(setDevTwoTeam, team, index, column, value);
        break;
      case 'design':
        setTeamState(setDesignTeam, team, index, column, value);
        break;
      case 'planning':
        setTeamState(setPlanningTeam, team, index, column, value);
        break;
      default:
        break;
    }
  };
  
  const handleInputKeyDown = (team: string, index: number, column: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const inputValue = e.currentTarget.value;
  
      // 입력 값이 비어있는지 확인, 빈 값이면 무시
      if (!inputValue.trim()) {
        return;
      }
  
      // 계산 수식 처리
      try {
        const calculatedValue = evaluate(inputValue);
        switch (team) {
          case 'common811':
            setCommon811Cost(prevCost => prevCost + calculatedValue);
            break;
          case 'common812':
            setCommon812Cost(prevCost => prevCost + calculatedValue);
            break;
          case 'common813':
            setCommon813Cost(prevCost => prevCost + calculatedValue);
            break;
          case 'common814':
            setCommon814Cost(prevCost => prevCost + calculatedValue);
            break;
          case 'common815':
            setCommon815Cost(prevCost => prevCost + calculatedValue);
            break;
          case 'common818':
            setCommon818Cost(prevCost => prevCost + calculatedValue);
            break;
          case 'common819':
            setCommon819Cost(prevCost => prevCost + calculatedValue);
            break;
          case 'management':
            setManagementCost(prevCost => prevCost + calculatedValue);
            break;
          case 'support':
            setSupportCost(prevCost => prevCost + calculatedValue);
            break;
          case 'devOne':
            setDevOneCost(prevCost => prevCost + calculatedValue);
            break;
          case 'devTwo':
            setDevTwoCost(prevCost => prevCost + calculatedValue);
            break;
          case 'design':
            setDesignCost(prevCost => prevCost + calculatedValue);
            break;
          case 'planning':
            setPlanningnCost(prevCost => prevCost + calculatedValue);
            break;
          default:
            break;
        }
        handleInputChange(team, index, column, calculatedValue.toLocaleString());
      } catch (error) {
        console.log('수식 입력이 잘못됐습니다.')
      }
    }
  };

  const handleAccountNameChange = (team: string, index: number, value: string) => {
    // 선택된 계정명에 해당하는 계정코드
    const code = Object.keys(accountCode).find(key => accountCode[key] === value);

    // 계정코드가 있으면 변경
    if (code) {
      handleInputChange(team, index, 0, code);
    } else if (code === '') {
      handleInputChange(team, index, 0, '');
    }
  };
  
  const CommonRowSpan = common811Team.length + common812Team.length + common813Team.length + common814Team.length + common815Team.length + common818Team.length + common819Team.length;
  const ManageRowSpan = managementTeam.length + supportTeam.length;
  const DevRowSpan = devOneTeam.length + devTwoTeam.length;
  const MarketingRowSpan = designTeam.length + planningTeam.length;

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownOpen && !event.target.closest('.oper-dropdown-menu')) {
        setDropdownOpen(false);
      }
    };
  
    document.addEventListener('click', handleClickOutside);
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

// 운영비 관리 작성
const handleSubmit = () => {
  setEditMode(!editMode);
  
  const formData = {
    common811: common811Team,
    common812: common812Team,
    common813: common813Team,
    common814: common814Team,
    common815: common815Team,
    common818: common818Team,
    common819: common819Team,
    management: managementTeam,
    support: supportTeam,
    devOne: devOneTeam,
    devTwo: devTwoTeam,
    design: designTeam,
    planning: planningTeam,
    percent:percentage
  }
  

  // API 호출
  WriteOperating(formData)
    .then(response => {
      console.log("운영비 데이터 전송 성공", response)
    })
    .catch(error => {
      console.log("운영비 데이터 전송 오류", error);
    })
  }

  // 예비비 금액 계산
  useEffect(() => {
    const totalCost = common811Cost + common812Cost + common813Cost + common814Cost + common815Cost + common818Cost + common819Cost + managementCost + supportCost + devOneCost + devTwoCost + designCost + planningCost;
    if (percentage) {
      const reserveFund = totalCost * (parseFloat(percentage) / 100);
      setReserveFund(reserveFund);
    } else {
      setReserveFund(0);
    }
  }, [percentage, common811Cost, common812Cost, common813Cost, common814Cost, common815Cost, common818Cost, common819Cost, managementCost, supportCost, devOneCost, devTwoCost, designCost, planningCost]);

  return (
    <div className="content">
      <div className='oper_header_right'>
        <select
          name="yearSelect"
          id="yearSelect"
          className='oper_year_select'
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
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
      </div>
      <div className="content_container">
          <div className="container_operating" id="table-to-xls">
            <div className="Excel_operating"> 
              <table className='Explan_operating'>
                <tbody>
                  <tr>
                    <th className="table_header_name th_right th_bottom" colSpan={2}>부서 / 팀명</th>
                    <th className="table_header_name_code th_right th_bottom">부서 코드</th>
                    <th className="table_header_account_code th_right th_bottom">계정 코드</th>
                    <th className="table_header_account th_right th_bottom">계정명</th>
                    <th className="table_header_yearAccount th_right th_bottom">연간편성액(원)</th>
                    <th className="table_header_note th_right th_bottom">비고</th>
                    <th className="table_header_totalAccount th_right th_bottom">합계</th>
                    <th className="table_header_totalAccount th_bottom">부서 합계</th>
                  </tr>
                  
                  {common811Team.map((row, index) => (
                    <tr key={index} onContextMenu={(e) => e.preventDefault()}>
                      {index === 0 ? (
                        <>
                          <th rowSpan={CommonRowSpan} colSpan={2} className="th_right th_bottom">공통 <br /> (1000) </th>
                          <th rowSpan={CommonRowSpan} className="th_right th_bottom">1000</th>
                        </>
                      ) : null}
                      {row.map((item, i) => (
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td className={index === common811Team.length-1 ? 'border_light_line' : 'dashed_line'} onContextMenu={(e) => handleRightClick(e, 'common811')}>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('common811', index, e.target.value)}
                                className="left-align"
                                disabled={!editMode}
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td className={index === common811Team.length-1 ? 'border_light_line' : 'dashed_line'} onContextMenu={(e) => handleRightClick(e, 'common811')}>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('common811', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('common811', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                                disabled={!editMode}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={CommonRowSpan} className="th_left th_right th_bottom text_right"> {(common811Cost + common812Cost + common813Cost + common814Cost + common815Cost + common818Cost + common819Cost).toLocaleString()} </th>
                          <th rowSpan={CommonRowSpan} className="th_bottom text_right"> {(common811Cost + common812Cost + common813Cost + common814Cost + common815Cost + common818Cost + common819Cost).toLocaleString()} </th>
                        </>
                      ) : null}
                      
                    </tr>
                  ))}

                  {common812Team.map((row, index) => (
                    <tr key={index} onContextMenu={(e) => handleRightClick(e, 'common812')}>
                      {row.map((item, i) => (
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td className={index === common812Team.length-1 ? 'border_light_line' : 'dashed_line'}>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('common812', index, e.target.value)}
                                className="left-align"
                                disabled={!editMode}
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td className={index === common812Team.length-1 ? 'border_light_line' : 'dashed_line'}>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('common812', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('common812', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                                disabled={!editMode}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}                     
                    </tr>
                  ))}

                  {common813Team.map((row, index) => (
                    <tr key={index} onContextMenu={(e) => handleRightClick(e, 'common813')}>
                      {row.map((item, i) => (
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td className={index === common813Team.length-1 ? 'border_light_line' : 'dashed_line'}>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('common813', index, e.target.value)}
                                className="left-align"
                                disabled={!editMode}
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td className={index === common813Team.length-1 ? 'border_light_line' : 'dashed_line'}>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('common813', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('common813', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                                disabled={!editMode}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}                     
                    </tr>
                  ))}

                  {common814Team.map((row, index) => (
                    <tr key={index} onContextMenu={(e) => handleRightClick(e, 'common814')}>
                      {row.map((item, i) => (
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td className={index === common814Team.length-1 ? 'border_light_line' : 'dashed_line'}>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('common814', index, e.target.value)}
                                className="left-align"
                                disabled={!editMode}
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td className={index === common814Team.length-1 ? 'border_light_line' : 'dashed_line'}>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('common814', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('common814', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                                disabled={!editMode}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}                     
                    </tr>
                  ))}

                  {common815Team.map((row, index) => (
                    <tr key={index} onContextMenu={(e) => handleRightClick(e, 'common815')}>
                      {row.map((item, i) => (
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td className={index === common815Team.length-1 ? 'border_light_line' : 'dashed_line'}>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('common815', index, e.target.value)}
                                className="left-align"
                                disabled={!editMode}
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td className={index === common815Team.length-1 ? 'border_light_line' : 'dashed_line'}>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('common815', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('common815', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                                disabled={!editMode}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}                     
                    </tr>
                  ))}

                  {common818Team.map((row, index) => (
                    <tr key={index} onContextMenu={(e) => handleRightClick(e, 'common818')}>
                      {row.map((item, i) => (
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td className={index === common818Team.length-1 ? 'border_light_line' : 'dashed_line'}>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('common818', index, e.target.value)}
                                className="left-align"
                                disabled={!editMode}
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td className={index === common818Team.length-1 ? 'border_light_line' : 'dashed_line'}>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('common818', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('common818', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                                disabled={!editMode}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}                     
                    </tr>
                  ))}

                  {common819Team.map((row, index) => (
                    <tr key={index} onContextMenu={(e) => handleRightClick(e, 'common819')}>
                      {row.map((item, i) => (
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td className={index === common819Team.length-1 ? 'border_line' : 'dashed_line'}>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('common819', index, e.target.value)}
                                className="left-align"
                                disabled={!editMode}
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td className={index === common819Team.length-1 ? 'border_line' : 'dashed_line'}>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('common819', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('common819', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                                disabled={!editMode}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}                     
                    </tr>
                  ))}
                  
                  {managementTeam.map((row, index) => (
                    <tr key={index} onContextMenu={(e) => e.preventDefault()}>
                      {index === 0 ? (
                        <>
                          <th rowSpan={ManageRowSpan} className="th_right th_bottom">관리부 <br /> (10) </th>
                          <th rowSpan={managementTeam.length} className="th_right th_bottom">관리팀 <br /> (01) </th>
                          <th rowSpan={managementTeam.length} className="th_right th_bottom">1001</th>
                        </>
                      ) : null}
                      {row.map((item, i) => (
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td className={index === managementTeam.length-1 ? 'border_line' : 'dashed_line'} onContextMenu={(e) => handleRightClick(e, 'management')}>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('management', index, e.target.value)}
                                className="left-align"
                                disabled={!editMode}
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td className={index === managementTeam.length-1 ? 'border_line' : 'dashed_line'} onContextMenu={(e) => handleRightClick(e, 'management')}>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('management', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('management', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                                disabled={!editMode}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={managementTeam.length} className="th_left th_right th_bottom text_right"> {managementCost.toLocaleString()} </th>
                          <th rowSpan={ManageRowSpan} className="th_bottom text_right"> {(managementCost + supportCost).toLocaleString()} </th>
                        </>
                      ) : null}
                    </tr>
                  ))}

                  {supportTeam.map((row, index) => (
                    <tr key={index} onContextMenu={(e) => e.preventDefault()}>
                    {index === 0 ? (
                      <>
                          <th rowSpan={supportTeam.length} className="th_right th_bottom">지원팀 <br /> (02) </th>
                          <th rowSpan={supportTeam.length} className="th_right th_bottom">1002</th>
                        </>
                      ) : null}
                      {row.map((item, i) => (
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td className={index === supportTeam.length-1 ? 'border_line' : 'dashed_line'} onContextMenu={(e) => handleRightClick(e, 'support')}>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('support', index, e.target.value)}
                                className="left-align"
                                disabled={!editMode}
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td className={index === supportTeam.length-1 ? 'border_line' : 'dashed_line'} onContextMenu={(e) => handleRightClick(e, 'support')}>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('support', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('support', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                                disabled={!editMode}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={supportTeam.length} className="th_left th_right th_bottom text_right"> {supportCost.toLocaleString()} </th>
                        </>
                      ) : null}
                    </tr>
                  ))}

                  {devOneTeam.map((row, index) => (
                    <tr key={index} onContextMenu={(e) => e.preventDefault()}>
                      {index === 0 ? (
                        <>
                          <th rowSpan={DevRowSpan} className="th_right th_bottom">개발부 <br /> (20) </th>
                          <th rowSpan={devOneTeam.length} className="th_right th_bottom">개발 1팀 <br /> (01) </th>
                          <th rowSpan={devOneTeam.length} className="th_right th_bottom">2001</th>
                        </>
                      ) : null}
                      {row.map((item, i) => (
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td className={index === devOneTeam.length-1 ? 'border_line' : 'dashed_line'} onContextMenu={(e) => handleRightClick(e, 'devOne')}>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('devOne', index, e.target.value)}
                                className="left-align"
                                disabled={!editMode}
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td className={index === devOneTeam.length-1 ? 'border_line' : 'dashed_line'} onContextMenu={(e) => handleRightClick(e, 'devOne')}>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('devOne', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('devOne', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                                disabled={!editMode}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={devOneTeam.length} className="th_left th_right th_bottom text_right"> {devOneCost.toLocaleString()} </th>
                          <th rowSpan={DevRowSpan} className="th_bottom text_right"> {(devOneCost + devTwoCost).toLocaleString()} </th>
                        </>
                      ) : null}
                    </tr>
                  ))}


                  {devTwoTeam.map((row, index) => (
                    <tr key={index} onContextMenu={(e) => e.preventDefault()}>
                      {index === 0 ? (
                        <>
                          <th rowSpan={devTwoTeam.length} className="th_right th_bottom">개발 2팀 <br /> (02) </th>
                          <th rowSpan={devTwoTeam.length} className="th_right th_bottom">2002</th>
                        </>
                      ) : null}
                      {row.map((item, i) => (
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td className={index === devTwoTeam.length-1 ? 'border_line' : 'dashed_line'} onContextMenu={(e) => handleRightClick(e, 'devTwo')}>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('devTwo', index, e.target.value)}
                                className="left-align"
                                disabled={!editMode}
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td className={index === devTwoTeam.length-1 ? 'border_line' : 'dashed_line'} onContextMenu={(e) => handleRightClick(e, 'devTwo')}>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('devTwo', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('devTwo', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                                disabled={!editMode}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={devTwoTeam.length} className="th_left th_right th_bottom text_right"> {devTwoCost.toLocaleString()} </th>
                        </>
                      ) : null}
                    </tr>
                  ))}
                  
                  {designTeam.map((row, index) => (
                    <tr key={index} onContextMenu={(e) => e.preventDefault()}>
                      {index === 0 ? (
                        <>
                          <th rowSpan={MarketingRowSpan} className="th_right th_bottom">마케팅부 <br /> (40) </th>
                          <th rowSpan={designTeam.length} className="th_right th_bottom">디자인팀 <br /> (01) </th>
                          <th rowSpan={designTeam.length} className="th_right th_bottom">4001</th>
                        </>
                      ) : null}
                      {row.map((item, i) => (
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td className={index === designTeam.length-1 ? 'border_line' : 'dashed_line'} onContextMenu={(e) => handleRightClick(e, 'design')}>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('design', index, e.target.value)}
                                className="left-align"
                                disabled={!editMode}
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td className={index === designTeam.length-1 ? 'border_line' : 'dashed_line'} onContextMenu={(e) => handleRightClick(e, 'design')}>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('design', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('design', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                                disabled={!editMode}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={designTeam.length} className="th_left th_right th_bottom text_right"> {designCost.toLocaleString()} </th>
                          <th rowSpan={MarketingRowSpan} className="text_right">{(designCost + planningCost).toLocaleString()} </th>
                        </>
                      ) : null}
                    </tr>
                  ))}

                  
                  {planningTeam.map((row, index) => (
                    <tr key={index} onContextMenu={(e) => e.preventDefault()}>
                      {index === 0 ? (
                        <>
                          <th rowSpan={planningTeam.length} className="th_right">기획팀 <br /> (02) </th>
                          <th rowSpan={planningTeam.length} className="th_right">4002</th >
                        </>
                      ) : null}
                      {row.map((item, i) => (
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td className={index === planningTeam.length-1 ? 'border_line' : 'dashed_line'} onContextMenu={(e) => handleRightClick(e, 'planning')}>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('planning', index, e.target.value)}
                                className="left-align"
                                disabled={!editMode}
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td className={index === planningTeam.length-1 ? 'border_line' : 'dashed_line'} onContextMenu={(e) => handleRightClick(e, 'planning')}>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('planning', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('planning', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                                disabled={!editMode}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={planningTeam.length} className="th_left th_right text_right"> {planningCost.toLocaleString()} </th>
                        </>
                      ) : null}
                    </tr>
                  ))}

                </tbody>
              </table>
                
              <table className='Excel_total'>
                <tbody onContextMenu={(e) => e.preventDefault()}>
                  <tr>
                    <td className="total_title">부서(팀)별 편성액 합계</td>
                    <td className="total_cost">{( common811Cost + common812Cost + common813Cost + common814Cost + common815Cost + common818Cost + common819Cost + managementCost + supportCost + devOneCost + devTwoCost + designCost + planningCost).toLocaleString()}</td>
                    <td>  </td>
                  </tr>
                  <tr>
                    <td className="total_title">예비비</td>
                    <td className="total_cost">
                      {reserveFund ? (
                        <div onClick={() => setReserveFund(0)}>
                          {reserveFund.toLocaleString()}
                        </div>
                      ) : (
                        <select
                          name="예비비"
                          id="예비비"
                          className='dropdown_select'
                          onChange={(e) => {
                            const ratio = parseFloat(e.target.value) || 0;
                            const reserveFund = (common811Cost + common812Cost + common813Cost + common814Cost + common815Cost + common818Cost + common819Cost + managementCost + supportCost + devOneCost + devTwoCost + designCost + planningCost) * ratio / 100;
                            setReserveFund(reserveFund);
                            setPercentage(e.target.value); 
                          }}
                          disabled={!editMode}
                          value={percentage}
                        >
                          <option value=""></option>
                          <option value="5">5%</option>
                          <option value="10">10%</option>
                          <option value="15">15%</option>
                          <option value="20">20%</option>
                          <option value="25">25%</option>
                          <option value="30">30%</option>
                        </select>
                      )}
                    </td>
                    <td>
                      <input
                        type="text"
                        value={customInputValue}
                        onChange={(e) => handleCustomInputChange(e.target.value)}
                        className='dropdown_input'
                        disabled={!editMode}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="total_title">{selectedYear}년 총 예산</td>
                    <td className="total_cost">{(( common811Cost + common812Cost + common813Cost + common814Cost + common815Cost + common818Cost + common819Cost + managementCost + supportCost + devOneCost + devTwoCost + designCost + planningCost) + reserveFund).toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      </div>  
      {dropdownOpen && dropdownTeam && (
        <span className="oper-dropdown-menu" style={{ position: 'absolute', top: dropdownPosition.y - 50, left: dropdownPosition.x - 250 }}>
          <div className="dropdown_title">
            {(() => {
              switch (dropdownTeam) {
                case 'common811':
                  return '공통 - 811';
                case 'common812':
                  return '공통 - 812';
                case 'common813':
                  return '공통 - 813';
                case 'common814':
                  return '공통 - 814';
                case 'common815':
                  return '공통 - 815';
                case 'common818':
                  return '공통 - 818';
                case 'common819':
                  return '공통 - 819';
                case 'management':
                  return '관리팀';
                case 'support':
                  return '지원팀';
                case 'devOne':
                  return '개발 1팀';
                case 'devTwo':
                  return '개발 2팀';
                case 'design':
                  return '디자인팀';
                case 'planning':
                  return '기획팀';
                  default:
                  return '';
              }
            })()}
          </div>
          <div className="dropdown_border"></div>
          <div className="dropdown_add" onClick={() => addRow(dropdownTeam)}>행 추가</div>
          <div className="dropdown_del" onClick={() => removeRow(dropdownTeam)}>행 삭제</div>
        </span>
      )}
    </div>
  );
};

export default Operating;