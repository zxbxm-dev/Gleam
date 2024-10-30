import "./MeetingRoom.scss";
import { useState, useEffect, useRef } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import CustomModal from "../../components/modal/CustomModal";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';
import { PersonData } from '../../services/person/PersonServices';
import { CheckMeeting, writeMeeting, EditMeeting, DeleteMeeting } from "../../services/meeting/MeetingRoom";
import { useQuery } from 'react-query';
import IncludeMeSlide from "./IncludeMeSlide";

export interface Event {
  id: string;
  username: string;
  userId: string;
  company: string;
  department: string;
  team: string;
  title: string;
  origintitle: string;
  startDate: string;
  endDate: string;
  mergeDate: string;
  place: string;
  meetpeople: Array<string>;
  memo: string;
  startTime:string;
  endTime:string;
}

type EventDetails = {
  username: string;
  userID: string;
  company: string;
  department: string;
  team: string;
  title: string;
  meetpeople: string[];
  startDate: string;
  endDate: string;
  place: string;
  memo: string;
  startTime: string;
  endTime: string;
};

interface ColorScheme {
  backgroundColor: string;
  borderColor: string;
}

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

const formatDate = (date: Date): string => {
  const year = date.getFullYear().toString().slice(-2); // 연도의 마지막 2자리
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월
  const day = String(date.getDate()).padStart(2, '0'); // 일
  return `${year}-${month}-${day}`;
};

