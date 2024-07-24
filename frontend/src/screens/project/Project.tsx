import "./Project.scss";
import {
  Right_Arrow,
  White_Arrow,
  mail_delete,
  mail_important,
} from "../../assets/images/index";
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomModal from "../../components/modal/CustomModal";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';
import { PersonData } from '../../services/person/PersonServices';
import { useQuery } from 'react-query';
import { CheckProject, addMainProject, addSubProject, EditMainProject, DeleteMainProject } from "../../services/project/ProjectServices";

interface ProjectData {
  mainprojectIndex: number;
  userId: string;
  status: string;
  projectName: string;
  Leader: string;
  startDate: Date;
  endDate: Date;
  members: [string];
  referrer: [string];
  memo: string;
  pinned: boolean;
}

const Project = () => {
  const user = useRecoilValue(userState);
  const [ispjtModalOpen, setPjtModalOPen] = useState(false);
  const [isAddSubPjtModalOpen, setAddSubPjtModalOPen] = useState(false);
  const [isAddPjtModalOpen, setAddPjtModalOPen] = useState(false);
  const [isEditPjtModalOpen, setEditPjtModalOpen] = useState(false);
  const [isDeletePjtModalOpen, setDeletePjtModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const [persondata, setPersonData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [tabHeights, setTabHeights] = useState({ 0: '41px', 1: '35px' });
  const [tabMargins, setTabMargins] = useState({ 0: '6px', 1: '6px' });
  const calendarRef = useRef<FullCalendar>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [pjtTitle, setPjtTitle] = useState<string>('');
  const [pjtMemo, setPjtMemo] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [teamLeader, setTeamLeader] = useState('');
  const [inputteamLeader, setInputteamLeader] = useState('');
  const [allMembers, setAllMembers] = useState<string[]>([]);
  const [inputAllMember, setInputAllmember] = useState('');
  const [allReferrers, setAllReferrers] = useState<string[]>([]);
  const [inputAllReferrer, setInputAllReferrer] = useState('');

  const [slideVisible, setSlideVisible] = useState(false);
  const [projectVisible, setProjectVisible] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: true });
  const [stateIsOpen, setStateIsOpen] = useState(false);
  const [selectedstateOption, setSelectedStateOption] = useState('전체');

  const [projects, setProjects] = useState<any[]>([]);
  const [clickedProjects, setClickedProjects] = useState<ProjectData | null>(null);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<{ [key: number]: boolean }>({});
  const [subprojectVisible, setSubProjectVisible] = useState<{ [key: string]: boolean }>({});

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  
  const stateOptions = [
    '전체',
    '진행 중',
    '진행 완료',
  ];

  const resetForm = () => {
    setPjtTitle('');
    setPjtMemo('');
    setTeamLeader('');
    setAllMembers([]);
    setAllReferrers([]);
    setStartDate(null);
    setEndDate(null);
  }

  useEffect(() => {
    if (Array.isArray(projects)) {
      setSubProjectVisible(
        projects.reduce((acc: any, project: any) => {
          acc[project.id] = false;
          if (Array.isArray(project.subProjects)) {
            project.subProjects.forEach((subProject: any) => {
              acc[subProject.id] = false;
            });
          }
          return acc;
        }, {})
      );
    } else {
      setSubProjectVisible({});
    }
  }, [projects]);

  const toggleSubProjects = (projectId: string) => {
    setSubProjectVisible(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const toggleAllCheckboxes = () => {
    if (allSelected) {
      setSelectedProjects({});
    } else {
      const newSelectedProjects = projects.reduce((acc, project) => {
        acc[project.id] = true;
        return acc;
      }, {});
      setSelectedProjects(newSelectedProjects);
    }
    setAllSelected(!allSelected);
  };

  const toggleProjectSelection = (projectId: number) => {
    setSelectedProjects((prevSelectedProjects) => ({
      ...prevSelectedProjects,
      [projectId]: !prevSelectedProjects[projectId],
    }));
  };

  const fetchUser = async () => {
    try {
      const response = await PersonData();
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  };

  useQuery("person", fetchUser, {
    onSuccess: (data) => {
      setPersonData(data);
    },
    onError: (error) => {
      console.log(error);
    }
  })

  useEffect(() => {
    if (activeTab === 0) {
      setTabHeights({ 0: '41px', 1: '35px' });
      setTabMargins({ 0: '0px', 1: '6px' });
    } else {
      setTabHeights({ 0: '35px', 1: '41px' });
      setTabMargins({ 0: '6px', 1: '0px' });
    }
  }, [activeTab]);

  const events = [
    { title: 'ChainLinker | 1 시작일', start: new Date('2024-06-03'), end: new Date('2024-06-03'), backgroundColor: '#ABF0FF', borderColor: '#ABF0FF', textColor: '#000' },
    { title: 'FCTS | 2 시작일', start: new Date('2024-06-07'), end: new Date('2024-06-07'), backgroundColor: '#B1C3FF', borderColor: '#B1C3FF', textColor: '#000' },
    { title: 'DRChat | 5 시작일', start: new Date('2024-06-10'), end: new Date('2024-06-10'), backgroundColor: '#FCF5D7', borderColor: '#FCF5D7', textColor: '#000' },
    { title: 'ChainLinker | 1 만기일', start: new Date('2024-06-14'), end: new Date('2024-06-14'), backgroundColor: '#ABF0FF', borderColor: '#ABF0FF', textColor: '#000' },
    { title: 'FCTS | 2 만기일', start: new Date('2024-06-21'), end: new Date('2024-06-21'), backgroundColor: '#B1C3FF', borderColor: '#B1C3FF', textColor: '#000' },
    { title: 'DRChat | 5 만기일', start: new Date('2024-06-28'), end: new Date('2024-06-28'), backgroundColor: '#FCF5D7', borderColor: '#FCF5D7', textColor: '#000' },
  ];

  const handleEventClick = (info: any) => {
    setPjtModalOPen(true);
  };

  const toggleSlide = () => {
    setSlideVisible(!slideVisible);
  };

  const toggleProjectVisibility = (index: number) => {
    setProjectVisible(prevState => ({ ...prevState, [index]: !prevState[index] }));
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputteamLeader(e.target.value);
    setTeamLeader(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputteamLeader.trim()) {
        setTeamLeader(inputteamLeader.trim());
        setInputteamLeader('');
      }
    }
  };

  const handleAutoCompleteClick = (username: string, department: string, team: string) => {
    if (team) {
      setTeamLeader(team + ' ' + username);
    } else {
      setTeamLeader(department + ' ' + username);
    }
    setInputteamLeader('');
  };

  const handleInputAllMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAllmember(e.target.value);
  };

  const handleInputAllReferrerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAllReferrer(e.target.value);
  };

  const handleInputAllMemberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputAllMember.trim()) {
        setAllMembers([...allMembers, inputAllMember.trim()]);
        setInputAllmember('');
      }
    }
  };

  const handleInputAllReferrerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputAllReferrer.trim()) {
        setAllReferrers([...allReferrers, inputAllReferrer.trim()]);
        setInputAllReferrer('');
      }
    }
  };
  
  const handleAutoAllMembersCompleteClick = (username: string, department: string, team: string) => {
    if (team) {
      setAllMembers([...allMembers, team + ' ' + username]);
    } else {
      setAllMembers([...allMembers, department + ' ' + username]);
    }

    setInputAllmember('');
  };

  const handleAutoAllReferrersCompleteClick = (username: string, department: string, team: string) => {
    if (team) {
      setAllReferrers([...allReferrers, team + ' ' + username]);
    } else {
      setAllReferrers([...allReferrers, department + ' ' + username]);
    }

    setInputAllReferrer('');
  };

  const handleRecipientRemove = (user: string) => {
    setAllMembers(allMembers.filter(member => member !== user));
  };

  const handleReferrersRemove = (user: string) => {
    setAllReferrers(allReferrers.filter(member => member !== user));
  };

  const filteredNames = persondata.filter(person => {
    const inputLowerCase = inputteamLeader.toLowerCase();
    if (person.team) {
      return (
        person.username.toLowerCase().includes(inputLowerCase) ||
        person.team.toLowerCase().includes(inputLowerCase)
      );
    } else {
      return (
        person.username.toLowerCase().includes(inputLowerCase) ||
        person.department.toLowerCase().includes(inputLowerCase)
      );
    }
  });

  const filteredAllmembersNames = persondata.filter(person => {
    const inputLowerCase = inputAllMember.toLowerCase();
    if (person.team) {
      return (
        person.username.toLowerCase().includes(inputLowerCase) ||
        person.team.toLowerCase().includes(inputLowerCase)
      )
    } else {
      return (
        person.username.toLowerCase().includes(inputLowerCase) ||
        person.department.toLowerCase().includes(inputLowerCase)
      )
    }
  });

  const filteredAllReferrersNames = persondata.filter(person => {
    const inputLowerCase = inputAllReferrer.toLowerCase();
    if (person.team) {
      return (
        person.username.toLowerCase().includes(inputLowerCase) ||
        person.team.toLowerCase().includes(inputLowerCase)
      )
    } else {
      return (
        person.username.toLowerCase().includes(inputLowerCase) ||
        person.department.toLowerCase().includes(inputLowerCase)
      )
    }
  });

  const togglestate = () => {
    setStateIsOpen(!stateIsOpen);
  }

  const handleStateSelect = (option: string) => {
    setSelectedStateOption(option);
    setStateIsOpen(false);
  }

  const handleRightClick = (project: ProjectData, event: React.MouseEvent<HTMLTableCellElement>) => {
    setClickedProjects(project);
    event.preventDefault();
    setDropdownOpen(true);
    setDropdownPosition({ x: event.pageX, y: event.pageY });
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownOpen && !event.target.closest('.dropdown-menu')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  // 프로젝트 일정 조회
  const fetchProject = async () => {
    try {
      const response = await CheckProject();
      return response.data;
    } catch (error) {
      console.log("Failed to fetch Project data");
    }
  };

  const { refetch : refetchProject } = useQuery("Project", fetchProject, {
    enabled: false,
    onSuccess: (data) => {
      console.log('불러온 프로젝트', data);
      if (selectedstateOption === '전체') {
        setProjects(data.mainprojects);
      } else if (selectedstateOption === '진행 중') {
        const filteredProjects = data.mainprojects.filter((project: any) => project.status === 'inprogress');
        setProjects(filteredProjects)
      } else {
        const filteredProjects = data.mainprojects.filter((project: any) => project.status === 'done');
        setProjects(filteredProjects)
      }
    },
    onError: (error) => {
      console.log(error);
    }
  });

  // 메인 프로젝트 추가
  const handleAddMainProject = async () => {
    const pjtDetails = {
      userID: user.userID,
      projectName: pjtTitle,
      Leader: teamLeader,
      members: allMembers,
      referrer: allReferrers,
      startDate: startDate,
      endDate: endDate,
      memo: pjtMemo,
    };

    try {
      const response = await addMainProject(pjtDetails);
      console.log('메인 프로젝트 추가 성공', response.data);
      setStatusMessage('프로젝트 일정을 추가하였습니다.')
      setIsStatusModalOpen(true);
    } catch (error: any) {
      console.log('메인 프로젝트 추가 실패', error);
      setStatusMessage('프로젝트 일정 추가에 실패하였습니다.')
      setIsStatusModalOpen(true);
    }
    refetchProject();
    resetForm();
  };

  // 서브 프로젝트 추가
  const handleAddSubProject = async (mainprojectindex: any) => {
    const pjtDetails = {
      userID: user.userID,
      projectName: pjtTitle,
      Leader: teamLeader,
      members: allMembers,
      referrer: allReferrers,
      startDate: startDate,
      endDate: endDate,
      memo: pjtMemo,
    };

    try {
      const response = await addSubProject(mainprojectindex, pjtDetails);
      console.log('서브 프로젝트 추가 성공', response.data);
      setStatusMessage('프로젝트 일정을 추가하였습니다.')
      setIsStatusModalOpen(true);
    } catch (error: any) {
      console.log('서브 프로젝트 추가 실패', error);
      setStatusMessage('프로젝트 일정 추가에 실패하였습니다.')
      setIsStatusModalOpen(true);
    }

    refetchProject();
    resetForm();
  };

  // 메인 프로젝트 수정
  const handleEditProject = (mainprojectIndex: number) => {
    const pjtData = {
      userID: user.userID,
      projectName: pjtTitle,
      Leader: teamLeader,
      members: allMembers,
      referrer: allReferrers,
      startDate: startDate,
      endDate: endDate,
      memo: pjtMemo,
      status: 'inprogress',
      pinned: false,
    }

    EditMainProject(mainprojectIndex, pjtData)
    .then(() => {
      console.log('메인 프로젝트 수정 성공');
      refetchProject();
    })
    .catch((error) => {
      console.log('메인 프로젝트 수정 실패', error)
    })
  }

  // 메인 프로젝트 삭제


  useEffect(() => {
    refetchProject();
  }, [refetchProject, selectedstateOption]);

  return (
    <div className="content">
      <div className="content_container">
        {activeTab === 0 &&
          <div className="project_header_right">
            <button className="primary_button" onClick={() => setAddPjtModalOPen(true)}>새업무 +</button>
          </div>
        }
        <Tabs variant='enclosed' onChange={(index) => setActiveTab(index)}>
          <TabList>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[0]} marginTop={tabMargins[0]}>담당 업무</Tab>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[1]} marginTop={tabMargins[1]}>일정</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <div className="project_container">
                <div className="project_container_header">
                  <div className="project_container_header_left">
                    <label className="custom-checkbox">
                      <input type="checkbox" id="check1" checked={allSelected} onChange={toggleAllCheckboxes}/>
                      <span></span>
                    </label>
                    <img src={mail_delete} alt="mail_delete" onClick={() => setDeletePjtModalOpen(true)}/>
                    <img src={mail_important} alt="mail_important" />
                  </div>

                  <div className="project_container_header_right" onClick={togglestate}>
                    <span>상태 : {selectedstateOption}</span>
                    <img src={White_Arrow} alt="White_Arrow" />
                  </div>
                  {stateIsOpen && (
                    <ul className="dropdown_menu">
                      {stateOptions.map((option) => (
                        <li key={option} onClick={() => handleStateSelect(option)}>
                          {option}
                          <div className={option === '진행 중' ? 'blue_circle' : option === '진행 완료' ? 'brown_circle' : ''}></div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="project_content">
                  <table className="project_board_list">
                    <colgroup>
                      <col width="3%" />
                      <col width="7%" />
                      <col width="10%" />
                      <col width="35%" />
                      <col width="15%" />
                      <col width="15%" />
                      <col width="15%" />
                    </colgroup>
                    <thead>
                      <tr className="board_header">
                        <th></th>
                        <th>번호</th>
                        <th>상태</th>
                        <th>제목</th>
                        <th>팀리더</th>
                        <th>시작일</th>
                        <th>마감일</th>
                      </tr>
                    </thead>
                    <tbody className="board_container">
                      {(Array.isArray(projects) ? projects : []).map((project, index) => (
                        <React.Fragment key={project.mainprojectIndex}>
                          <tr className="board_content">
                            <td>
                              <label className="custom-checkbox">
                                <input 
                                  type="checkbox"
                                  checked={allSelected ? allSelected : selectedProjects[project.mainprojectIndex] || false}
                                  onChange={() => toggleProjectSelection(project.mainprojectIndex)}   
                                />
                                <span></span>
                              </label>
                            </td>
                            <td>{index + 1}</td>
                            <td className={project.status === 'notstarted' ? 'text_medium' : project.status === 'inprogress' ? 'text_medium text_blue' : 'text_medium text_brown'}>{project.status === 'notstarted' ? '대기 중' : project.status === 'inprogress' ? '진행 중' : '진행 완료'}</td>
                            <td
                              className="text_left_half text_cursor"
                              onClick={() => toggleSubProjects(project.mainprojectIndex)}
                              onContextMenu={(e) => handleRightClick(project, e)}
                            >
                              <div className="dropdown">
                                {project.projectName}
                                {dropdownOpen && (
                                  <div className="dropdown-menu" style={{ position: 'absolute', top: dropdownPosition.y - 70, left: dropdownPosition.x - 210 }}>
                                    <div className="dropdown_pin" 
                                          onClick={(e) => {
                                            e.stopPropagation(); 
                                            setEditPjtModalOpen(true); 
                                            setPjtTitle(clickedProjects?.projectName || ''); 
                                            setTeamLeader(clickedProjects?.Leader || '');
                                            setAllMembers(clickedProjects?.members || []);
                                            setAllReferrers(clickedProjects?.referrer || []);
                                            setStartDate(clickedProjects?.startDate || null);
                                            setEndDate(clickedProjects?.endDate || null);
                                      }
                                    }>
                                      편집
                                    </div>
                                    <div className="dropdown_pin" onClick={(e) => {e.stopPropagation(); setAddSubPjtModalOPen(true);}}>추가</div>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>{project.Leader}</td>
                            <td>{new Date(project.startDate).toISOString().substring(0, 10)}</td>
                            <td>{new Date(project.endDate).toISOString().substring(0, 10)}</td>
                          </tr>
                          {subprojectVisible[project.mainprojectIndex] && project.subProjects && (
                            project.subProjects.map((subProject: any) => (
                              <tr key={subProject.mainprojectIndex} className="board_content subproject">
                                <td>
                                  <label className="custom-checkbox">
                                    <input type="checkbox" id="check1" />
                                    <span></span>
                                  </label>
                                </td>
                                <td>{subProject.id}</td>
                                <td>{subProject.state}</td>
                                <td className="text_left text_cursor">{subProject.title}</td>
                                <td>{subProject.teamLeader}</td>
                                <td>{subProject.startDate}</td>
                                <td>{subProject.endDate}</td>
                              </tr>
                            ))
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="project_container">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  height="100%"
                  headerToolbar={{
                    start: 'prev title next',
                    center: '',
                    end: '',
                  }}
                  dayHeaderFormat={{ weekday: 'long' }}
                  titleFormat={(date) => `${date.date.year}년 ${date.date.month + 1}월`}
                  dayCellContent={(info) => {
                    var number = document.createElement("a");
                    number.classList.add("fc-daygrid-day-number");
                    number.innerHTML = info.dayNumberText.replace("일", "");
                    if (info.view.type === "dayGridMonth") {
                      return { html: number.outerHTML };
                    }
                    return { domNodes: [] };
                  }}
                  locale='kr'
                  fixedWeekCount={false}
                  events={events}
                  eventContent={(arg) => <div>{arg.event.title.replace('오전 12시 ', '')}</div>}
                  dayMaxEventRows={true}
                  eventDisplay="block"
                  eventClick={handleEventClick}
                  moreLinkText='개 일정 더보기'
                />
              </div>

              <div className="project_slide_container">
                <div className={`project_slide ${slideVisible ? 'visible' : ''}`} onClick={toggleSlide}>
                  <span>전체 프로젝트 일정</span>
                  {slideVisible ? (
                    <img src={White_Arrow} alt="White_Arrow" className="img_rotate" />
                  ) : (
                    <img src={White_Arrow} alt="White_Arrow" />
                  )}
                </div>

                <div className={`additional_content ${slideVisible ? 'visible' : ''}`}>
                  <div className="project_content">
                    <div className="project_name_container">
                      <div className="name_left" onClick={() => toggleProjectVisibility(0)}>
                        {projectVisible[0] ? (
                          <img src={Right_Arrow} alt="Right_Arrow" className="img_rotate" />
                        ) : (
                          <img src={Right_Arrow} alt="Right_Arrow" />
                        )}
                        <span className="project_name">Chain-Linker</span>
                      </div>
                      <div className="name_right">
                        <span className="project_state">진행 중</span>
                        <div></div>
                      </div>
                    </div>
                    {projectVisible[0] && (
                      <div className="project_content_container">
                        <div>3 | 프론트엔드 개발</div>
                        <div>팀리더 : 개발1팀 장현지</div>
                        <div>프로젝트 기간 : 2024.06.12 ~ 2024.08.16</div>
                      </div>
                    )}
                  </div>

                  <div className="project_content">
                    <div className="project_name_container">
                      <div className="name_left" onClick={() => toggleProjectVisibility(1)}>
                        {projectVisible[1] ? (
                          <img src={Right_Arrow} alt="Right_Arrow" className="img_rotate" />
                        ) : (
                          <img src={Right_Arrow} alt="Right_Arrow" />
                        )}
                        <span className="project_name">FCTS</span>
                      </div>
                      <div className="name_right">
                        <span className="project_state">진행 중</span>
                        <div></div>
                      </div>
                    </div>
                    {projectVisible[1] && (
                      <div className="project_content_container">
                        <div>3 | 프론트엔드 개발</div>
                        <div>팀리더 : 개발1팀 장현지</div>
                        <div>프로젝트 기간 : 2024.06.12 ~ 2024.08.16</div>
                      </div>
                    )}
                  </div>

                  <div className="project_content">
                    <div className="project_name_container">
                      <div className="name_left" onClick={() => toggleProjectVisibility(2)}>
                        {projectVisible[2] ? (
                          <img src={Right_Arrow} alt="Right_Arrow" className="img_rotate" />
                        ) : (
                          <img src={Right_Arrow} alt="Right_Arrow" />
                        )}
                        <span className="project_name">DRChat</span>
                      </div>
                      <div className="name_right">
                        <span className="project_state">진행 중</span>
                        <div></div>
                      </div>
                    </div>
                    {projectVisible[2] && (
                      <div className="project_content_container">
                        <div>3 | 프론트엔드 개발</div>
                        <div>팀리더 : 개발1팀 장현지</div>
                        <div>프로젝트 기간 : 2024.06.12 ~ 2024.08.16</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      <CustomModal
        isOpen={isAddPjtModalOpen}
        onClose={() => { setAddPjtModalOPen(false); resetForm(); }}
        header={'프로젝트 - 새 업무'}
        footer1={'저장'}
        footer1Class="green-btn"
        onFooter1Click={() => { setAddPjtModalOPen(false); resetForm(); handleAddMainProject(); }}
        width="500px"
        height="550px"
      >
        <div className="body-container">
          <div className="body_container_content">
            <div className="body_container_content_title">프로젝트 명</div>
            <input type="text" value={pjtTitle} onChange={(e) => setPjtTitle(e.target.value)}/>
          </div>

          <div className="body_container_content">
            <div className="body_container_content_title">팀리더</div>
            <input
              type="text"
              value={teamLeader}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              ref={inputRef}
            />
            {inputteamLeader && (
              <ul className="autocomplete_dropdown">
                {filteredNames.map(person => (
                  <li key={person.username} onClick={() => handleAutoCompleteClick(person.username, person.department, person.team)}>
                    {person.team ? person.team : person.department} &nbsp;
                    {person.username}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="body_container_content">
            <div className="body_container_content_title">전체 팀원</div>
            <input
              type="text"
              value={inputAllMember}
              onChange={handleInputAllMemberChange}
              onKeyDown={handleInputAllMemberKeyDown}
              ref={inputRef}
            />
            {inputAllMember && (
              <ul className="autocomplete_dropdown">
                {filteredAllmembersNames.map(person => (
                  <li key={person.username} onClick={() => handleAutoAllMembersCompleteClick(person.username, person.department, person.team)}>
                    {person.team ? person.team : person.department} &nbsp;
                    {person.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="body_container_content">
            <div className="body_container_content_listbox">
              {allMembers.map((item: string) => (
                <div className="listbox_content">
                  {item}
                  <span className="remove" onClick={() => handleRecipientRemove(item)}>×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="body_container_content">
            <div className="body_container_content_title">참조자</div>
            <input
              type="text"
              value={inputAllReferrer}
              onChange={handleInputAllReferrerChange}
              onKeyDown={handleInputAllReferrerKeyDown}
              ref={inputRef}
            />
            {inputAllReferrer && (
              <ul className="autocomplete_dropdown">
                {filteredAllReferrersNames.map(person => (
                  <li key={person.username} onClick={() => handleAutoAllReferrersCompleteClick(person.username, person.department, person.team)}>
                    {person.team ? person.team : person.department} &nbsp;
                    {person.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="body_container_content">
            <div className="body_container_content_listbox">
              {allReferrers.map((item: string) => (
                <div className="listbox_content">
                  {item}
                  <span className="remove" onClick={() => handleReferrersRemove(item)}>×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="body_container_content">
            <div className="body_container_content_title">프로젝트<br />기간</div>
            <div className="body_container_content_datepicker">
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText={new Date().toLocaleDateString('ko-KR')}
                dateFormat="yyyy-MM-dd"
                className="datepicker"
                popperPlacement="top"
              />
              <span className="timespan">~</span>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText={new Date().toLocaleDateString('ko-KR')}
                dateFormat="yyyy-MM-dd"
                className="datepicker"
                popperPlacement="top"
              />
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isAddSubPjtModalOpen}
        onClose={() => { setAddSubPjtModalOPen(false); resetForm(); }}
        header={clickedProjects?.projectName}
        footer1={'저장'}
        footer1Class="green-btn"
        onFooter1Click={() => { setAddSubPjtModalOPen(false); resetForm(); handleAddSubProject(clickedProjects?.mainprojectIndex); }}
        width="500px"
        height="550px"
      >
        <div className="body-container">
          <div className="body_container_content">
            <div className="body_container_content_title">프로젝트 명</div>
            <input type="text" value={pjtTitle} onChange={(e) => setPjtTitle(e.target.value)}/>
          </div>
          
          <div className="body_container_content">
            <div className="body_container_content_title">팀리더</div>
            <input
              type="text"
              value={teamLeader}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              ref={inputRef}
            />
            {inputteamLeader && (
              <ul className="autocomplete_dropdown">
                {filteredNames.map(person => (
                  <li key={person.username} onClick={() => handleAutoCompleteClick(person.username, person.department, person.team)}>
                    {person.team ? person.team : person.department} &nbsp;
                    {person.username}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="body_container_content">
            <div className="body_container_content_title">담당 팀원</div>
            <input
              type="text"
              value={inputAllMember}
              onChange={handleInputAllMemberChange}
              onKeyDown={handleInputAllMemberKeyDown}
              ref={inputRef}
            />
            {inputAllMember && (
              <ul className="autocomplete_dropdown">
                {filteredAllmembersNames.map(person => (
                  <li key={person.username} onClick={() => handleAutoAllMembersCompleteClick(person.username, person.department, person.team)}>
                    {person.team ? person.team : person.department} &nbsp;
                    {person.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="body_container_content">
            <div className="body_container_content_listbox">
              {allMembers.map((item: string) => (
                <div className="listbox_content">
                  {item}
                  <span className="remove" onClick={() => handleRecipientRemove(item)}>×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="body_container_content">
            <div className="body_container_content_title">업무기간</div>
            <div className="body_container_content_datepicker">
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText={new Date().toLocaleDateString('ko-KR')}
                dateFormat="yyyy-MM-dd"
                className="datepicker"
                popperPlacement="top"
              />
              <span className="timespan">~</span>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText={new Date().toLocaleDateString('ko-KR')}
                dateFormat="yyyy-MM-dd"
                className="datepicker"
                popperPlacement="top"
              />
            </div>
          </div>

          <div className="body_container_content">
            <div className="body_container_content_title">프로젝트<br />내용</div>
            <textarea value={pjtMemo} onChange={(e) => setPjtMemo(e.target.value)}/>
          </div>
        </div>
      </CustomModal>
      
      <CustomModal
        isOpen={isEditPjtModalOpen}
        onClose={() => { setEditPjtModalOpen(false); resetForm(); }}
        header={'프로젝트 수정'}
        footer1={'편집'}
        footer1Class="green-btn"
        onFooter1Click={() => { setEditPjtModalOpen(false); resetForm(); handleEditProject(clickedProjects?.mainprojectIndex || 0)}}
        footer2={'삭제'}
        footer2Class="red-btn"
        onFooter2Click={() => { setEditPjtModalOpen(false); resetForm();}}
        width="500px"
        height="550px"
      >
        <div className="body-container">
          <div className="body_container_content">
            <div className="body_container_content_title">프로젝트 명</div>
            <input type="text" value={pjtTitle} onChange={(e) => setPjtTitle(e.target.value)}/>
          </div>

          <div className="body_container_content">
            <div className="body_container_content_title">팀리더</div>
            <input
              type="text"
              value={teamLeader}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              ref={inputRef}
            />
            {inputteamLeader && (
              <ul className="autocomplete_dropdown">
                {filteredNames.map(person => (
                  <li key={person.username} onClick={() => handleAutoCompleteClick(person.username, person.department, person.team)}>
                    {person.team ? person.team : person.department} &nbsp;
                    {person.username}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="body_container_content">
            <div className="body_container_content_title">전체 팀원</div>
            <input
              type="text"
              value={inputAllMember}
              onChange={handleInputAllMemberChange}
              onKeyDown={handleInputAllMemberKeyDown}
              ref={inputRef}
            />
            {inputAllMember && (
              <ul className="autocomplete_dropdown">
                {filteredAllmembersNames.map(person => (
                  <li key={person.username} onClick={() => handleAutoAllMembersCompleteClick(person.username, person.department, person.team)}>
                    {person.team ? person.team : person.department} &nbsp;
                    {person.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="body_container_content">
            <div className="body_container_content_listbox">
              {allMembers.map((item: string) => (
                <div className="listbox_content">
                  {item}
                  <span className="remove" onClick={() => handleRecipientRemove(item)}>×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="body_container_content">
            <div className="body_container_content_title">참조자</div>
            <input
              type="text"
              value={inputAllReferrer}
              onChange={handleInputAllReferrerChange}
              onKeyDown={handleInputAllReferrerKeyDown}
              ref={inputRef}
            />
            {inputAllReferrer && (
              <ul className="autocomplete_dropdown">
                {filteredAllReferrersNames.map(person => (
                  <li key={person.username} onClick={() => handleAutoAllReferrersCompleteClick(person.username, person.department, person.team)}>
                    {person.team ? person.team : person.department} &nbsp;
                    {person.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="body_container_content">
            <div className="body_container_content_listbox">
              {allReferrers.map((item: string) => (
                <div className="listbox_content">
                  {item}
                  <span className="remove" onClick={() => handleReferrersRemove(item)}>×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="body_container_content">
            <div className="body_container_content_title">프로젝트<br />기간</div>
            <div className="body_container_content_datepicker">
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText={new Date().toLocaleDateString('ko-KR')}
                dateFormat="yyyy-MM-dd"
                className="datepicker"
                popperPlacement="top"
              />
              <span className="timespan">~</span>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText={new Date().toLocaleDateString('ko-KR')}
                dateFormat="yyyy-MM-dd"
                className="datepicker"
                popperPlacement="top"
              />
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isDeletePjtModalOpen}
        onClose={() => setDeletePjtModalOpen(false)}
        header={'알림'}
        footer1={'삭제'}
        footer1Class="red-btn"
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => {setDeletePjtModalOpen(false)}}
      >
        <div>
          삭제하시겠습니까?
        </div>
      </CustomModal>

      <CustomModal
        isOpen={ispjtModalOpen}
        onClose={() => setPjtModalOPen(false)}
        header={'이벤트 제목'}
        footer1={'확인'}
        footer1Class="red-btn"
        onFooter1Click={() => setPjtModalOPen(false)}
        width="496px"
        height="auto"
      >
        <div className="body-container">
          <div className="body-content">
            <div className="content-left">
              상태
            </div>
            <div className="content-right">
              <div className="content-type">
                진행 중
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-left content-center">
              팀리더
            </div>
            <div className="content-right">
              <div className="content-date">
                개발1팀 장현지
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-left">
              담당 팀원
            </div>
            <div className="content-right">
              <div className="content-memo">
                개발1팀 구민석, 개발1팀 구민석, 개발1팀 구민석, 개발1팀 구민석, 개발1팀 구민석, 개발1팀 구민석
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-left">
              프로젝트 기간
            </div>
            <div className="content-right">
              <div className="content-memo">
                2024-06-13 ~ 2024-06-13
              </div>
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        header={'알림'}
        footer1={'확인'}
        footer1Class="gray-btn"
        onFooter1Click={() => setIsStatusModalOpen(false)}
        width="400px"
        height="200px"
      >
        <div className="text-center">
          <span>{statusMessage}</span>
        </div>
      </CustomModal>
    </div>
  );
};

export default Project;