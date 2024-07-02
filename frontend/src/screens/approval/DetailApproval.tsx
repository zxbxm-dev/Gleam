import React, { useEffect, useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
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
import CustomModal from '../../components/modal/CustomModal';
import sign from "../../assets/images/sign/구민석_서명.png";
// import testPDF from '../../assets/pdf/[서식-A106-1] TF팀 기획서.pdf';
import { userState } from '../../recoil/atoms';
import { useRecoilValue } from 'recoil';
import { WriteApproval, HandleApproval, CheckReport } from '../../services/approval/ApprovalServices';
import { useLocation } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

type PDFFile = string | File | null;

const DetailApproval = () => {
  const [isSignModalOpen, setSignModalOpen] = useState(false);
  const [file, setFile] = useState<PDFFile>('');
  const [numPages, setNumPages] = useState<number>(0);
  const [checksignup, setCheckSignUp] = useState<boolean[]>([]);
  const [signupindex, setSignUpIndex] = useState<number>(0);
  const [signDates, setSignDates] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const user = useRecoilValue(userState);
  const [opinion, setOpinion] = useState('');
  const [rejection, setRejection] = useState('');

  const location = useLocation();
  const pathnameParts = location.pathname.split('/');
  const report_id = pathnameParts[pathnameParts.length - 1];
  const documentInfo = useState(location.state?.documentInfo);

  const [signatories, setSignatories] = useState<any[]>([]);

  useEffect(() => {
    // setFile(testPDF);
    const initialChecks = new Array(signatories.length).fill(false);
    const approvedCount = Number(documentInfo[0].approval);

    for (let i = 0; i < approvedCount; i++) {
      initialChecks[i] = true;
    }

    for (let i = approvedCount; i < signatories.length; i++) {
      initialChecks[i] = false;
    }

    setCheckSignUp(initialChecks);
    setSignDates(new Array(signatories.length).fill(''));
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const exportToPDF = async () => {
    const element = containerRef.current;
    if (!element) {
      console.error('Element not found');
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    element.style.height = element.scrollHeight + 'px';

    await html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpg');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'JPG', 0, 0, imgWidth, imgHeight);
      if (numPages > 1) {
        pdf.addPage();
      }
    });

    for (let i = 2; i <= numPages; i++) {
      const pageElement = document.querySelector(`[data-page-number="${i}"]`) as HTMLElement;
      if (pageElement) {
        await html2canvas(pageElement).then((canvas) => {
          const imgData = canvas.toDataURL('image/jpg');
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (i > 2) {
            pdf.addPage();
          }

          pdf.addImage(imgData, 'JPG', 0, 0, imgWidth, imgHeight);
        });
      }
    }

    pdf.save('보고서.pdf');
  };

  const handleSignModal = (index: number) => {
    setSignModalOpen(true);
    setSignUpIndex(index);
  }

  const handleSign = (index: number) => {
    const newCheckSignUp = [...checksignup];
    newCheckSignUp[index] = true;
    setCheckSignUp(newCheckSignUp);

    const newSignDates = [...signDates];
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear().toString().slice(2)}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;
    newSignDates[index] = formattedDate;
    setSignDates(newSignDates);

    setSignModalOpen(false);
  }

  const handleSignDel = (index: number) => {
    const newCheckSignUp = [...checksignup];
    newCheckSignUp[index] = false;
    setCheckSignUp(newCheckSignUp);

    const newSignDates = [...signDates];
    newSignDates[index] = '';
    setSignDates(newSignDates);

    setSignModalOpen(false);
  }

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <Page
          key={`page_${i}`}
          pageNumber={i}
          width={1000}
          data-page-number={i}
        />
      );
    }
    return pages;
  };

  const handleOpinionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOpinion(e.target.value);
  }

  const handleRejectionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRejection(e.target.value);
  }


  const fetchCheckReport = async (report_id: string) => {
    try {
      const response = await CheckReport(report_id);
  
      if (response.status === 200) {
        const url = URL.createObjectURL(response.data);
        setFile(url);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };


  useEffect(() => {
    fetchCheckReport(report_id);

    try {
      const parsedString = JSON.parse(documentInfo[0]?.Payment);
      const parsedarray = JSON.parse(parsedString);
  
      const filteredApproveLine = parsedarray
        .filter((item: any) => item.name !== '참조')
        .map((item: any) => item.name);
  
      setSignatories(filteredApproveLine.reverse());
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  }, [report_id])

  const handleSubmitOpinion = async (report_id: string) => {
    try {
      const formData = {
        userID: user.userID,
        username: user.username,
        position: user.position,
        opinion: opinion,
      };
      await WriteApproval(report_id, formData);
      alert('Opinion submitted successfully.');
      setOpinion('');
    } catch (error) {
      alert('Failed to submit opinion.');
    }
  };

  const handleSubmitRejection = async (report_id: string) => {
    try {
      const formData = {
        userID: user.userID,
        username: user.username,
        position: user.position,
        rejection: rejection,
      };
      await WriteApproval(report_id, formData);
      alert('Rejection submitted successfully.');
      setRejection('');
    } catch (error) {
      alert('Failed to submit rejection.');
    }
  };

  
  const handleApproval = async (report_id: string) => {
    const formData = new FormData();
    formData.append("userID", user.userID);
    formData.append("username", user.username);

    HandleApproval(report_id, formData)
    .then(() => {
      console.log('보고서 결재에 성공했습니다.')
    })
    .catch((error) => {
      console.error('보고서 결재에 실패했습니다.', error)
    })
  }

  return (
    <div className="content">
      <div className="content_container">
        <div className="container">
          <div className="approval_write_container">
            <div className="approval_write_container">
              <div className="top_left_content">
                <Popover placement="right-start">
                  <PopoverTrigger>
                    <button className="white_button">의견 작성</button>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent width='400px' height='274px' border='0' borderRadius='5px' boxShadow='0px 0px 5px #444'>
                      <PopoverHeader color='white' bg='#76CB7E' border='0' fontFamily='var(--font-family-Noto-B)' borderTopRadius='5px' fontSize='14px'>의견 작성</PopoverHeader>
                      <PopoverCloseButton color='white' />
                      <PopoverBody display='flex' flexDirection='column' padding='0px' justifyContent='center' alignItems='center' fontSize='14px' paddingRight="15px">
                        <div className='opinionBox'>
                          <div className='WriterBox'>
                            <div className='Write'>작성자</div>
                            <div className='Writer'>{user.username}&nbsp;{user.position}</div>
                          </div>
                          <div className='TextAreaBox'>
                            <div className='Title'>내용</div>
                            <textarea
                              className='TextAreaStyle'
                              placeholder='내용을 입력해주세요.'
                              value={opinion}
                              onChange={handleOpinionChange}
                            />
                          </div>
                        </div>
                        <div className='button-wrap'>
                          <button className="second_button" onClick={() => handleSubmitOpinion(report_id)}>등록</button>
                          <button className="white_button">취소</button>
                        </div>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </div>

              <div className="top_right_content">
                <button className="primary_button" onClick={() => handleApproval(report_id)}>결재하기</button>
                <button className="white_button" onClick={exportToPDF}>다운로드</button>
                <Popover placement="right-start">
                  <PopoverTrigger>
                    <button className="red_button">반려하기</button>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent width='410px' height='274px' border='0' borderRadius='5px' boxShadow='0px 0px 5px #444'>
                      <PopoverHeader color='white' bg='#76CB7E' border='0' fontFamily='var(--font-family-Noto-B)' borderTopRadius='5px' fontSize='14px'>반려 사유 작성</PopoverHeader>
                      <PopoverCloseButton color='white' />
                      <PopoverBody display='flex' flexDirection='column' padding='0px' justifyContent='center' alignItems='center' fontSize='14px' paddingRight="15px">
                        <div className='opinionBox'>
                          <div className='WriterBox'>
                            <div className='CompanionWrite'>반려자</div>
                            <div className='Writer'>{user.username}&nbsp;{user.position}</div>
                          </div>
                          <div className='TextAreaBox'>
                            <div className='CompanionTitle'>반려 사유</div>
                            <textarea
                              className='TextAreaCompanion'
                              placeholder='내용을 입력해주세요.'
                              value={rejection}
                              onChange={handleRejectionChange}
                            />
                          </div>
                        </div>
                        <div className='button-wrap'>
                          <button className="second_button" onClick={() => handleSubmitRejection(report_id)}>등록</button>
                          <button className="white_button">취소</button>
                        </div>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </div>
            </div>
            <div className="write_btm_container">
              <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                <div ref={containerRef} id="report-to-xls">
                  <div className='PaymentLine'>
                    {signatories.map((signatory, index) => (
                      <div className='Pay' key={index}>
                        <input className='Top' type="text" placeholder={signatory} disabled />
                        {signatory === user.position ? 
                          (
                          <div className='Bottom' onClick={() => handleSignModal(index)}>
                            {checksignup[index] ?
                              <img className='SignImg' src={sign} alt="sign" />
                              :
                              <></>
                            }
                          </div>)
                          :
                          (
                          <div className='Bottom_notHover'>
                            {checksignup[index] ?
                              <img className='SignImg' src={sign} alt="sign" />
                              :
                              <></>
                            }
                          </div>
                          )
                        }
                        
                        <div className='BtmDate'>{signDates[index] || ''}</div>
                      </div>
                    ))}
                  </div>
                  {renderPages()}
                </div>
              </Document>
            </div>
          </div>
        </div>
      </div>

      <CustomModal
        isOpen={isSignModalOpen}
        onClose={() => setSignModalOpen(false)}
        header={'알림'}
        footer1={'서명'}
        footer1Class="green-btn"
        footer2={'취소'}
        onFooter1Click={() => handleSign(signupindex)}
        footer2Class="gray-btn"
        onFooter2Click={() => handleSignDel(signupindex)}
      >
        <div>
          서명하시겠습니까?
        </div>
      </CustomModal>
    </div>
  );
};

export default DetailApproval;
