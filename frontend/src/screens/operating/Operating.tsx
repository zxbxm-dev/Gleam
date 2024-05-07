import React, { useState, useEffect } from 'react';
import "./Operating.scss";
import { Link } from "react-router-dom";
import { evaluate } from "mathjs";

const Operating = () => {
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
    890 : '잡비',
  }


  const [commonTeam, setCommonTeam] = useState<string[][]>([['', '', '', '']]);
  const [managementTeam, setManagementTeam] = useState<string[][]>([['', '', '', '']]);
  const [supportTeam, setSupportTeam] = useState<string[][]>([['', '', '', '']]);
  const [devOneTeam, setDevOneTeam] = useState<string[][]>([['', '', '', '']]);
  const [devTwoTeam, setDevTwoTeam] = useState<string[][]>([['', '', '', '']]);
  const [blockchainTeam, setBlockChainTeam] = useState<string[][]>([['', '', '', '']]);
  const [designTeam, setDesignTeam] = useState<string[][]>([['', '', '', '']]);
  const [planningTeam, setPlanningTeam] = useState<string[][]>([['', '', '', '']]);
  

  const [commonCost, setCommonCost] = useState<number>(0);
  const [managementCost, setManagementCost] = useState<number>(0);
  const [supportCost, setSupportCost] = useState<number>(0);
  const [devOneCost, setDevOneCost] = useState<number>(0);
  const [devTwoCost, setDevTwoCost] = useState<number>(0);
  const [blockchainCost, setBlockChainCost] = useState<number>(0);
  const [designCost, setDesignCost] = useState<number>(0);
  const [planningCost, setPlanningnCost] = useState<number>(0);

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
        switch (team) {
          case 'common':
            setCommonCost(prevCost => prevCost + calculatedValue);
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
          case 'blockchain':
            setBlockChainCost(prevCost => prevCost + calculatedValue);
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
        window.alert('수식이 잘못 입력됐습니다.')
        // 수식 에러 처리
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
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('common', index, e.target.value)}
                                className="left-align"
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('common', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('common', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={CommonRowSpan}> {commonCost.toLocaleString()} </th>
                          <th rowSpan={commonTeam.length}> {commonCost.toLocaleString()} </th>
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
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('management', index, e.target.value)}
                                className="left-align"
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('management', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('management', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={managementTeam.length}> {managementCost.toLocaleString()} </th>
                          <th rowSpan={ManageRowSpan}> {(managementCost + supportCost).toLocaleString()} </th>
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
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('support', index, e.target.value)}
                                className="left-align"
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('support', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('support', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={supportTeam.length}> {supportCost.toLocaleString()} </th>
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
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('devOne', index, e.target.value)}
                                className="left-align"
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('devOne', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('devOne', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={devOneTeam.length}> {devOneCost.toLocaleString()} </th>
                          <th rowSpan={DevRowSpan}> {(devOneCost + devTwoCost).toLocaleString()} </th>
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
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('devTwo', index, e.target.value)}
                                className="left-align"
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('devTwo', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('devTwo', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={devTwoTeam.length}> {devTwoCost.toLocaleString()} </th>
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
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('blockchain', index, e.target.value)}
                                className="left-align"
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('blockchain', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('blockchain', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={BlockChainRowSpan}> {blockchainCost.toLocaleString()} </th>
                          <th rowSpan={blockchainTeam.length}> {blockchainCost.toLocaleString()} </th>
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
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('design', index, e.target.value)}
                                className="left-align"
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('design', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('design', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={designTeam.length}> {designCost.toLocaleString()} </th>
                          <th rowSpan={MarketingRowSpan}> {(designCost + planningCost).toLocaleString()} </th>
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
                        <React.Fragment key={i}>
                          {i === 1 ? (
                            <td>
                              <select
                                value={item}
                                onChange={(e) => handleAccountNameChange('planning', index, e.target.value)}
                                className="left-align"
                              >
                                {Object.entries(accountCode).map(([code, department]) => (
                                  <option key={code} value={department}>
                                    {department}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            <td>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('planning', index, i, e.target.value)}
                                onKeyDown={i === 2 ? (e) => handleInputKeyDown('planning', index, i, e) : undefined}
                                className={i === 1 ? 'left-align' : i === 2 ? 'right-align' : 'center-align'}
                              />
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                      {index === 0 ? (
                        <>
                          <th rowSpan={planningTeam.length}> {planningCost.toLocaleString()} </th>
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