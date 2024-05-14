import React, { useState } from 'react';
import "./Report.scss";
import {
  FileUploadIcon,
  UserIcon_dark,
  CloseIcon,
} from "../../assets/images/index";
import { useNavigate, Link } from "react-router-dom";
import { Select } from '@chakra-ui/react';
import HrSidebar from "../../components/sidebar/HrSidebar";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Portal,
} from '@chakra-ui/react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

type Member = [string, string, string, string];


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

type PDFFile = string | File | null;

const WriteReport = () => {
  let navigate = useNavigate();
  const [file, setFile] = useState<PDFFile>('');
  const [numPages, setNumPages] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedApproval, setSelectedApproval] = useState('');
  // HrSidebar에서 멤버를 클릭할 때 호출되는 함수

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  // 전체 페이지 렌더링 함수
  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <Page
          key={`page_${i}`}
          pageNumber={i}
          width={1000}
        />
      );
    }
    return pages;
  };

  // 파일 선택 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const [approvalLines, setApprovalLines] = useState([
    { name: '최종결재', checked: false, selectedMember: null as Member | null },
    { name: '결재라인 1', checked: false, selectedMember: null as Member | null },
    { name: '결재라인 2', checked: false, selectedMember: null as Member | null },
    { name: '결재라인 3', checked: false, selectedMember: null as Member | null },
    { name: '결재라인 4', checked: false, selectedMember: null as Member | null },
    { name: '결재라인 5', checked: false, selectedMember: null as Member | null },
    { name: '참조', checked: false, selectedMembers: [] as Member[] },
  ]);

  const handleCheckboxChange = (index: number) => {
    const updatedApprovalLines = [...approvalLines];
    updatedApprovalLines[index].checked = !updatedApprovalLines[index].checked;

    if (!updatedApprovalLines[index].checked) {
      // 체크박스가 해제되면 selectedMember 초기화
      updatedApprovalLines[index].selectedMember = null;
    }

    setSelectedApproval(updatedApprovalLines[index].name);
    setApprovalLines(updatedApprovalLines);
  };


  const handleMemberClick = (name: string, dept: string, team: string, position: string, lineName: string) => {
    // 선택된 멤버 정보를 새로운 Member 배열로 생성
    const newMember: Member = [name, dept, team, position];

    // approvalLines 배열을 복사하여 새로운 배열 생성
    const updatedApprovalLines = [...approvalLines];

    // lineName에 해당하는 결재 라인의 인덱스 찾기
    const index = updatedApprovalLines.findIndex(line => line.name === lineName);

    if (index !== -1) {
      if (lineName === '참조') {
        // 참조 라인인 경우, 중복 체크 후 중복되지 않은 경우에만 추가
        const existingMembers = updatedApprovalLines[index].selectedMembers;
        if (existingMembers) {
          const isDuplicate = existingMembers.some(member => member[0] === name && member[1] === dept && member[2] === team && member[3] === position);
          if (!isDuplicate) {
            (updatedApprovalLines[index] as { name: string; checked: boolean; selectedMembers: Member[] }).selectedMembers.push(newMember);
          }
        } else {
          // selectedMembers가 비어있을 경우, 새로운 배열로 초기화하여 추가
          updatedApprovalLines[index].selectedMembers = [newMember];
        }
      } else {
        // 그 외의 경우에는 기존 로직과 동일하게 처리
        updatedApprovalLines[index].selectedMember = newMember;
      }

      // 새로운 배열을 상태로 설정
      setApprovalLines(updatedApprovalLines);
    } else {
      console.error(`결재 라인 "${lineName}"을 찾을 수 없습니다.`);
    }
  };

  // 멤버 삭제 함수
  const handleRemoveMember = (indexToRemove: number) => {
    const updatedApprovalLines = [...approvalLines];
    if (updatedApprovalLines[6].selectedMembers !== undefined) {
      updatedApprovalLines[6].selectedMembers.splice(indexToRemove, 1);
      setApprovalLines(updatedApprovalLines);
    }
};


  const members: Member[] = [
    ['이정훈', '포체인스 주식회사', '', '대표'],
    ['안후상', '포체인스 주식회사', '', '이사'],
    ['이정열', '관리부', '', '부서장'],
    ['김효은', '관리부', '관리팀', '팀장'],
    ['우현지', '관리부', '관리팀', '사원'],
    ['염승희', '관리부', '관리팀', '사원'],
    ['김태희', '관리부', '지원팀', '팀장'],
    ['이주범', '관리부', '지원팀', '사원'],
    ['진유빈', '개발부', '', '부서장'],
    ['장현지', '개발부', '개발 1팀', '사원'],
    ['권채림', '개발부', '개발 1팀', '사원'],
    ['구민석', '개발부', '개발 1팀', '사원'],
    ['변도일', '개발부', '개발 2팀', '팀장'],
    ['이로운', '개발부', '개발 2팀', '사원'],
    ['권상원', '블록체인 사업부', '', '부서장'],
    ['권준우', '블록체인 사업부', '블록체인 1팀', '사원'],
    ['김도환', '블록체인 사업부', '블록체인 1팀', '사원'],
    ['김현지', '마케팅부', '', '부서장'],
    ['전아름', '마케팅부', '기획팀', '팀장'],
    ['함다슬', '마케팅부', '기획팀', '사원'],
    ['전규미', '마케팅부', '기획팀', '사원'],
    ['서주희', '마케팅부', '디자인팀', '사원'],
  ];


  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/report"} className="sub_header">보고서</Link>
      </div>

      <div className="content_container">
        <div className="container">
          <div className="write_container">
            <div className="write_top_container">
              <div className="top_left_content">
                <div className="sub_title">양식 선택</div>
                <Select size='sm' width='380px' borderRadius='5px' fontFamily='var(--font-family-Noto-M)'>
                  <option value='' disabled style={{ fontFamily: 'var(--font-family-Noto-B)' }}>공통보고서</option>
                  <option value=''>&nbsp;&nbsp; 주간업무일지</option>
                  <option value=''>&nbsp;&nbsp; 지출품의서</option>
                  <option value=''>&nbsp;&nbsp; 휴가신청서</option>

                  <option value='' disabled style={{ fontFamily: 'var(--font-family-Noto-B)' }}>기타</option>
                  <option value=''>&nbsp;&nbsp; 시말서</option>
                  <option value=''>&nbsp;&nbsp; 사직서</option>
                  <option value=''>&nbsp;&nbsp; 휴직원</option>
                  <option value=''>&nbsp;&nbsp; 복직원</option>

                  <option value='' disabled style={{ fontFamily: 'var(--font-family-Noto-B)' }}>워크숍</option>
                  <option value=''>&nbsp;&nbsp; 워크숍 신청서</option>
                  <option value=''>&nbsp;&nbsp; 워크숍 보고서 (프로젝트 회의)</option>
                  <option value=''>&nbsp;&nbsp; 워크숍 보고서 (야유회)</option>
                  <option value=''>&nbsp;&nbsp; 지출내역서</option>
                  <option value=''>&nbsp;&nbsp; 예산신청서 (지원팀)</option>

                  <option value='' disabled style={{ fontFamily: 'var(--font-family-Noto-B)' }}>기획서</option>
                  <option value=''>&nbsp;&nbsp; 기획서</option>
                  <option value=''>&nbsp;&nbsp; 최종보고서</option>
                  <option value=''>&nbsp;&nbsp; 프로젝트 기획서</option>

                </Select>
              </div>

              <div className="top_right_content">
                <Popover placement="left-start">
                  <PopoverTrigger>
                    <button className="approval_button">결재라인 선택</button>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent width='440px' height='700px' border='0' borderRadius='5px' boxShadow='0px 0px 5px #444'>
                      <PopoverHeader color='white' bg='#746E58' border='0' fontFamily='var(--font-family-Noto-B)' borderTopRadius='5px'>결재라인 선택</PopoverHeader>
                      <PopoverCloseButton color='white' />
                      <PopoverBody display='flex' flexDirection='row' padding='0px'>
                        <div style={{ width: '200px', height: '650px', overflowY: 'scroll', scrollbarWidth: 'thin' }}>
                          <HrSidebar members={members} onClickMember={(name, dept, team, position) => handleMemberClick(name, dept, team, position, selectedApproval)} />
                        </div>
                        <div style={{ width: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0' }}>
                          {approvalLines.map((line, index) => (
                            <div key={index} className="approval_content">
                              <div className='approval_line'>
                                <input
                                  type="checkbox"
                                  checked={line.checked}
                                  onChange={() => handleCheckboxChange(index)}
                                  className='approval_checkbox'
                                  id={`check${index}`}
                                  style={{ cursor: 'pointer' }}
                                />
                                <label htmlFor={`check${index}`} style={{ cursor: 'pointer' }}>{line.name}</label>
                              </div>
                              {line.checked ? (
                                line.selectedMember ? (
                                  <div className='approval_name'>
                                    <img src={UserIcon_dark} alt="UserIcon_dark" className="name_img" />
                                    <div className='name_text'>{line.selectedMember[0]}</div>
                                    <div className='name_border'></div>
                                    <div className='name_text'>{line.selectedMember[3]}</div>
                                  </div>
                                ) : (
                                  line.name === '참조' && line.selectedMembers ? (
                                    <div className='approvals_contents'>
                                      {line.selectedMembers.map((member, index) => (
                                        <div key={index} className='approval_small_name'>
                                          {/* <img src={UserIcon_dark} alt="UserIcon_dark" className="name_img" /> */}
                                          <div className='name_text'>{member[0]}</div>
                                          <div className='name_border'></div>
                                          <div className='name_text'>{member[3]}</div>
                                          <img src={CloseIcon} alt="CloseIcon" className='close_btn' onClick={() => handleRemoveMember(index)}/>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className='approval_checked'>
                                      <div>&nbsp;</div>
                                    </div>
                                  )
                                )
                              ) : (
                                <div className='approval_checked'>
                                  칸 선택 후 좌측 리스트에서<br />
                                  결재라인을 선택해주세요
                                </div>
                              )}
                            </div>
                          ))}

                          <div className='button-wrap'>
                            <button className="second_button">제출</button>
                            <button className="white_button">취소</button>
                          </div>
                        </div>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
                <button className="save_button" onClick={onOpen}>임시저장</button>
                <button className="upload_button">
                  <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', gap: '5px' }}>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <img src={FileUploadIcon} alt="FileUploadIcon" />
                    파일 업로드
                  </label>
                </button>
              </div>
            </div>

            <div className="write_btm_container2">
              {file ? (
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                  {renderPages()}
                </Document>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalContent height='200px' bg='#fff' borderTopRadius='10px'>
          <ModalHeader className='ModalHeader' height='34px' bg='#746E58' fontSize='14px' color='#fff' borderTopRadius='10px' fontFamily='var(--font-family-Noto-B)'>알림</ModalHeader>
          <ModalCloseButton color='#fff' fontSize='12px' top='0' />
          <ModalBody className="cancle_modal_content">
            임시저장이 완료되었습니다.
          </ModalBody>

          <ModalFooter justifyContent='center'>
            <button className="del_button" onClick={() => { navigate('/tempReportStorage') }}>확인</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default WriteReport;
