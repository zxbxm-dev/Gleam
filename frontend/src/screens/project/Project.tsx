import "./Project.scss";
import {
  Right_Arrow,
  White_Arrow,
  mail_delete,
  mail_important_active,
} from "../../assets/images/index";
import { useState, useEffect, useRef } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomModal from "../../components/modal/CustomModal";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { PersonData } from '../../services/person/PersonServices';
import { useQuery } from 'react-query';


interface Event {
  title: string;
  startDate: string;
  endDate: string;
}

const Project = () => {
  const [iseventModalOpen, setEventModalOPen] = useState(false);
  const [isAddEventModalOpen, setAddEventModalOPen] = useState(false);
  const [persondata, setPersonData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [tabHeights, setTabHeights] = useState({0: '41px', 1: '35px'});
  const [tabMargins, setTabMargins] = useState({0: '6px', 1: '6px'});
  const [key, setKey] = useState(0);
  const calendarRef = useRef<FullCalendar>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [teamLeader, setTeamLeader] = useState('');
  const [inputteamLeader, setInputteamLeader] = useState('');
  const [allMembers, setAllMembers] = useState<string[]>([]);
  const [inputAllMember, setInputAllmember] = useState('');

  const [slideVisible, setSlideVisible] = useState(false);
  const [projectVisible, setProjectVisible] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: true});
  const [stateIsOpen, setStateIsOpen] = useState(false);
  const [selectedstateOption, setSelectedStateOption] = useState('전체');

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  const stateOptions = [
    '전체',
    '진행 중',
    '진행 완료',
  ];

  useEffect(() => {
    const initialProjects = [
      { id: 1, state: '진행 중', title: 'FCTS', teamLeader: '개발부 진유빈', startDate: '2024.04.11', endDate: '2024.12.30'},
      { id: 2, state: '진행 중', title: 'DRChat', teamLeader: '개발부 진유빈', startDate: '2023.10.28', endDate: '2024.04.04'},
    ];

    setProjects(initialProjects);
  });

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
      setTabHeights({0: '41px', 1: '35px'});
      setTabMargins({0: '0px', 1: '6px'});
    } else {
      setTabHeights({0: '35px', 1: '41px'});
      setTabMargins({0: '6px', 1: '0px'});
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
  
  const handleEventClick = (info:any) => {
    setSelectedEvent({
      title: info.event.title,
      startDate: info.event.start.toISOString().substring(0, 10),
      endDate: info.event.end ? info.event.end.toISOString().substring(0, 10) : info.event.start.toISOString().substring(0, 10),
    });
    setEventModalOPen(true);
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
      setTeamLeader(team+ ' ' + username);
    } else {
      setTeamLeader(department + ' ' + username);
    }
    setInputteamLeader('');
  };

  const handleInputAllMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAllmember(e.target.value);
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

  const handleRecipientRemove = (username: string) => {
    setAllMembers(allMembers.filter(allMember => allMember !== username));
  };

  const handleAutoAllMembersCompleteClick = (username: string, department: string, team: string) => {
    if (team) {
      setAllMembers([...allMembers, team + ' ' + username]);
    } else {
      setAllMembers([...allMembers, department + ' ' + username]);
    }
      
    setInputAllmember('');
  };

  const filteredNames = persondata.filter(person =>
    person.username.toLowerCase().includes(inputteamLeader.toLowerCase())
  );

  const filteredAllmembersNames = persondata.filter(person =>
    person.username.toLowerCase().includes(inputAllMember.toLowerCase())
  );

  const togglestate = () => {
    setStateIsOpen(!stateIsOpen);
  }

  const handleStateSelect = (option: string) => {
    setSelectedStateOption(option);
    setStateIsOpen(false);
  }

  return (
    <div className="content">
      <div className="content_container">
        { activeTab === 0 &&
          <div className="project_header_right">
            <button className="primary_button" onClick={() => setAddEventModalOPen(true)}>새업무 +</button>
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
                      <input type="checkbox" id="check1" />
                      <span></span>
                    </label>
                    <img src={mail_delete} alt="mail_delete" />
                    <img src={mail_important_active} alt="mail_important_active" />
                  </div>

                  <div className="project_container_header_right" onClick={togglestate}>
                    <span>상태 : {selectedstateOption}</span>
                    <img src={White_Arrow} alt="White_Arrow" />
                  </div>
                  {stateIsOpen && (
                  <ul className="dropdown_menu">
                    {stateOptions.map((option: string) => (
                      <li key={option} onClick={() => handleStateSelect(option)}>
                        {option}
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
                      {projects
                        .map((project) => (
                          <>
                            <tr key={project.id} className="board_content">
                              <td>
                                <label className="custom-checkbox">
                                  <input type="checkbox" id="check1" />
                                  <span></span>
                                </label>
                              </td>
                              <td>{project.id}</td>
                              <td>{project.state}</td>
                              <td>{project.title}</td>
                              <td>{project.teamLeader}</td>
                              <td>{project.startDate}</td>
                              <td>{project.endDate}</td>
                            </tr>
                          </>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="project_container">
                <FullCalendar
                  key={key}
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
                    <img src={White_Arrow} alt="White_Arrow" className="img_rotate"/>
                  ) : (
                    <img src={White_Arrow} alt="White_Arrow"/>
                  )}
                </div>

                <div className={`additional_content ${slideVisible ? 'visible' : ''}`}>
                  <div className="project_content">
                    <div className="project_name_container">
                      <div className="name_left" onClick={() => toggleProjectVisibility(0)}>
                        {projectVisible[0] ? (
                          <img src={Right_Arrow} alt="Right_Arrow" className="img_rotate"/>
                        ) : (
                          <img src={Right_Arrow} alt="Right_Arrow"/>
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
                          <img src={Right_Arrow} alt="Right_Arrow" className="img_rotate"/>
                        ) : (
                          <img src={Right_Arrow} alt="Right_Arrow"/>
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
                          <img src={Right_Arrow} alt="Right_Arrow" className="img_rotate"/>
                        ) : (
                          <img src={Right_Arrow} alt="Right_Arrow"/>
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
        isOpen={isAddEventModalOpen}
        onClose={() => setAddEventModalOPen(false)}
        header={'프로젝트 - 새 업무'}
        footer1={'저장'}
        footer1Class="green-btn"
        onFooter1Click={() => setAddEventModalOPen(false)}
        width="500px"
        height="550px"
      >
        <div className="body-container">
          <div className="body_container_content">
            <div className="body_container_content_title">프로젝트 명</div>
            <input type="text" />
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
              {allMembers.map((item:string) => item + ', ')}
            </div>
          </div>

          <div className="body_container_content">
            <div className="body_container_content_title">참조자</div>
            <input type="text" />
          </div>
          <div className="body_container_content">
            <div className="body_container_content_listbox">
              
            </div>
          </div>

          <div className="body_container_content">
            <div className="body_container_content_title">프로젝트<br/>기간</div>
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
        isOpen={iseventModalOpen}
        onClose={() => setEventModalOPen(false)}
        header={'이벤트 제목'}
        footer1={'확인'}
        footer1Class="red-btn"
        onFooter1Click={() => setEventModalOPen(false)}
        width="496px"
        height="300px"
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
                개발1팀 구민석, 개발1팀 구민석, 개발1팀 구민석
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
    </div>
  );
};

export default Project;