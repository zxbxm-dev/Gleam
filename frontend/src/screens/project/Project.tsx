import "./Project.scss";
import { Link } from "react-router-dom";
import {
  Right_Arrow,
} from "../../assets/images/index";
import { useState, useEffect, useRef } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';


interface Event {
  title: string;
  startDate: string;
  endDate: string;
}

const Project = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabHeights, setTabHeights] = useState({0: '41px', 1: '35px'});
  const [tabMargins, setTabMargins] = useState({0: '6px', 1: '6px'});
  const [key, setKey] = useState(0);
  const calendarRef = useRef<FullCalendar>(null);
  const [slideVisible, setSlideVisible] = useState(false);
  const [projectVisible, setProjectVisible] = useState<Record<number, boolean>>({ 0: false, 1: false, 2: false});

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
  };

  const toggleSlide = () => {
    setSlideVisible(!slideVisible);
  };

  const toggleProjectVisibility = (index: number) => {
    setProjectVisible(prevState => ({ ...prevState, [index]: !prevState[index] }));
  };

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/project"} className="sub_header">프로젝트</Link>
      </div>
      
      <div className="content_container">
        <Tabs variant='enclosed' onChange={(index) => setActiveTab(index)}>
          <TabList>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[0]} marginTop={tabMargins[0]}>담당 업무</Tab>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[1]} marginTop={tabMargins[1]}>일정</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <div className="project_container">

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

              <div className={`project_slide ${slideVisible ? 'visible' : ''}`} onClick={toggleSlide}>
                전체 프로젝트 일정
              </div>

              <div className={`additional_content ${slideVisible ? 'visible' : ''}`}>
                <div className="project_content">
                  <div className="project_name_container">
                    <div className="name_left">
                      <img src={Right_Arrow} alt="Right_Arrow" onClick={() => toggleProjectVisibility(0)} />
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
                    <div className="name_left">
                      <img src={Right_Arrow} alt="Right_Arrow" onClick={() => toggleProjectVisibility(1)} />
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
                    <div className="name_left">
                      <img src={Right_Arrow} alt="Right_Arrow" onClick={() => toggleProjectVisibility(2)} />
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
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

    </div>
  );
};

export default Project;