import React, { useState, useEffect } from 'react';
import "./Operating.scss";
import { Link } from "react-router-dom";
import { evaluate } from "mathjs";

const Operating = () => {
  const accountCode = {
    81101 : '비품-사무용가구',
    81102 : '비품-업무용비품'
  }


  const [commonTeam, setCommonTeam] = useState<string[][]>([['', '', '', '']]);
  const [managementTeam, setManagementTeam] = useState<string[][]>([['', '', '', '']]);
  const [supportTeam, setSupportTeam] = useState<string[][]>([['', '', '', '']]);
  const [devOneTeam, setDevOneTeam] = useState<string[][]>([['', '', '', '']]);
  const [devTwoTeam, setDevTwoTeam] = useState<string[][]>([['', '', '', '']]);
  const [blockchainTeam, setBlockChainTeam] = useState<string[][]>([['', '', '', '']]);
  const [designTeam, setDesignTeam] = useState<string[][]>([['', '', '', '']]);
  const [planningTeam, setPlanningTeam] = useState<string[][]>([['', '', '', '']]);
  

  const addRow = (team: 'common' | 'management' | 'support' | 'devOne' | 'devTwo' | 'blockchain' | 'design' | 'planning') => {
    let newTeam: string[][];

    if (team === 'common') {
      newTeam = [...commonTeam, ['', '', '', '']];
      setCommonTeam(newTeam);
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
    } else if (team === 'blockchain') {
      newTeam = [...blockchainTeam, ['', '', '', '']];
      setBlockChainTeam(newTeam);
    } else if (team === 'design') {
      newTeam = [...designTeam, ['', '', '', '']];
      setDesignTeam(newTeam);
    } else {
      newTeam = [...planningTeam, ['', '', '', '']];
      setPlanningTeam(newTeam);
    }
  
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
      case 'common':
        setTeamState(setCommonTeam, team, index, column, value);
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
      case 'blockchain':
        setTeamState(setBlockChainTeam, team, index, column, value);
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
        
        handleInputChange(team, index, column, calculatedValue.toLocaleString());
      } catch (error) {
        window.alert('수식이 잘못 입력됐습니다.')
        // 수식 에러 처리
      }
    }
  };


  const CommonRowSpan = commonTeam.length;
  const ManageRowSpan = managementTeam.length + supportTeam.length;
  const DevRowSpan = devOneTeam.length + devTwoTeam.length;
  const BlockChainRowSpan = blockchainTeam.length;
  const MarketingRowSpan = designTeam.length + planningTeam.length;

  useEffect(() => {
    
  },);

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/operating-manage"} className="sub_header">운영비 관리</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="container_operating">
            <div className="Excel_operating">

              <table className='Explan_operating'>
                <tbody>
                  <tr>
                    <th className="table_header_name" colSpan={2}>부서 / 팀명</th>
                    <th className="table_header_name_code">부서 코드</th>
                    <th className="table_header_account_code">계정 코드</th>
                    <th className="table_header_account">계정명</th>
                    <th className="table_header_yearAccount">연간편성액(원)</th>
                    <th className="table_header_note">비고</th>
                    <th className="table_header_totalAccount">합계</th>
                    <th className="table_header_totalAccount">부서 합계</th>
                  </tr>
                  
                  {commonTeam.map((row, index) => (
                    <tr key={index} className={index === commonTeam.length-1 ? 'border_line' : 'dashed_line'}>
                      {index === 0 ? (
                        <>
                          <th rowSpan={CommonRowSpan} colSpan={2}>공통 <br /> (1000) </th>
                          <th rowSpan={commonTeam.length}>1000</th>
                        </>
                      ) : null}
                      {row.map((item, i) => (
                        <td key={i}>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleInputChange('common', index, i, e.target.value)}
                            onKeyDown={i === 2 ? (e) => handleInputKeyDown('common', index, i, e) : undefined}
                            className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                          />
                        </td>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={CommonRowSpan}> </th>
                          <th rowSpan={commonTeam.length}></th>
                        </>
                      ) : null}
                    </tr>
                  ))}

                  {managementTeam.map((row, index) => (
                    <tr key={index} className={index === managementTeam.length-1 ? 'border_line' : 'dashed_line'}>
                      {index === 0 ? (
                        <>
                          <th rowSpan={ManageRowSpan}>관리부 <br /> (10) </th>
                          <th rowSpan={managementTeam.length}>관리팀 <br /> (01) </th>
                          <th rowSpan={managementTeam.length}>1001</th>
                        </>
                      ) : null}
                      {row.map((item, i) => (
                        <td key={i}>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleInputChange('management', index, i, e.target.value)}
                            onKeyDown={i === 2 ? (e) => handleInputKeyDown('management', index, i, e) : undefined}
                            className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                          />
                        </td>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={managementTeam.length}></th>
                          <th rowSpan={ManageRowSpan}> </th>
                        </>
                      ) : null}
                    </tr>
                  ))}

                  {supportTeam.map((row, index) => (
                    <tr key={index} className={index === supportTeam.length-1 ? 'border_line' : 'dashed_line'}>
                      {index === 0 ? (
                        <>
                          <th rowSpan={supportTeam.length}>지원팀 <br /> (02) </th>
                          <th rowSpan={supportTeam.length}>1002</th>
                        </>
                      ) : null}
                      {row.map((item, i) => (
                        <td key={i}>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleInputChange('support', index, i, e.target.value)}
                            onKeyDown={i === 2 ? (e) => handleInputKeyDown('support', index, i, e) : undefined}
                            className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                          />
                        </td>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={supportTeam.length}></th>
                        </>
                      ) : null}
                    </tr>
                  ))}

                  {devOneTeam.map((row, index) => (
                    <tr key={index} className={index === devOneTeam.length-1 ? 'border_line' : 'dashed_line'}>
                      {index === 0 ? (
                        <>
                          <th rowSpan={DevRowSpan}>개발부 <br /> (20) </th>
                          <th rowSpan={devOneTeam.length}>개발 1팀 <br /> (01) </th>
                          <th rowSpan={devOneTeam.length}>2001</th>
                        </>
                      ) : null}
                      {row.map((item, i) => (
                        <td key={i}>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleInputChange('devOne', index, i, e.target.value)}
                            onKeyDown={i === 2 ? (e) => handleInputKeyDown('devOne', index, i, e) : undefined}
                            className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                          />
                        </td>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={devOneTeam.length}></th>
                          <th rowSpan={DevRowSpan}> </th>
                        </>
                      ) : null}
                    </tr>
                  ))}


                  {devTwoTeam.map((row, index) => (
                    <tr key={index} className={index === devTwoTeam.length-1 ? 'border_line' : 'dashed_line'}>
                      {index === 0 ? (
                        <>
                          <th rowSpan={devTwoTeam.length}>개발 2팀 <br /> (02) </th>
                          <th rowSpan={devTwoTeam.length}>2002</th>
                        </>
                      ) : null}
                      {row.map((item, i) => (
                        <td key={i}>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleInputChange('devTwo', index, i, e.target.value)}
                            onKeyDown={i === 2 ? (e) => handleInputKeyDown('devTwo', index, i, e) : undefined}
                            className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                          />
                        </td>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={devTwoTeam.length}></th>
                        </>
                      ) : null}
                    </tr>
                  ))}

                  {blockchainTeam.map((row, index) => (
                    <tr key={index} className={index === blockchainTeam.length-1 ? 'border_line' : 'dashed_line'}>
                      {index === 0 ? (
                        <>
                          <th rowSpan={BlockChainRowSpan}>블록체인 <br />사업부 <br /> (30) </th>
                          <th rowSpan={blockchainTeam.length}>블록체인 <br /> 1팀 <br /> (01) </th>
                          <th rowSpan={blockchainTeam.length}>3001</th>
                        </>
                      ) : null}
                      {row.map((item, i) => (
                        <td key={i}>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleInputChange('blockchain', index, i, e.target.value)}
                            onKeyDown={i === 2 ? (e) => handleInputKeyDown('blockchain', index, i, e) : undefined}
                            className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                          />
                        </td>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={BlockChainRowSpan}></th>
                          <th rowSpan={blockchainTeam.length}></th>
                        </>
                      ) : null}
                    </tr>
                  ))}
                  
                  {designTeam.map((row, index) => (
                    <tr key={index} className={index === designTeam.length-1 ? 'border_line' : 'dashed_line'}>
                      {index === 0 ? (
                        <>
                          <th rowSpan={MarketingRowSpan}>마케팅부 <br /> (40) </th>
                          <th rowSpan={designTeam.length}>디자인팀 <br /> (01) </th>
                          <th rowSpan={designTeam.length}>4001</th>
                        </>
                      ) : null}
                      {row.map((item, i) => (
                        <td key={i}>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleInputChange('design', index, i, e.target.value)}
                            onKeyDown={i === 2 ? (e) => handleInputKeyDown('design', index, i, e) : undefined}
                            className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                          />
                        </td>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={designTeam.length}></th>
                          <th rowSpan={MarketingRowSpan}></th>
                        </>
                      ) : null}
                    </tr>
                  ))}

                  
                  {planningTeam.map((row, index) => (
                    <tr key={index} className={index === planningTeam.length-1 ? 'border_line' : 'dashed_line'}>
                      {index === 0 ? (
                        <>
                          <th rowSpan={planningTeam.length}>기획팀 <br /> (02) </th>
                          <th rowSpan={planningTeam.length}>4002</th>
                        </>
                      ) : null}
                      {row.map((item, i) => (
                        <td key={i}>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleInputChange('planning', index, i, e.target.value)}
                            onKeyDown={i === 2 ? (e) => handleInputKeyDown('planning', index, i, e) : undefined}
                            className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                          />
                        </td>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={planningTeam.length}></th>
                        </>
                      ) : null}
                    </tr>
                  ))}



                </tbody>
              </table>
            </div>
          </div>

          <div>
            <input type='button' value='공통 행 추가' onClick={() => addRow('common')} />--
            <input type='button' value='관리팀 행 추가' onClick={() => addRow('management')} />--
            <input type='button' value='지원팀 행 추가' onClick={() => addRow('support')} />--
            <input type='button' value='개발1팀 행 추가' onClick={() => addRow('devOne')} />--
            <input type='button' value='개발2팀 행 추가' onClick={() => addRow('devTwo')} />--
            <input type='button' value='블록체인팀 행 추가' onClick={() => addRow('blockchain')} />--
            <input type='button' value='디자인팀 행 추가' onClick={() => addRow('design')} />--
            <input type='button' value='기획팀 행 추가' onClick={() => addRow('planning')} />
          </div>

        </div>
      </div>  
      
    </div>
  );
};

export default Operating;