const MeetingRoom = () => {
  const user = useRecoilValue(userState);
  const [persondata, setPersonData] = useState<any[]>([]);
  const [meetingEvent, setMeetingEvent] = useState<any[]>([]);
  const [NotFilterEvent, setNotFilterEvent] = useState<any[]>([]);

  const [isAddeventModalOpen, setAddEventModalOPen] = useState(false);
  const [iseventModalOpen, setEventModalOPen] = useState(false);
  const [isEditeventModalOpen, setEditEventModalOPen] = useState(false);
  const [isDeleteeventModalOpen, setDeleteEventModalOPen] = useState(false);
  const [isMeetingModalOpen, setMeetingModalOPen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isEditConfirmationModalOpen, setIsEditConfirmationModalOpen] = useState(false);
  const [tempEventDetails, setTempEventDetails] = useState<EventDetails | null>(null);

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [memo, setMemo] = useState("");
  const calendarRef1 = useRef<FullCalendar>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [location, setLocation] = useState(""); // 선택된 장소 상태
  const [otherLocation, setOtherLocation] = useState("");
  const [company, setCompany] = useState(""); // 선택된 회사 상태
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [isTwoOpen, setIsTwoOpen] = useState(false);
  const [selectedTwoTime, setSelectedTwoTime] = useState("");
  const [title, setTitle] = useState<string>("");
  const [selectedPersonIndex, setSelectedPersonIndex] = useState(-1); // 사람 리스트에 대한 인덱스
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(-1); // 팀 리스트에 대한 인덱스
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [recipients, setRecipients] = useState<string[]>([]);

  const [isOn, setIsOn] = useState(false);
  const [isOtherLocation, setIsOtherLocation] = useState(false);

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
      const departmentOrder = [
        "개발부",
        "마케팅부",
        "관리부",
        "알고리즘 연구실",
        "동형분석 연구실",
        "블록체인 연구실"
      ];

      const initialData = [
        { department: "관리부", username: "" },
        { team: "지원팀", username: "" },
        { team: "관리팀", username: "" },
        { department: "마케팅부", username: "" },
        { team: "기획팀", username: "" },
        { team: "디자인팀", username: "" },
        { department: "개발부", username: "" },
        { team: "개발 1팀", username: "" },
        { team: "개발 2팀", username: "" },
        { department: "알고리즘 연구실", username: "" },
        { team: "암호 연구팀", username: "" },
        { team: "AI 연구팀", username: "" },
        { department: "동형분석 연구실", username: "" },
        { team: "동형분석 연구팀", username: "" },
        { department: "블록체인 연구실", username: "" },
        { team: "크립토 블록체인 연구팀", username: "" },
        { team: "API 개발팀", username: "" }
      ];

      // data 부분만 정렬
      const sortedData = data.sort((a: any, b: any) => {
        const deptA = a.department || "";
        const deptB = b.department || "";

        // 부서 순서 기준으로 정렬
        const deptIndexA = departmentOrder.indexOf(deptA);
        const deptIndexB = departmentOrder.indexOf(deptB);

        if (deptIndexA !== -1 && deptIndexB !== -1) {
          if (deptIndexA !== deptIndexB) {
            return deptIndexA - deptIndexB;
          } else {
            // 같은 부서일 경우 팀 이름으로 추가 정렬
            const teamComparison = (a.team || "").localeCompare(b.team || "");

            if (teamComparison !== 0) return teamComparison;

            // 팀까지 동일하면 이름으로 정렬
            return (a.username || "").localeCompare(b.username || "");
          }
        } else if (deptIndexA !== -1) {
          return -1;
        } else if (deptIndexB !== -1) {
          return 1;
        }

        // 부서가 없는 경우 기본 알파벳 정렬, 이후 팀, 이름 순
        return deptA.localeCompare(deptB) || 
              (a.team || "").localeCompare(b.team || "") || 
              (a.username || "").localeCompare(b.username || "");
      });

      
      // initialData와 sortedData를 결합
      const updatedData = [...initialData, ...sortedData];
      setPersonData(updatedData);
    },
    onError: (error) => {
      console.log(error);
    }
  })

  const handleRecipientRemove = (userData: string) => {
    setRecipients(recipients.filter(recipient => recipient !== userData));
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue && !recipients.includes(trimmedValue)) {
        setRecipients([...recipients, trimmedValue]);
        setInputValue('');
      }
    }
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: any) => {
    if (e.key === "ArrowDown") {
      setSelectedPersonIndex((prevIndex) =>
        prevIndex < filteredEmailsPerson.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setSelectedPersonIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === "Enter") {
      if (selectedPersonIndex >= 0 && selectedPersonIndex < filteredEmailsPerson.length) {
        handleAutoCompleteClick(
          `${filteredEmailsPerson[selectedPersonIndex].team ? filteredEmailsPerson[selectedPersonIndex].team : filteredEmailsPerson[selectedPersonIndex].department} ${filteredEmailsPerson[selectedPersonIndex].username}`
        );
        setSelectedPersonIndex(-1);
      }
    }
  };

  const handleAutoCompleteClick = (userData: string) => {
    const trimmedData = userData.trim();
    
    const isTeam = persondata.some(person => person.team === trimmedData);
    const isDepartment = persondata.some(person => person.department === trimmedData);

    if (isTeam) {
      const teamMembers = persondata.filter(person => person.team === trimmedData);
      const newRecipients = [...recipients];

      teamMembers.forEach(member => {
        const fullName = `${member.team ? member.team : member.department} ${member.username}`;
        if (!newRecipients.includes(fullName) && fullName.trim() !== trimmedData) {
          newRecipients.push(fullName);
        }
      });

      setRecipients(newRecipients);
    } else if (isDepartment) {
      const departmentMembers = persondata.filter(person => person.department === trimmedData);
      const newRecipients = [...recipients];

      departmentMembers.forEach(member => {
        const fullName = `${member.team ? member.team : member.department} ${member.username}`;
        if (!newRecipients.includes(fullName) && fullName.trim() !== trimmedData) {
          newRecipients.push(fullName);
        }
      });

      setRecipients(newRecipients);
    } else {
      if (!recipients.includes(userData)) {
        setRecipients([...recipients, userData]);
      }
    }

    setInputValue('');
  };




  const filteredEmails = persondata.filter(person => {
    const inputLowerCase = inputValue.toLowerCase();
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

  const filteredEmailsPerson = filteredEmails.filter(person => person.username !== '')
  const filteredEmailsTeam = filteredEmails.filter(person => person.username === '')

  const getClosestTime = () => {
    const now = new Date();
    const times: string[] = [];

    for (let index = 0; index < 16; index++) {
      const hour = 10 + Math.floor(index / 2);
      const minute = (index % 2) * 30;
      if (hour === 17 && minute > 0) continue; // 17:30 제외
      times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }

    // 현재 시간에 가장 가까운 시간을 찾기
    let closestTime = times[0];
    let closestDiff = Infinity;

    times.forEach(time => {
      const [hour, minute] = time.split(':').map(Number);
      const timeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
      const diff = Math.abs(now.getTime() - timeDate.getTime());

      if (diff < closestDiff) {
        closestDiff = diff;
        closestTime = time;
      }
    });

    return closestTime;
  };


  useEffect(() => {
    const closestTime = getClosestTime();
    setSelectedTime(closestTime);
  }, []);

  const toggleSelect = () => {
    setIsOpen(!isOpen);
  };

  const toggleSwitch = () => {
    setIsOn(!isOn);
    if (!isOn) {
      setSelectedTime("10:00");
      setSelectedTwoTime("17:00");
    } else {
      setSelectedTime(getClosestTime());
      setSelectedTwoTime("");
    }
  };

  const addHoursToTime = (time: any, hoursToAdd: any) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setHours(date.getHours() + hoursToAdd);
    return date.toTimeString().slice(0, 5);
  };

  const handleTimeSelect = (time: any) => {
    setSelectedTime(time);
    setSelectedTwoTime(addHoursToTime(time, 1));
    setIsOpen(false);
  };

  const toggleTwoSelect = () => {
    setIsTwoOpen(!isTwoOpen);
  };

  const handleTwoTimeSelect = (time: any) => {
    setSelectedTwoTime(time);
    setIsTwoOpen(false);
  };

  const handleStartDateChange = (date: any) => {
    setStartDate(date);
    if (!endDate || date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: any) => {
    setEndDate(date);
  };

  const handleCompanyChange = (e: any) => {
    const selectedCompany = e.target.value;
    setCompany(selectedCompany);
    setLocation("");
  };

  const handleLocationChange = (e: any) => {
    const selectedLocation = e.target.value;
    setLocation(selectedLocation);
    setIsOtherLocation(selectedLocation === "기타");
    setOtherLocation('');
  };

  const handleOtherLocationChange = (e: any) => {
    setOtherLocation(e.target.value);
  };

  const handleMemoChange = (event: any) => {
    setMemo(event.target.value);
  };

  const handleEventClick = (info: any) => {
    // 요일 배열
    const days = ["일", "월", "화", "수", "목", "금", "토"];

    const formatTime = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const isAllDay = (start: Date, end: Date) => {
      // (시작시간이 10:00이고 종료시간이 17:00이면 종일)
      const startHours = start.getHours();
      const startMinutes = start.getMinutes();
      const endHours = end.getHours();
      const endMinutes = end.getMinutes();
      return (startHours === 10 && startMinutes === 0 && endHours === 17 && endMinutes === 0);
    };

    const startDate = info.event.start;
    const endDate = info.event.end || info.event.start;

    let mergeDate = '';
    //  날짜가 같은 경우
    if (
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate()
    ) {
      // 하루 종일 이벤트인지 확인
      if (isAllDay(startDate, endDate)) {
        mergeDate = `${startDate.getFullYear()}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${String(startDate.getDate()).padStart(2, '0')} (${days[startDate.getDay()]}) (종일)`;
      } else {
        mergeDate = `${startDate.getFullYear()}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${String(startDate.getDate()).padStart(2, '0')} (${days[startDate.getDay()]}) ${formatTime(startDate)} ~ ${formatTime(endDate)}`;
      }
    } else {
      if (isAllDay(startDate, endDate)) {
        mergeDate = `${startDate.getFullYear()}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${String(startDate.getDate()).padStart(2, '0')} (${days[startDate.getDay()]}) ~ ${endDate.getFullYear()}.${String(endDate.getMonth() + 1).padStart(2, '0')}.${String(endDate.getDate()).padStart(2, '0')} (${days[endDate.getDay()]}) (종일)`;
      } else {
        mergeDate = `${startDate.getFullYear()}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${String(startDate.getDate()).padStart(2, '0')} (${days[startDate.getDay()]}) ~ ${endDate.getFullYear()}.${String(endDate.getMonth() + 1).padStart(2, '0')}.${String(endDate.getDate()).padStart(2, '0')} (${days[endDate.getDay()]}) ${formatTime(startDate)} ~ ${formatTime(endDate)}`;
      }
    }

    setSelectedEvent({
      id: info.event.extendedProps.meetingId,
      username: info.event.extendedProps.username,
      userId: info.event.extendedProps.userId,
      company: info.event.extendedProps.company,
      department: info.event.extendedProps.department,
      team: info.event.extendedProps.team,
      title: info.event.title,
      origintitle: info.event.extendedProps.origintitle,
      startDate: info.event.start,
      endDate: info.event.end,
      startTime:info.event.startTime,
      endTime:info.event.endTime,
      mergeDate: mergeDate,
      place: info.event.extendedProps.place,
      meetpeople: info.event.extendedProps.meetpeople,
      memo: info.event.extendedProps.memo,
    });
    setEventModalOPen(true);
  };

  const handleEditEvent = () => {
    const savedStartDate = selectedEvent?.startDate;
    const savedendDate = selectedEvent?.endDate;
    if (savedStartDate) {
      const savedDate = new Date(savedStartDate);

      setStartDate(new Date(savedDate.getFullYear(), savedDate.getMonth(), savedDate.getDate()));
      setSelectedTime(
        `${String(savedDate.getHours()).padStart(2, '0')}:${String(savedDate.getMinutes()).padStart(2, '0')}`
      );
    } else {
      setStartDate(null);
      setSelectedTime("");
    }

    if (savedendDate) {
      const savedDate = new Date(savedendDate);

      setEndDate(new Date(savedDate.getFullYear(), savedDate.getMonth(), savedDate.getDate()));
      setSelectedTwoTime(
        `${String(savedDate.getHours()).padStart(2, '0')}:${String(savedDate.getMinutes()).padStart(2, '0')}`
      );
    } else {
      setEndDate(null);
      setSelectedTwoTime("");
    }


    setTitle(selectedEvent?.origintitle || '');
    setRecipients(selectedEvent?.meetpeople || []);
    setCompany(selectedEvent?.company || '');
    if (selectedEvent?.company === '기타') {
      setOtherLocation(selectedEvent?.place || '');
    } else {
      setLocation(selectedEvent?.place || '');
    }
    setMemo(selectedEvent?.memo || '');
    setEventModalOPen(false);
    setEditEventModalOPen(true);
  }

  const handleDeleteEventModal = () => {
    setDeleteEventModalOPen(true)
  }

  // 회의실 일정 전체 목록 조회
  const transformMeetingData = (data: any) => {
    const colorMapping: Record<string, ColorScheme> = {
      '라운지': { backgroundColor: '#D3D6F8', borderColor: '#D3D6F8' },
      '미팅룸': { backgroundColor: '#DBE7EB', borderColor: '#DBE7EB' },
      '연구총괄실': { backgroundColor: '#B8E4F4', borderColor: '#B8E4F4' },
    };

    const currentTime = new Date();

    return data?.map((event: any) => {
      const { id, title, startDate, endDate, startTime, endTime, backgroundColor, borderColor, textColor, ...rest } = event;
      const start = new Date(`20${startDate}T${startTime}`);
      const end = new Date(`20${endDate}T${endTime}`);

      let colors = colorMapping[event.place] || { backgroundColor: '#C9FFDB', borderColor: '#C9FFDB', textColor: 'black' };

      // 현재 시간과 비교하여 색상 변경 -------- 색 변경 필요
      if (end < currentTime) {
        switch (event.place) {
          case '미팅룸':
            colors = { backgroundColor: '#DDDDDD', borderColor: '#DDDDDD' };
            break;
          case '라운지':
            colors = { backgroundColor: '#DDDDDD', borderColor: '#DDDDDD' };
            break;
          case '연구총괄실':
            colors = { backgroundColor: '#DDDDDD', borderColor: '#DDDDDD' };
            break;
          default:
            colors = { backgroundColor: '#DDDDDD', borderColor: '#DDDDDD' };
            break;
        }
      }

      return {
        id: event.meetingId,
        title: startTime?.slice(0, 5) + '　' + event.title + ' | ' + event.place,
        origintitle: title,
        start,
        end,
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        textColor: textColor || "#000",
        ...rest,
      };
    });
  };


  const fetchMeeting = async () => {
    try {
      const response = await CheckMeeting();
      setNotFilterEvent(response.data);

      return response.data;
    } catch (error) {
      console.log("Failed to fetch Meeting data");
    };
  };

  const { refetch: refetchMeeting } = useQuery("Meeting", fetchMeeting, {
    enabled: false,
    onSuccess: (data) => {
      const transformedData = transformMeetingData(data);

      setMeetingEvent(transformedData);
    },
    onError: (error) => {
      console.log(error);
    }
  });

  // 회의실 예약 추가
  const handleAddEvent = async () => {
    const formattedStartDate = startDate ? formatDate(startDate) : '';
    const formattedEndDate = endDate ? formatDate(endDate) : '';

    const eventDetails = {
      username: user.username,
      userID: user.userID,
      company: company,
      department: user.department,
      team: user.team,
      title,
      meetpeople: recipients,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      place: (location === '기타' || company === '기타') ? otherLocation : location,
      memo,
      startTime: isOn ? "10:00" : selectedTime,
      endTime: isOn ? "17:00" : selectedTwoTime,
    };

    try {
      const response = await writeMeeting(eventDetails);
      console.log("회의 일정 추가 성공:", response.data);
      refetchMeeting();
      setTitle('');
      setRecipients([]);
      setStartDate(new Date());
      setEndDate(new Date());
      setCompany('');
      setLocation('');
      setOtherLocation('');
      setMemo('');
      setSelectedTwoTime('');
      setIsOn(false);
      setAddEventModalOPen(false);
    } catch (error: any) {
      console.error("회의 일정 추가 실패:", error);
      if (error.response) {
        const { status } = error.response;
        const { message } = error.response.data;
        switch (status) {
          case 409:
            setMeetingModalOPen(true);
            setErrorMessage(message);
            break;

          case 418:
            setTempEventDetails(eventDetails);
            setIsConfirmationModalOpen(true);
            break;
        }
      }
    }
  };

  // 회의실 예약 수정
  const handleEidtMeeting = () => {
    const formattedStartDate = startDate ? formatDate(startDate) : '';
    const formattedEndDate = endDate ? formatDate(endDate) : '';

    const eventData = {
      username: user.username,
      userID: user.userID,
      company,
      department: user.department,
      team: user.team,
      title,
      meetpeople: recipients,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      place: (location === '기타' || company === '기타') ? otherLocation : location,
      memo,
      startTime: selectedTime,
      endTime: selectedTwoTime,
    }

    const Meeting_id = selectedEvent?.id;

    EditMeeting(eventData, Meeting_id)
      .then(() => {
        console.log('수정할때 보낸 데이터', eventData)
        setEditEventModalOPen(false);
        setTitle('');
        setRecipients([]);
        setStartDate(new Date());
        setEndDate(new Date());
        setCompany('');
        setLocation('');
        setOtherLocation('');
        setMemo('');
        setSelectedTwoTime('');
        setIsOn(false);
        setAddEventModalOPen(false);
        refetchMeeting();
      })
      .catch((error) => {
        console.log("회의실 수정에 실패했습니다.", error);
        if (error.response) {
          const { status } = error.response;
          const { message } = error.response.data;
          switch (status) {
            case 409:
              setMeetingModalOPen(true);
              setErrorMessage(message);
              break;

            case 418:
              setTempEventDetails(eventData);
              setIsEditConfirmationModalOpen(true);
              break;
          }
        }
      })
  };

  // 회의실 예약 삭제
  const handleDeleteMeeting = () => {
    const eventData = {
      userID: selectedEvent?.userId,
    }
    const Meeting_id = selectedEvent?.id;

    DeleteMeeting(eventData, Meeting_id)
      .then(response => {
        console.log("회의실 데이터 삭제 성공", response);
        refetchMeeting();
      })
      .catch(error => {
        console.error("회의실 데이터 삭제 실패", error);
        if (error.response) {
          const { status } = error.response;
          const { message } = error.response.data;
          switch (status) {
            case 403:
              setMeetingModalOPen(true);
              setErrorMessage(message);
              break;
          }
        }
      });

    setDeleteEventModalOPen(false);
    setEventModalOPen(false);
  }

  const userIsAuthorized = () => {  // 수정, 삭제 권한
    const meetpeopleNames = selectedEvent?.meetpeople.map(person => person.split(' ').pop());
    return user.username === selectedEvent?.username || meetpeopleNames?.includes(user.username);
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

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPersonIndex, filteredEmails]);

  useEffect(() => {
    // fc-popover의 위치를 조정
    const adjustPopoverTop = () => {
      const popovers = document.querySelectorAll('.fc-popover');
      popovers.forEach((popover) => {
        const popoverElement = popover as HTMLElement;
        const currentTop = parseFloat(popoverElement.style.top);
        if (!isNaN(currentTop)) {
          popoverElement.style.top = `${currentTop - 50}px`;
        }
      });
    };

    const observer = new MutationObserver(() => {
      adjustPopoverTop();
    });

    const calendarContainer = document.querySelector('.fc') as HTMLElement;
    if (calendarContainer) {
      observer.observe(calendarContainer, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    refetchMeeting(); // 첫 렌더링 시 목록 조회 호출
  }, [refetchMeeting]);

  return (
    <div className="content">
      <div className="content_container">
        <div className="meetingroom_container">
          <FullCalendar
            ref={calendarRef1}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            height="100%"
            customButtons={{
              Addschedule: {
                text: '일정 추가　+',
                click: function () {
                  setAddEventModalOPen(true);
                },
              },
            }}
            headerToolbar={{
              start: '',
              center: 'prev title next',
              end: 'Addschedule',
            }}
            dayHeaderFormat={{ weekday: 'long' }}
            titleFormat={(date) => `${date.date.year}년 ${date.date.month + 1}월`}
            locale='kr'
            fixedWeekCount={false}
            events={meetingEvent}
            eventContent={(arg) => {
              const matches = arg.event.extendedProps.meetpeople.some((meetPerson: string[]) => {
                return meetPerson.includes(user.username) && (user.team ? meetPerson.includes(user.team) : true);
              });

              const circleClass = arg.event._def.ui.backgroundColor === '#DDDDDD' ? "InActiveCircle" : "ActiveCircle";

              return (
                <div className="IncludeMe">
                  <span>{arg.event.title}</span>
                  {matches && (
                    <div className={circleClass} />
                  )}
                </div>
              );
            }}
            dayMaxEventRows={true}
            eventDisplay="block"
            eventClick={handleEventClick}
            moreLinkText='개 일정 더보기'
            dayCellContent={dayCellContent}
          />
          <IncludeMeSlide NotFilterEvent={NotFilterEvent} />
        </div>
      </div>

      <CustomModal
        isOpen={isAddeventModalOpen}
        onClose={() => {
          setAddEventModalOPen(false);
          setTitle('');
          setRecipients([]);
          setStartDate(new Date());
          setEndDate(new Date());
          setCompany('');
          setLocation('');
          setOtherLocation('');
          setIsOn(false);
          setMemo('');
          setSelectedTwoTime('');
        }}
        header={'회의실 예약'}
        headerTextColor="White"
        footer1={'저장'}
        footer1Class="back-green-btn"
        onFooter1Click={handleAddEvent}
        height="525px"
        width="530px"
      >
        <div className="body-container">
          <div className="AddTitle">
            <input className="MeetingRoom_Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
          </div>
          <div className="AddPeople">
            <div className="InputContainer">
              <input
                id="recipient_input_element"
                placeholder="전체 팀원"
                className="AddInputCon"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                ref={inputRef}
              />
              {inputValue && (
                <div className="autocomplete_dropdown_container">
                  <ul className="autocomplete_dropdown_person">
                    {filteredEmailsPerson
                    .map((person, index) => (
                      <li
                        key={person.username}
                        className={index === selectedPersonIndex ? "selected" : ""}
                        onClick={() => handleAutoCompleteClick(`${person.team ? person.team : person.department} ${person.username}`)}
                        onMouseEnter={() => setSelectedPersonIndex(index)}
                        onMouseLeave={() => setSelectedPersonIndex(-1)}
                      >
                        {person.team ? person.team : person.department} {person.username}
                      </li>
                    ))}
                  </ul>
                  <ul className="autocomplete_dropdown_team">
                    {filteredEmailsTeam
                    .map((person, index) => (
                      <li
                        key={person.username}
                        className={index === selectedTeamIndex ? "selected" : ""}
                        onClick={() => handleAutoCompleteClick(`${person.team ? person.team : person.department} ${person.username}`)}
                        onMouseEnter={() => setSelectedTeamIndex(index)}
                        onMouseLeave={() => setSelectedTeamIndex(-1)}
                      >
                        {person.team ? person.team : person.department} {person.username}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="AddsInputCon">
                {recipients.map((userData, index) => (
                  <div className="recipient" key={index}>
                    {userData}
                    <span className="remove" onClick={() => handleRecipientRemove(userData)}>×</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="AddPeople Meeting_border">
            <span className="Meeting_border_title">시간</span>
            <div className="Date">
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText={new Date().toLocaleDateString('ko-KR')}
                dateFormat="yyyy-MM-dd"
                className="datepicker"
                popperPlacement="top"
              />
              <div className="timeoption" onClick={toggleSelect}>
                <input type="text" className="time_input" maxLength={5} value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
                {isOpen && (
                  <div className="options">
                    {[...Array(16)].map((_, index) => {
                      const hour = 10 + Math.floor(index / 2);
                      const minute = (index % 2) * 30;
                      if (hour === 17 && minute > 0) return null;
                      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                      return (
                        <div key={index} className="optionselect" onClick={() => handleTimeSelect(time)}>
                          {time}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <span className="timespan">~</span>
            <div className="Date">
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText={new Date().toLocaleDateString('ko-KR')}
                dateFormat="yyyy-MM-dd"
                className="datepicker"
                popperPlacement="top"
              />
              <div className="timeoption" onClick={toggleTwoSelect}>
                <input type="text" className="time_input" maxLength={5} value={selectedTwoTime || '00:00'} onChange={(e) => setSelectedTwoTime(e.target.value)} />
                {isTwoOpen && (
                  <div className="options">
                    {[...Array(16)].map((_, index) => {
                      const hour = 10 + Math.floor(index / 2);
                      const minute = (index % 2) * 30;
                      if (hour === 17 && minute > 0) return null;
                      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                      return (
                        <div key={index} className="optionselect" onClick={() => handleTwoTimeSelect(time)}>
                          {time}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="All_day_button">
                <span>종일</span>
                <div className={`switch ${isOn ? 'on' : 'off'}`} onClick={toggleSwitch}>
                  <div className="slider"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="AddPeoples">
            <div className="MeetingRoom">
              <div className="MeetingRoom_place">
                <span className="MeetingRoom_place_title">장소</span>
                <fieldset className="Field" onChange={handleCompanyChange}>
                  <label className="custom-radio">
                    <input type="radio" name="company" value="본사" checked={company === '본사'} readOnly />
                    <span>본사</span>
                    <span className="checkmark"></span>
                  </label>
                  <label className="custom-radio">
                    <input type="radio" name="company" value="R&D" checked={company === 'R&D'} readOnly />
                    <span>R&D</span>
                    <span className="checkmark"></span>
                  </label>
                  <label className="custom-radio">
                    <input type="radio" name="company" value="기타" checked={company === '기타'} readOnly />
                    <span>기타</span>
                    <span className="checkmark"></span>
                  </label>
                </fieldset>
              </div>
              {company !== '기타' ? (
                <div className="SelectRoom_wrap">
                  <select className="SelectRoom" value={location} onChange={handleLocationChange}>
                    <option value="">회의실 선택</option>
                    {company === "본사" && (
                      <>
                        <option value="미팅룸">미팅룸</option>
                        <option value="라운지">라운지</option>
                        <option value="기타">기타</option>
                      </>
                    )}
                    {company === "R&D" && (
                      <>
                        <option value="연구총괄실">연구총괄실</option>
                        <option value="기타">기타</option>
                      </>
                    )}
                  </select>

                  {isOtherLocation && (
                    <input
                      className="write_selectRoom"
                      placeholder="장소를 입력해주세요."
                      value={otherLocation}
                      onChange={handleOtherLocationChange}
                    />
                  )}
                </div>
              ) :
                (
                  <input
                    className="other_place_input"
                    placeholder="장소를 입력해주세요."
                    value={otherLocation}
                    onChange={handleOtherLocationChange}
                  />
                )
              }
            </div>
          </div>
          <div className="AddTitle">
            <div className="MeetingRoom_memo">
              <div className="MeetingRoom_memo_title">메모</div>
              <textarea className="TextInputCon2" value={memo} onChange={handleMemoChange} />
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={iseventModalOpen}
        onClose={() => setEventModalOPen(false)}
        header={'회의실'}
        headerTextColor="White"
        footer1={userIsAuthorized() ? '편집' : null}
        footer1Class="gray-btn"
        onFooter1Click={handleEditEvent}
        footer2={'확인'}
        footer2Class="green-btn"
        onFooter2Click={() => setEventModalOPen(false)}
        footer3={userIsAuthorized() ? '삭제' : null}
        footer3Class="red-btn"
        onFooter3Click={handleDeleteEventModal}
        width="400px"
        height="auto"
      >
        <div className="body-container">
          <div className="body-content">
            <div className="content-right">
              <div className="content-type">
                {selectedEvent?.origintitle}
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-right">
              <div className="content-date">
                <span className="content-date-name">시간</span>
                <span>{selectedEvent?.mergeDate}</span>
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-right">
              <div className="content-date">
                <span className="content-date-name">장소</span>
                <span>{selectedEvent?.place}</span>
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-right">
              <div className="content-member-container">
                <div className="content-member-text">
                  인원
                </div>
                <div className="content-member">
                  {selectedEvent?.meetpeople.map((person: any, index: number) => (
                    <div key={index} className="content-member-box">{person}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="body-content">
            <div className="content-right">
              <div className="content-memo-container">
                <div className="content-memo-text">
                  메모
                </div>
                <div className="content-memo" style={{ height: '100px' }}>
                  <textarea className="textareainput" value={selectedEvent?.memo} readOnly />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isEditeventModalOpen}
        onClose={() => {
          setEditEventModalOPen(false);
          setTitle('');
          setRecipients([]);
          setStartDate(new Date());
          setEndDate(new Date());
          setCompany('');
          setLocation('');
          setOtherLocation('');
          setIsOn(false);
          setMemo('');
          setSelectedTwoTime('');
        }}
        header={'일정 수정하기'}
        headerTextColor="White"
        footer1={'수정'}
        footer1Class="back-green-btn"
        onFooter1Click={handleEidtMeeting}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => {
          setEditEventModalOPen(false);
          setTitle('');
          setRecipients([]);
          setStartDate(new Date());
          setEndDate(new Date());
          setCompany('');
          setLocation('');
          setOtherLocation('');
          setIsOn(false);
          setMemo('');
          setSelectedTwoTime('');
        }}
        height="525px"
        width="530px"
      >
        <div className="body-container">
          <div className="AddTitle">
            <input className="MeetingRoom_Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
          </div>
          <div className="AddPeople">
            <div className="InputContainer">
              <input
                id="recipient_input_element"
                placeholder="전체 팀원"
                className="AddInputCon"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                ref={inputRef}
              />
              {inputValue && (
                <div className="autocomplete_dropdown_container">
                  <ul className="autocomplete_dropdown_person">
                    {filteredEmailsPerson
                    .map((person, index) => (
                      <li
                        key={person.username}
                        className={index === selectedPersonIndex ? "selected" : ""}
                        onClick={() => handleAutoCompleteClick(`${person.team ? person.team : person.department} ${person.username}`)}
                        onMouseEnter={() => setSelectedPersonIndex(index)}
                        onMouseLeave={() => setSelectedPersonIndex(-1)}
                      >
                        {person.team ? person.team : person.department} {person.username}
                      </li>
                    ))}
                  </ul>
                  <ul className="autocomplete_dropdown_team">
                    {filteredEmailsTeam
                    .map((person, index) => (
                      <li
                        key={person.username}
                        className={index === selectedTeamIndex ? "selected" : ""}
                        onClick={() => handleAutoCompleteClick(`${person.team ? person.team : person.department} ${person.username}`)}
                        onMouseEnter={() => setSelectedTeamIndex(index)}
                        onMouseLeave={() => setSelectedTeamIndex(-1)}
                      >
                        {person.team ? person.team : person.department} {person.username}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="AddsInputCon">
                {recipients.map((userData, index) => (
                  <div className="recipient" key={index}>
                    {userData}
                    <span className="remove" onClick={() => handleRecipientRemove(userData)}>×</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="AddPeople Meeting_border">
            <span className="Meeting_border_title">시간</span>
            <div className="Date">
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText={new Date().toLocaleDateString('ko-KR')}
                dateFormat="yyyy-MM-dd"
                className="datepicker"
                popperPlacement="top"
              />
              <div className="timeoption" onClick={toggleSelect}>
                <input type="text" className="time_input" maxLength={5} value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
                {isOpen && (
                  <div className="options">
                    {[...Array(16)].map((_, index) => {
                      const hour = 10 + Math.floor(index / 2);
                      const minute = (index % 2) * 30;
                      if (hour === 17 && minute > 0) return null;
                      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                      return (
                        <div key={index} className="optionselect" onClick={() => handleTimeSelect(time)}>
                          {time}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <span className="timespan">~</span>
            <div className="Date">
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText={new Date().toLocaleDateString('ko-KR')}
                dateFormat="yyyy-MM-dd"
                className="datepicker"
                popperPlacement="top"
              />
              <div className="timeoption" onClick={toggleTwoSelect}>
                <input type="text" className="time_input" maxLength={5} value={selectedTwoTime || '00:00'} onChange={(e) => setSelectedTwoTime(e.target.value)} />
                {isTwoOpen && (
                  <div className="options">
                    {[...Array(16)].map((_, index) => {
                      const hour = 10 + Math.floor(index / 2);
                      const minute = (index % 2) * 30;
                      if (hour === 17 && minute > 0) return null;
                      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                      return (
                        <div key={index} className="optionselect" onClick={() => handleTwoTimeSelect(time)}>
                          {time}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="All_day_button">
                <span>종일</span>
                <div className={`switch ${isOn ? 'on' : 'off'}`} onClick={toggleSwitch}>
                  <div className="slider"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="AddPeoples">
            <div className="MeetingRoom">
              <div className="MeetingRoom_place">
                <span className="MeetingRoom_place_title">장소</span>
                <fieldset className="Field" onChange={handleCompanyChange}>
                  <label className="custom-radio">
                    <input type="radio" name="company" value="본사" checked={company === '본사'} readOnly />
                    <span>본사</span>
                    <span className="checkmark"></span>
                  </label>
                  <label className="custom-radio">
                    <input type="radio" name="company" value="R&D" checked={company === 'R&D'} readOnly />
                    <span>R&D</span>
                    <span className="checkmark"></span>
                  </label>
                  <label className="custom-radio">
                    <input type="radio" name="company" value="기타" checked={company === '기타'} readOnly />
                    <span>기타</span>
                    <span className="checkmark"></span>
                  </label>
                </fieldset>
              </div>
              {company !== '기타' ? (
                <div className="SelectRoom_wrap">
                  <select className="SelectRoom" value={location} onChange={handleLocationChange}>
                    <option value="">회의실 선택</option>
                    {company === "본사" && (
                      <>
                        <option value="미팅룸">미팅룸</option>
                        <option value="라운지">라운지</option>
                        <option value="기타">기타</option>
                      </>
                    )}
                    {company === "R&D" && (
                      <>
                        <option value="연구총괄실">연구총괄실</option>
                        <option value="기타">기타</option>
                      </>
                    )}
                  </select>

                  {isOtherLocation && (
                    <input
                      className="write_selectRoom"
                      placeholder="장소를 입력해주세요."
                      value={otherLocation}
                      onChange={handleOtherLocationChange}
                    />
                  )}
                </div>
              ) :
                (
                  <input
                    className="other_place_input"
                    placeholder="장소를 입력해주세요."
                    value={otherLocation}
                    onChange={handleOtherLocationChange}
                  />
                )
              }
            </div>
          </div>
          <div className="AddTitle">
            <div className="MeetingRoom_memo">
              <div className="MeetingRoom_memo_title">메모</div>
              <textarea className="TextInputCon2" value={memo} onChange={handleMemoChange} />
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isDeleteeventModalOpen}
        onClose={() => setDeleteEventModalOPen(false)}
        header={'알림'}
        footer1={'삭제'}
        onFooter1Click={(handleDeleteMeeting)}
        footer1Class="red-btn"
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => setDeleteEventModalOPen(false)}
      >
        <div>
          삭제하시겠습니까?
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isMeetingModalOpen}
        onClose={() => setMeetingModalOPen(false)}
        header={'알림'}
        footer1={'확인'}
        footer1Class="gray-btn"
        onFooter1Click={() => setMeetingModalOPen(false)}
        width="400px"
        height="250px"
      >
        <div className="text-center">
          <span>{errorMessage}</span>
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        header="회의 일정 중복"
        footer1="확인"
        footer1Class="green-btn"
        onFooter1Click={async () => {
          try {
            const response = await writeMeeting({ ...tempEventDetails, force: true });
            console.log("회의 일정 추가 성공:", response.data);
            refetchMeeting();
          } catch (error) {
            console.error("회의 일정 추가 실패:", error);
          }
          setIsConfirmationModalOpen(false);
          setTitle('');
          setRecipients([]);
          setStartDate(new Date());
          setEndDate(new Date());
          setCompany('');
          setLocation('');
          setOtherLocation('');
          setMemo('');
          setSelectedTwoTime('');
          setIsOn(false);
        }}
        footer2="취소"
        footer2Class="gray-btn"
        onFooter2Click={() => setIsConfirmationModalOpen(false)}
        width="400px"
        height="250px"
      >
        <div className="text-center">
          참여인원이 선택하신 시간에 다른 일정이 <br />
          예약되어 있습니다. <br />
          그래도 등록을 진행하시겠습니까?
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isEditConfirmationModalOpen}
        onClose={() => setIsEditConfirmationModalOpen(false)}
        header="회의 일정 중복"
        footer1="확인"
        footer1Class="green-btn"
        onFooter1Click={async () => {
          try {
            const response = await EditMeeting({ ...tempEventDetails, force: true, }, selectedEvent?.id);
            console.log("회의 일정 수정 성공:", response.data);
            setEditEventModalOPen(false);
            refetchMeeting();
          } catch (error) {
            console.error("회의 일정 수정 실패:", error);
          }
          setIsEditConfirmationModalOpen(false);
          setTitle('');
          setRecipients([]);
          setStartDate(new Date());
          setEndDate(new Date());
          setCompany('');
          setLocation('');
          setOtherLocation('');
          setMemo('');
          setSelectedTwoTime('');
          setIsOn(false);
        }}
        footer2="취소"
        footer2Class="gray-btn"
        onFooter2Click={() => setIsConfirmationModalOpen(false)}
        width="400px"
        height="250px"
      >
        <div className="text-center">
          참여인원이 선택하신 시간에 다른 일정이 <br />
          예약되어 있습니다. <br />
          그래도 등록을 진행하시겠습니까?
        </div>
      </CustomModal>
    </div>
  );
};

export default MeetingRoom;
