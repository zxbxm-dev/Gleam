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


type PDFFile = string | File | null;

const HumanResource = () => {
  const { isOpen: isAdd, onOpen: AddOpen, onClose: AddClose } = useDisclosure();
  const { isOpen: isEdit, onOpen: EditOpen, onClose: EditClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState(0);
  const [tabHeights, setTabHeights] = useState({0: '41px', 1: '35px', 2: '35px'});
  const [tabMargins, setTabMargins] = useState({0: '6px', 1: '6px', 2: '6px'});
  const [numPages, setNumPages] = useState<number>(0);
  const [file, setFile] = useState<PDFFile>(testPDF_구민석);
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isSelectMember] = useRecoilState(isSelectMemberState);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<{
    dept: string;
    position: string;
    date: string;
    classify: string;
  }>({
    dept: '',
    position: '',
    date: '',
    classify: '',
  })

  useEffect(() => {
    if (activeTab === 0) {
      setTabHeights({0: '41px', 1: '35px', 2: '35px'});
      setTabMargins({0: '0px', 1: '6px', 2: '6px'});
    } else if (activeTab === 1){
      setTabHeights({0: '35px', 1: '41px', 2: '35px'});
      setTabMargins({0: '6px', 1: '0px', 2: '6px'});
    } else {
      setTabHeights({0: '35px', 1: '35px', 2: '41px'});
      setTabMargins({0: '6px', 1: '6px', 2: '0px'});
    }
  }, [activeTab]);

  const handleDeptChange = (event: any) => {
    setForm({...form, dept: event.target.value})
  }

  const handlePositionChange = (event: any) => {
    setForm({...form, position: event.target.value})
  }

  const handleDateChange = (event: any) => {
    setForm({...form, date: event.target.value})
  }

  const handleClassifyChange = (event: any) => {
    setForm({...form, classify: event.target.value})
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
    onSuccess: (data) => console.log(data),
    onError: (error) => {
      console.log(error)
    }
  });

  // 인사이동 등록
  const handleAppointSubmit = () => {
    const {dept, position, date, classify} = form;

    const formData = new FormData();
    formData.append('dept', dept);
    formData.append('position', position);
    formData.append('date', date);
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
  const handleAppointmentEdit = () => {
    const {dept, position, date, classify} = form;

    const formData = new FormData();
    formData.append('dept', dept);
    formData.append('position', position);
    formData.append('date', date);
    formData.append('classify', classify);

    EditAppointment(formData)
    .then(response => {
      console.log("인사이동 등록 성공")
    })
    .catch(error => {
      console.log("인사이동 등록 실패")
    })
  }

  // 인사이동 삭제
  const handleAppointmentDelete = () => {
    DeleteAppointment()
    .then((response) => {
      console.log("인사이동이 성공적으로 삭제되었습니다.", response);
    })
    .catch((error) => {
      console.error("인사이동 삭제에 실패했습니다.", error);
    });
  }


  const downloadPDF = () => {
    const link = document.createElement('a');
    setFile(testPDF_구민석)
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
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files);
      setFiles([...files, ...selectedFiles]);
      console.log(files)
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
    // 인사정보관리 제출
    WriteHrInfo()
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


  return (
    <div className="content">
      <div className="content_header">
        {isSelectMember[0] === '' ? (
          <>
            <Link to={"/human-resources"} className="sub_header">인사 정보 관리</Link>
          </>
        ) : (
          <>
            <Link to={"/human-resources"} className="main_header">인사 정보 관리</Link>
            <div className="main_header">＞</div>
            <div className="sub_header">{isSelectMember[0]}</div>
          </>
        )}
      </div>
      
      <div className="content_container">
        <Tabs variant='enclosed' onChange={(index) => setActiveTab(index)}>
          <TabList>
            <Tab _selected={{bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)'}} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[0]} marginTop={tabMargins[0]}>인사기록카드</Tab>
            <Tab _selected={{bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)'}} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[1]} marginTop={tabMargins[1]}>근로자명부</Tab>
            <Tab _selected={{bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)'}} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[2]} marginTop={tabMargins[2]}>인사이동</Tab>
          </TabList>

          <TabPanels bg='white' border='1px solid #DEDEDE' borderBottomRadius='10px' borderRightRadius='10px' className="hr_tab_container">
            <TabPanel display='flex' flexDirection='column'>
              {isSelectMember[0] === '' ? (
                <></>
              ) : (
                <>
                  <div style={{display: 'flex', flexDirection: 'row-reverse', width: '100%', height: '5vh' ,borderBottom: '1px solid #DCDCDC', gap: '10px'}}>
                    {isEditing ? (
                      <>
                        <button className="second_button" onClick={handleToggleEdit}>등록</button>
                        <button className="red_button" onClick={handleToggleEdit}>취소</button>
                      </>
                    ) : (
                      <>
                        <button className="white_button" onClick={handleToggleEdit}>업로드</button>
                        <button className="white_button" onClick={downloadPDF}>다운로드</button>
                      </>
                    )}
                  </div>
                  <div className="hr_pdf_container">
                    {isEditing ? (
                      <div
                        className="upload-area"
                        onDrop={handleFileDrop}
                        onDragOver={handleDragOver}
                      >
                        <div className='upload-text-top'>
                          <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', gap: '5px'}}>
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
                      <Document file={testPDF_구민석} onLoadSuccess={onDocumentLoadSuccess}>
                        {renderPages()}
                      </Document>
                    )}
                  </div>
                </>
              )}

            </TabPanel>

            <TabPanel display='flex' flexDirection='column'>
            {isSelectMember[0] === '' ? (
                <></>
              ) : (
                <>
                  <div style={{display: 'flex', flexDirection: 'row-reverse', width: '100%', height: '5vh' ,borderBottom: '1px solid #DCDCDC', gap: '10px'}}>
                    {isEditing ? (
                      <>
                        <button className="adds_button" onClick={handleToggleEdit}>등록</button>
                        <button className="edits_button" onClick={handleToggleEdit}>취소</button>
                      </>
                    ) : (
                      <>
                        <button className="edits_button" onClick={handleToggleEdit}>업로드</button>
                        <button className="downloads_button">다운로드</button>
                      </>
                    )}
                  </div>
                  <div className="hr_pdf_container">
                    {isEditing ? (
                      <div
                        className="upload-area"
                        onDrop={handleFileDrop}
                        onDragOver={handleDragOver}
                      >
                        <div className='upload-text-top'>
                          <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', gap: '5px'}}>
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
                      <Document file={test2PDF_구민석} onLoadSuccess={onDocumentLoadSuccess}>
                        {renderPages()}
                      </Document>
                    )}
                  </div>
                </>
              )}
              
            </TabPanel>

            <TabPanel display='flex' flexDirection='column'>
              <div style={{display: 'flex', flexDirection: 'row-reverse', width: '100%', height: '5vh'}}>
                <Popover placement="left-start" isOpen={isAdd} onClose={AddClose}>
                  <PopoverTrigger>
                    <button className="adds_button" onClick={AddOpen}>등록</button>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent width='25vw' height='35vh' border='0' borderRadius='5px' boxShadow='0px 0px 5px #444'>
                      <PopoverHeader color='white' bg='#746E58' border='0' fontFamily= 'var(--font-family-Noto-B)' borderTopRadius='5px'>인사이동 등록하기</PopoverHeader>
                      <PopoverCloseButton color='white'/>
                      <PopoverBody display='flex' flexDirection='column' padding='0px' justifyContent='center' alignItems='center'>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', height: '24vh', justifyContent: 'center' , alignItems: 'center'}}>
                          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                            <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>부서</div>
                            <Input placeholder='ex) 개발부 개발 1팀' size='sm' width='20vw' onChange={handleDeptChange}/>
                          </div>
                          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                            <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>직위</div>
                            <Input placeholder='내용을 입력해주세요.' size='sm' width='20vw' onChange={handlePositionChange}/>
                          </div>
                          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                            <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>날짜</div>
                            <Input placeholder='small size' size='sm' width='20vw' onChange={handleDateChange}/>
                          </div>
                          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                            <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>구분</div>
                            <Input placeholder='승진 / 부서이동 / 강등' size='sm' width='20vw' onChange={handleClassifyChange}/>
                          </div>
                        </div>
                        <div className='button-wrap'>
                          <button className="adds_button" onClick={handleAppointSubmit}>등록</button>
                          <button className="edits_button" onClick={AddClose}>취소</button>
                        </div>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </div>
              
              <div>
                <table className="hr_board_list">
                  <colgroup>
                    <col width="20%"/>
                    <col width="20%"/>
                    <col width="20%"/>
                    <col width="20%"/>
                    <col width="20%"/>
                  </colgroup>
                  <thead>
                    <tr className="board_header">
                      <th>부서</th>
                      <th>직위</th>
                      <th>날짜</th>
                      <th>구분</th>
                      <th>수정/삭제</th>
                    </tr>
                  </thead>
                  <tbody className="board_container">
                    <tr className="board_content">
                      <td>마케팅부 디자인팀</td>
                      <td>팀장</td>
                      <td>2024-05-04</td>
                      <td>승진</td>
                      <td>
                        <Popover placement="left-start" isOpen={isEdit} onClose={EditClose}>
                          <PopoverTrigger>
                            <button className="edits_button" onClick={EditOpen}>수정</button>
                          </PopoverTrigger>
                          <Portal>
                            <PopoverContent width='25vw' height='35vh' border='0' borderRadius='5px' boxShadow='0px 0px 5px #444'>
                              <PopoverHeader color='white' bg='#746E58' border='0' fontFamily= 'var(--font-family-Noto-B)' borderTopRadius='5px'>인사이동 수정하기</PopoverHeader>
                              <PopoverCloseButton color='white'/>
                              <PopoverBody display='flex' flexDirection='column' padding='0px' justifyContent='center' alignItems='center'>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '10px', height: '24vh', justifyContent: 'center' , alignItems: 'center'}}>
                                  <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                    <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>부서</div>
                                    <Input placeholder='ex) 개발부 개발 1팀' size='sm' width='20vw' />
                                  </div>
                                  <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                    <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>직위</div>
                                    <Input placeholder='내용을 입력해주세요.' size='sm' width='20vw'/>
                                  </div>
                                  <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                    <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>날짜</div>
                                    <Input placeholder='small size' size='sm' width='20vw'/>
                                  </div>
                                  <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                    <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>구분</div>
                                    <Input placeholder='승진 / 부서이동 / 강등' size='sm' width='20vw'/>
                                  </div>
                                </div>
                                <div className='button-wrap'>
                                  <button className="edits_button" onClick={handleAppointmentEdit}>수정</button>
                                  <button className="edits_button" onClick={EditClose}>취소</button>
                                </div>
                              </PopoverBody>
                            </PopoverContent>
                          </Portal>
                        </Popover>
                        <button className="dels_button" onClick={() => {setDeleteModalOpen(true); handleAppointmentDelete()}}>삭제</button>
                      </td>
                    </tr>

                    <tr className="board_content">
                      <td>관리부 지원팀</td>
                      <td>사원</td>
                      <td>2024-05-04</td>
                      <td>부서이동</td>
                      <td>
                        <button className="edits_button">수정</button>
                        <button className="dels_button">삭제</button>
                      </td>
                    </tr>

                    <tr className="board_content">
                      <td>개발부 개발 1팀</td>
                      <td>사원</td>
                      <td>2024-05-04</td>
                      <td>강등</td>
                      <td>
                        <button className="edits_button">수정</button>
                        <button className="dels_button">삭제</button>
                      </td>
                    </tr>

                    <tr className="board_content">
                      <td>개발부 개발 1팀</td>
                      <td>팀장</td>
                      <td>2024-05-04</td>
                      <td>부서이동</td>
                      <td>
                        <button className="edits_button">수정</button>
                        <button className="dels_button">삭제</button>
                      </td>
                    </tr>
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