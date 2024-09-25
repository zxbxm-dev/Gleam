import "./Project.scss";
import {
  Right_Arrow,
  White_Arrow,
  Down_Arrow,
  mail_delete,
  pinned_true,
  pinned_false,
} from "../../assets/images/index";
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomModal from "../../components/modal/CustomModal";
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';
import { PersonData } from '../../services/person/PersonServices';
import { useQuery } from 'react-query';
import { CheckProject, addMainProject, addSubProject, EditMainProject, EditSubProject, DeleteMainProject, DeleteSubProject } from "../../services/project/ProjectServices";

interface ProjectData {
  mainprojectIndex: number;
  subprojectIndex: string;
  userId: string;
  status: string;
  projectName: string;
  Leader: string;
  startDate: Date;
  endDate: Date
  members: string[];
  referrer: string[];
  memo: string;
  pinned: number;
  subProject?: ProjectData[];
};

interface GoogleCalendarEvent {
  start: {
    date?: string;
    dateTime?: string;
  };
  summary: string;
}

interface Holiday {
  title: string;
  start: string;
  end?: string;
  color?: string;
}


const Project = () => {
  const user = useRecoilValue(userState);
  const [ispjtModalOpen, setPjtModalOPen] = useState(false);
  const [isAddSubPjtModalOpen, setAddSubPjtModalOPen] = useState(false);
  const [isAddPjtModalOpen, setAddPjtModalOPen] = useState(false);
  const [isEditPjtModalOpen, setEditPjtModalOpen] = useState(false);
  const [isViewSubPjtModalOpen, setViewSubPjtModalOpen] = useState(false);
  const [isEditSubPjtModalOpen, setEditSubPjtModalOpen] = useState(false);
  const [isDeletePjtModalOpen, setDeletePjtModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [EditForceMessage, setEditForceMessage] = useState(false);

  const [persondata, setPersonData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const calendarRef = useRef<FullCalendar>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [pjtStatus, setpjtStatus] = useState('진행 예정');
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
  const [projectVisible, setProjectVisible] = useState<Record<number, boolean>>({});
  const [pjtstateIsOpen, setPjtStateIsOpen] = useState(false);

  const [projects, setProjects] = useState<any[]>([]);
  const [myprojects, setMyProjects] = useState<any[]>([]);
  const [subprojects, setSubProjects] = useState<any[]>([]);
  const [projectEvent, setProjectEvent] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ProjectData | null>(null);
  const [rightclickedProjects, setRightClickedProjects] = useState<ProjectData | null>(null);
  const [clickedProjects, setClickedProjects] = useState<ProjectData | null>(null);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<{ [key: number]: boolean }>({});
  const [pinnedProjects, setPinnedProjects] = useState<{ [key: number]: boolean }>({});
  const [subprojectVisible, setSubProjectVisible] = useState<{ [key: string]: boolean }>({});

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [subdropdownOpen, setSubDropdownOpen] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const pjtstateOptions = [
    '진행 예정',
    '진행 중',
    '진행 완료',
  ];

  const resetForm = () => {
    setPjtStateIsOpen(false);
    setPjtTitle('');
    setPjtMemo('');
    setTeamLeader('');
    setAllMembers([]);
    setAllReferrers([]);
    setStartDate(null);
    setEndDate(null);
  };

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
    setSubProjectVisible(prev => {
      // 모든 프로젝트를 false로 설정한 새 객체 생성
      const newState = Object.keys(prev).reduce((acc: any, key) => {
        acc[key] = false;
        return acc;
      }, {});

      // 클릭한 프로젝트의 서브 프로젝트만 true로 설정
      newState[projectId] = !prev[projectId];

      return newState;
    });
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

  const handleEventClick = (info: any) => {
    setSelectedEvent({
      mainprojectIndex: info.event.id?.split('-')[0],
      subprojectIndex: info.event.id?.split('-')[1],
      userId: info.event.extendedProps.userId,
      status: info.event.extendedProps.status,
      projectName: `${info.event.title?.split('|')[0]} | ${info.event.id?.split('-')[1]} - ${info.event.extendedProps.origintitle}`,
      Leader: info.event.extendedProps.Leader,
      startDate: info.event.extendedProps.originstart ,
      endDate: info.event.extendedProps.originend ,
      members: info.event.extendedProps.members,
      referrer: info.event.extendedProps.referrer,
      memo: info.event.extendedProps.memo,
      pinned: 0,
    })
    setPjtModalOPen(true);
  };

  const toggleSlide = () => {
    setSlideVisible(!slideVisible);
  };

  const ProjectVisibilityInitial = (projectId: number) => {
    setProjectVisible(prevState => ({
      ...prevState,
      [projectId]: true,
    }));
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

  const togglePjtstate = () => {
    setPjtStateIsOpen(!pjtstateIsOpen);
  };

  const handlePjtStateSelect = (option: string) => {
    setpjtStatus(option);
    setPjtStateIsOpen(false);
  };

  const handleRightClick = (project: ProjectData, event: any) => {
    setRightClickedProjects(project);
    event.preventDefault();
    setDropdownOpen(true);
    setDropdownPosition({ x: event.pageX, y: event.pageY });
  };

  const handleOpenSubProject = (subProject: any) => {
    setClickedProjects(subProject);
  };

  useEffect(() => {
    if (clickedProjects) {
      setViewSubPjtModalOpen(true);
      setpjtStatus(clickedProjects.status === 'notstarted' ? '진행 예정' : clickedProjects.status === 'inprogress' ? '진행 중' : '진행 완료' || '진행 예정');
      setPjtTitle(clickedProjects.projectName || '');
      setTeamLeader(clickedProjects.Leader || '');
      setAllMembers(clickedProjects.members || []);
      setStartDate(clickedProjects.startDate || null);
      setEndDate(clickedProjects.endDate || null);
      setPjtMemo(clickedProjects.memo || '');
    }
  }, [clickedProjects]);

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

  useEffect(() => {
    const handleSubClickOutside = (event: any) => {
      if (subdropdownOpen && !event.target.closest('.dropdown-menu')) {
        setSubDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleSubClickOutside);

    return () => {
      document.removeEventListener('click', handleSubClickOutside);
    };
  }, [subdropdownOpen]);

  // 프로젝트 일정 조회
  const fetchProject = async () => {
    try {
      const response = await CheckProject();
      return response.data;
    } catch (error) {
      console.log("Failed to fetch Project data");
    }
  };

  const colors = [
    { backgroundColor: '#FCF5D7', borderColor: '#FCF5D7' },
    { backgroundColor: '#D6CDC2', borderColor: '#D6CDC2' },
    { backgroundColor: '#B1C3FF', borderColor: '#B1C3FF' },
    { backgroundColor: '#C1FFC1', borderColor: '#C1FFC1' },
    { backgroundColor: '#FFE897', borderColor: '#FFE897' },
  ];

  const transformProjectData = (data: any) => {
    const result: any[] = [];
    let colorIndex = 0;
  
    data?.forEach((event: any) => {
      const { projectName, textColor, subProjects } = event;
  
      // 서브 프로젝트 배열을 순회
      subProjects?.forEach((subProject: any) => {
        const { subprojectIndex, projectName: subProjectName, startDate: subStartDate, endDate: subEndDate, ...rest } = subProject;
  
        // 순차적으로 색상 선택
        const { backgroundColor, borderColor } = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length; // 다음 색상으로 인덱스 업데이트
  
        // 시작일 이벤트 추가
        result.push({
          id: `${subprojectIndex}-start`,
          title: `${projectName} | ${subprojectIndex?.split('-')[1]} 시작일`,
          origintitle: subProjectName,
          start: new Date(subStartDate).toISOString(),
          end: new Date(subStartDate).toISOString(),
          originstart: subStartDate,
          originend: subEndDate,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          textColor: textColor || "#000",
          ...rest
        });
  
        // 종료일 이벤트 추가
        result.push({
          id: `${subprojectIndex}-end`,
          title: `${projectName} | ${subprojectIndex?.split('-')[1]} 종료일`,
          origintitle: subProjectName,
          start: new Date(subEndDate).toISOString(),
          end: new Date(subEndDate).toISOString(),
          originstart: subStartDate,
          originend: subEndDate,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          textColor: textColor || "#000",
          ...rest
        });
      });
    });
  
    return result;
  };

  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    const fetchGoogleHolidays = async () => {
      const apiKey = "AIzaSyBB-X6Uc-1EnRlFTXs36cKK6gAQ0VAPpC0";
      const calendarId = 'ko.south_korea.official%23holiday%40group.v.calendar.google.com';
      const timeMin = new Date('2020-01-01').toISOString();
      const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const holidays = data.items.map((item: GoogleCalendarEvent) => ({
          title: item.summary,
          start: item.start.date,
          allDay: true,
          color: 'red',
        }));
        setHolidays(holidays);
      } catch (error) {
        console.error("Error fetching Google Calendar holidays:", error);
      }
    };

    fetchGoogleHolidays();
  }, []);

  const dayCellContent = (arg: any) => {
    const date = new Date(arg.date.getFullYear(), arg.date.getMonth(), arg.date.getDate());
    const formattedDateStr = date.toISOString().split('T')[0];
    const holiday = holidays.find(holiday => {
      const holidayDate = new Date(holiday.start);
      holidayDate.setHours(0, 0, 0, 0);
      const holidayDateStr = holidayDate.toISOString().split('T')[0];
      return holidayDateStr === formattedDateStr;
    });

    return (
      <div className="day-cell-content">
        <div className={`date-text ${holiday ? 'holiday-date' : ''}`}>{date.getDate()}</div>
        {holiday && <div className="holiday-title">{holiday.title}</div>}
      </div>
    );
  };

  const { refetch: refetchProject } = useQuery("Project", fetchProject, {
    enabled: false,
    onSuccess: (data) => {
      // Process and sort the main projects
      const mainprojects = data?.mainprojects?.map((mainproject: ProjectData) => {
        ProjectVisibilityInitial(mainproject?.mainprojectIndex);
        const subProjects = data?.subprojects?.filter(
          (subproject: ProjectData) => subproject.mainprojectIndex === mainproject.mainprojectIndex
        );
        return { ...mainproject, subProjects };
      });
  
      const newPinnedProjects = mainprojects?.reduce((acc: { [key: number]: number }, mainproject: ProjectData) => {
        acc[mainproject.mainprojectIndex] = mainproject.pinned;
        return acc;
      }, {});
  
      setPinnedProjects(newPinnedProjects);
  
      const sortedMainProjects = mainprojects?.sort((a: ProjectData, b: ProjectData) => {
        if (a.pinned && !b.pinned) {
          return -1;
        } else if (!a.pinned && b.pinned) {
          return 1;
        } else {
          return b.mainprojectIndex - a.mainprojectIndex;
        }
      });
  
      const userUsername = user?.username.trim();
  
      const filteredSortedProjects = sortedMainProjects?.filter((mainproject: ProjectData) => {
        const isLeader = userUsername === mainproject?.Leader?.split(' ').pop();
        const isMember = mainproject?.members?.some(member => member.includes(userUsername));
        const isReferrer = mainproject?.referrer?.some(referrer => referrer.includes(userUsername));
        return isLeader || isMember || isReferrer;
      });
  
      setMyProjects(filteredSortedProjects);
      setProjects(sortedMainProjects);
      setSubProjects(mainprojects);
      setProjectEvent(transformProjectData(mainprojects));
    },
    onError: (error) => {
      console.log(error);
    }
  });
  
  
  // 메인 프로젝트 추가
  const handleAddMainProject = async () => {
    const currentDate = new Date();
    
    let status;
    if (startDate === null) {
      status = 'notstarted';
    } else if (startDate > currentDate) {
      status = 'notstarted';
    } else {
      status = 'inprogress';
    }

    const pjtDetails = {
      userID: user.userID,
      projectName: pjtTitle,
      Leader: teamLeader,
      members: allMembers,
      referrer: allReferrers,
      startDate: startDate,
      endDate: endDate,
      memo: pjtMemo,
      status : status,
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
    const currentDate = new Date();
    
    let status;
    if (startDate === null) {
      status = 'notstarted';
    } else if (startDate > currentDate) {
      status = 'notstarted';
    } else {
      status = 'inprogress';
    }

    const pjtDetails = {
      userID: user.userID,
      projectName: pjtTitle,
      Leader: teamLeader,
      members: allMembers,
      referrer: allReferrers,
      startDate: startDate,
      endDate: endDate,
      memo: pjtMemo,
      status : status,
    };

    try {
      const response = await addSubProject(mainprojectindex, pjtDetails);
      console.log('서브 프로젝트 추가 성공', response.data);
      setStatusMessage('프로젝트 일정을 추가하였습니다.')
      setIsStatusModalOpen(true);
    } catch (error: any) {
      console.log('서브 프로젝트 추가 실패', error);
      if (error.response) {
        const { status } = error.response;
        const { message } = error.response.data;
        switch (status ) {
          case 418:
            setStatusMessage(message);
            setIsStatusModalOpen(true);
            break;

          case 419:
            setStatusMessage(message);
            setIsStatusModalOpen(true);
            break;
        }
      }
    }

    refetchProject();
    resetForm();
  };

  // 메인 프로젝트 수정
  const handleEditProject = (mainprojectIndex: any, force = false) => {
    let projectStatus;

    if (pjtStatus === '진행 예정') {
      projectStatus = 'notstarted';
    } else if (pjtStatus === '진행 중') {
      projectStatus = 'inprogress';
    } else if (pjtStatus === '진행 완료') {
      projectStatus = 'done';
    } else {
      projectStatus = 'notstarted';
    }
    
    const pjtData = {
      userID: user.userID,
      projectName: pjtTitle,
      Leader: teamLeader,
      members: allMembers,
      referrer: allReferrers,
      startDate: startDate,
      endDate: endDate,
      memo: pjtMemo,
      status: projectStatus,
      force: force,
    }

    EditMainProject(mainprojectIndex, pjtData)
    .then(() => {
      console.log('메인 프로젝트 수정 성공');
      refetchProject();
      resetForm();
    })
    .catch((error) => {
      console.log('메인 프로젝트 수정 실패', error);
      if (error.response) {
        const { status } = error.response;
        switch (status ) {
          case 420:
            setEditForceMessage(true);
            break;
        }
      }
    })
  };

  // 서브 프로젝트 수정
  const handleEditSubProject = (mainprojectIndex: any, subprojectIndex: any) => {
    let projectStatus;

    if (pjtStatus === '진행 예정') {
      projectStatus = 'notstarted';
    } else if (pjtStatus === '진행 중') {
      projectStatus = 'inprogress';
    } else if (pjtStatus === '진행 완료') {
      projectStatus = 'done';
    } else {
      projectStatus = 'notstarted';
    }
    
    const pjtData = {
      userID: user.userID,
      projectName: pjtTitle,
      Leader: teamLeader,
      members: allMembers,
      startDate: startDate,
      endDate: endDate,
      memo: pjtMemo,
      status: projectStatus,
    }

    EditSubProject(mainprojectIndex, subprojectIndex, pjtData)
    .then(() => {
      console.log('서브 프로젝트 수정 성공');
      refetchProject();
      resetForm();
      setClickedProjects(null);
    })
    .catch((error) => {
      console.log('서브 프로젝트 수정 실패', error);
      setClickedProjects(null);
      if (error.response) {
        const { status } = error.response;
        const { message } = error.response.data;
        switch (status ) {
          case 418:
            setStatusMessage(message);
            setIsStatusModalOpen(true);
            break;

          case 419:
            setStatusMessage(message);
            setIsStatusModalOpen(true);
            break;
        }
      }
    })
  };

  // 메인 프로젝트 삭제
  const hanelDeleteMainPjt = (mainprojectIndex: any) => {
    DeleteMainProject(mainprojectIndex)
    .then(response => {
      console.log('메인 프로젝트 삭제 성공', response);
      refetchProject();
    })
    .catch(error => {
      console.log('메인 프로젝트 삭제 실패', error);
    })
  };

  // 서브 프로젝트 삭제
  const handleDeleteSubPjt = (mainprojectIndex: any, subprojectIndex: any) => {
    DeleteSubProject(mainprojectIndex, subprojectIndex)
    .then(response => {
      console.log('서브 프로젝트 삭제 성공', response);
      refetchProject();
    })
    .catch(error => {
      console.log('서브 프로젝트 삭제 실패', error);
    })
  };

  // 체크박스로 선택한 프로젝트 삭제
  const handleDeleteCheckboxPjt = (selectedProjects: any) => {
    Object.keys(selectedProjects).forEach(mainprojectIndex => {
      if (selectedProjects[mainprojectIndex]) {
        DeleteMainProject(mainprojectIndex)
        .then(response => {
          console.log(`메인 프로젝트 ${mainprojectIndex} 삭제 성공`, response);
          setDeletePjtModalOpen(false);
          setSelectedProjects({});
          refetchProject();
        })
        .catch(error => {
          console.log(`메인 프로젝트 ${mainprojectIndex} 삭제 실패`, error);
        });
      }
    });
  };

  // 체크박스로 선택한 프로젝트 고정
  const handlePinnedCheckboxPjt = (mainprojectIndex: any, mainprojectstatus: any) => {
    const pjtData = {
      pinned: !pinnedProjects[Number(mainprojectIndex)],
      status: mainprojectstatus,
    }

    EditMainProject(mainprojectIndex, pjtData)
    .then(() => {
      console.log('메인 프로젝트 수정 성공');
      refetchProject();
      resetForm();
      setSelectedProjects({});
    })
    .catch((error) => {
      console.log('메인 프로젝트 수정 실패', error);
    })
  }

  useEffect(() => {
    refetchProject();
  }, [refetchProject]);

  const userUsername = user?.username.trim();
  const members = rightclickedProjects?.members ?? [];
  const referrer = rightclickedProjects?.referrer ?? [];

  const isMemberIncluded = members.some(member => member.includes(userUsername));
  const isReferrerIncluded = referrer.some(ref => ref.includes(userUsername));

  const canEdit = (
    user.username === rightclickedProjects?.Leader?.split(' ').pop() || 
    user.userID === rightclickedProjects?.userId ||
    isMemberIncluded ||
    isReferrerIncluded
  );

  return (
    <div className="content">
      <div className="content_container">
        <div className="project_header">
          <div className="project_container_header_left">
            <button
              className={activeTab === 0 ? "primary_button" : "white_button"}
              onClick={() => setActiveTab(0)}
            >
              담당 업무
            </button>
            <button
              className={activeTab === 1 ? "primary_button" : "white_button"}
              onClick={() => setActiveTab(1)}
            >
              일정
            </button>
          </div>
          {activeTab === 0 && (
            <div className="project_container_header_right">
              <img className="mail_delete_img" src={mail_delete} alt="mail_delete" onClick={() => setDeletePjtModalOpen(true)}/>
              <button className="primary_button" onClick={() => setAddPjtModalOPen(true)}>새 업무 +</button>
            </div>
          )}
        </div>
        
        
        {activeTab === 0 && (
          <div className="project_container">
            {/*<div className="project_container_header">
              <div className="project_container_header_left">
                <label className="custom-checkbox">
                  <input type="checkbox" id="check1" checked={allSelected} onChange={toggleAllCheckboxes}/>
                  <span></span>
                </label>
                
                
              </div>
            </div> */}

            <div className="project_content">
              <div className="project_content_section">
                <div className="project_content_notstarted_section">
                  <span>진행 예정</span>
                  <div></div>
                </div>
                <div className="project_content_section_list">
                  {(Array.isArray(myprojects) ? myprojects.filter(project => project.status === 'notstarted') : []).map((project, index) => (
                    <React.Fragment key={project.mainprojectIndex}>
                      <div className={`project_box ${subprojectVisible[project.mainprojectIndex] ? 'visible' : ''}`} onClick={() => { toggleSubProjects(project.mainprojectIndex); setRightClickedProjects(project);}} onContextMenu={(e) => handleRightClick(project, e)}
                        style={{background: project?.status === 'inprogress' && new Date().toISOString().split('T')[0] > new Date(project.endDate).getFullYear() + '-' + String(new Date(project.endDate).getMonth() + 1).padStart(2, '0') + '-' + String(new Date(project.endDate).getDate()).padStart(2, '0') ? '#d0d0d0' : ''}}
                      >
                        <div className="project_box_header">
                          <div className="box_header_title">
                            <div className="box_header_title_left">
                              {project?.pinned === false ? (
                                <img className="box_header_title_important" src={pinned_false} alt="mail_important" onClick={() => handlePinnedCheckboxPjt(project.mainprojectIndex, project.status)}/>
                              ) : (
                                <img className="box_header_title_important" src={pinned_true} alt="mail_important_active" onClick={() => handlePinnedCheckboxPjt(project.mainprojectIndex, project.status)}/>
                              )}
                              <span>{project.projectName}</span>
                            </div>
                            <div className="box_header_title_right">
                              <label className="custom-checkbox">
                                <input 
                                  type="checkbox"
                                  checked={allSelected ? allSelected : selectedProjects[project.mainprojectIndex] || false}
                                  onChange={() => toggleProjectSelection(project.mainprojectIndex)}   
                                />
                                <span></span>
                              </label>
                              {subprojectVisible[project.mainprojectIndex] ? (
                                <img src={Down_Arrow} alt="Down_Arrow" className="Arrow_rotate"/>
                              ) : (
                                <img src={Down_Arrow} alt="Down_Arrow"/>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="project_box_content">
                          {dropdownOpen && (
                            <div className="dropdown-menu" style={{ position: 'absolute', top: dropdownPosition.y - 70, left: dropdownPosition.x - 210 }}>
                              {(canEdit
                              ) && (
                                <div className="dropdown_pin"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditPjtModalOpen(true);
                                    setpjtStatus(
                                      rightclickedProjects?.status === 'notstarted' ? '진행 예정' :
                                      rightclickedProjects?.status === 'inprogress' ? '진행 중' :
                                      rightclickedProjects?.status === 'completed' ? '진행 완료' :
                                      '진행 예정'
                                    );
                                    setPjtTitle(rightclickedProjects?.projectName || ''); 
                                    setTeamLeader(rightclickedProjects?.Leader || '');
                                    setAllMembers(rightclickedProjects?.members || []);
                                    setAllReferrers(rightclickedProjects?.referrer || []);
                                    setStartDate(rightclickedProjects?.startDate || null);
                                    setEndDate(rightclickedProjects?.endDate || null);
                                  }}
                                >
                                  편집
                                </div>
                              )}
                              <div className="dropdown_pin" onClick={(e) => {e.stopPropagation(); setAddSubPjtModalOPen(true);}}>
                                추가
                              </div>
                            </div>
                          )}
                          <div>
                            <div>{project.Leader}</div>
                          </div> 
                          <div className="project_box_content_right">
                            <div>{new Date(project.startDate).getFullYear() + '.' + String(new Date(project.startDate).getMonth() + 1).padStart(2, '0') + '.' + String(new Date(project.startDate).getDate()).padStart(2, '0')}</div>
                            <div>-</div>
                            <div>{new Date(project.endDate).getFullYear() + '.' + String(new Date(project.endDate).getMonth() + 1).padStart(2, '0') + '.' + String(new Date(project.endDate).getDate()).padStart(2, '0')}</div>
                          </div>
                        </div>
                        {subprojectVisible[project.mainprojectIndex] && project.subProjects.length !== 0 && (
                          <div className={`subprojects_container ${subprojectVisible[project.mainprojectIndex] ? 'visible' : ''}`} onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                            {project.subProjects?.slice().reverse().map((subProject: any, subindex: any) => (
                              <div key={subProject.subprojectIndex} className="subproject_box" onClick={() => { handleOpenSubProject(subProject); }}>
                                <div className="subproject_box_left">
                                  <div className={subProject.status === 'notstarted' ? 'subproject_box_left_notstarted_tag' : subProject.status === 'inprogress' ? 'subproject_box_left_inprogress_tag' : 'subproject_box_left_done_tag'}></div>
                                  <div>
                                    {subProject.projectName}
                                  </div>
                                </div>

                                <div className="subproject_box_right">
                                  <div className={subProject.status === 'notstarted' ? 'text_medium text_brown' : subProject.status === 'inprogress' ? 'text_medium text_blue' : 'text_medium text_gray'}>
                                    {subProject.status === 'notstarted' ? '진행 예정' : subProject.status === 'inprogress' ? '진행 중' : '진행 완료'}
                                  </div>
                                  <div className="text_regular text_gray">
                                    {subProject?.startDate ? new Date(subProject.startDate).getFullYear() + '.' + String(new Date(subProject.startDate).getMonth() + 1).padStart(2, '0') + '.' + String(new Date(subProject.startDate).getDate()).padStart(2, '0') : null}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              <div className="project_content_section">
                <div className="project_content_inprogress_section">
                  <span>진행 중</span>
                  <div></div>
                </div>
                <div className="project_content_section_list">
                  {(Array.isArray(myprojects) ? myprojects.filter(project => project.status === 'inprogress') : []).map((project, index) => (
                    <React.Fragment key={project.mainprojectIndex}>
                      <div className={`project_box ${subprojectVisible[project.mainprojectIndex] ? 'visible' : ''}`} onClick={() => { toggleSubProjects(project.mainprojectIndex); setRightClickedProjects(project);}} onContextMenu={(e) => handleRightClick(project, e)}
                        style={{background: project?.status === 'inprogress' && new Date().toISOString().split('T')[0] > new Date(project.endDate).getFullYear() + '-' + String(new Date(project.endDate).getMonth() + 1).padStart(2, '0') + '-' + String(new Date(project.endDate).getDate()).padStart(2, '0') ? '#d0d0d0' : ''}}
                      >
                        <div className="project_box_header">
                          <div className="box_header_title">
                            <div className="box_header_title_left">
                              {project?.pinned === false ? (
                                <img className="box_header_title_important" src={pinned_false} alt="mail_important" onClick={() => handlePinnedCheckboxPjt(project.mainprojectIndex, project.status)}/>
                              ) : (
                                <img className="box_header_title_important" src={pinned_true} alt="mail_important_active" onClick={() => handlePinnedCheckboxPjt(project.mainprojectIndex, project.status)}/>
                              )}
                              <span>{project.projectName}</span>
                            </div>
                            <div className="box_header_title_right">
                              <label className="custom-checkbox">
                                <input 
                                  type="checkbox"
                                  checked={allSelected ? allSelected : selectedProjects[project.mainprojectIndex] || false}
                                  onChange={() => toggleProjectSelection(project.mainprojectIndex)}   
                                />
                                <span></span>
                              </label>
                              {subprojectVisible[project.mainprojectIndex] ? (
                                <img src={Down_Arrow} alt="Down_Arrow" className="Arrow_rotate"/>
                              ) : (
                                <img src={Down_Arrow} alt="Down_Arrow"/>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="project_box_content">
                          {dropdownOpen && (
                            <div className="dropdown-menu" style={{ position: 'absolute', top: dropdownPosition.y - 70, left: dropdownPosition.x - 210 }}>
                              {(canEdit
                              ) && (
                                <div className="dropdown_pin"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditPjtModalOpen(true);
                                    setpjtStatus(
                                      rightclickedProjects?.status === 'notstarted' ? '진행 예정' :
                                      rightclickedProjects?.status === 'inprogress' ? '진행 중' :
                                      rightclickedProjects?.status === 'completed' ? '진행 완료' :
                                      '진행 예정'
                                    );
                                    setPjtTitle(rightclickedProjects?.projectName || ''); 
                                    setTeamLeader(rightclickedProjects?.Leader || '');
                                    setAllMembers(rightclickedProjects?.members || []);
                                    setAllReferrers(rightclickedProjects?.referrer || []);
                                    setStartDate(rightclickedProjects?.startDate || null);
                                    setEndDate(rightclickedProjects?.endDate || null);
                                  }}
                                >
                                  편집
                                </div>
                              )}
                              <div className="dropdown_pin" onClick={(e) => {e.stopPropagation(); setAddSubPjtModalOPen(true);}}>
                                추가
                              </div>
                            </div>
                          )}
                          <div>
                            <div>{project.Leader}</div>
                          </div> 
                          <div className="project_box_content_right">
                            <div>{new Date(project.startDate).getFullYear() + '.' + String(new Date(project.startDate).getMonth() + 1).padStart(2, '0') + '.' + String(new Date(project.startDate).getDate()).padStart(2, '0')}</div>
                            <div>-</div>
                            <div>{new Date(project.endDate).getFullYear() + '.' + String(new Date(project.endDate).getMonth() + 1).padStart(2, '0') + '.' + String(new Date(project.endDate).getDate()).padStart(2, '0')}</div>
                          </div>
                        </div>
                        {subprojectVisible[project.mainprojectIndex] && project.subProjects.length !== 0 && (
                          <div className={`subprojects_container subproject_inprogress ${subprojectVisible[project.mainprojectIndex] ? 'visible' : ''}`} onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                            {project.subProjects?.slice().reverse().map((subProject: any, subindex: any) => (
                              <div key={subProject.subprojectIndex} className="subproject_box" onClick={() => { handleOpenSubProject(subProject); }}>
                                <div className="subproject_box_left">
                                  <div className={subProject.status === 'notstarted' ? 'subproject_box_left_notstarted_tag' : subProject.status === 'inprogress' ? 'subproject_box_left_inprogress_tag' : 'subproject_box_left_done_tag'}></div>
                                  <div>
                                    {subProject.projectName}
                                  </div>
                                </div>

                                <div className="subproject_box_right">
                                  <div className={subProject.status === 'notstarted' ? 'text_medium text_brown' : subProject.status === 'inprogress' ? 'text_medium text_blue' : 'text_medium text_gray'}>
                                    {subProject.status === 'notstarted' ? '진행 예정' : subProject.status === 'inprogress' ? '진행 중' : '진행 완료'}
                                  </div>
                                  <div className="text_regular text_gray">
                                    {subProject?.startDate ? new Date(subProject.startDate).getFullYear() + '.' + String(new Date(subProject.startDate).getMonth() + 1).padStart(2, '0') + '.' + String(new Date(subProject.startDate).getDate()).padStart(2, '0') : null}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="project_content_section">
                <div className="project_content_done_section">
                  <span>진행 완료</span>
                  <div></div>
                </div>
                <div className="project_content_section_list">
                  {(Array.isArray(myprojects) ? myprojects.filter(project => project.status === 'done') : []).map((project, index) => (
                    <React.Fragment key={project.mainprojectIndex}>
                      <div className={`project_box ${subprojectVisible[project.mainprojectIndex] ? 'visible' : ''}`} onClick={() => { toggleSubProjects(project.mainprojectIndex); setRightClickedProjects(project);}} onContextMenu={(e) => handleRightClick(project, e)}
                        style={{background: project?.status === 'inprogress' && new Date().toISOString().split('T')[0] > new Date(project.endDate).getFullYear() + '-' + String(new Date(project.endDate).getMonth() + 1).padStart(2, '0') + '-' + String(new Date(project.endDate).getDate()).padStart(2, '0') ? '#d0d0d0' : ''}}
                      >
                        <div className="project_box_header">
                          <div className="box_header_title">
                            <div className="box_header_title_left">
                              {project?.pinned === false ? (
                                <img className="box_header_title_important" src={pinned_false} alt="mail_important" onClick={() => handlePinnedCheckboxPjt(project.mainprojectIndex, project.status)}/>
                              ) : (
                                <img className="box_header_title_important" src={pinned_true} alt="mail_important_active" onClick={() => handlePinnedCheckboxPjt(project.mainprojectIndex, project.status)}/>
                              )}
                              <span>{project.projectName}</span>
                            </div>
                            <div className="box_header_title_right">
                              <label className="custom-checkbox">
                                <input 
                                  type="checkbox"
                                  checked={allSelected ? allSelected : selectedProjects[project.mainprojectIndex] || false}
                                  onChange={() => toggleProjectSelection(project.mainprojectIndex)}   
                                />
                                <span></span>
                              </label>
                              {subprojectVisible[project.mainprojectIndex] ? (
                                <img src={Down_Arrow} alt="Down_Arrow" className="Arrow_rotate"/>
                              ) : (
                                <img src={Down_Arrow} alt="Down_Arrow"/>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="project_box_content">
                          {dropdownOpen && (
                            <div className="dropdown-menu" style={{ position: 'absolute', top: dropdownPosition.y - 70, left: dropdownPosition.x - 210 }}>
                              {(canEdit
                              ) && (
                                <div className="dropdown_pin"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditPjtModalOpen(true);
                                    setpjtStatus(
                                      rightclickedProjects?.status === 'notstarted' ? '진행 예정' :
                                      rightclickedProjects?.status === 'inprogress' ? '진행 중' :
                                      rightclickedProjects?.status === 'completed' ? '진행 완료' :
                                      '진행 예정'
                                    );
                                    setPjtTitle(rightclickedProjects?.projectName || ''); 
                                    setTeamLeader(rightclickedProjects?.Leader || '');
                                    setAllMembers(rightclickedProjects?.members || []);
                                    setAllReferrers(rightclickedProjects?.referrer || []);
                                    setStartDate(rightclickedProjects?.startDate || null);
                                    setEndDate(rightclickedProjects?.endDate || null);
                                  }}
                                >
                                  편집
                                </div>
                              )}
                              <div className="dropdown_pin" onClick={(e) => {e.stopPropagation(); setAddSubPjtModalOPen(true);}}>
                                추가
                              </div>
                            </div>
                          )}
                          <div>
                            <div>{project.Leader}</div>
                          </div> 
                          <div className="project_box_content_right">
                            <div>{new Date(project.startDate).getFullYear() + '.' + String(new Date(project.startDate).getMonth() + 1).padStart(2, '0') + '.' + String(new Date(project.startDate).getDate()).padStart(2, '0')}</div>
                            <div>-</div>
                            <div>{new Date(project.endDate).getFullYear() + '.' + String(new Date(project.endDate).getMonth() + 1).padStart(2, '0') + '.' + String(new Date(project.endDate).getDate()).padStart(2, '0')}</div>
                          </div>
                        </div>
                        {subprojectVisible[project.mainprojectIndex] && project.subProjects.length !== 0 && (
                          <div className={`subprojects_container subproject_done ${subprojectVisible[project.mainprojectIndex] ? 'visible' : ''}`} onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                            {project.subProjects?.slice().reverse().map((subProject: any, subindex: any) => (
                              <div key={subProject.subprojectIndex} className="subproject_box" onClick={() => { handleOpenSubProject(subProject); }}>
                                <div className="subproject_box_left">
                                  <div className={subProject.status === 'notstarted' ? 'subproject_box_left_notstarted_tag' : subProject.status === 'inprogress' ? 'subproject_box_left_inprogress_tag' : 'subproject_box_left_done_tag'}></div>
                                  <div>
                                    {subProject.projectName}
                                  </div>
                                </div>

                                <div className="subproject_box_right">
                                  <div className={subProject.status === 'notstarted' ? 'text_medium text_brown' : subProject.status === 'inprogress' ? 'text_medium text_blue' : 'text_medium text_gray'}>
                                    {subProject.status === 'notstarted' ? '진행 예정' : subProject.status === 'inprogress' ? '진행 중' : '진행 완료'}
                                  </div>
                                  <div className="text_regular text_gray">
                                    {subProject?.startDate ? new Date(subProject.startDate).getFullYear() + '.' + String(new Date(subProject.startDate).getMonth() + 1).padStart(2, '0') + '.' + String(new Date(subProject.startDate).getDate()).padStart(2, '0') : null}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>                
              </div>
            </div>
          </div>
        )}


        {activeTab === 1 && (
          <div className="project_container">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              dayCellContent={dayCellContent}
              height="100%"
              headerToolbar={{
                start: 'prev title next',
                center: '',
                end: '',
              }}
              dayHeaderFormat={{ weekday: 'long' }}
              titleFormat={(date) => `${date.date.year}년 ${date.date.month + 1}월`}
              locale='kr'
              fixedWeekCount={false}
              events={projectEvent}
              eventContent={(arg) => <div>{arg.event.title.replace('오전 12시 ', '')}</div>}
              dayMaxEventRows={true}
              eventDisplay="block"
              eventClick={handleEventClick}
              moreLinkText='개 일정 더보기'
            />

              <div className="project_slide_container">
              <div className={`project_slide ${slideVisible ? 'visible' : ''}`} onClick={toggleSlide}>
                <span>진행 중인 프로젝트 일정</span>
                {slideVisible ? (
                  <img src={White_Arrow} alt="White_Arrow" className="img_rotate" />
                ) : (
                  <img src={White_Arrow} alt="White_Arrow" />
                )}
              </div>
              <div className={`additional_content ${slideVisible ? 'visible' : ''}`}>
                {
                  (Array.isArray(subprojects) ? subprojects : [])
                    .filter((projectData: any) => projectData.status === 'inprogress')
                    .map((projectData: any, index: number) => (
                    <React.Fragment key={projectData.mainprojectIndex}>
                      <div className="project_content">
                        <div className="project_name_container">
                          <div className="name_left" onClick={() => toggleProjectVisibility(projectData.mainprojectIndex)}>
                            {projectVisible[projectData.mainprojectIndex] ? (
                              <img src={Right_Arrow} alt="Right_Arrow" className="img_rotate" />
                            ) : (
                              <img src={Right_Arrow} alt="Right_Arrow" />
                            )}
                            <span className="project_name">{projectData.projectName}</span>
                          </div>
                          <div className="name_right">
                            <span className="project_state">
                              {projectData.status === 'notstarted' ? '진행 예정' :
                              projectData.status === 'inprogress' ? '진행 중' : '진행 완료'}
                            </span>
                            <div className={
                              projectData.status === 'notstarted' ? '' :
                              projectData.status === 'inprogress' ? 'blue_circle' : 'brown_circle'}
                            ></div>
                          </div>
                        </div>
                        {projectVisible[projectData.mainprojectIndex] && (
                          (Array.isArray(projectData.subProjects) ? projectData.subProjects : []).map((subprojectData: any, subIndex: number) => (
                            <React.Fragment key={subprojectData.subprojectIndex}>
                              <div className="project_content_container">
                                <div>{subprojectData.subprojectIndex?.split('-')[1] + ' | ' + subprojectData?.projectName}</div>
                                <div>팀리더 : {subprojectData.Leader}</div>
                                <div>프로젝트 기간 : {new Date(subprojectData.startDate).getFullYear() + '-' + String(new Date(subprojectData.startDate).getMonth() + 1).padStart(2, '0') + '-' + String(new Date(subprojectData.startDate).getDate()).padStart(2, '0')} ~ {new Date(subprojectData.endDate).getFullYear() + '-' + String(new Date(subprojectData.endDate).getMonth() + 1).padStart(2, '0') + '-' + String(new Date(subprojectData.endDate).getDate()).padStart(2, '0')}</div>
                              </div>
                            </React.Fragment>
                          ))
                        )}
                      </div>
                    </React.Fragment>
                  ))
                }
              </div>
            </div>
          </div>

        )}  
      </div>

      {/* 메인 프로젝트 생성 모달 */}
      <CustomModal
        isOpen={isAddPjtModalOpen}
        onClose={() => { setAddPjtModalOPen(false); resetForm(); }}
        header={'프로젝트 - 새 업무'}
        headerTextColor="white"
        footer1={'저장'}
        footer1Class="back-green-btn"
        onFooter1Click={() => { setAddPjtModalOPen(false); resetForm(); handleAddMainProject(); }}
        width="430px"
        height="510px"
      >
        <div className="body-container custom_scroll" style={{padding: '2% 5%'}}>
          <div className="body_container_content">
            <input type="text" className="input_project" value={pjtTitle} placeholder="프로젝트 명" onChange={(e) => setPjtTitle(e.target.value)}/>
          </div>

          <div className="body_container_content content_box">
            <input
              type="text"
              className="input_box"
              value={teamLeader}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder="팀리더"
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
            
          <div className="body_container_content member_list_box" tabIndex={0}>
            <input
              type="text"
              className="input_list"
              value={inputAllMember}
              onChange={handleInputAllMemberChange}
              onKeyDown={handleInputAllMemberKeyDown}
              placeholder="전체 팀원"
              ref={inputRef}
            />
            {inputAllMember && (
              <ul className="autocomplete_dropdown_inbox">
                {filteredAllmembersNames.map(person => (
                  <li key={person.username} onClick={() => handleAutoAllMembersCompleteClick(person.username, person.department, person.team)}>
                    {person.team ? person.team : person.department} &nbsp;
                    {person.username}
                  </li>
                ))}
              </ul>
            )}

            <div className="body_container_content_listbox">
              {allMembers.map((item: string) => (
                <div className="listbox_content">
                  {item}
                  <span className="remove" onClick={() => handleRecipientRemove(item)}>×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="body_container_content member_list_box" style={{height: '110px', backgroundColor: '#F4F4F4'}}>
            <input
              type="text"
              className="input_list"
              value={inputAllReferrer}
              onChange={handleInputAllReferrerChange}
              onKeyDown={handleInputAllReferrerKeyDown}
              placeholder="참조자"
              ref={inputRef}
            />
            {inputAllReferrer && (
              <ul className="autocomplete_dropdown_inbox">
                {filteredAllReferrersNames.map(person => (
                  <li key={person.username} onClick={() => handleAutoAllReferrersCompleteClick(person.username, person.department, person.team)}>
                    {person.team ? person.team : person.department} &nbsp;
                    {person.username}
                  </li>
                ))}
              </ul>
            )}

            <div className="body_container_content_listbox">
              {allReferrers.map((item: string) => (
                <div className="listbox_content">
                  {item}
                  <span className="remove" onClick={() => handleReferrersRemove(item)}>×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="body_container_content content_box" tabIndex={0}>
            <div className="body_container_content_datepicker_title">
              프로젝트 기간
            </div>
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

      {/* 서브 프로젝트 생성 모달 */}
      <CustomModal
        isOpen={isAddSubPjtModalOpen}
        onClose={() => { setAddSubPjtModalOPen(false); resetForm(); }}
        header={rightclickedProjects?.projectName}
        headerTextColor="white"
        footer1={'저장'}
        footer1Class="green-btn"
        onFooter1Click={() => { setAddSubPjtModalOPen(false); resetForm(); handleAddSubProject(rightclickedProjects?.mainprojectIndex); }}
        width="430px"
        height="510px"
      >
        <div className="body-container custom_scroll" style={{padding: '2% 5%'}}>
          <div className="body_container_content">
            <input type="text" className="input_project" value={pjtTitle} placeholder="서브 프로젝트 명" onChange={(e) => setPjtTitle(e.target.value)}/>
          </div>
          
          <div className="body_container_content content_box">
            <input
              type="text"
              className="input_box"
              value={teamLeader}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder="팀리더"
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

          <div className="body_container_content member_list_box" tabIndex={0}>
            <input
              type="text"
              className="input_list"
              value={inputAllMember}
              onChange={handleInputAllMemberChange}
              onKeyDown={handleInputAllMemberKeyDown}
              placeholder="전체 팀원"
              ref={inputRef}
            />
            {inputAllMember && (
              <ul className="autocomplete_dropdown_inbox">
                {filteredAllmembersNames.map(person => (
                  <li key={person.username} onClick={() => handleAutoAllMembersCompleteClick(person.username, person.department, person.team)}>
                    {person.team ? person.team : person.department} &nbsp;
                    {person.username}
                  </li>
                ))}
              </ul>
            )}

            <div className="body_container_content_listbox">
              {allMembers.map((item: string) => (
                <div className="listbox_content">
                  {item}
                  <span className="remove" onClick={() => handleRecipientRemove(item)}>×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="body_container_content content_box" tabIndex={0}>
            <div className="body_container_content_datepicker_title">
              프로젝트 기간
            </div>
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

          <div className="body_container_content textarea_content">
            <div className="textarea_content_title">프로젝트 내용</div>
            <textarea value={pjtMemo} onChange={(e) => setPjtMemo(e.target.value)}/>
          </div>
        </div>
      </CustomModal>
      
      {/* 메인 프로젝트 수정 모달 */}
      <CustomModal
        isOpen={isEditPjtModalOpen}
        onClose={() => { setEditPjtModalOpen(false); resetForm(); }}
        header={rightclickedProjects?.projectName}
        headerTextColor="white"
        footer1={'편집'}
        footer1Class="green-btn"
        onFooter1Click={() => { setEditPjtModalOpen(false); handleEditProject(rightclickedProjects?.mainprojectIndex || 0)}}
        footer2={'삭제'}
        footer2Class="red-btn"
        onFooter2Click={() => { setEditPjtModalOpen(false); resetForm(); hanelDeleteMainPjt(rightclickedProjects?.mainprojectIndex || 0)}}
        width="430px"
        height="510px"
      >
        <div className="body-container custom_scroll" style={{padding: '2% 5%'}}>
          <div className="body_container_content">
            <div className="body_container_content_title">상태</div>
            <div className="pjt_status" onClick={togglePjtstate}>
              <div className={pjtStatus === '진행 중' ? 'blue_circle' : pjtStatus === '진행 완료' ? 'brown_circle' : ''}></div>
              {pjtStatus}
              {pjtstateIsOpen && (
                <ul className="dropdown_menu_status">
                  {pjtstateOptions.map((option) => (
                    <li key={option} onClick={() => handlePjtStateSelect(option)}>
                      {option}
                      <div className={option === '진행 중' ? 'blue_circle' : option === '진행 완료' ? 'brown_circle' : ''}></div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="body_container_content">
            <input type="text" className="input_project" value={pjtTitle} placeholder="프로젝트 명" onChange={(e) => setPjtTitle(e.target.value)}/>
          </div>

          <div className="body_container_content content_box">
            <input
              type="text"
              className="input_box"
              value={teamLeader}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder="팀리더"
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

          <div className="body_container_content member_list_box" tabIndex={0}>
            <input
              type="text"
              className="input_list"
              value={inputAllMember}
              onChange={handleInputAllMemberChange}
              onKeyDown={handleInputAllMemberKeyDown}
              placeholder="전체 팀원"
              ref={inputRef}
            />
            {inputAllMember && (
              <ul className="autocomplete_dropdown_inbox">
                {filteredAllmembersNames.map(person => (
                  <li key={person.username} onClick={() => handleAutoAllMembersCompleteClick(person.username, person.department, person.team)}>
                    {person.team ? person.team : person.department} &nbsp;
                    {person.username}
                  </li>
                ))}
              </ul>
            )}

            <div className="body_container_content_listbox">
              {allMembers.map((item: string) => (
                <div className="listbox_content">
                  {item}
                  <span className="remove" onClick={() => handleRecipientRemove(item)}>×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="body_container_content member_list_box" style={{height: '110px'}}>
            <input
              type="text"
              className="input_list"
              value={inputAllReferrer}
              onChange={handleInputAllReferrerChange}
              onKeyDown={handleInputAllReferrerKeyDown}
              placeholder="참조자"
              ref={inputRef}
            />
            {inputAllReferrer && (
              <ul className="autocomplete_dropdown_inbox">
                {filteredAllReferrersNames.map(person => (
                  <li key={person.username} onClick={() => handleAutoAllReferrersCompleteClick(person.username, person.department, person.team)}>
                    {person.team ? person.team : person.department} &nbsp;
                    {person.username}
                  </li>
                ))}
              </ul>
            )}

            <div className="body_container_content_listbox">
              {allReferrers.map((item: string) => (
                <div className="listbox_content">
                  {item}
                  <span className="remove" onClick={() => handleReferrersRemove(item)}>×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="body_container_content content_box" tabIndex={0}>
            <div className="body_container_content_datepicker_title">
              프로젝트 기간
            </div>
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
      
      {/* 서브 프로젝트 수정 모달 */}
      <CustomModal
        isOpen={isViewSubPjtModalOpen}
        onClose={() => { setViewSubPjtModalOpen(false); resetForm(); setClickedProjects(null);}}
        header={rightclickedProjects?.projectName}
        headerTextColor="White"
        footer1={'편집'}
        footer1Class="green-btn"
        onFooter1Click={() => { setEditSubPjtModalOpen(true); setViewSubPjtModalOpen(false);}}
        footer2={'삭제'}
        footer2Class="red-btn"
        onFooter2Click={() => { setViewSubPjtModalOpen(false); resetForm(); setClickedProjects(null); handleDeleteSubPjt(clickedProjects?.mainprojectIndex || 0, clickedProjects?.subprojectIndex || 0)}}
        width="430px"
        height="520px"
      >
        <div className="body-container custom_scroll" style={{padding: '2% 5%'}}>
          <div className="body_container_content">
            <div className="body_container_content_title">상태</div>
            <div className="view_div">
              <div className={pjtStatus === '진행 중' ? 'blue_circle' : pjtStatus === '진행 완료' ? 'brown_circle' : ''}></div>
              {pjtStatus}
            </div>
          </div>
              
          <div className="body_container_content">
            <input type="text" readOnly className="input_project" value={pjtTitle} placeholder="서브 프로젝트 명" onChange={(e) => setPjtTitle(e.target.value)} />
          </div>

          <div className="body_container_content content_box">
            <input
              type="text"
              readOnly
              className="input_box"
              value={teamLeader}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder="팀리더"
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

          <div className="body_container_content member_list_box">
            <input
              type="text"
              readOnly
              className="input_list"
              value={inputAllMember}
              onChange={handleInputAllMemberChange}
              onKeyDown={handleInputAllMemberKeyDown}
              placeholder="담당 팀원"
              ref={inputRef}
            />
            {inputAllMember && (
              <ul className="autocomplete_dropdown_inbox">
                {filteredAllmembersNames.map(person => (
                  <li key={person.username} onClick={() => handleAutoAllMembersCompleteClick(person.username, person.department, person.team)}>
                    {person.team ? person.team : person.department} &nbsp;
                    {person.username}
                  </li>
                ))}
              </ul>
            )}

            <div className="body_container_content_listbox">
              {allMembers.map((item: string) => (
                <div className="listbox_content">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="body_container_content content_box" tabIndex={0}>
            <div className="body_container_content_datepicker_title">
              업무 기간
            </div>
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
                readOnly
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
                readOnly
              />
            </div>
          </div>

          <div className="body_container_content textarea_content">
            <div className="textarea_content_title">프로젝트 내용</div>
            <textarea readOnly value={pjtMemo} onChange={(e) => setPjtMemo(e.target.value)}/>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isEditSubPjtModalOpen}
        onClose={() => { setEditSubPjtModalOpen(false); resetForm(); }}
        header={rightclickedProjects?.projectName}
        headerTextColor="White"
        footer1={'수정'}
        footer1Class="green-btn"
        onFooter1Click={() => { setEditSubPjtModalOpen(false); resetForm(); handleEditSubProject(rightclickedProjects?.mainprojectIndex || 0, clickedProjects?.subprojectIndex || 0)}}
        footer2={'취소'}
        footer2Class="red-btn"
        onFooter2Click={() => { setEditSubPjtModalOpen(false); resetForm(); }}
        width="430px"
        height="520px"
      >
        <div className="body-container">
          <div className="body_container_content">
            <div className="body_container_content_title">상태</div>
            <div className="pjt_status" onClick={togglePjtstate}>
              {pjtStatus}
              <div className={pjtStatus === '진행 중' ? 'blue_circle' : pjtStatus === '진행 완료' ? 'brown_circle' : ''}></div>
              {pjtstateIsOpen && (
                <ul className="dropdown_menu_status">
                  {pjtstateOptions.map((option) => (
                    <li key={option} onClick={() => handlePjtStateSelect(option)}>
                      {option}
                      <div className={option === '진행 중' ? 'blue_circle' : option === '진행 완료' ? 'brown_circle' : ''}></div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="body_container_content">
            <input type="text" className="input_project" value={pjtTitle} placeholder="서브 프로젝트 명" onChange={(e) => setPjtTitle(e.target.value)}/>
          </div>

          <div className="body_container_content content_box">
            <input
              type="text"
              className="input_box"
              value={teamLeader}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder="팀리더"
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

          <div className="body_container_content member_list_box" tabIndex={0}>
            <input
              type="text"
              className="input_list"
              value={inputAllMember}
              onChange={handleInputAllMemberChange}
              onKeyDown={handleInputAllMemberKeyDown}
              placeholder="전체 팀원"
              ref={inputRef}
            />
            {inputAllMember && (
              <ul className="autocomplete_dropdown_inbox">
                {filteredAllmembersNames.map(person => (
                  <li key={person.username} onClick={() => handleAutoAllMembersCompleteClick(person.username, person.department, person.team)}>
                    {person.team ? person.team : person.department} &nbsp;
                    {person.username}
                  </li>
                ))}
              </ul>
            )}

            <div className="body_container_content_listbox">
              {allMembers.map((item: string) => (
                <div className="listbox_content">
                  {item}
                  <span className="remove" onClick={() => handleRecipientRemove(item)}>×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="body_container_content content_box" tabIndex={0}>
            <div className="body_container_content_datepicker_title">
              프로젝트 기간
            </div>
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

          <div className="body_container_content textarea_content">
            <div className="textarea_content_title">프로젝트 내용</div>
            <textarea value={pjtMemo} onChange={(e) => setPjtMemo(e.target.value)}/>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isDeletePjtModalOpen}
        onClose={() => setDeletePjtModalOpen(false)}
        header={'알림'}
        footer1={'삭제'}
        footer1Class="red-btn"
        onFooter1Click={() => {handleDeleteCheckboxPjt(selectedProjects)}}
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
        header={'프로젝트'}
        headerTextColor="White"
        footer1={'확인'}
        footer1Class="back-green-btn"
        onFooter1Click={() => setPjtModalOPen(false)}
        width="400px"
        height="360px"
      >
        <div className="body-container">
          <div className="body-content">
            <div className="content-right">
              <div className="content-type" style={{justifyContent: 'space-between'}}>
                <span>{selectedEvent?.projectName}</span>
                <div className={selectedEvent?.status === 'notstarted' ? 'green_circle' : selectedEvent?.status === 'inprogress' ? 'blue_circle' : 'brown_circle'}>{selectedEvent?.status === 'notstarted' ? '진행 예정' : selectedEvent?.status === 'inprogress' ? '진행 중' : '진행 완료'}</div>
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-right">
              <div className="content-teamLead">
                <span className="content-teamLead-name">팀리더</span>
                <span>{selectedEvent?.Leader}</span>
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-right">
              <div className="content-member-container">
                <div className="content-member-text">
                  담당 팀원
                </div>
                <div className="content-member">
                  {selectedEvent?.members.map(person => (
                    <div className="content-member-box">{person}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-right">
              <div className="content-date">
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <span className="content-date-name">프로젝트 기간</span>
                </div>
                {selectedEvent?.startDate ? new Date(selectedEvent.startDate).getFullYear() + '.' +  String(new Date(selectedEvent.startDate).getMonth() + 1).padStart(2, '0') + '.' + String(new Date(selectedEvent.startDate).getDate()).padStart(2, '0') + '　 ~ 　' + new Date(selectedEvent.endDate).getFullYear() + '.' +  String(new Date(selectedEvent.endDate).getMonth() + 1).padStart(2, '0') + '.' + String(new Date(selectedEvent.endDate).getDate()).padStart(2, '0') : 'No start date available'}
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
        width="350px"
        height="200px"
      >
        <div className="text-center">
          <span>{statusMessage}</span>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={EditForceMessage}
        onClose={() => {setEditForceMessage(false); resetForm();}}
        header={'알림'}
        footer1={'예'}
        footer1Class="gray-btn"
        onFooter1Click={() => {
          handleEditProject(rightclickedProjects?.mainprojectIndex, true); 
          setEditForceMessage(false); 
        }}
        footer2={'아니오'}
        footer2Class="red-btn"
        onFooter2Click={() => {setEditForceMessage(false); resetForm();}}
        width="350px"
        height="200px"
      >
        <div className="text-center">
          <span>프로젝트 기간 설정이 올바르지 않습니다.</span>
          <span>그래도 수정하시겠습니까?</span>
        </div>
      </CustomModal>

    </div>
  );
};

export default Project;