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
import { Textarea } from '@chakra-ui/react';

import testPDF from '../../assets/pdf/[서식-A101]주간업무일지.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

type PDFFile = string | File | null;

const DetailApproval = () => {
  const [file, setFile] = useState<PDFFile>('');
  const [numPages, setNumPages] = useState<number>(0);

  useEffect(() => {
    setFile(testPDF);
  }, []);

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
                      <PopoverHeader color='white' bg='#746E58' border='0' fontFamily= 'var(--font-family-Noto-B)' borderTopRadius='5px' fontSize='14px'>의견 작성</PopoverHeader>
                      <PopoverCloseButton color='white' />
                      <PopoverBody display='flex' flexDirection='column' padding='0px' justifyContent='center' alignItems='center' fontSize='14px'>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', height: '24vh', justifyContent: 'center'}}>
                          <div style={{display: 'flex', gap: '10px'}}>
                            <div style={{width: '2.5vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>작성자</div>
                            <div style={{color: '#323232', fontFamily: 'var(--font-family-Noto-M)'}}>김효은 팀장</div>
                          </div>
                          <div style={{display: 'flex', gap: '10px'}}>
                            <div style={{width: '2.5vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>내용</div>
                            <Textarea placeholder='내용을 입력해주세요.' size='sm' width='19vw' height='15vh' fontFamily='var(--font-family-Noto-R)'/>
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
                <button className="save_button">인쇄하기</button>
                <Popover placement="right-start">
                  <PopoverTrigger>
                    <button className="reject_button">반려하기</button>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent width='25vw' height='35vh' border='0' borderRadius='5px' boxShadow='0px 0px 5px #444'>
                      <PopoverHeader color='white' bg='#746E58' border='0' fontFamily= 'var(--font-family-Noto-B)' borderTopRadius='5px' fontSize='14px'>반려 사유 작성</PopoverHeader>
                      <PopoverCloseButton color='white'/>
                      <PopoverBody display='flex' flexDirection='column' padding='0px' justifyContent='center' alignItems='center' fontSize='14px'>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', height: '24vh', justifyContent: 'center'}}>
                          <div style={{display: 'flex', gap: '10px'}}>
                            <div style={{width: '3vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>반려자</div>
                            <div style={{color: '#323232', fontFamily: 'var(--font-family-Noto-M)'}}>김효은 팀장</div>
                          </div>
                          <div style={{display: 'flex', gap: '10px'}}>
                            <div style={{width: '3vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>반려 사유</div>
                            <Textarea placeholder='내용을 입력해주세요.' size='sm' width='17vw' height='15vh' fontFamily='var(--font-family-Noto-R)'/>
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
                {renderPages()}
                <div className='exam_sign1'>
                  첫번째 서명
                </div>
              </Document>
              
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default DetailApproval;