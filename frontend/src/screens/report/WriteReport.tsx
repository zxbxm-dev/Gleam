import React, { useState, useEffect } from 'react';
import {
  FileUploadIcon,
  UserIcon_dark,
  CloseIcon,
  SelectArrow,
  Approval_Plus,
  Approval_Plus_green,
  Approval_Minus,
  SelectDownArrow
} from "../../assets/images/index";
import { useLocation, Link } from "react-router-dom";
import HrSidebar from "../../components/sidebar/HrSidebar";
import { Document, Page, pdfjs } from 'react-pdf';
import CustomModal from '../../components/modal/CustomModal';
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
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';
import { submitReport } from '../../services/report/ReportServices';

type Member = [string, string, string, string];


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

type PDFFile = string | File | null;



const WriteReport = () => {
  const user = useRecoilValue(userState);
  const location = useLocation();
  const { state } = location;
  const reportName = state?.reportName || '';

  const [isSubmitModalOpen, setSubmitModalOpen] = useState(false);
  const [file, setFile] = useState<PDFFile>('');
  const [numPages, setNumPages] = useState<number>(0);
  const [selectedApproval, setSelectedApproval] = useState('');
  const [selectedReport, setSelectedReport] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);

  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (reportName) {
      setSelectedReport(reportName);
      updateApprovalLines(reportName);
    }
  }, [reportName]);

  const sendDate = new Date();
  const approvalValue = 0;

  const countSelectedMembers = (approvalLines: any) => {
    return approvalLines.reduce((count: number, line: any) => {
      return count + (line.hasOwnProperty('selectedMember') ? 1 : 0);
    }, 0);
  };
  const createFormData = (selectedReport: string, approvalLines: any, file: any, sendDate: any, approvalValue: any) => {
    const formData = new FormData();
    formData.append('userID', user.userID);
    formData.append('username', user.username);
    formData.append('position', user.position);
    formData.append('dept', user.department);
    formData.append('selectForm', selectedReport);
    formData.append('Payment', JSON.stringify(approvalLines));

    if (file) {
      formData.append('handleSubmit', file);
      formData.append('pdffile', file.name);
    }

    formData.append('receiptDate', "");
    formData.append('stopDate', "");
    formData.append('sendDate', sendDate.toISOString());
    formData.append('opinionName', "");
    formData.append('opinionContent', "");
    formData.append('rejectName', "");
    formData.append('rejectContent', "");
    formData.append('approval', approvalValue);

    const selectedMemberCount = countSelectedMembers(approvalLines);
    formData.append('currentSigner', selectedMemberCount);

    return formData;
  };


  const handleSubmit = () => {
    const formData = createFormData(selectedReport, approvalLines, file, sendDate, approvalValue);

    submitReport(formData)
      .then(response => {
        console.log('보고서 제출 완료', response)
      })
      .catch(error => {
        console.log('보고서 제출 실패', error)
      })
  };


  const members: Member[] = [
    ['이정훈', '포체인스 주식회사', '', '대표'],
    ['안후상', '포체인스 주식회사', '', '이사'],
    ['이정열', '관리부', '', '부서장'],
    ['김효은', '관리부', '관리팀', '팀장'],
    ['우현지', '관리부', '관리팀', '사원'],
    ['염승희', '관리부', '관리팀', '사원'],
    ['김태희', '관리부', '지원팀', '팀장'],
    ['진유빈', '개발부', '', '부서장'],
    ['장현지', '개발부', '개발 1팀', '사원'],
    ['구민석', '개발부', '개발 1팀', '사원'],
    ['박세준', '개발부', '개발 1팀', '사원'],
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

  const SelectOptions = (report: string) => {
    setSelectedReport(report);
    setSelectOpen(false);
    updateApprovalLines(report);
  };

  const approvalFixed = members.find(member => member[0] === '이정훈') || null;
  const ManagementFixed = members.find(member => member[0] === '김효은') || null;
  const SupportFixed = members.find(member => member[0] === '김태희') || null;
  const vacationFixed = members.find(member => member[0] === '우현지') || null;

  const updateApprovalLines = (report: string) => {
    let newApprovalLines;

    function SupportLines() {
      return [
        { name: '참조', checked: false, selectedMembers: [] as Member[] },
        { name: '대표', checked: true, selectedMember: approvalFixed },
        { name: '지원팀장', checked: true, selectedMember: SupportFixed },
        { name: '부서장', checked: false, selectedMember: null },
        { name: '팀장', checked: false, selectedMember: null },
        { name: '작성자', checked: false, selectedMember: null },
      ];
    }

    function ManagementLines() {
      return [
        { name: '참조', checked: false, selectedMembers: [] as Member[] },
        { name: '대표', checked: true, selectedMember: approvalFixed },
        { name: '관리팀장', checked: true, selectedMember: ManagementFixed },
        { name: '부서장', checked: false, selectedMember: null },
        { name: '팀장', checked: false, selectedMember: null },
        { name: '작성자', checked: false, selectedMember: null },
      ];
    }

    
    function vacationLines() {
      return [
        { name: '참조', checked: true, selectedMembers: vacationFixed ? [vacationFixed] : [] },
        { name: '대표', checked: true, selectedMember: approvalFixed },
        { name: '관리팀장', checked: true, selectedMember: ManagementFixed },
        { name: '부서장', checked: false, selectedMember: null },
        { name: '팀장', checked: false, selectedMember: null },
        { name: '작성자', checked: false, selectedMember: null },
      ];
    }

    switch (report) {
      case '주간업무일지':
        newApprovalLines = [
          { name: '참조', checked: false, selectedMembers: [] as Member[] },
          { name: '대표', checked: true, selectedMember: approvalFixed },
          { name: '부서장', checked: false, selectedMember: null },
          { name: '팀장', checked: false, selectedMember: null },
        ];
        break;
      case '지출품의서':
        newApprovalLines = SupportLines();
        break;
      case '휴가신청서':
        newApprovalLines = vacationLines();
        break;
      case '시말서':
        newApprovalLines = ManagementLines();
        break;
      // case '사직서':
      //   newApprovalLines = ManagementLines();
      //   break;
      case '휴직원':
        newApprovalLines = ManagementLines();
        break;
      case '복직원':
        newApprovalLines = ManagementLines();
        break;
      case '워크숍 신청서':
        newApprovalLines = SupportLines();
        break;
      case '워크숍 보고서 (프로젝트 회의)':
        newApprovalLines = SupportLines();
        break;
      case '워크숍 보고서 (야유회)':
        newApprovalLines = SupportLines();
        break;
      case '지출내역서':
        newApprovalLines = SupportLines();
        break;
      case '예산신청서 (지원팀)':
        newApprovalLines = [
          { name: '참조', checked: false, selectedMembers: [] as Member[] },
          { name: '대표', checked: true, selectedMember: approvalFixed },
          { name: '지원팀장', checked: false, selectedMember: null },
        ];
        break;
      case '기획서':
        newApprovalLines = ManagementLines();
        break;
      case '최종보고서':
        newApprovalLines = ManagementLines();
        break;
      case '프로젝트 계획서':
        newApprovalLines = SupportLines();
        break;
      default:
        newApprovalLines = [
          { name: '참조', checked: false, selectedMembers: [] as Member[] },
          { name: '대표', checked: true, selectedMember: approvalFixed },
          { name: '결재라인 1', checked: false, selectedMember: null },
          { name: '결재라인 2', checked: false, selectedMember: null },
          { name: '결재라인 3', checked: false, selectedMember: null },
          { name: '결재라인 4', checked: false, selectedMember: null },
          { name: '결재라인 5', checked: false, selectedMember: null },
        ];
    }
    setApprovalLines(newApprovalLines);
  };

  const SelectOpen = () => {
    setSelectOpen(!selectOpen);
  }
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
    { name: '참조', checked: false, selectedMembers: [] as Member[] },
    { name: '대표', checked: false, selectedMember: null as Member | null },
    { name: '결재라인 1', checked: false, selectedMember: null as Member | null },
    { name: '결재라인 2', checked: false, selectedMember: null as Member | null },
    { name: '결재라인 3', checked: false, selectedMember: null as Member | null },
    { name: '결재라인 4', checked: false, selectedMember: null as Member | null },
    { name: '결재라인 5', checked: false, selectedMember: null as Member | null },
  ]);

  const handleCheckboxChange = (index: number) => {
    const updatedApprovalLines = [...approvalLines];
    updatedApprovalLines.forEach((line, idx) => {
      if (idx === index) {
        line.checked = !line.checked;
        if (line.selectedMember) {
          line.selectedMember = null;
        } else if (line.selectedMembers) {
          line.selectedMembers = [];
        }

      } else {
        if (!line.selectedMember && (!line.selectedMembers || line.selectedMembers.length === 0)) {
          line.checked = false;
        }
      }
    });
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
    if (updatedApprovalLines[0].selectedMembers !== undefined) {
      updatedApprovalLines[0].selectedMembers.splice(indexToRemove, 1);
      setApprovalLines(updatedApprovalLines);
    }
  };

  // 결재라인 추가 함수
  const addApprovalLine = () => {
    if (approvalLines.length <= 6) {
      const newLineNumber = approvalLines.filter(line => line.name.startsWith("결재라인")).length + 1;
      const newLine = { name: `결재라인 ${newLineNumber}`, checked: false, selectedMember: null as Member | null };
      setApprovalLines([...approvalLines, newLine]);
    }
  };

  // 결재라인 삭제 함수
  const removeApprovalLine = (index: number) => {
    if (approvalLines.length > 1) {
      const updatedLines = approvalLines.filter((line, i) => i !== index);
      setApprovalLines(updatedLines);
    }
  };

  const handleNameChange = (index: number, newName: string) => {
    const updatedApprovalLines = [...approvalLines];
    updatedApprovalLines[index].name = newName;
    setApprovalLines(updatedApprovalLines);
  };

  return (
    <div className="content">
      <div className="content_container">
        <div className="report_write_container">
          <div className="write_top_container">
            <div className="top_left_content">
              <div className="sub_title">양식 선택</div>
              <div className="Select_report">
                <div className="Select_report_Header" onClick={SelectOpen}>
                  <img src={selectOpen ? SelectDownArrow : SelectArrow} alt="SelectArrow" className="SelectArrow" />
                  <span>{selectedReport}</span>
                </div>
                {selectOpen ? (
                  <div className="Select_report_Content">
                    <div>공동</div>
                    <div className="Option" onClick={() => SelectOptions('주간업무일지')}>
                      <span>주간업무일지</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('휴가신청서')}>
                      <span>휴가신청서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('지출품의서')}>
                      <span>지출품의서</span>
                    </div>

                    <div>프로젝트</div>
                    <div className="Option" onClick={() => SelectOptions('기획서')}>
                      <span>기획서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('중간보고서')}>
                      <span>중간보고서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('최종보고서')}>
                      <span>최종보고서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('TF팀 기획서')}>
                      <span>TF팀 기획서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('TF팀 프로젝트 계획서')}>
                      <span>TF팀 프로젝트 계획서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('TF팀 중간보고서')}>
                      <span>TF팀 중간보고서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('TF팀 프로젝트 결과 보고서')}>
                      <span>TF팀 프로젝트 결과 보고서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('박람회 보고서')}>
                      <span>박람회 보고서</span>
                    </div>

                    <div>인사</div>
                    <div className="Option" onClick={() => SelectOptions('휴직원')}>
                      <span>휴직원</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('복직원')}>
                      <span>복직원</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('시말서')}>
                      <span>시말서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('진급추천서')}>
                      <span>진급추천서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('퇴직금 중간정산 신청서')}>
                      <span>퇴직금 중간정산 신청서</span>
                    </div>

                    <div>총무</div>
                    <div className="Option" onClick={() => SelectOptions('출장 신청서')}>
                      <span>출장 신청서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('출장 보고서')}>
                      <span>출장 보고서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('자기개발비 신청서')}>
                      <span>자기개발비 신청서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('법인카드 신청서')}>
                      <span>법인카드 신청서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('지출내역서')}>
                      <span>지출내역서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('예산신청서')}>
                      <span>예산신청서</span>
                    </div>

                    <div>기타</div>
                    <div className="Option" onClick={() => SelectOptions('워크숍 신청서')}>
                      <span>워크숍 신청서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('야유회 보고서')}>
                      <span>야유회 보고서</span>
                    </div>
                    <div className="Option" onClick={() => SelectOptions('프로젝트 회의 보고서')}>
                      <span>프로젝트 회의 보고서</span>
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>

            <div className="top_right_content">
              <Popover placement="left-start">
                <PopoverTrigger>
                  <button className="primary_button">결재라인 선택</button>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent width='440px' height='700px' border='0' borderRadius='5px' boxShadow='0px 0px 5px #d9d9d9'>
                    <PopoverHeader color='#272727' bg='#76CB7E' border='0' fontFamily='var(--font-family-Noto-M)' borderTopRadius='5px'>결재라인 선택</PopoverHeader>
                    <PopoverCloseButton color='#272727' />
                    <PopoverBody display='flex' flexDirection='row' padding='0px'>
                      <div style={{ width: '200px', height: '650px', overflowY: 'scroll', scrollbarWidth: 'thin' }}>
                        <HrSidebar members={members} onClickMember={(name, dept, team, position) => handleMemberClick(name, dept, team, position, selectedApproval)} />
                      </div>
                      <div className='FlexContentBox'>
                        <div className='ContentBox' style={{ width: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', position: 'relative' }}>
                          {approvalLines.filter(line => line.name !== '참조').map((line, index) => (
                            <div key={index} className="approval_content" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                              <div className='approval_line'>
                                <input type="text" value={line.name} onChange={(e) => handleNameChange(index + 1, e.target.value)} />
                                {hoveredIndex === index ?
                                  <img src={Approval_Minus} alt="Approval_Minus" onClick={() => { removeApprovalLine(index + 1) }} style={{ cursor: 'pointer' }} />
                                  :
                                  <></>
                                }
                              </div>
                              {line.checked ? (
                                line.selectedMember ? (
                                  <div className='approval_name' onClick={() => handleCheckboxChange(index + 1)}>
                                    <img src={UserIcon_dark} alt="UserIcon_dark" className="name_img" />
                                    <div className='name_text'>{line.selectedMember[0]}</div>
                                    <div className='name_border'></div>
                                    <div className='name_text'>{line.selectedMember[3]}</div>
                                  </div>
                                ) : (
                                  <div className={line.checked === true ? "approval_checked" : "approval_unchecked"} onClick={() => handleCheckboxChange(index + 1)}>
                                    <div>&nbsp;</div>
                                  </div>
                                )
                              ) : (
                                <div className="approval_unchecked" onClick={() => handleCheckboxChange(index + 1)}>
                                  칸 선택 후 좌측 리스트에서<br />
                                  결재라인을 선택해주세요
                                </div>
                              )}
                            </div>
                          ))}
                          {approvalLines.length <= 6 ? (
                            <img src={isHovered ? Approval_Plus_green : Approval_Plus}
                              alt="Approval_Plus"
                              onClick={addApprovalLine}
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={() => setIsHovered(true)}
                              onMouseLeave={() => setIsHovered(false)}
                            />
                          ) : (
                            <></>

                          )}
                        </div>
                        {approvalLines.filter(line => line.name === '참조').map((line, index) => (
                          <div key={index} className="last_approval_content">
                            <div className='approval_line'>
                              <input
                                type="checkbox"
                                checked={line.checked}
                                onChange={() => handleCheckboxChange(index)}
                                className='approval_checkbox'
                                id="chk"
                                style={{ cursor: 'pointer' }}
                              />
                              <label htmlFor="chk" style={{ cursor: 'pointer' }}>{line.name}</label>
                            </div>
                            {line.checked ? (
                              line.selectedMember ? (
                                <div className='approval_name' onClick={() => handleCheckboxChange(index)}>
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
                                        <div className='name_text'>{member[0]}</div>
                                        <div className='name_border'></div>
                                        <div className='name_text'>{member[3]}</div>
                                        <img src={CloseIcon} alt="CloseIcon" className='close_btn' onClick={() => handleRemoveMember(index)} />
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className={line.checked === true ? "approval_checked" : "approval_unchecked"} onClick={() => handleCheckboxChange(index)}>
                                    <div>&nbsp;</div>
                                  </div>
                                )
                              )
                            ) : (
                              <div className="approval_unchecked" onClick={() => handleCheckboxChange(index)}>
                                칸 선택 후 좌측 리스트에서<br />
                                결재라인을 선택해주세요
                              </div>
                            )}
                          </div>
                        ))}

                        <div className='button-wrap'>
                          <button className="second_button" onClick={() => handleSubmit()}>제출</button>
                          <button className="white_button">취소</button>
                        </div>
                      </div>
                    </PopoverBody>
                  </PopoverContent>
                </Portal>
              </Popover>
              <button className="white_button">
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
      <CustomModal
        isOpen={isSubmitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        header={'알림'}
        footer1={'확인'}
        footer1Class="green-btn"
        onFooter1Click={() => setSubmitModalOpen(false)}
      >
        <div>
          제출이 완료되었습니다.
        </div>
      </CustomModal>
    </div>
  );
};

export default WriteReport;
