import React, { useEffect, useState } from 'react';
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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react';
import sign from "../../assets/images/sign/구민석_서명.png";
import testPDF from '../../assets/pdf/[서식-A102] 지출품의서_2024.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

type PDFFile = string | File | null;

const DetailApproval = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState<PDFFile>('');
  const [numPages, setNumPages] = useState<number>(0);
  const [checksignup, setCheckSignUp] = useState<boolean[]>([false, false, false]);
  const [signupindex, setSignUpIndex] = useState<number>(0);

  useEffect(() => {
    setFile(testPDF);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const exportToPDF = async () => {
    const element = document.getElementById('report-to-xls');
    if (!element) {
      console.error('Element not found');
      return;
    }
  
    const pdf = new jsPDF('p', 'mm', 'a4');
    element.style.height = element.scrollHeight + 'px';
  
    await html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      if (numPages > 1) {
        pdf.addPage();
      }
    });
  
    for (let i = 2; i <= numPages; i++) {
      const pageElement = document.querySelector(`[data-page-number="${i}"]`) as HTMLElement;
      if (pageElement) {
        await html2canvas(pageElement).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
          if (i > 2) {
            pdf.addPage();
          }
  
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        });
      }
    }
  
    pdf.save('보고서.pdf');
  };
  
  
  const handleSignModal = (index: number) => {
    onOpen();
    setSignUpIndex(index);
  }

  const handleSign = (index: number) => {
    const newCheckSignUp = [...checksignup];
    newCheckSignUp[index] = true;
    setCheckSignUp(newCheckSignUp);
    onClose();
  }

  const handleSignDel = (index: number) => {
    const newCheckSignUp = [...checksignup];
    newCheckSignUp[index] = false;
    setCheckSignUp(newCheckSignUp);
    onClose();
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '24vh', justifyContent: 'center' }}>
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
                <div id='report-to-xls'>
                  <div className='PaymentLine'>
                    <div className='Pay'>
                      <div className='Top'>팀장</div>
                      <div className='Bottom' onClick={() => handleSignModal(0)}>
                        {checksignup[0] ? 
                          <img src={sign} alt="sign"/>
                          :
                          <></>
                        }
                      </div>
                    </div>
                    <div className='Pay'>
                      <div className='Top'>부서장</div>
                      <div className='Bottom' onClick={() => handleSignModal(1)}>
                        {checksignup[1] ? 
                          <img src={sign} alt="sign"/>
                          :
                          <></>
                        }
                      </div>
                    </div>
                    <div className='Pay'>
                      <div className='Top'>대표</div>
                      <div className='Bottom' onClick={() => handleSignModal(2)}>
                        {checksignup[2] ? 
                          <img src={sign} alt="sign"/>
                          :
                          <></>
                        }
                      </div>
                    </div>
                  </div>
                  {renderPages()}
                </div>
              </Document>

            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalContent height='200px' bg='#fff' borderTopRadius='10px'>
          <ModalHeader className='ModalHeader' height='34px' bg='#746E58' fontSize='14px' color='#fff' borderTopRadius='10px' fontFamily='var(--font-family-Noto-B)'>알림</ModalHeader>
          <ModalCloseButton color='#fff' fontSize='12px' top='0'/>
          <ModalBody className="cancle_modal_content">
            서명하시겠습니까?
          </ModalBody>

          <ModalFooter gap='7px' justifyContent='center'>
            <button className="del_button" onClick={() => {handleSign(signupindex)}}>서명</button>
            <button className="cle_button" onClick={() => {handleSignDel(signupindex)}}>취소</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DetailApproval;