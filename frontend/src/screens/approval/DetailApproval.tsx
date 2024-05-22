import React, { useEffect, useState, useRef } from 'react';
import "./Approval.scss";
import { Link } from "react-router-dom";
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
import { Textarea } from '@chakra-ui/react';
import sign from "../../assets/images/sign/구민석_서명.png";
import testPDF from '../../assets/pdf/[서식-A106] 기획서.pdf';

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

  const signatories = ['작성자','팀장', '부서장', '지원팀장', '대표'];

  useEffect(() => {
    setFile(testPDF);
    setCheckSignUp(new Array(signatories.length).fill(false));
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

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/report"} className="sub_header">보고서 결재</Link>
      </div>

      <div className="content_container">
        <div className="container">
          <div className="write_container">
            <div className="write_top_container">
              <div className="top_left_content">
                <Popover placement="right-start">
                  <PopoverTrigger>
                    <button className="save_button">의견 작성</button>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent width='25vw' height='35vh' border='0' borderRadius='5px' boxShadow='0px 0px 5px #444'>
                      <PopoverHeader color='white' bg='#746E58' border='0' fontFamily='var(--font-family-Noto-B)' borderTopRadius='5px' fontSize='14px'>의견 작성</PopoverHeader>
                      <PopoverCloseButton color='white' />
                      <PopoverBody display='flex' flexDirection='column' padding='0px' justifyContent='center' alignItems='center' fontSize='14px'>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '24vh', justifyContent: 'center' }}>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ width: '2.5vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)' }}>작성자</div>
                            <div style={{ color: '#323232', fontFamily: 'var(--font-family-Noto-M)' }}>김효은 팀장</div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ width: '2.5vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)' }}>내용</div>
                            <Textarea placeholder='내용을 입력해주세요.' size='sm' width='19vw' height='15vh' fontFamily='var(--font-family-Noto-R)' />
                          </div>
                        </div>
                        <div className='button-wrap'>
                          <button className="second_button">등록</button>
                          <button className="white_button">취소</button>
                        </div>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </div>

              <div className="top_right_content">
                <button className="approve_button">결재하기</button>
                <button className="save_button" onClick={exportToPDF}>인쇄하기</button>
                <Popover placement="right-start">
                  <PopoverTrigger>
                    <button className="reject_button">반려하기</button>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent width='25vw' height='35vh' border='0' borderRadius='5px' boxShadow='0px 0px 5px #444'>
                      <PopoverHeader color='white' bg='#746E58' border='0' fontFamily='var(--font-family-Noto-B)' borderTopRadius='5px' fontSize='14px'>반려 사유 작성</PopoverHeader>
                      <PopoverCloseButton color='white' />
                      <PopoverBody display='flex' flexDirection='column' padding='0px' justifyContent='center' alignItems='center' fontSize='14px'>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '24vh', justifyContent:'center' }}>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ width: '3vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)' }}>반려자</div>
                            <div style={{ color: '#323232', fontFamily: 'var(--font-family-Noto-M)' }}>김효은 팀장</div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ width: '3vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)' }}>반려 사유</div>
                            <Textarea placeholder='내용을 입력해주세요.' size='sm' width='17vw' height='15vh' fontFamily='var(--font-family-Noto-R)' />
                          </div>
                        </div>
                        <div className='button-wrap'>
                          <button className="second_button">등록</button>
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
                        <div className='Bottom' onClick={() => handleSignModal(index)}>
                          {checksignup[index] ?
                            <img className='SignImg' src={sign} alt="sign" />
                            :
                            <></>
                          }
                        </div>
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
