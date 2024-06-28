import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from '@chakra-ui/react';
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
import testPDF_구민석 from '../../assets/pdf/[서식-P502] 인사기록카드_구민석.pdf';
import test2PDF_구민석 from '../../assets/pdf/[서식-P501] 근로자명부_구민석.pdf';

import { useQuery } from "react-query";
import { CheckHrInfo, WriteHrInfo, CheckAppointment, writeAppointment, EditAppointment, DeleteAppointment } from "../../services/humanresource/HumanResourceServices";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();


const HumanResource = () => {
  const { isOpen: isAdd, onOpen: AddOpen, onClose: AddClose } = useDisclosure();
  const { isOpen: isEdit, onOpen: EditOpen, onClose: EditClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState(0);
  const [tabHeights, setTabHeights] = useState({ 0: '41px', 1: '35px', 2: '35px' });
  const [tabMargins, setTabMargins] = useState({ 0: '6px', 1: '6px', 2: '6px' });
  const [numPages, setNumPages] = useState<number>(0);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSelectMember] = useRecoilState(isSelectMemberState);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);

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
    try {
      const response = await CheckHrInfo();
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  }

  useQuery("HrInfo", fetchHrInfo, {
    onSuccess: (data) => console.log(data),
    onError: (error) => {
      console.log(error)
    }
  });


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
    onSuccess: (data) => setAppointments(data),
    onError: (error) => {
      console.log(error)
    }
  });

  // 인사이동 등록
  const handleAppointSubmit = () => {
    const { dept, team, position, spot, date, classify } = form;

    const DateType = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;

    const formData = new FormData();
    formData.append('username', isSelectMember[0]);
    formData.append('team', isSelectMember[2]);
    formData.append('dept', isSelectMember[1]);
    formData.append('position', isSelectMember[3]);
    formData.append('Newdept', dept);
    formData.append('Newteam', team);
    formData.append('Newposition', position);
    formData.append('Newspot', spot);
    formData.append('date', DateType);
    formData.append('classify', classify);

    writeAppointment(formData)
      .then(response => {
        console.log("인사이동 등록 성공")
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
      })
      .catch((error) => {
        console.error("인사이동 삭제에 실패했습니다.", error);
      });
  }


  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = testPDF_구민석;
    link.download = '인사기록카드_구민석.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const handleHumanInfoDelete = () => {
    setDeleteModalOpen(false);
  }

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
    formData.append('username', isSelectMember[0]);
    formData.append('team', isSelectMember[2]);
    formData.append('dept', isSelectMember[1]);
    formData.append('TabData', TabName);

    try {
      const response = await WriteHrInfo(formData);
      console.log('Data successfully sent:', response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  }

  return (
    <div className="content">
      <div className="content_container">
        <div className="sub_header">{isSelectMember[0]}</div>
        <Tabs variant='enclosed' onChange={(index) => setActiveTab(index)}>
          <TabList>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[0]} marginTop={tabMargins[0]}>인사기록카드</Tab>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[1]} marginTop={tabMargins[1]}>근로자명부</Tab>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[2]} marginTop={tabMargins[2]}>인사이동</Tab>
          </TabList>

          <TabPanels className="hr_tab_container">
            <TabPanel className="hr_tab_container_select">
              {/* {isSelectMember[0] !== '' ? (
                <></>
              ) : ( */}
              <>
                <div className="hr_button_wrap">
                  {attachment ? (
                    <>
                      <button className="primary_button" onClick={handleSubmitHrInfo}>등록</button>
                      <button className="red_button" onClick={handleToggleEdit}>취소</button>
                    </>
                  ) : (
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
                      <button className="white_button" onClick={downloadPDF}>다운로드</button>
                    </>
                  )}
                </div>
                <div className="hr_pdf_container">
                  {!attachment ? (
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
                    <Document file={attachment} onLoadSuccess={onDocumentLoadSuccess}>
                      {renderPages()}
                    </Document>
                  )}
                </div>
              </>
              {/* )} */}

            </TabPanel>

            <TabPanel className="hr_tab_container_select">
              {/* {isSelectMember[0] !== '' ? (
                <></>
              ) : ( */}
              <>
                <div className="hr_button_wrap">
                  {attachment ? (
                    <>
                      <button className="primary_button" onClick={handleSubmitHrInfo}>등록</button>
                      <button className="red_button" onClick={handleToggleEdit}>취소</button>
                    </>
                  ) : (
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
                      <button className="white_button" onClick={downloadPDF}>다운로드</button>
                    </>
                  )}
                </div>
                <div className="hr_pdf_container">
                  {!attachment ? (
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
                    <Document file={attachment} onLoadSuccess={onDocumentLoadSuccess}>
                      {renderPages()}
                    </Document>
                  )}
                </div>
              </>
              {/* )} */}

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
                      <PopoverCloseButton className="hr_popover_header_close"/>
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
                            <td>{appointment.department}</td>
                            <td>{appointment.spot}</td>
                            <td>{appointment.position}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.classify}</td>
                            <td className="flex_center">
                              <Popover placement="left-start" isOpen={isEdit} onClose={EditClose}>
                                <PopoverTrigger>
                                  <button className="white_button" onClick={EditOpen}>수정</button>
                                </PopoverTrigger>
                                <Portal>
                                  <PopoverContent className="hr_popover_content">
                                    <PopoverHeader className="hr_popover_header">인사이동 수정하기</PopoverHeader>
                                    <PopoverCloseButton className="hr_popover_header_close"/>
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
                                        <button className="white_button" onClick={() => {handleAppointmentEdit(index)}}>수정</button>
                                        <button className="white_button" onClick={EditClose}>취소</button>
                                      </div>
                                    </PopoverBody>
                                  </PopoverContent>
                                </Portal>
                              </Popover>
                              <button className="red_button" onClick={() => { setDeleteModalOpen(true); handleAppointmentDelete(index) }}>삭제</button>
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
        onFooter1Click={handleHumanInfoDelete}
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