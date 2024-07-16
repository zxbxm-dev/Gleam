import React, { useState, useEffect } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import CustomModal from "../../components/modal/CustomModal";
import { useRecoilState } from 'recoil';
import { isSelectMemberState } from '../../recoil/atoms';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useQueryClient, useQuery } from 'react-query';
import { CheckHrInfo, WriteHrInfo, EditHrInfo, CheckAppointment, writeAppointment, EditAppointment, DeleteAppointment } from "../../services/humanresource/HumanResourceServices";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

type PDFFile = string | File | null;

const HumanResource = () => {
  const queryClient = useQueryClient();
  const { isOpen: isAdd, onOpen: AddOpen, onClose: AddClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState(0);
  const [tabHeights, setTabHeights] = useState({ 0: '41px', 1: '35px', 2: '35px' });
  const [tabMargins, setTabMargins] = useState({ 0: '6px', 1: '6px', 2: '6px' });
  const [numPages, setNumPages] = useState<number>(0);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [file, setFile] = useState<PDFFile>('');
  const [isSelectMember] = useRecoilState(isSelectMemberState);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [clickIdx, setClickIdx] = useState<number>(0);

  const [form, setForm] = useState<{
    dept: string;
    position: string;
    spot: string;
    team: string;
    date: string;
    classify: string;
  }>({
    dept: '',
    position: '',
    spot: '',
    team: '',
    date: '',
    classify: '',
  })

  useEffect(() => {
    fetchHrInfo();
    if (activeTab === 0) {
      setTabHeights({ 0: '41px', 1: '35px', 2: '35px' });
      setTabMargins({ 0: '0px', 1: '6px', 2: '6px' });
    } else if (activeTab === 1) {
      setTabHeights({ 0: '35px', 1: '41px', 2: '35px' });
      setTabMargins({ 0: '6px', 1: '0px', 2: '6px' });
    } else {
      setTabHeights({ 0: '35px', 1: '35px', 2: '41px' });
      setTabMargins({ 0: '6px', 1: '6px', 2: '0px' });
    }
  }, [activeTab]);

  const handleDeptChange = (event: any) => {
    setForm({ ...form, dept: event.target.value })
  }
  const handleTeamChange = (event: any) => {
    setForm({ ...form, team: event.target.value })
  }

  const handlePositionChange = (event: any) => {
    setForm({ ...form, position: event.target.value })
  }

  const handleSpotChange = (event: any) => {
    setForm({ ...form, spot: event.target.value })
  }

  const handleDateChange = (event: any) => {
    setForm({ ...form, date: event.target.value })
  }

  const handleClassifyChange = (event: any) => {
    setForm({ ...form, classify: event.target.value })
  }

  // 인사정보관리 목록 조회
  const fetchHrInfo = async () => {
    let TabName;
    if (activeTab === 0) {
      TabName = "인사기록카드";
    } else if (activeTab === 1) {
      TabName = "근로자 명부";
    } else {
      return;
    }

    const params = {
      username: isSelectMember[1],
      TabData: TabName,
    }
    try {
      const response = await CheckHrInfo(params);
      
      if (response.status === 200) {
        const url = URL.createObjectURL(response.data);
        setFile(url);
      } else {
        console.error("Failed to fetch data");
        setFile('');
      }
    } catch (error) {
      console.error("Failed to fetch data");
      setFile('');
    }
  }

  const { refetch } = useQuery("HrInfo", fetchHrInfo, {
    enabled: false, // 자동 실행을 막고 필요할 때만 실행하도록 설정
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error)
    }
  });

  // 인사정보관리 수정
  const handleHrInfoEdit = async() => {
    if (!attachment) {
      alert('선택된 파일이 없습니다.');
      return;
    }

    let TabName;
    if (activeTab === 0) {
      TabName = "인사기록카드";
    } else if (activeTab === 1) {
      TabName = "근로자 명부";
    } else {
      alert('유효하지 않은 탭입니다.');
      return;
    }
    const formData = new FormData();
    formData.append('username', isSelectMember[1]);
    formData.append('attachment', attachment);
    formData.append('team', isSelectMember[3]);
    formData.append('dept', isSelectMember[2]);
    formData.append('TabData', TabName);

    try {
      const response = await EditHrInfo(formData);
      console.log('인사정보관리 수정 성공', response.data);
      setAttachment(null);
      setIsEditing(!isEditing);
      setIsEditing(false);
      refetch();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }


  // 인사이동 목록 조회
  const fetchAppointment = async () => {
    try {
      const response = await CheckAppointment();
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  }

  useQuery("Appointment", fetchAppointment, {
    onSuccess: (data) => { 
      const userAppoint = data.data
        .filter((item:any) => item.username === isSelectMember[1])
      setAppointments(userAppoint);
    },
    onError: (error) => {
      console.log(error);
    }
  });

  useEffect(() => {
    if (isSelectMember[0]) {
      refetch(); // 처음에만 데이터를 가져오도록 설정
    }
  }, [isSelectMember, refetch]);

  // 인사이동 등록
  const handleAppointSubmit = () => {
    const { dept, team, position, spot, date, classify } = form;

    const DateType = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;

    const formData = new FormData();
    formData.append('username', isSelectMember[1]);
    formData.append('Newdept', dept);
    formData.append('Newteam', team);
    formData.append('Newposition', position);
    formData.append('Newspot', spot);
    formData.append('date', DateType);
    formData.append('classify', classify);

    writeAppointment(formData)
      .then(response => {
        console.log("인사이동 등록 성공")
        queryClient.invalidateQueries("Appointment");
        setForm({
          dept: '',
          position: '',
          spot: '',
          team: '',
          date: '',
          classify: '',
        });
        AddClose();
      })
      .catch(error => {
        console.log("인사이동 등록 실패")
      })
  };


  // 인사이동 수정
  const handleAppointmentEdit = (index: number) => {
    const { dept, position, spot, date, classify } = form;

    const formData = new FormData();
    formData.append('dept', dept);
    formData.append('position', position);
    formData.append('spot', spot);
    formData.append('date', date);
    formData.append('classify', classify);

    EditAppointment(index, formData)
      .then(response => {
        console.log("인사이동 등록 성공")
        queryClient.invalidateQueries("Appointment");
      })
      .catch(error => {
        console.log("인사이동 등록 실패")
      })
  }

  // 인사이동 삭제
  const handleAppointmentDelete = (index: number) => {
    DeleteAppointment(index)
      .then((response) => {
        console.log("인사이동이 성공적으로 삭제되었습니다.", response);
        setDeleteModalOpen(false);
        queryClient.invalidateQueries("Appointment");
      })
      .catch((error) => {
        console.error("인사이동 삭제에 실패했습니다.", error);
      });
  }


  const downloadPDF = async () => {
    let TabName;
    if (activeTab === 0) {
      TabName = "인사기록카드";
    } else if (activeTab === 1) {
      TabName = "근로자 명부";
    } else {
      return;
    }

    const params = {
      username: isSelectMember[1],
      TabData: TabName,
    };

    try {
      const response = await CheckHrInfo(params);
      
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${TabName}_${isSelectMember[1]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <Page
          key={`page_${i}`}
          pageNumber={i}
          width={1200}
        />
      );
    }
    return pages;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files?.[0];
    if (droppedFiles) {
      setAttachment(droppedFiles);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // 인사기록카드, 근로자명부 제출
  const handleSubmitHrInfo = async () => {
    if (!attachment) {
      alert('선택된 파일이 없습니다.');
      return;
    }

    let TabName;
    if (activeTab === 0) {
      TabName = "인사기록카드";
    } else if (activeTab === 1) {
      TabName = "근로자 명부";
    } else {
      alert('유효하지 않은 탭입니다.');
      return;
    }

    const formData = new FormData();
    formData.append('attachment', attachment);
    formData.append('pdffile', attachment.name);
    formData.append('username', isSelectMember[1]);
    formData.append('team', isSelectMember[3]);
    formData.append('dept', isSelectMember[2]);
    formData.append('TabData', TabName);

    try {
      const response = await WriteHrInfo(formData);
      console.log('Data successfully sent:', response.data);
      setAttachment(null);
      setIsEditing(false);
      refetch();
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  }

  console.log('첨부된 파일', attachment)
  console.log('백엔드 파일', file)
  return (
    <div className="content">
      <div className="content_container">
        <div className="sub_header">{isSelectMember[1]}</div>
        <Tabs variant='enclosed' onChange={(index) => setActiveTab(index)}>
          <TabList>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[0]} marginTop={tabMargins[0]}>인사기록카드</Tab>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[1]} marginTop={tabMargins[1]}>근로자명부</Tab>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[2]} marginTop={tabMargins[2]}>인사이동</Tab>
          </TabList>

          <TabPanels className="hr_tab_container">
            <TabPanel className="hr_tab_container_select">
              {isSelectMember[0] === '' ? (
                <></>
              ) : (
                <>
                  <div className="hr_button_wrap">
                    {!file && !attachment ? (
                      // 백엔드에 파일이 없고, 첨부된 파일이 없을 때
                      <>
                        <button className="white_button">
                          <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                            업로드
                            <input
                              id="fileInput"
                              type="file"
                              name="handleFileSubmit"
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                            />
                          </label>
                        </button>
                      </>
                    ) : (
                      isEditing ? (
                        // 수정 모드일 때
                        <>
                          <button className="primary_button" onClick={isEditing ? handleHrInfoEdit : handleSubmitHrInfo}>
                            {isEditing && attachment ? '수정하기' : '등록하기'}
                          </button>
                          <button className="red_button" onClick={handleToggleEdit}>취소</button>
                        </>
                      ) : (
                        // 일반 모드일 때
                        <>
                          <button className="white_button" onClick={downloadPDF}>다운로드</button>
                          <button className="primary_button" onClick={handleToggleEdit}>수정</button>
                        </>
                      )
                    )}
                  </div>

                  <div className="hr_pdf_container">
                    {!attachment && !file ? (
                      // 파일이 없을 때 파일 첨부하기 영역 표시
                      <div
                        className="upload-area"
                        onDrop={handleFileDrop}
                        onDragOver={handleDragOver}
                      >
                        <div className='upload-text-top'>
                          <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', gap: '5px' }}>
                            <input
                              id="file-upload"
                              type="file"
                              accept=".pdf"
                              onChange={handleFileChange}
                              style={{ display: 'none' }}
                            />
                            파일 첨부하기 +
                          </label>
                        </div>
                        <div className='upload-text-btm'>클릭 후 파일 선택이나 드래그로 파일 첨부 가능합니다.</div>
                      </div>
                    ) : (
                      // 파일이 있을 때 PDF 뷰어 표시
                      <Document file={attachment || file} onLoadSuccess={onDocumentLoadSuccess}>
                        {renderPages()}
                      </Document>
                    )}
                  </div>
                </>
              )}
            </TabPanel>



            <TabPanel className="hr_tab_container_select">
              {isSelectMember[0] === '' ? (
                <></>
              ) : (
                <>
                  <div className="hr_button_wrap">
                    {!file && !attachment ? (
                      // 백엔드에 파일이 없고, 첨부된 파일이 없을 때
                      <>
                        <button className="white_button">
                          <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                            업로드
                            <input
                              id="fileInput"
                              type="file"
                              name="handleFileSubmit"
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                            />
                          </label>
                        </button>
                      </>
                    ) : (
                      // 파일이 있거나, 첨부된 파일이 있을 때
                      isEditing || !file ? (
                        // 수정 모드일 때
                        <>
                          <button className="primary_button" onClick={attachment && !file ? handleSubmitHrInfo : handleHrInfoEdit}>
                            {attachment && !file ? '등록하기' : '수정하기'}
                          </button>
                          <button className="red_button" onClick={handleToggleEdit}>취소</button>
                        </>
                      ) : (
                        // 일반 모드일 때
                        <>
                          <button className="white_button" onClick={downloadPDF}>다운로드</button>
                          <button className="primary_button" onClick={handleToggleEdit}>수정</button>
                        </>
                      )
                    )}
                  </div>

                  <div className="hr_pdf_container">
                    {!attachment && !file ? (
                      // 파일이 없을 때 파일 첨부하기 영역 표시
                      <div
                        className="upload-area"
                        onDrop={handleFileDrop}
                        onDragOver={handleDragOver}
                      >
                        <div className='upload-text-top'>
                          <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', gap: '5px' }}>
                            <input
                              id="file-upload"
                              type="file"
                              accept=".pdf"
                              onChange={handleFileChange}
                              style={{ display: 'none' }}
                            />
                            파일 첨부하기 +
                          </label>
                        </div>
                        <div className='upload-text-btm'>클릭 후 파일 선택이나 드래그로 파일 첨부 가능합니다.</div>
                      </div>
                    ) : (
                      // 파일이 있을 때 PDF 뷰어 표시
                      <Document file={attachment || file} onLoadSuccess={onDocumentLoadSuccess}>
                        {renderPages()}
                      </Document>
                    )}
                  </div>
                </>
              )}
            </TabPanel>


            <TabPanel className="hr_tab_container_select">
              <div className="appoint_button_wrap">
                <Popover placement="left-start" isOpen={isAdd} onClose={AddClose}>
                  <PopoverTrigger>
                    <button className="primary_button" onClick={AddOpen}>등록</button>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent className="hr_popover_content">
                      <PopoverHeader className="hr_popover_header">인사이동 등록하기</PopoverHeader>
                      <PopoverCloseButton className="hr_popover_header_close" />
                      <PopoverBody className="hr_popover_body">
                        <div className="hr_popover_body_wrap">
                          <div className="hr_popover_body_content">
                            <div>부서</div>
                            <input placeholder='ex) 개발부' onChange={handleDeptChange} />
                          </div>
                          <div className="hr_popover_body_content">
                            <div>팀</div>
                            <input placeholder='ex) 개발 1팀' onChange={handleTeamChange} />
                          </div>
                          <div className="hr_popover_body_content">
                            <div>직위</div>
                            <input placeholder='내용을 입력해주세요.' onChange={handlePositionChange} />
                          </div>
                          <div className="hr_popover_body_content">
                            <div>직책</div>
                            <input placeholder='내용을 입력해주세요.' onChange={handleSpotChange} />
                          </div>
                          <div className="hr_popover_body_content">
                            <div>날짜</div>
                            <input placeholder='20240627' onChange={handleDateChange} />
                          </div>
                          <div className="hr_popover_body_content">
                            <div>구분</div>
                            <input placeholder='승진 / 부서이동 / 강등' onChange={handleClassifyChange} />
                          </div>
                        </div>
                        <div className='button-wrap'>
                          <button className="second_button" onClick={handleAppointSubmit}>등록</button>
                          <button className="white_button" onClick={AddClose}>취소</button>
                        </div>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </div>

              <div>
                <table className="hr_board_list">
                  <colgroup>
                    <col width="20%" />
                    <col width="10%" />
                    <col width="10%" />
                    <col width="20%" />
                    <col width="20%" />
                    <col width="20%" />
                  </colgroup>
                  <thead>
                    <tr className="board_header">
                      <th>부서</th>
                      <th>직책</th>
                      <th>직위</th>
                      <th>날짜</th>
                      <th>구분</th>
                      <th>수정/삭제</th>
                    </tr>
                  </thead>
                  <tbody className="board_container">
                    {appointments
                      .map((appointment, index) => (
                        <tr key={appointment.id} className="board_content">
                          <td>{appointment.Newdept}</td>
                          <td>{appointment.Newposition}</td>
                          <td>{appointment.Newspot}</td>
                          <td>{appointment.date}</td>
                          <td>{appointment.classify}</td>
                          <td className="flex_center">
                            <Popover placement="left-start">
                              <PopoverTrigger>
                                <button className="white_button" 
                                  onClick={() => {
                                    setForm({ dept: appointment.Newdept, position: appointment.Newposition, spot: appointment.Newspot, team: appointment.team, date: appointment.date, classify: appointment.classify,});}}>
                                      수정
                                </button>
                              </PopoverTrigger>
                              <Portal>
                                <PopoverContent className="hr_popover_content">
                                  <PopoverHeader className="hr_popover_header">인사이동 수정하기</PopoverHeader>
                                  <PopoverCloseButton className="hr_popover_header_close" />
                                  <PopoverBody className="hr_popover_body">
                                    <div className="hr_popover_body_wrap">
                                      <div className="hr_popover_body_content">
                                        <div>부서</div>
                                        <input value={form.dept} onChange={handleDeptChange} />
                                      </div>
                                      <div className="hr_popover_body_content">
                                        <div>팀</div>
                                        <input value={form.team} onChange={handleTeamChange} />
                                      </div>
                                      <div className="hr_popover_body_content">
                                        <div>직위</div>
                                        <input value={form.position} onChange={handlePositionChange} />
                                      </div>
                                      <div className="hr_popover_body_content">
                                        <div>직책</div>
                                        <input value={form.spot} onChange={handleSpotChange} />
                                      </div>
                                      <div className="hr_popover_body_content">
                                        <div>날짜</div>
                                        <input value={form.date} onChange={handleDateChange} />
                                      </div>
                                      <div className="hr_popover_body_content">
                                        <div>구분</div>
                                        <input value={form.classify} onChange={handleClassifyChange} />
                                      </div>
                                    </div>
                                    <div className='button-wrap'>
                                      <button className="white_button" onClick={() => { handleAppointmentEdit(appointment.id) }}>수정</button>
                                    </div>
                                  </PopoverBody>
                                </PopoverContent>
                              </Portal>
                            </Popover>
                            <button className="red_button" onClick={() => { setDeleteModalOpen(true); setClickIdx(appointment.id) }}>삭제</button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>

            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        header={'알림'}
        footer1={'삭제'}
        footer1Class="red-btn"
        onFooter1Click={() => {handleAppointmentDelete(clickIdx)}}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => setDeleteModalOpen(false)}
      >
        <div>
          삭제하시겠습니까?
        </div>
      </CustomModal>
    </div>
  );
};

export default HumanResource;